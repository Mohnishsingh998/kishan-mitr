const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Land = sequelize.define(
    'Land',
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      farmerId: {
        type: DataTypes.UUID,
        allowNull: false,
        field: 'farmer_id',
      },
      name: {
        type: DataTypes.STRING(100),
        allowNull: false,
      },
      areaAcres: {
        type: DataTypes.FLOAT,
        allowNull: false,
        field: 'area_acres',
      },
      soilType: {
        type: DataTypes.ENUM('black', 'red', 'alluvial', 'sandy', 'clay', 'loamy'),
        defaultValue: 'black',
        field: 'soil_type',
      },
      soilPh: {
        type: DataTypes.FLOAT,
        allowNull: true,
        field: 'soil_ph',
      },
      soilOrganicMatter: {
        type: DataTypes.FLOAT,
        allowNull: true,
        field: 'soil_organic_matter',
      },
      irrigationType: {
        type: DataTypes.ENUM('canal', 'borewell', 'rainfed', 'drip', 'sprinkler', 'mixed'),
        defaultValue: 'rainfed',
        field: 'irrigation_type',
      },
      latitude: {
        type: DataTypes.FLOAT,
        allowNull: true,
      },
      longitude: {
        type: DataTypes.FLOAT,
        allowNull: true,
      },
      lastCrop: {
        type: DataTypes.STRING(80),
        allowNull: true,
        field: 'last_crop',
      },
      lastCropHindi: {
        type: DataTypes.STRING(80),
        allowNull: true,
        field: 'last_crop_hindi',
      },
      suitableCrops: {
        type: DataTypes.ARRAY(DataTypes.STRING),
        defaultValue: [],
        field: 'suitable_crops',
      },
      notes: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
    },
    {
      tableName: 'lands',
      underscored: true,
      timestamps: true,
    }
  );

  return Land;
};
