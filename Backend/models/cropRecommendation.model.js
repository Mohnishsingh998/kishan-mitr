const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const CropRecommendation = sequelize.define(
    'CropRecommendation',
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      advisoryId: {
        type: DataTypes.UUID,
        allowNull: false,
        field: 'advisory_id',
      },
      rank: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      cropName: {
        type: DataTypes.STRING(80),
        allowNull: false,
        field: 'crop_name',
      },
      cropNameHindi: {
        type: DataTypes.STRING(80),
        allowNull: true,
        field: 'crop_name_hindi',
      },
      suitabilityScore: {
        type: DataTypes.INTEGER, // 0–100
        allowNull: false,
        field: 'suitability_score',
      },
      estimatedYieldPerAcre: {
        type: DataTypes.FLOAT,
        allowNull: true,
        field: 'estimated_yield_per_acre',
      },
      estimatedRevenue: {
        type: DataTypes.FLOAT,
        allowNull: true,
        field: 'estimated_revenue',
      },
      reasons: {
        type: DataTypes.ARRAY(DataTypes.TEXT),
        defaultValue: [],
      },
      risks: {
        type: DataTypes.ARRAY(DataTypes.TEXT),
        defaultValue: [],
      },
      // Array of {week, task, type(field/monitor/input/harvest)}
      activities: {
        type: DataTypes.JSONB,
        defaultValue: [],
      },
      sowingStart: {
        type: DataTypes.DATEONLY,
        allowNull: true,
        field: 'sowing_start',
      },
      harvestDate: {
        type: DataTypes.DATEONLY,
        allowNull: true,
        field: 'harvest_date',
      },
    },
    {
      tableName: 'crop_recommendations',
      underscored: true,
      timestamps: true,
    }
  );

  return CropRecommendation;
};
