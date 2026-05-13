const { Pest, PestOutbreak, Farmer } = require('../models');
const { Op, literal } = require('sequelize');

const getAll = async ({ type, crop, season, page = 1, limit = 20 }) => {
  const where = {};
  if (type) where.type = type;
  if (season) where.season = { [Op.contains]: [season] };
  if (crop) where.affectedCrops = { [Op.contains]: [crop] };

  const offset = (page - 1) * limit;
  const { count, rows } = await Pest.findAndCountAll({
    where,
    limit: parseInt(limit),
    offset,
    order: [['name', 'ASC']],
  });

  return { total: count, page: parseInt(page), limit: parseInt(limit), pests: rows };
};

const getById = async (id) => {
  const pest = await Pest.findByPk(id);
  if (!pest) throw { status: 404, message: 'Pest not found.' };
  return pest;
};

const getTreatments = async (id) => {
  const pest = await Pest.findByPk(id, { attributes: ['id', 'name', 'treatments', 'preventions'] });
  if (!pest) throw { status: 404, message: 'Pest not found.' };
  return { pestId: id, pestName: pest.name, treatments: pest.treatments, preventions: pest.preventions };
};

// Rule-based pest identifier (free — no external vision API)
const identify = async ({ cropName, symptoms, season }) => {
  const where = {};
  if (cropName) where.affectedCrops = { [Op.contains]: [cropName.toLowerCase()] };
  if (season) where.season = { [Op.contains]: [season] };

  const pests = await Pest.findAll({ where });

  // Score by symptom keyword overlap
  const symptomsLower = (symptoms || '').toLowerCase();
  const scored = pests
    .map((p) => {
      const pestSymptoms = (p.symptoms || '').toLowerCase();
      const words = symptomsLower.split(/\s+/);
      const matchCount = words.filter((w) => w.length > 3 && pestSymptoms.includes(w)).length;
      return { pest: p, score: matchCount };
    })
    .filter((x) => x.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 3);

  if (!scored.length) {
    return {
      message: 'Could not identify pest from symptoms. Please consult your local Krishi Vigyan Kendra.',
      matches: [],
    };
  }

  return {
    message: `Found ${scored.length} possible match(es) based on symptoms.`,
    matches: scored.map(({ pest, score }) => ({
      id: pest.id,
      name: pest.name,
      nameHindi: pest.nameHindi,
      type: pest.type,
      confidence: Math.min(95, score * 20),
      treatments: pest.treatments?.slice(0, 2),
    })),
  };
};

const reportOutbreak = async (data, reportedBy) => {
  const outbreak = await PestOutbreak.create({ ...data, reportedBy });
  return outbreak;
};

const getNearbyOutbreaks = async (lat, lng, radiusKm = 50) => {
  // Haversine approximation using bounding box (no PostGIS needed)
  const latDelta = radiusKm / 111;
  const lngDelta = radiusKm / (111 * Math.cos((lat * Math.PI) / 180));

  const outbreaks = await PestOutbreak.findAll({
    where: {
      latitude: { [Op.between]: [lat - latDelta, lat + latDelta] },
      longitude: { [Op.between]: [lng - lngDelta, lng + lngDelta] },
      status: { [Op.in]: ['reported', 'verified'] },
    },
    include: [{ association: 'pest', attributes: ['id', 'name', 'nameHindi', 'type', 'severityLevel'] }],
    order: [['reportedAt', 'DESC']],
    limit: 20,
  });

  return outbreaks;
};

module.exports = { getAll, getById, getTreatments, identify, reportOutbreak, getNearbyOutbreaks };
