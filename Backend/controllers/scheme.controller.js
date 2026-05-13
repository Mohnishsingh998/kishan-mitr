const schemeService = require('../services/scheme.service');

const getAll = async (req, res, next) => {
  try {
    const result = await schemeService.getAll(req.query);
    res.json(result);
  } catch (err) {
    next(err);
  }
};

const getById = async (req, res, next) => {
  try {
    const scheme = await schemeService.getById(req.params.id);
    res.json(scheme);
  } catch (err) {
    next(err);
  }
};

const getEligible = async (req, res, next) => {
  try {
    const schemes = await schemeService.getEligibleSchemes(req.params.farmerId);
    res.json(schemes);
  } catch (err) {
    next(err);
  }
};

const applyForScheme = async (req, res, next) => {
  try {
    const application = await schemeService.applyForScheme(req.params.id, req.farmer.id, req.body);
    res.status(201).json(application);
  } catch (err) {
    next(err);
  }
};

module.exports = { getAll, getById, getEligible, applyForScheme };
