-- ═══════════════════════════════════════════════════════════
-- Xpress Skins — Visual Page Builder Schema
-- Run in: Supabase Dashboard → SQL Editor → New Query
-- Idempotent — safe to re-run.
-- ═══════════════════════════════════════════════════════════

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ─── ROLES (admin / editor) ───────────────────────────────
-- We piggyback on Supabase Auth users; a separate table holds the role.
CREATE TABLE IF NOT EXISTS admin_users (
  user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'editor'
    CHECK (role IN ('admin','editor')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Helper: check if current jwt user has a builder role
-- SECURITY DEFINER so it bypasses RLS on admin_users (otherwise the
-- policy on admin_users would call this function recursively → error).
CREATE OR REPLACE FUNCTION is_builder_user()
RETURNS BOOLEAN LANGUAGE SQL STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (
    SELECT 1 FROM admin_users WHERE user_id = auth.uid()
  );
$$;

CREATE OR REPLACE FUNCTION is_admin_user()
RETURNS BOOLEAN LANGUAGE SQL STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (
    SELECT 1 FROM admin_users WHERE user_id = auth.uid() AND role = 'admin'
  );
$$;

-- ─── THEMES (global design tokens) ────────────────────────
CREATE TABLE IF NOT EXISTS themes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  is_default BOOLEAN DEFAULT false,
  -- JSON shape: { colors: {primary, secondary, accent, ...}, fonts: {body, heading},
  --              radii: {sm, md, lg, full}, spacing: {xs, sm, md, lg, xl},
  --              shadows: {sm, md, lg} }
  tokens JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Only ONE default theme at a time
CREATE UNIQUE INDEX IF NOT EXISTS themes_only_one_default
  ON themes ((is_default)) WHERE is_default = true;

-- ─── PAGES (the editable site pages) ──────────────────────
CREATE TABLE IF NOT EXISTS builder_pages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  slug TEXT UNIQUE NOT NULL,          -- '' = home, 'about', 'pricing/quote'
  title TEXT NOT NULL DEFAULT 'Untitled',
  status TEXT NOT NULL DEFAULT 'draft'
    CHECK (status IN ('draft','published','archived')),
  theme_id UUID REFERENCES themes(id) ON DELETE SET NULL,
  -- Puck data trees
  draft_data JSONB NOT NULL DEFAULT '{"content":[],"root":{"props":{}}}'::jsonb,
  published_data JSONB,
  -- SEO
  seo JSONB NOT NULL DEFAULT '{}'::jsonb,
  -- Show in main nav?
  in_nav BOOLEAN DEFAULT false,
  nav_label TEXT DEFAULT '',
  nav_order INT DEFAULT 0,
  created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  published_at TIMESTAMPTZ
);

CREATE INDEX IF NOT EXISTS builder_pages_status_slug
  ON builder_pages (status, slug);

-- ─── PAGE VERSIONS (snapshots for undo/restore) ───────────
CREATE TABLE IF NOT EXISTS builder_page_versions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  page_id UUID NOT NULL REFERENCES builder_pages(id) ON DELETE CASCADE,
  data JSONB NOT NULL,
  label TEXT DEFAULT '',
  created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS builder_page_versions_page
  ON builder_page_versions (page_id, created_at DESC);

-- ─── ASSETS (image / video library) ───────────────────────
CREATE TABLE IF NOT EXISTS builder_assets (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  url TEXT NOT NULL,
  storage_path TEXT,                  -- bucket path if hosted in Supabase Storage
  type TEXT NOT NULL DEFAULT 'image'
    CHECK (type IN ('image','video','svg','other')),
  mime_type TEXT,
  width INT,
  height INT,
  size_bytes BIGINT,
  alt TEXT DEFAULT '',
  folder TEXT DEFAULT '',
  uploaded_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS builder_assets_folder
  ON builder_assets (folder, created_at DESC);

-- ─── updated_at TRIGGERS ──────────────────────────────────
CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END $$;

DROP TRIGGER IF EXISTS trg_themes_updated ON themes;
CREATE TRIGGER trg_themes_updated BEFORE UPDATE ON themes
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

DROP TRIGGER IF EXISTS trg_pages_updated ON builder_pages;
CREATE TRIGGER trg_pages_updated BEFORE UPDATE ON builder_pages
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

-- ─── ROW LEVEL SECURITY ───────────────────────────────────
ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE themes ENABLE ROW LEVEL SECURITY;
ALTER TABLE builder_pages ENABLE ROW LEVEL SECURITY;
ALTER TABLE builder_page_versions ENABLE ROW LEVEL SECURITY;
ALTER TABLE builder_assets ENABLE ROW LEVEL SECURITY;

-- admin_users: only admins can read/write the list
DROP POLICY IF EXISTS admin_users_select ON admin_users;
CREATE POLICY admin_users_select ON admin_users
  FOR SELECT USING (is_admin_user() OR user_id = auth.uid());

DROP POLICY IF EXISTS admin_users_write ON admin_users;
CREATE POLICY admin_users_write ON admin_users
  FOR ALL USING (is_admin_user()) WITH CHECK (is_admin_user());

-- themes: editors read & write; public can SELECT (so the site can fetch tokens)
DROP POLICY IF EXISTS themes_public_read ON themes;
CREATE POLICY themes_public_read ON themes FOR SELECT USING (true);

DROP POLICY IF EXISTS themes_editor_write ON themes;
CREATE POLICY themes_editor_write ON themes
  FOR ALL USING (is_builder_user()) WITH CHECK (is_builder_user());

-- builder_pages: public can READ only published_data of published rows
DROP POLICY IF EXISTS pages_public_read ON builder_pages;
CREATE POLICY pages_public_read ON builder_pages
  FOR SELECT USING (status = 'published' OR is_builder_user());

DROP POLICY IF EXISTS pages_editor_write ON builder_pages;
CREATE POLICY pages_editor_write ON builder_pages
  FOR ALL USING (is_builder_user()) WITH CHECK (is_builder_user());

-- versions: editors only
DROP POLICY IF EXISTS versions_editor_all ON builder_page_versions;
CREATE POLICY versions_editor_all ON builder_page_versions
  FOR ALL USING (is_builder_user()) WITH CHECK (is_builder_user());

-- assets: public can read URLs; editors can write
DROP POLICY IF EXISTS assets_public_read ON builder_assets;
CREATE POLICY assets_public_read ON builder_assets FOR SELECT USING (true);

DROP POLICY IF EXISTS assets_editor_write ON builder_assets;
CREATE POLICY assets_editor_write ON builder_assets
  FOR ALL USING (is_builder_user()) WITH CHECK (is_builder_user());

-- ─── SEED DEFAULT THEME (XpressSkins brand) ───────────────
INSERT INTO themes (name, is_default, tokens) VALUES (
  'XpressSkins Default',
  true,
  '{
    "colors": {
      "background": "#050508",
      "foreground": "#eeeef2",
      "primary": "#ff1a6c",
      "primaryLight": "#ff5c99",
      "secondary": "#a855f7",
      "accent": "#06b6d4",
      "muted": "#6b6b8a",
      "mutedLight": "#9898b4",
      "surface0": "#08080d",
      "surface1": "#0e0e16",
      "surface2": "#15151f",
      "surface3": "#1c1c2a"
    },
    "fonts": {
      "body": "var(--font-inter), system-ui, sans-serif",
      "heading": "var(--font-inter), system-ui, sans-serif"
    },
    "radii": { "none":"0", "sm":"0.375rem", "md":"0.75rem", "lg":"1.25rem", "xl":"1.75rem", "full":"9999px" },
    "spacing": { "xs":"0.5rem", "sm":"1rem", "md":"1.5rem", "lg":"2.5rem", "xl":"4rem", "2xl":"6rem" },
    "shadows": {
      "sm":"0 2px 8px rgba(0,0,0,0.2)",
      "md":"0 12px 40px rgba(0,0,0,0.4)",
      "lg":"0 24px 80px rgba(0,0,0,0.5), 0 0 40px rgba(255,26,108,0.06)"
    }
  }'::jsonb
) ON CONFLICT DO NOTHING;

-- ─── STORAGE BUCKET (run separately if not already created) ─
-- In Supabase Dashboard → Storage → New Bucket:
--   name: builder-assets   public: true
-- Or via SQL:
INSERT INTO storage.buckets (id, name, public)
  VALUES ('builder-assets', 'builder-assets', true)
  ON CONFLICT (id) DO NOTHING;

-- Public read on the bucket; authenticated users (admins/editors) can write
DROP POLICY IF EXISTS "builder assets public read" ON storage.objects;
CREATE POLICY "builder assets public read" ON storage.objects
  FOR SELECT USING (bucket_id = 'builder-assets');

DROP POLICY IF EXISTS "builder assets editor write" ON storage.objects;
CREATE POLICY "builder assets editor write" ON storage.objects
  FOR ALL USING (
    bucket_id = 'builder-assets' AND is_builder_user()
  ) WITH CHECK (
    bucket_id = 'builder-assets' AND is_builder_user()
  );

-- ═══════════════════════════════════════════════════════════
-- POST-RUN: promote yourself to admin
--   INSERT INTO admin_users (user_id, email, role)
--   SELECT id, email, 'admin' FROM auth.users WHERE email = 'YOUR@EMAIL.COM'
--   ON CONFLICT (user_id) DO UPDATE SET role = 'admin';
-- ═══════════════════════════════════════════════════════════
