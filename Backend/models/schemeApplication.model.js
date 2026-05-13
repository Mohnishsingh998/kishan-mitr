const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const SchemeApplication = sequelize.define(
    'SchemeApplication',
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      schemeId: {
        type: DataTypes.UUID,
        allowNull: false,
        field: 'scheme_id',
      },
      farmerId: {
        type: DataTypes.UUID,
        allowNull: false,
        field: 'farmer_id',
      },
      status: {
        type: DataTypes.ENUM('applied', 'under_review', 'approved', 'rejected', 'enrolled'),
        defaultValue: 'applied',
      },
      applicationData: {
        type: DataTypes.JSONB,
        defaultValue: {},
        field: 'application_data',
      },
      referenceNumber: {
        type: DataTypes.STRING(50),
        allowNull: true,
        field: 'reference_number',
      },
      appliedAt: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
        field: 'applied_at',
      },
      approvedAt: {
        type: DataTypes.DATE,
        allowNull: true,
        field: 'approved_at',
      },
      remarks: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
    },
    {
      tableName: 'scheme_applications',
      underscored: true,
      timestamps: true,
      indexes: [{ fields: ['scheme_id', 'farmer_id'], unique: true }],
    }
  );

  return SchemeApplication;
};
