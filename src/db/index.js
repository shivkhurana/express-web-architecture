const { Sequelize } = require('sequelize');

const dialect = process.env.DB_DIALECT || 'postgres';
const host = process.env.DB_HOST || 'localhost';
const port = process.env.DB_PORT || (dialect === 'postgres' ? 5432 : 3306);
const database = process.env.DB_NAME || 'payloads_db';
const username = process.env.DB_USER || 'payload_user';
const password = process.env.DB_PASSWORD || 'change_me';

const sequelize = new Sequelize(database, username, password, {
  host,
  port,
  dialect,
  logging: false,
  pool: {
    max: 20,
    min: 2,
    acquire: 30000,
    idle: 10000,
  },
});

// Import models
const Payload = require('../models/payload')(sequelize);

module.exports = { sequelize, Payload };
