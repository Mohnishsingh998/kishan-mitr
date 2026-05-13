const authService = require('../services/auth.service');

const register = async (req, res, next) => {
  try {
    const result = await authService.register(req.body);
    res.status(201).json(result);
  } catch (err) {
    next(err);
  }
};

const login = async (req, res, next) => {
  try {
    const result = await authService.login(req.body);
    res.json(result);
  } catch (err) {
    next(err);
  }
};

const refreshToken = async (req, res, next) => {
  try {
    const { refresh_token } = req.body;
    const result = await authService.refresh(refresh_token);
    res.json(result);
  } catch (err) {
    next(err);
  }
};

const getProfile = async (req, res, next) => {
  try {
    const farmer = await authService.getProfile(req.farmer.id);
    res.json(farmer);
  } catch (err) {
    next(err);
  }
};

const updateProfile = async (req, res, next) => {
  try {
    const updated = await authService.updateProfile(req.farmer.id, req.body);
    res.json(updated);
  } catch (err) {
    next(err);
  }
};

module.exports = { register, login, refreshToken, getProfile, updateProfile };
