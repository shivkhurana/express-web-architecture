const { Payload } = require('../db');

exports.ingestPayload = async (req, res) => {
  const start = Date.now();
  const { external_id, data, metadata } = req.body;
  try {
    // Upsert by external_id to handle retries and idempotency
    const [record, created] = await Payload.upsert({
      external_id,
      payload: { data, metadata },
      status: 'received',
      received_at: new Date(),
    }, { returning: true });

    const processing_time_ms = Date.now() - start;
    // Update processing_time
    await Payload.update({ processing_time_ms }, { where: { external_id } });

    res.status(201).json({ external_id, created: !!created, processing_time_ms });
  } catch (err) {
    console.error('Ingest error', err);
    res.status(500).json({ error: 'Failed to ingest payload' });
  }
};

exports.getPayloadById = async (req, res) => {
  const id = req.params.id;
  try {
    const record = await Payload.findOne({ where: { external_id: id } });
    if (!record) return res.status(404).json({ error: 'Not found' });
    res.json({ external_id: record.external_id, payload: record.payload, status: record.status, received_at: record.received_at });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Query failed' });
  }
};

exports.listPayloads = async (req, res) => {
  const limit = Math.min(parseInt(req.query.limit) || 50, 1000);
  const offset = parseInt(req.query.offset) || 0;
  try {
    const rows = await Payload.findAll({ order: [['received_at', 'DESC']], limit, offset });
    res.json(rows.map(r => ({ external_id: r.external_id, status: r.status, received_at: r.received_at })));
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Query failed' });
  }
};
