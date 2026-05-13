const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const MarketPrice = sequelize.define(
    'MarketPrice',
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      mandiId: {
        type: DataTypes.UUID,
        allowNull: false,
        field: 'mandi_id',
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
      pricePerQuintal: {
        type: DataTypes.FLOAT,
        allowNull: false,
        field: 'price_per_quintal',
      },
      minPrice: {
        type: DataTypes.FLOAT,
        allowNull: true,
        field: 'min_price',
      },
      maxPrice: {
        type: DataTypes.FLOAT,
        allowNull: true,
        field: 'max_price',
      },
      mspPrice: {
        type: DataTypes.FLOAT,
        allowNull: true,
        field: 'msp_price',
      },
      priceChange: {
        type: DataTypes.FLOAT,
        defaultValue: 0,
        field: 'price_change',
      },
      trend: {
        type: DataTypes.ENUM('up', 'down', 'stable'),
        defaultValue: 'stable',
      },
      tradeDate: {
        type: DataTypes.DATEONLY,
        allowNull: false,
        defaultValue: DataTypes.NOW,
        field: 'trade_date',
      },
      source: {
        type: DataTypes.STRING(50),
        defaultValue: 'manual',
      },
    },
    {
      tableName: 'market_prices',
      underscored: true,
      timestamps: true,
      indexes: [
        { fields: ['mandi_id', 'crop_name', 'trade_date'], unique: true },
        { fields: ['crop_name'] },
        { fields: ['trade_date'] },
      ],
    }
  );

  return MarketPrice;
};
