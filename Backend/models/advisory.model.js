const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Advisory = sequelize.define(
    'Advisory',
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
      landId: {
        type: DataTypes.UUID,
        allowNull: true,
        field: 'land_id',
      },
      season: {
        type: DataTypes.ENUM('kharif', 'rabi', 'zaid'),
        allowNull: false,
      },
      year: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: new Date().getFullYear(),
      },
      weatherData: {
        type: DataTypes.JSONB,
        allowNull: true,
        field: 'weather_data',
      },
      soilData: {
        type: DataTypes.JSONB,
        allowNull: true,
        field: 'soil_data',
      },
      status: {
        type: DataTypes.ENUM('pending', 'generated', 'viewed'),
        defaultValue: 'generated',
      },
      generatedAt: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
        field: 'generated_at',
      },
    },
    {
      tableName: 'advisories',
      underscored: true,
      timestamps: true,
    }
  );

  return Advisory;
};
