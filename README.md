# Scalable REST API (Node.js + Express + Sequelize)

## Overview
This repository contains a scaffolded REST API designed to ingest and store large volumes of complex JSON payloads with an architecture optimized for high throughput (50,000+ records per day). It uses Express for the HTTP layer and Sequelize as the ORM (supports PostgreSQL and MySQL).

## Project Layout
- `src/index.js` — Express server bootstrap and middleware
- `src/routes/payloads.js` — payload routing
- `src/controllers/payloadController.js` — ingestion and query logic
- `src/middleware/validatePayload.js` — Joi-based payload validation middleware
- `src/db/index.js` — Sequelize initialization and model registration
- `src/models/payload.js` — payload model with recommended indexes
- `db/init.sql` — SQL initialization and index scripts
- `scripts/sync_db.js` — quick DB sync script
- `scripts/load_test.js` — autocannon-based load test harness
- `postman/Scalable API.postman_collection.json` — Postman collection demonstrating the API

## Getting Started

1. Copy `.env.example` to `.env` and set the database credentials.

2. Install dependencies:

```bash
cd scalable_rest_api_nodejs
npm install
```

3. Initialize or migrate the database (Postgres/MySQL):

```bash
node scripts/sync_db.js
# Or run db/init.sql against your DB to create tables and indexes
```

4. Start the server:

```bash
npm start
# or for local development
npm run dev
```

5. API docs available at `http://localhost:3000/api/docs` (Swagger UI)

## Endpoints
- `POST /api/payloads/ingest` — ingest payloads (idempotent by `external_id`)
- `GET /api/payloads/:id` — fetch single payload by external id
- `GET /api/payloads` — list recent payloads with pagination

## Database & Indexing
- Use PostgreSQL for JSONB and partial indexing advantages.
- `db/init.sql` contains recommended indexes:
  - index on `status`
  - index on `received_at` with DESC order
  - unique index on `external_id`
  - partial index for recent records (last 7 days)

## Scaling and Performance
- Connection pool tuned in `src/db/index.js`.
- Use batching writes or Kafka for ingest bursts; replace `Payload.upsert` with bulk inserts for large-scale ingestion.
- Deploy behind a load balancer with multiple Node workers (PM2 or Kubernetes pods).
- Use read replicas for heavy read workloads and partition/archive old payloads.
- To handle 50k+ daily payloads: ensure DB hardware IOPS, tune WAL, and consider partitioning by time.

## Load Testing
A simple `autocannon` script is provided at `scripts/load_test.js`:

```bash
# run simple load test against ingest endpoint
PORT=3000 node scripts/load_test.js
```

Tune env variables `LOAD_TEST_CONN` and `LOAD_TEST_DURATION` to simulate higher throughput.

## Security and Best Practices
- Use HTTPS and API gateway in production.
- Apply authentication and authorization middleware.
- Rate-limit and implement request signing for client requests.
- Sanitize and validate payloads strictly.

## Postman
Import `postman/Scalable API.postman_collection.json` to test the endpoints.

## Next steps (suggested)
- Add background workers to process and transform payloads asynchronously (e.g., BullMQ/Redis).
- Add proper migrations via `sequelize-cli` and CI integration.
- Implement monitoring (Prometheus/Grafana), tracing (Jaeger), and central logging (ELK).

