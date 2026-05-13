const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const RefreshToken = sequelize.define(
    'RefreshToken',
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
      token: {
        type: DataTypes.TEXT,
        allowNull: false,
        unique: true,
      },
      expiresAt: {
        type: DataTypes.DATE,
        allowNull: false,
        field: 'expires_at',
      },
      isRevoked: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
        field: 'is_revoked',
      },
    },
    {
      tableName: 'refresh_tokens',
      underscored: true,
      timestamps: true,
    }
  );

  return RefreshToken;
};
