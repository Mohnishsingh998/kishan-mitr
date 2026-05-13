const farmerService = require('../services/farmer.service');

const getAll = async (req, res, next) => {
  try {
    const result = await farmerService.getAll(req.query);
    res.json(result);
  } catch (err) {
    next(err);
  }
};

const getById = async (req, res, next) => {
  try {
    const farmer = await farmerService.getById(req.params.id);
    res.json(farmer);
  } catch (err) {
    next(err);
  }
};

const create = async (req, res, next) => {
  try {
    const farmer = await farmerService.create(req.body);
    res.status(201).json(farmer);
  } catch (err) {
    next(err);
  }
};

const update = async (req, res, next) => {
  try {
    const farmer = await farmerService.update(req.params.id, req.body);
    res.json(farmer);
  } catch (err) {
    next(err);
  }
};

const remove = async (req, res, next) => {
  try {
    await farmerService.remove(req.params.id);
    res.status(204).send();
  } catch (err) {
    next(err);
  }
};

const getLands = async (req, res, next) => {
  try {
    const lands = await farmerService.getLands(req.params.id);
    res.json(lands);
  } catch (err) {
    next(err);
  }
};

const createLand = async (req, res, next) => {
  try {
    const land = await farmerService.createLand(req.params.id, req.body);
    res.status(201).json(land);
  } catch (err) {
    next(err);
  }
};

const updateLandSoil = async (req, res, next) => {
  try {
    const land = await farmerService.updateLandSoil(req.params.landId, req.body);
    res.json(land);
  } catch (err) {
    next(err);
  }
};

module.exports = { getAll, getById, create, update, remove, getLands, createLand, updateLandSoil };
