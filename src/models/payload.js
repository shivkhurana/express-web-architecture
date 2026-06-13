const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Payload = sequelize.define('Payload', {
    id: {
      type: DataTypes.BIGINT,
      autoIncrement: true,
      primaryKey: true,
    },
    external_id: {
      type: DataTypes.STRING(128),
      allowNull: false,
      unique: true,
    },
    payload: {
      type: DataTypes.JSONB,
      allowNull: false,
    },
    status: {
      type: DataTypes.STRING(32),
      allowNull: false,
      defaultValue: 'received',
    },
    received_at: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    processing_time_ms: {
      type: DataTypes.FLOAT,
      allowNull: true,
    },
  }, {
    tableName: 'payloads',
    timestamps: false,
    indexes: [
      { fields: ['external_id'] },
      { fields: ['status'] },
      { fields: ['received_at'] },
    ],
  });

  return Payload;
};
