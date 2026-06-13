const express = require('express');
const router = express.Router();
const validatePayload = require('../middleware/validatePayload');
const payloadController = require('../controllers/payloadController');

// POST /api/payloads/ingest
router.post('/ingest', validatePayload, payloadController.ingestPayload);

// GET /api/payloads/:id
router.get('/:id', payloadController.getPayloadById);

// GET /api/payloads
router.get('/', payloadController.listPayloads);

module.exports = router;
