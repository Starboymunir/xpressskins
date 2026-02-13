-- ═══════════════════════════════════════════════════════════
-- Add vehicles table for admin-uploadable vehicle database
-- Run this in: Supabase Dashboard → SQL Editor → New Query
-- ═══════════════════════════════════════════════════════════

CREATE TABLE IF NOT EXISTS vehicles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  make TEXT NOT NULL,
  model TEXT NOT NULL,
  year INT NOT NULL,
  trim TEXT NOT NULL DEFAULT '',
  total_sqft NUMERIC(8,2) NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_vehicles_make ON vehicles(make);
CREATE INDEX IF NOT EXISTS idx_vehicles_model ON vehicles(make, model);
CREATE UNIQUE INDEX IF NOT EXISTS idx_vehicles_unique ON vehicles(make, model, year, trim);

-- Updated-at trigger
CREATE TRIGGER set_updated_at_vehicles
  BEFORE UPDATE ON vehicles
  FOR EACH ROW EXECUTE FUNCTION trigger_set_updated_at();

ALTER TABLE vehicles ENABLE ROW LEVEL SECURITY;

-- Public read access (pricing page needs it)
CREATE POLICY "Public can read vehicles" ON vehicles
  FOR SELECT USING (true);

-- Admin full access
CREATE POLICY "Admin full access vehicles" ON vehicles
  FOR ALL USING (auth.role() = 'authenticated');

-- Service role full access (for upload API)
CREATE POLICY "Service can manage vehicles" ON vehicles
  FOR ALL USING (true);
