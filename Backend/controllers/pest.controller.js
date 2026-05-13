const pestService = require('../services/pest.service');

const getAll = async (req, res, next) => {
  try {
    const result = await pestService.getAll(req.query);
    res.json(result);
  } catch (err) {
    next(err);
  }
};

const identify = async (req, res, next) => {
  try {
    const result = await pestService.identify(req.body);
    res.json(result);
  } catch (err) {
    next(err);
  }
};

const getTreatments = async (req, res, next) => {
  try {
    const result = await pestService.getTreatments(req.params.id);
    res.json(result);
  } catch (err) {
    next(err);
  }
};

const reportOutbreak = async (req, res, next) => {
  try {
    const outbreak = await pestService.reportOutbreak(req.body, req.farmer.id);
    res.status(201).json(outbreak);
  } catch (err) {
    next(err);
  }
};

const getNearbyOutbreaks = async (req, res, next) => {
  try {
    const { lat, lng, radius } = req.query;
    if (!lat || !lng) return res.status(400).json({ message: 'lat and lng query params required.' });
    const outbreaks = await pestService.getNearbyOutbreaks(parseFloat(lat), parseFloat(lng), parseFloat(radius) || 50);
    res.json(outbreaks);
  } catch (err) {
    next(err);
  }
};

module.exports = { getAll, identify, getTreatments, reportOutbreak, getNearbyOutbreaks };
