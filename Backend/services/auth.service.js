const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { Farmer, RefreshToken } = require('../models');
const { Op } = require('sequelize');

const SALT_ROUNDS = parseInt(process.env.BCRYPT_ROUNDS) || 10;

const generateTokens = (farmerId) => {
  const accessToken = jwt.sign({ id: farmerId }, process.env.JWT_ACCESS_SECRET, {
    expiresIn: process.env.JWT_ACCESS_EXPIRY || '15m',
  });
  const refreshToken = jwt.sign({ id: farmerId }, process.env.JWT_REFRESH_SECRET, {
    expiresIn: process.env.JWT_REFRESH_EXPIRY || '7d',
  });
  return { accessToken, refreshToken };
};

const register = async ({ name, nameHindi, phone, password, state, district, village, pincode, latitude, longitude }) => {
  const existing = await Farmer.findOne({ where: { phone } });
  if (existing) throw { status: 409, message: 'Phone number already registered.' };

  const hashed = await bcrypt.hash(password, SALT_ROUNDS);
  const farmer = await Farmer.create({
    name, nameHindi, phone, password: hashed,
    state: state || 'Madhya Pradesh', district, village, pincode, latitude, longitude,
  });

  const { accessToken, refreshToken } = generateTokens(farmer.id);

  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + 7);
  await RefreshToken.create({ farmerId: farmer.id, token: refreshToken, expiresAt });

  const safe = farmer.toJSON();
  delete safe.password;
  return { access_token: accessToken, refresh_token: refreshToken, user: safe };
};

const login = async ({ phone, password }) => {
  const farmer = await Farmer.findOne({ where: { phone } });
  if (!farmer) throw { status: 401, message: 'Invalid phone number or password.' };
  if (!farmer.isActive) throw { status: 403, message: 'Account is deactivated.' };

  const match = await bcrypt.compare(password, farmer.password);
  if (!match) throw { status: 401, message: 'Invalid phone number or password.' };

  const { accessToken, refreshToken } = generateTokens(farmer.id);

  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + 7);
  await RefreshToken.create({ farmerId: farmer.id, token: refreshToken, expiresAt });

  await farmer.update({ lastLoginAt: new Date() });

  const safe = farmer.toJSON();
  delete safe.password;
  return { access_token: accessToken, refresh_token: refreshToken, user: safe };
};

const refresh = async (token) => {
  if (!token) throw { status: 400, message: 'Refresh token required.' };

  let decoded;
  try {
    decoded = jwt.verify(token, process.env.JWT_REFRESH_SECRET);
  } catch {
    throw { status: 401, message: 'Invalid or expired refresh token.' };
  }

  const stored = await RefreshToken.findOne({
    where: { token, farmerId: decoded.id, isRevoked: false, expiresAt: { [Op.gt]: new Date() } },
  });
  if (!stored) throw { status: 401, message: 'Refresh token revoked or not found.' };

  await stored.update({ isRevoked: true });

  const { accessToken, refreshToken: newRefresh } = generateTokens(decoded.id);
  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + 7);
  await RefreshToken.create({ farmerId: decoded.id, token: newRefresh, expiresAt });

  return { access_token: accessToken, refresh_token: newRefresh };
};

const getProfile = async (farmerId) => {
  const farmer = await Farmer.findByPk(farmerId, {
    attributes: { exclude: ['password'] },
    include: [{ association: 'lands' }],
  });
  if (!farmer) throw { status: 404, message: 'Farmer not found.' };
  return farmer;
};

const updateProfile = async (farmerId, data) => {
  const farmer = await Farmer.findByPk(farmerId);
  if (!farmer) throw { status: 404, message: 'Farmer not found.' };

  // Prevent password/phone update via this endpoint
  delete data.password;
  delete data.phone;

  await farmer.update(data);
  const safe = farmer.toJSON();
  delete safe.password;
  return safe;
};

module.exports = { register, login, refresh, getProfile, updateProfile };
