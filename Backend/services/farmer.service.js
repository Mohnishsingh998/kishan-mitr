const { Farmer, Land } = require('../models');
const { Op } = require('sequelize');

const getAll = async ({ page = 1, limit = 20, state, district, search }) => {
  const where = {};
  if (state) where.state = state;
  if (district) where.district = district;
  if (search) {
    where[Op.or] = [
      { name: { [Op.iLike]: `%${search}%` } },
      { phone: { [Op.like]: `%${search}%` } },
    ];
  }

  const offset = (page - 1) * limit;
  const { count, rows } = await Farmer.findAndCountAll({
    where,
    attributes: { exclude: ['password'] },
    limit: parseInt(limit),
    offset,
    order: [['createdAt', 'DESC']],
  });

  return { total: count, page: parseInt(page), limit: parseInt(limit), farmers: rows };
};

const getById = async (id) => {
  const farmer = await Farmer.findByPk(id, {
    attributes: { exclude: ['password'] },
    include: [{ association: 'lands' }],
  });
  if (!farmer) throw { status: 404, message: 'Farmer not found.' };
  return farmer;
};

const create = async (data) => {
  const farmer = await Farmer.create(data);
  const safe = farmer.toJSON();
  delete safe.password;
  return safe;
};

const update = async (id, data) => {
  const farmer = await Farmer.findByPk(id);
  if (!farmer) throw { status: 404, message: 'Farmer not found.' };
  delete data.password;
  await farmer.update(data);
  const safe = farmer.toJSON();
  delete safe.password;
  return safe;
};

const remove = async (id) => {
  const farmer = await Farmer.findByPk(id);
  if (!farmer) throw { status: 404, message: 'Farmer not found.' };
  await farmer.update({ isActive: false }); // soft delete
};

const getLands = async (farmerId) => {
  const farmer = await Farmer.findByPk(farmerId);
  if (!farmer) throw { status: 404, message: 'Farmer not found.' };
  return Land.findAll({ where: { farmerId }, order: [['createdAt', 'ASC']] });
};

const createLand = async (farmerId, data) => {
  const farmer = await Farmer.findByPk(farmerId);
  if (!farmer) throw { status: 404, message: 'Farmer not found.' };
  const land = await Land.create({ ...data, farmerId });
  return land;
};

const updateLandSoil = async (landId, data) => {
  const land = await Land.findByPk(landId);
  if (!land) throw { status: 404, message: 'Land not found.' };
  await land.update(data);
  return land;
};

module.exports = { getAll, getById, create, update, remove, getLands, createLand, updateLandSoil };
