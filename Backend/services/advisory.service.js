const { Advisory, CropRecommendation, Land, Farmer } = require('../models');

// ─── Rule-Based Crop Advisory Engine ─────────────────────────────────────────
// Free & local — no external ML API needed.
// Scores crops based on: soil type, season, irrigation, last crop (rotation).

const CROP_RULES = {
  // Kharif crops (June–November)
  soybean: {
    nameHindi: 'सोयाबीन',
    seasons: ['kharif'],
    soilTypes: ['black', 'loamy'],
    irrigation: ['rainfed', 'mixed', 'canal'],
    baseScore: 85,
    yieldPerAcre: 8, // quintals
    revenuePerQuintal: 4200,
    reasons: [
      'Best suited for black cotton soil of MP',
      'Rainfed crop — no irrigation dependency',
      'Strong MSP support from government',
    ],
    reasonsHindi: [
      'मध्यप्रदेश की काली मिट्टी के लिए सर्वोत्तम',
      'वर्षा आधारित फसल — सिंचाई की जरूरत नहीं',
      'सरकार का मजबूत MSP समर्थन',
    ],
    risks: ['Susceptible to yellow mosaic virus', 'Waterlogging causes root rot'],
    activities: [
      { week: 1, task: 'Seed treatment with fungicide + rhizobium', type: 'input' },
      { week: 2, task: 'Sowing at 45×5 cm spacing', type: 'field' },
      { week: 4, task: 'First weeding & thinning', type: 'field' },
      { week: 6, task: 'Monitor for whitefly & yellow mosaic', type: 'monitor' },
      { week: 8, task: 'Apply fertilizer top-dressing', type: 'input' },
      { week: 14, task: 'Harvest when pods turn brown', type: 'harvest' },
    ],
    sowingMonth: 6,
    harvestMonthOffset: 3,
  },
  maize: {
    nameHindi: 'मक्का',
    seasons: ['kharif', 'rabi', 'zaid'],
    soilTypes: ['loamy', 'alluvial', 'red'],
    irrigation: ['canal', 'borewell', 'drip', 'mixed'],
    baseScore: 78,
    yieldPerAcre: 20,
    revenuePerQuintal: 1700,
    reasons: [
      'High yield potential with irrigation',
      'Good for loamy and alluvial soils',
      'Ready market through poultry and starch industry',
    ],
    risks: ['Requires regular irrigation', 'Susceptible to stem borer'],
    activities: [
      { week: 1, task: 'Field preparation and basal fertilizer', type: 'field' },
      { week: 2, task: 'Sowing seeds 3–4 cm deep', type: 'field' },
      { week: 3, task: 'Gap filling and thinning', type: 'field' },
      { week: 5, task: 'Top dress with urea', type: 'input' },
      { week: 7, task: 'Check for stem borer — apply chlorpyrifos', type: 'monitor' },
      { week: 10, task: 'Harvest when husks turn papery', type: 'harvest' },
    ],
    sowingMonth: 6,
    harvestMonthOffset: 2.5,
  },
  wheat: {
    nameHindi: 'गेहूँ',
    seasons: ['rabi'],
    soilTypes: ['black', 'loamy', 'alluvial', 'clay'],
    irrigation: ['canal', 'borewell', 'mixed'],
    baseScore: 90,
    yieldPerAcre: 16,
    revenuePerQuintal: 2200,
    reasons: [
      'MP is a major wheat-producing state',
      'Excellent MSP and government procurement',
      'Well-suited to rabi season climate',
    ],
    risks: ['Yellow rust in cool, wet weather', 'Requires 4–5 irrigation cycles'],
    activities: [
      { week: 1, task: 'Deep ploughing and field levelling', type: 'field' },
      { week: 2, task: 'Seed treatment + sowing', type: 'field' },
      { week: 3, task: 'First irrigation (crown root initiation)', type: 'input' },
      { week: 6, task: 'Top dress urea at tillering stage', type: 'input' },
      { week: 8, task: 'Monitor for rust and aphids', type: 'monitor' },
      { week: 16, task: 'Harvest at golden maturity', type: 'harvest' },
    ],
    sowingMonth: 11,
    harvestMonthOffset: 4,
  },
  cotton: {
    nameHindi: 'कपास',
    seasons: ['kharif'],
    soilTypes: ['black', 'clay'],
    irrigation: ['rainfed', 'mixed', 'drip'],
    baseScore: 75,
    yieldPerAcre: 6,
    revenuePerQuintal: 6500,
    reasons: [
      'High value cash crop',
      'Black soil retains moisture well for cotton',
      'Steady demand from textile industry',
    ],
    risks: ['Pink bollworm — major threat in MP', 'Long duration crop (180+ days)', 'Price volatility'],
    activities: [
      { week: 1, task: 'Bt cotton seed selection & treatment', type: 'input' },
      { week: 2, task: 'Sowing at 90×60 cm spacing', type: 'field' },
      { week: 6, task: 'Thinning & earthing up', type: 'field' },
      { week: 10, task: 'Pink bollworm scouting — install pheromone traps', type: 'monitor' },
      { week: 14, task: 'Spray for bollworm if threshold crossed', type: 'input' },
      { week: 24, task: 'First picking when bolls open fully', type: 'harvest' },
    ],
    sowingMonth: 5,
    harvestMonthOffset: 5,
  },
  chickpea: {
    nameHindi: 'चना',
    seasons: ['rabi'],
    soilTypes: ['black', 'loamy', 'red'],
    irrigation: ['rainfed', 'mixed'],
    baseScore: 80,
    yieldPerAcre: 8,
    revenuePerQuintal: 5200,
    reasons: [
      'MP leads India in chickpea production',
      'Fixes atmospheric nitrogen — improves soil health',
      'Low water requirement',
    ],
    risks: ['Gram pod borer is the biggest threat', 'Frost damage in December–January'],
    activities: [
      { week: 1, task: 'Seed treatment with Trichoderma + rhizobium', type: 'input' },
      { week: 2, task: 'Sowing in rows 30 cm apart', type: 'field' },
      { week: 5, task: 'One protective irrigation at flowering', type: 'input' },
      { week: 7, task: 'Monitor for pod borer — use pheromone traps', type: 'monitor' },
      { week: 14, task: 'Harvest when plants dry and pods rattle', type: 'harvest' },
    ],
    sowingMonth: 10,
    harvestMonthOffset: 3.5,
  },
  mustard: {
    nameHindi: 'सरसों',
    seasons: ['rabi'],
    soilTypes: ['loamy', 'alluvial', 'sandy'],
    irrigation: ['rainfed', 'mixed', 'canal'],
    baseScore: 76,
    yieldPerAcre: 7,
    revenuePerQuintal: 5500,
    reasons: [
      'Short duration (90–110 days)',
      'Low input cost — ideal for small farmers',
      'Rising edible oil demand drives prices',
    ],
    risks: ['Aphid attack in February', 'White rust in humid conditions'],
    activities: [
      { week: 1, task: 'Shallow sowing 1–1.5 cm deep', type: 'field' },
      { week: 3, task: 'Thinning to maintain 15 cm plant spacing', type: 'field' },
      { week: 5, task: 'Irrigation at branching stage', type: 'input' },
      { week: 7, task: 'Scout for aphids — spray if >25/plant', type: 'monitor' },
      { week: 13, task: 'Harvest when 75% siliqua turns golden', type: 'harvest' },
    ],
    sowingMonth: 10,
    harvestMonthOffset: 2.5,
  },
};

const scoreCrop = (crop, rules, land, season) => {
  let score = rules.baseScore;

  // Season match
  if (!rules.seasons.includes(season)) return null;

  // Soil match boost/penalty
  if (rules.soilTypes.includes(land.soilType)) score += 8;
  else score -= 15;

  // Irrigation match
  if (rules.irrigation.includes(land.irrigationType)) score += 5;
  else score -= 10;

  // Crop rotation bonus (avoid repeating last crop)
  if (land.lastCrop && land.lastCrop.toLowerCase() === crop) score -= 12;

  // Cap between 0–100
  return Math.max(0, Math.min(100, score));
};

const getSeason = () => {
  const month = new Date().getMonth() + 1;
  if (month >= 6 && month <= 10) return 'kharif';
  if (month >= 11 || month <= 3) return 'rabi';
  return 'zaid';
};

const generateRecommendations = async ({ farmerId, landId, season }) => {
  const land = await Land.findOne({ where: { id: landId, farmerId } });
  if (!land) throw { status: 404, message: 'Land parcel not found.' };

  const resolvedSeason = season || getSeason();

  // Score all crops
  const scored = Object.entries(CROP_RULES)
    .map(([crop, rules]) => {
      const score = scoreCrop(crop, rules, land, resolvedSeason);
      if (score === null) return null;
      return { crop, rules, score };
    })
    .filter(Boolean)
    .sort((a, b) => b.score - a.score)
    .slice(0, 3); // Top 3

  // Persist advisory
  const advisory = await Advisory.create({
    farmerId,
    landId,
    season: resolvedSeason,
    year: new Date().getFullYear(),
    soilData: { soilType: land.soilType, irrigationType: land.irrigationType },
  });

  const now = new Date();
  const recommendations = await Promise.all(
    scored.map(async ({ crop, rules, score }, idx) => {
      const sowingDate = new Date(now.getFullYear(), rules.sowingMonth - 1, 1);
      const harvestDate = new Date(sowingDate);
      harvestDate.setMonth(harvestDate.getMonth() + rules.harvestMonthOffset);

      return CropRecommendation.create({
        advisoryId: advisory.id,
        rank: idx + 1,
        cropName: crop,
        cropNameHindi: rules.nameHindi,
        suitabilityScore: score,
        estimatedYieldPerAcre: rules.yieldPerAcre,
        estimatedRevenue: rules.yieldPerAcre * rules.revenuePerQuintal * land.areaAcres,
        reasons: rules.reasons,
        risks: rules.risks,
        activities: rules.activities,
        sowingStart: sowingDate.toISOString().split('T')[0],
        harvestDate: harvestDate.toISOString().split('T')[0],
      });
    })
  );

  return { ...advisory.toJSON(), recommendations };
};

const getForFarmer = async (farmerId) => {
  return Advisory.findAll({
    where: { farmerId },
    include: [{ association: 'recommendations', order: [['rank', 'ASC']] }, { association: 'land' }],
    order: [['createdAt', 'DESC']],
  });
};

const getById = async (id) => {
  const advisory = await Advisory.findByPk(id, {
    include: [
      { association: 'recommendations', order: [['rank', 'ASC']] },
      { association: 'land' },
      { association: 'farmer', attributes: { exclude: ['password'] } },
    ],
  });
  if (!advisory) throw { status: 404, message: 'Advisory not found.' };
  return advisory;
};

const getCropCalendar = async ({ season, state }) => {
  const resolvedSeason = season || getSeason();
  return Object.entries(CROP_RULES)
    .filter(([, r]) => r.seasons.includes(resolvedSeason))
    .map(([crop, r]) => ({
      crop,
      cropHindi: r.nameHindi,
      season: resolvedSeason,
      sowingMonth: r.sowingMonth,
      harvestMonthOffset: r.harvestMonthOffset,
      soilTypes: r.soilTypes,
    }));
};

const getSowingSchedule = async (crop, region) => {
  if (!crop) {
    const season = getSeason();
    return Object.entries(CROP_RULES)
      .filter(([, r]) => r.seasons.includes(season))
      .map(([c, r]) => ({
        crop: c,
        cropHindi: r.nameHindi,
        region: region || 'Madhya Pradesh',
        season,
        sowingMonth: r.sowingMonth,
        harvestMonthOffset: r.harvestMonthOffset,
        activities: r.activities,
      }));
  }
  const rules = CROP_RULES[crop.toLowerCase()];
  if (!rules) throw { status: 404, message: `Crop '${crop}' not in advisory database.` };
  return {
    crop,
    cropHindi: rules.nameHindi,
    region: region || 'Madhya Pradesh',
    seasons: rules.seasons,
    sowingMonth: rules.sowingMonth,
    harvestMonthOffset: rules.harvestMonthOffset,
    activities: rules.activities,
  };
};

module.exports = { generateRecommendations, getForFarmer, getById, getCropCalendar, getSowingSchedule };
