const swaggerJsdoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Scalable REST API',
      version: '1.0.0',
      description: 'API for high-throughput payload ingestion and querying',
    },
    servers: [{ url: 'http://localhost:3000' }],
  },
  apis: ['./src/routes/*.js', './src/controllers/*.js'],
};

module.exports = swaggerJsdoc(options);
