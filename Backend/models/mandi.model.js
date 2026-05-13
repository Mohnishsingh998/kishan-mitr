const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Mandi = sequelize.define(
    'Mandi',
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      name: {
        type: DataTypes.STRING(100),
        allowNull: false,
        unique: true,
      },
      nameHindi: {
        type: DataTypes.STRING(100),
        allowNull: true,
        field: 'name_hindi',
      },
      district: {
        type: DataTypes.STRING(60),
        allowNull: false,
      },
      state: {
        type: DataTypes.STRING(60),
        allowNull: false,
        defaultValue: 'Madhya Pradesh',
      },
      latitude: {
        type: DataTypes.FLOAT,
        allowNull: true,
      },
      longitude: {
        type: DataTypes.FLOAT,
        allowNull: true,
      },
      isActive: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
        field: 'is_active',
      },
    },
    {
      tableName: 'mandis',
      underscored: true,
      timestamps: true,
    }
  );

  return Mandi;
};
