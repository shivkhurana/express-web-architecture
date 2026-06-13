const autocannon = require('autocannon');

const url = process.env.LOAD_TEST_URL || 'http://localhost:3000/api/payloads/ingest';
const connections = parseInt(process.env.LOAD_TEST_CONN) || 50;
const duration = parseInt(process.env.LOAD_TEST_DURATION) || 30; // seconds

function bodyGenerator(i) {
  return JSON.stringify({
    external_id: `test-${Date.now()}-${i}`,
    data: { value: Math.random(), index: i },
    metadata: { source: 'loadtest' }
  });
}

const instance = autocannon({
  url,
  method: 'POST',
  connections,
  duration,
  headers: { 'content-type': 'application/json' },
  setupClient: (client) => {
    let i = 0;
    client.on('request', (req) => {
      req.body = bodyGenerator(i++);
    });
  }
}, console.log);

autocannon.track(instance, { renderProgress: true });
