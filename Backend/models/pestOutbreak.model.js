const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const PestOutbreak = sequelize.define(
    'PestOutbreak',
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      pestId: {
        type: DataTypes.UUID,
        allowNull: false,
        field: 'pest_id',
      },
      reportedBy: {
        type: DataTypes.UUID,
        allowNull: true,
        field: 'reported_by',
      },
      district: {
        type: DataTypes.STRING(60),
        allowNull: false,
      },
      village: {
        type: DataTypes.STRING(100),
        allowNull: true,
      },
      latitude: {
        type: DataTypes.FLOAT,
        allowNull: true,
      },
      longitude: {
        type: DataTypes.FLOAT,
        allowNull: true,
      },
      affectedAreaAcres: {
        type: DataTypes.FLOAT,
        allowNull: true,
        field: 'affected_area_acres',
      },
      crop: {
        type: DataTypes.STRING(80),
        allowNull: true,
      },
      severity: {
        type: DataTypes.ENUM('low', 'medium', 'high', 'critical'),
        defaultValue: 'medium',
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      imageUrl: {
        type: DataTypes.TEXT,
        allowNull: true,
        field: 'image_url',
      },
      status: {
        type: DataTypes.ENUM('reported', 'verified', 'resolved'),
        defaultValue: 'reported',
      },
      reportedAt: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
        field: 'reported_at',
      },
    },
    {
      tableName: 'pest_outbreaks',
      underscored: true,
      timestamps: true,
    }
  );

  return PestOutbreak;
};
