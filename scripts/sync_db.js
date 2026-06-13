require('dotenv').config();
const { sequelize, Payload } = require('../src/db');

async function sync() {
  try {
    await sequelize.authenticate();
    console.log('DB authenticated');
    await sequelize.sync({ alter: true });
    console.log('All models synced');
    process.exit(0);
  } catch (err) {
    console.error('DB sync failed', err);
    process.exit(1);
  }
}

sync();
