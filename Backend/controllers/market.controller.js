const marketService = require('../services/market.service');

const getPrices = async (req, res, next) => {
  try {
    const result = await marketService.getPrices(req.query);
    res.json(result);
  } catch (err) {
    next(err);
  }
};

const getPriceHistory = async (req, res, next) => {
  try {
    const { crop, mandi, days } = req.query;
    if (!crop) return res.status(400).json({ message: 'crop query param required.' });
    const data = await marketService.getPriceHistory(crop, mandi, parseInt(days) || 180);
    res.json(data);
  } catch (err) {
    next(err);
  }
};

const getMandis = async (req, res, next) => {
  try {
    const { state } = req.query;
    const mandis = await marketService.getMandis(state);
    res.json(mandis);
  } catch (err) {
    next(err);
  }
};

const getPriceForecast = async (req, res, next) => {
  try {
    const data = await marketService.getPriceForecast(req.params.cropId);
    res.json(data);
  } catch (err) {
    next(err);
  }
};

module.exports = { getPrices, getPriceHistory, getMandis, getPriceForecast };
