const { Scheme, SchemeApplication, Farmer } = require('../models');
const { Op } = require('sequelize');
const { v4: uuidv4 } = require('crypto');

const getAll = async ({ page = 1, limit = 20, isActive = true }) => {
  const where = {};
  if (isActive !== undefined) where.isActive = isActive;

  const offset = (page - 1) * limit;
  const { count, rows } = await Scheme.findAndCountAll({
    where,
    limit: parseInt(limit),
    offset,
    order: [['name', 'ASC']],
  });

  return { total: count, page: parseInt(page), limit: parseInt(limit), schemes: rows };
};

const getById = async (id) => {
  const scheme = await Scheme.findByPk(id);
  if (!scheme) throw { status: 404, message: 'Scheme not found.' };
  return scheme;
};

// Check eligibility for all schemes for a given farmer
const getEligibleSchemes = async (farmerId) => {
  const farmer = await Farmer.findByPk(farmerId, {
    attributes: { exclude: ['password'] },
  });
  if (!farmer) throw { status: 404, message: 'Farmer not found.' };

  const schemes = await Scheme.findAll({ where: { isActive: true } });
  const applications = await SchemeApplication.findAll({ where: { farmerId } });
  const appliedIds = new Set(applications.map((a) => a.schemeId));

  const eligible = schemes.map((s) => {
    const criteria = s.eligibilityCriteria || {};
    let isEligible = true;
    const reasons = [];

    if (criteria.maxLandAcres && farmer.totalLandAcres > criteria.maxLandAcres) {
      isEligible = false;
      reasons.push(`Land holding exceeds ${criteria.maxLandAcres} acres limit.`);
    }
    if (criteria.minLandAcres && farmer.totalLandAcres < criteria.minLandAcres) {
      isEligible = false;
      reasons.push(`Requires minimum ${criteria.minLandAcres} acres.`);
    }
    if (criteria.states?.length && !criteria.states.includes(farmer.state)) {
      isEligible = false;
      reasons.push(`Scheme not available in ${farmer.state}.`);
    }

    const application = applications.find((a) => a.schemeId === s.id);
    const status = application ? application.status : isEligible ? 'eligible' : 'not_eligible';

    return {
      ...s.toJSON(),
      eligibility: { isEligible, reasons },
      applicationStatus: status,
      applicationId: application?.id || null,
    };
  });

  return eligible;
};

const applyForScheme = async (schemeId, farmerId, applicationData) => {
  const scheme = await Scheme.findByPk(schemeId);
  if (!scheme) throw { status: 404, message: 'Scheme not found.' };

  const existing = await SchemeApplication.findOne({ where: { schemeId, farmerId } });
  if (existing) throw { status: 409, message: 'Already applied for this scheme.' };

  const refNum = `KM-${scheme.code}-${Date.now().toString(36).toUpperCase()}`;

  const application = await SchemeApplication.create({
    schemeId,
    farmerId,
    applicationData: applicationData || {},
    referenceNumber: refNum,
    status: 'applied',
    appliedAt: new Date(),
  });

  return application;
};

module.exports = { getAll, getById, getEligibleSchemes, applyForScheme };
