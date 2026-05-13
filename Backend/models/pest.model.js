const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Pest = sequelize.define(
    'Pest',
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      name: {
        type: DataTypes.STRING(100),
        allowNull: false,
      },
      nameHindi: {
        type: DataTypes.STRING(100),
        allowNull: true,
        field: 'name_hindi',
      },
      type: {
        type: DataTypes.ENUM('pest', 'disease', 'weed', 'nutrient_deficiency'),
        allowNull: false,
      },
      affectedCrops: {
        type: DataTypes.ARRAY(DataTypes.STRING),
        defaultValue: [],
        field: 'affected_crops',
      },
      symptoms: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      symptomsHindi: {
        type: DataTypes.TEXT,
        allowNull: true,
        field: 'symptoms_hindi',
      },
      treatments: {
        type: DataTypes.JSONB,
        defaultValue: [],
        // Array of {method, description, productName, dosage, cost}
      },
      preventions: {
        type: DataTypes.ARRAY(DataTypes.TEXT),
        defaultValue: [],
      },
      season: {
        type: DataTypes.ARRAY(DataTypes.STRING),
        defaultValue: ['kharif', 'rabi'],
      },
      imageUrl: {
        type: DataTypes.TEXT,
        allowNull: true,
        field: 'image_url',
      },
      severityLevel: {
        type: DataTypes.ENUM('low', 'medium', 'high', 'critical'),
        defaultValue: 'medium',
        field: 'severity_level',
      },
    },
    {
      tableName: 'pests',
      underscored: true,
      timestamps: true,
    }
  );

  return Pest;
};
