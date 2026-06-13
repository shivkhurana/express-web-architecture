-- SQL init script with recommended indexes for high-throughput payloads
CREATE TABLE IF NOT EXISTS payloads (
  id BIGSERIAL PRIMARY KEY,
  external_id VARCHAR(128) NOT NULL UNIQUE,
  payload JSONB NOT NULL,
  status VARCHAR(32) NOT NULL DEFAULT 'received',
  received_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  processing_time_ms DOUBLE PRECISION
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_payloads_status ON payloads(status);
CREATE INDEX IF NOT EXISTS idx_payloads_received_at ON payloads(received_at DESC);
CREATE INDEX IF NOT EXISTS idx_payloads_external_id ON payloads(external_id);

-- For partial indexing of recent records (helps on time-window queries)
CREATE INDEX IF NOT EXISTS idx_recent_payloads ON payloads(received_at) WHERE received_at > now() - interval '7 days';
