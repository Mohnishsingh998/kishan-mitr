const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Farmer = sequelize.define(
    'Farmer',
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
      phone: {
        type: DataTypes.STRING(15),
        allowNull: false,
        unique: true,
        validate: { is: /^[6-9]\d{9}$/ },
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      state: {
        type: DataTypes.STRING(60),
        allowNull: false,
        defaultValue: 'Madhya Pradesh',
      },
      district: {
        type: DataTypes.STRING(60),
        allowNull: false,
      },
      village: {
        type: DataTypes.STRING(100),
        allowNull: true,
      },
      pincode: {
        type: DataTypes.STRING(10),
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
      totalLandAcres: {
        type: DataTypes.FLOAT,
        defaultValue: 0,
        field: 'total_land_acres',
      },
      irrigationType: {
        type: DataTypes.ENUM('canal', 'borewell', 'rainfed', 'mixed'),
        defaultValue: 'rainfed',
        field: 'irrigation_type',
      },
      annualIncomeRange: {
        type: DataTypes.STRING(50),
        allowNull: true,
        field: 'annual_income_range',
      },
      hasKisanCard: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
        field: 'has_kisan_card',
      },
      preferredLanguage: {
        type: DataTypes.ENUM('en', 'hi'),
        defaultValue: 'hi',
        field: 'preferred_language',
      },
      profilePicUrl: {
        type: DataTypes.TEXT,
        allowNull: true,
        field: 'profile_pic_url',
      },
      isActive: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
        field: 'is_active',
      },
      lastLoginAt: {
        type: DataTypes.DATE,
        allowNull: true,
        field: 'last_login_at',
      },
    },
    {
      tableName: 'farmers',
      underscored: true,
      timestamps: true,
    }
  );

  return Farmer;
};
