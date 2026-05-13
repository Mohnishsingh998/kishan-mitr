const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Scheme = sequelize.define(
    'Scheme',
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      code: {
        type: DataTypes.STRING(30),
        allowNull: false,
        unique: true,
      },
      name: {
        type: DataTypes.STRING(150),
        allowNull: false,
      },
      nameHindi: {
        type: DataTypes.STRING(150),
        allowNull: true,
        field: 'name_hindi',
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      descriptionHindi: {
        type: DataTypes.TEXT,
        allowNull: true,
        field: 'description_hindi',
      },
      ministry: {
        type: DataTypes.STRING(150),
        allowNull: true,
      },
      benefit: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      eligibilityCriteria: {
        type: DataTypes.JSONB,
        defaultValue: {},
        field: 'eligibility_criteria',
        // {maxLandAcres, minLandAcres, requiresBankAccount, requiresAadhaar, states[]}
      },
      requiredDocuments: {
        type: DataTypes.ARRAY(DataTypes.TEXT),
        defaultValue: [],
        field: 'required_documents',
      },
      applicationUrl: {
        type: DataTypes.TEXT,
        allowNull: true,
        field: 'application_url',
      },
      deadline: {
        type: DataTypes.DATEONLY,
        allowNull: true,
      },
      isActive: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
        field: 'is_active',
      },
    },
    {
      tableName: 'schemes',
      underscored: true,
      timestamps: true,
    }
  );

  return Scheme;
};
