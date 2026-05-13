const weatherService = require('../services/weather.service');

const getCurrent = async (req, res, next) => {
  try {
    const { lat, lng } = req.query;
    if (!lat || !lng) return res.status(400).json({ message: 'lat and lng query params required.' });
    const data = await weatherService.getCurrent(parseFloat(lat), parseFloat(lng));
    res.json(data);
  } catch (err) {
    next(err);
  }
};

const getForecast = async (req, res, next) => {
  try {
    const { lat, lng, days } = req.query;
    if (!lat || !lng) return res.status(400).json({ message: 'lat and lng query params required.' });
    const data = await weatherService.getForecast(parseFloat(lat), parseFloat(lng), parseInt(days) || 7);
    res.json(data);
  } catch (err) {
    next(err);
  }
};

const getHistorical = async (req, res, next) => {
  try {
    const { lat, lng, from, to } = req.query;
    if (!lat || !lng || !from || !to) {
      return res.status(400).json({ message: 'lat, lng, from and to are required.' });
    }
    const data = await weatherService.getHistorical(parseFloat(lat), parseFloat(lng), from, to);
    res.json(data);
  } catch (err) {
    next(err);
  }
};

const getAgriAlert = async (req, res, next) => {
  try {
    const { lat, lng } = req.query;
    if (!lat || !lng) return res.status(400).json({ message: 'lat and lng query params required.' });
    const alerts = await weatherService.getAgriAlert(parseFloat(lat), parseFloat(lng));
    res.json({ alerts });
  } catch (err) {
    next(err);
  }
};

module.exports = { getCurrent, getForecast, getHistorical, getAgriAlert };
