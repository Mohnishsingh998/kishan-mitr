const advisoryService = require('../services/advisory.service');

const getRecommendation = async (req, res, next) => {
  try {
    const { landId, season, farmerId: bodyFarmerId } = req.body;
    const farmerId = req.farmer?.id || bodyFarmerId;
    if (!farmerId) {
      return res.status(400).json({ message: 'farmerId is required in body or authenticate via JWT.' });
    }
    const result = await advisoryService.generateRecommendations({
      farmerId,
      landId,
      season,
    });
    res.status(201).json(result);
  } catch (err) {
    next(err);
  }
};

const getForFarmer = async (req, res, next) => {
  try {
    const advisories = await advisoryService.getForFarmer(req.params.id);
    res.json(advisories);
  } catch (err) {
    next(err);
  }
};

const getById = async (req, res, next) => {
  try {
    const advisory = await advisoryService.getById(req.params.id);
    res.json(advisory);
  } catch (err) {
    next(err);
  }
};

const getCropCalendar = async (req, res, next) => {
  try {
    const calendar = await advisoryService.getCropCalendar(req.query);
    res.json(calendar);
  } catch (err) {
    next(err);
  }
};

const getSowingSchedule = async (req, res, next) => {
  try {
    const { crop, region } = req.query;
    const schedule = await advisoryService.getSowingSchedule(crop, region);
    res.json(schedule);
  } catch (err) {
    next(err);
  }
};

module.exports = { getRecommendation, getForFarmer, getById, getCropCalendar, getSowingSchedule };
