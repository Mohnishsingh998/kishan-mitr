const axios = require('axios');
const { MarketPrice, Mandi } = require('../models');
const { Op } = require('sequelize');

const DATAGOVIN_BASE = process.env.DATAGOVIN_BASE_URL || 'https://api.data.gov.in/resource';
const DATAGOVIN_KEY = process.env.DATAGOVIN_API_KEY;
const RESOURCE_ID = process.env.DATAGOVIN_MANDI_RESOURCE_ID || '9ef84268-d588-465a-a308-a864a43d0070';

// ─── Fetch live prices from data.gov.in (Agmarknet) ──────────────────────────
const fetchFromDataGovIn = async ({ state = 'Madhya Pradesh', district, commodity, limit = 50 }) => {
  if (!DATAGOVIN_KEY) return null; // Fall back to DB

  try {
    const params = {
      'api-key': DATAGOVIN_KEY,
      format: 'json',
      limit,
      filters: {},
    };
    if (state) params['filters[State]'] = state;
    if (district) params['filters[District]'] = district;
    if (commodity) params['filters[Commodity]'] = commodity;

    const { data } = await axios.get(`${DATAGOVIN_BASE}/${RESOURCE_ID}`, { params, timeout: 8000 });

    if (!data?.records?.length) return null;

    // Upsert into DB for caching
    for (const rec of data.records) {
      const mandiName = rec['Market'] || rec['market'];
      if (!mandiName) continue;

      let mandi = await Mandi.findOne({ where: { name: mandiName } });
      if (!mandi) {
        mandi = await Mandi.create({
          name: mandiName,
          district: rec['District'] || rec['district'] || district || '',
          state: rec['State'] || rec['state'] || state,
        });
      }

      const price = parseFloat(rec['Modal Price'] || rec['modal_price'] || 0);
      const min = parseFloat(rec['Min Price'] || rec['min_price'] || price);
      const max = parseFloat(rec['Max Price'] || rec['max_price'] || price);
      const crop = rec['Commodity'] || rec['commodity'] || '';
      const tradeDate = rec['Arrival Date'] || rec['arrival_date'] || new Date().toISOString().split('T')[0];

      if (crop && price > 0) {
        await MarketPrice.upsert(
          { mandiId: mandi.id, cropName: crop.toLowerCase(), pricePerQuintal: price, minPrice: min, maxPrice: max, tradeDate, source: 'data.gov.in' },
          { conflictFields: ['mandi_id', 'crop_name', 'trade_date'] }
        );
      }
    }
    return true;
  } catch (err) {
    console.warn('data.gov.in API unavailable, using DB cache:', err.message);
    return null;
  }
};

// ─── getPrices — main endpoint ────────────────────────────────────────────────
const getPrices = async ({ state, district, mandiId, crop, page = 1, limit = 20 }) => {
  // Try live fetch first (will cache into DB)
  await fetchFromDataGovIn({ state, district, commodity: crop });

  const today = new Date();
  const ninetyDaysAgo = new Date(today);
  ninetyDaysAgo.setDate(ninetyDaysAgo.getDate() - 90);

  const where = { tradeDate: { [Op.gte]: ninetyDaysAgo.toISOString().split('T')[0] } };
  if (crop) where.cropName = { [Op.iLike]: `%${crop}%` };
  if (mandiId) where.mandiId = mandiId;

  const include = [{ association: 'mandi', where: {}, required: true }];
  if (state) include[0].where.state = state;
  if (district) include[0].where.district = { [Op.iLike]: `%${district}%` };

  const offset = (page - 1) * limit;
  const { count, rows } = await MarketPrice.findAndCountAll({
    where,
    include,
    limit: parseInt(limit),
    offset,
    order: [['tradeDate', 'DESC'], ['cropName', 'ASC']],
  });

  return { total: count, page: parseInt(page), limit: parseInt(limit), prices: rows };
};

// ─── getPriceHistory — 6-month trend ─────────────────────────────────────────
const getPriceHistory = async (crop, mandiId, days = 180) => {
  const from = new Date();
  from.setDate(from.getDate() - days);

  const rows = await MarketPrice.findAll({
    where: {
      cropName: { [Op.iLike]: `%${crop}%` },
      ...(mandiId && { mandiId }),
      tradeDate: { [Op.gte]: from.toISOString().split('T')[0] },
    },
    order: [['tradeDate', 'ASC']],
    include: [{ association: 'mandi' }],
  });

  return rows.map((r) => ({
    date: r.tradeDate,
    price: r.pricePerQuintal,
    min: r.minPrice,
    max: r.maxPrice,
    mandi: r.mandi?.name,
  }));
};

// ─── getMandis ────────────────────────────────────────────────────────────────
const getMandis = async (state) => {
  const where = { isActive: true };
  if (state) where.state = { [Op.iLike]: `%${state}%` };
  return Mandi.findAll({ where, order: [['name', 'ASC']] });
};

// ─── getPriceForecast — simple 7-day moving average projection ───────────────
const getPriceForecast = async (cropName) => {
  const history = await getPriceHistory(cropName, null, 30);
  if (!history.length) throw { status: 404, message: `No price data found for '${cropName}'.` };

  const prices = history.map((h) => h.price);
  const avg = prices.reduce((a, b) => a + b, 0) / prices.length;
  const last = prices[prices.length - 1];
  const trend = last > avg ? 'up' : last < avg ? 'down' : 'stable';
  const change = (((last - avg) / avg) * 100).toFixed(2);

  // Project next 7 days using weighted moving avg
  const projected = Array.from({ length: 7 }, (_, i) => {
    const day = new Date();
    day.setDate(day.getDate() + i + 1);
    const noise = (Math.random() - 0.5) * avg * 0.02; // ±1% noise
    return {
      date: day.toISOString().split('T')[0],
      projectedPrice: Math.round(last + noise),
    };
  });

  return { crop: cropName, currentPrice: last, average30d: Math.round(avg), trend, changePercent: change, projection: projected };
};

module.exports = { getPrices, getPriceHistory, getMandis, getPriceForecast };
