'use strict';

const { Sequelize } = require('sequelize');
const config = require('../config/database');

const env = process.env.NODE_ENV || 'development';
const dbConfig = config[env];

const sequelize = new Sequelize(
  dbConfig.database,
  dbConfig.username,
  dbConfig.password,
  {
    host: dbConfig.host,
    port: dbConfig.port,
    dialect: dbConfig.dialect,
    logging: dbConfig.logging,
    dialectOptions: dbConfig.dialectOptions,
    pool: dbConfig.pool,
  }
);

// Import all models
const Farmer = require('./farmer.model')(sequelize);
const Land = require('./land.model')(sequelize);
const Advisory = require('./advisory.model')(sequelize);
const CropRecommendation = require('./cropRecommendation.model')(sequelize);
const MarketPrice = require('./marketPrice.model')(sequelize);
const Mandi = require('./mandi.model')(sequelize);
const Pest = require('./pest.model')(sequelize);
const PestOutbreak = require('./pestOutbreak.model')(sequelize);
const Scheme = require('./scheme.model')(sequelize);
const SchemeApplication = require('./schemeApplication.model')(sequelize);
const Notification = require('./notification.model')(sequelize);
const RefreshToken = require('./refreshToken.model')(sequelize);

// ─── Associations ─────────────────────────────────────────────────────────────

// Farmer ↔ Land (1:Many)
Farmer.hasMany(Land, { foreignKey: 'farmerId', as: 'lands' });
Land.belongsTo(Farmer, { foreignKey: 'farmerId', as: 'farmer' });

// Farmer ↔ Advisory (1:Many)
Farmer.hasMany(Advisory, { foreignKey: 'farmerId', as: 'advisories' });
Advisory.belongsTo(Farmer, { foreignKey: 'farmerId', as: 'farmer' });

// Advisory ↔ Land
Land.hasMany(Advisory, { foreignKey: 'landId', as: 'advisories' });
Advisory.belongsTo(Land, { foreignKey: 'landId', as: 'land' });

// Advisory ↔ CropRecommendation (1:Many)
Advisory.hasMany(CropRecommendation, { foreignKey: 'advisoryId', as: 'recommendations' });
CropRecommendation.belongsTo(Advisory, { foreignKey: 'advisoryId', as: 'advisory' });

// Mandi ↔ MarketPrice (1:Many)
Mandi.hasMany(MarketPrice, { foreignKey: 'mandiId', as: 'prices' });
MarketPrice.belongsTo(Mandi, { foreignKey: 'mandiId', as: 'mandi' });

// Pest ↔ PestOutbreak (1:Many)
Pest.hasMany(PestOutbreak, { foreignKey: 'pestId', as: 'outbreaks' });
PestOutbreak.belongsTo(Pest, { foreignKey: 'pestId', as: 'pest' });

// Farmer ↔ PestOutbreak (1:Many) — reported by farmer
Farmer.hasMany(PestOutbreak, { foreignKey: 'reportedBy', as: 'reportedOutbreaks' });
PestOutbreak.belongsTo(Farmer, { foreignKey: 'reportedBy', as: 'reporter' });

// Scheme ↔ SchemeApplication (1:Many)
Scheme.hasMany(SchemeApplication, { foreignKey: 'schemeId', as: 'applications' });
SchemeApplication.belongsTo(Scheme, { foreignKey: 'schemeId', as: 'scheme' });

// Farmer ↔ SchemeApplication (1:Many)
Farmer.hasMany(SchemeApplication, { foreignKey: 'farmerId', as: 'applications' });
SchemeApplication.belongsTo(Farmer, { foreignKey: 'farmerId', as: 'farmer' });

// Farmer ↔ Notification (1:Many)
Farmer.hasMany(Notification, { foreignKey: 'farmerId', as: 'notifications' });
Notification.belongsTo(Farmer, { foreignKey: 'farmerId', as: 'farmer' });

// Farmer ↔ RefreshToken (1:Many)
Farmer.hasMany(RefreshToken, { foreignKey: 'farmerId', as: 'refreshTokens' });
RefreshToken.belongsTo(Farmer, { foreignKey: 'farmerId', as: 'farmer' });

module.exports = {
  sequelize,
  Sequelize,
  Farmer,
  Land,
  Advisory,
  CropRecommendation,
  MarketPrice,
  Mandi,
  Pest,
  PestOutbreak,
  Scheme,
  SchemeApplication,
  Notification,
  RefreshToken,
};
