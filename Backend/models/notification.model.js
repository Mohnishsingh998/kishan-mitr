const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Notification = sequelize.define(
    'Notification',
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
      type: {
        type: DataTypes.ENUM('weather', 'pest', 'market', 'scheme', 'advisory', 'general'),
        defaultValue: 'general',
      },
      severity: {
        type: DataTypes.ENUM('info', 'low', 'medium', 'high'),
        defaultValue: 'info',
      },
      title: {
        type: DataTypes.STRING(200),
        allowNull: false,
      },
      titleHindi: {
        type: DataTypes.STRING(200),
        allowNull: true,
        field: 'title_hindi',
      },
      message: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      messageHindi: {
        type: DataTypes.TEXT,
        allowNull: true,
        field: 'message_hindi',
      },
      isRead: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
        field: 'is_read',
      },
      readAt: {
        type: DataTypes.DATE,
        allowNull: true,
        field: 'read_at',
      },
      metadata: {
        type: DataTypes.JSONB,
        defaultValue: {},
      },
    },
    {
      tableName: 'notifications',
      underscored: true,
      timestamps: true,
    }
  );

  return Notification;
};
