-- ═══════════════════════════════════════════════════════════
-- Xpress Skins Inc. — Complete Supabase Database Schema
-- Run this in: Supabase Dashboard → SQL Editor → New Query
-- ═══════════════════════════════════════════════════════════

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ─── PRODUCTS ─────────────────────────────────────────────
CREATE TABLE products (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT DEFAULT '',
  short_description TEXT DEFAULT '',
  category TEXT NOT NULL DEFAULT 'custom'
    CHECK (category IN ('full_wrap','partial_wrap','hood','trunk','color_change','custom')),
  base_price NUMERIC(10,2) NOT NULL DEFAULT 0,
  sale_price NUMERIC(10,2),
  images TEXT[] DEFAULT '{}',
  featured BOOLEAN DEFAULT false,
  status TEXT NOT NULL DEFAULT 'draft'
    CHECK (status IN ('active','draft','archived')),
  sort_order INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ─── PORTFOLIO IMAGES ─────────────────────────────────────
CREATE TABLE portfolio_images (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  drive_id TEXT NOT NULL,
  alt TEXT DEFAULT '',
  category TEXT NOT NULL DEFAULT 'Full Wrap'
    CHECK (category IN ('Full Wrap','Partial Wrap','Hood','Trunk','Color Change')),
  tags TEXT[] DEFAULT '{}',
  featured BOOLEAN DEFAULT false,
  sort_order INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ─── PORTFOLIO VIDEOS ─────────────────────────────────────
CREATE TABLE portfolio_videos (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  drive_id TEXT NOT NULL,
  title TEXT NOT NULL,
  category TEXT NOT NULL DEFAULT 'Showcase'
    CHECK (category IN ('Showcase','Process','Reveal','Event')),
  featured BOOLEAN DEFAULT false,
  sort_order INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ─── CUSTOMERS ────────────────────────────────────────────
CREATE TABLE customers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  phone TEXT DEFAULT '',
  address TEXT DEFAULT '',
  notes TEXT DEFAULT '',
  total_orders INT DEFAULT 0,
  total_quotes INT DEFAULT 0,
  total_spent NUMERIC(10,2) DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ─── QUOTES (customer requests) ──────────────────────────
CREATE TABLE quotes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  customer_id UUID REFERENCES customers(id) ON DELETE SET NULL,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT DEFAULT '',
  vehicle_info TEXT DEFAULT '',
  wrap_type TEXT DEFAULT '',
  message TEXT DEFAULT '',
  reference_images TEXT[] DEFAULT '{}',
  status TEXT NOT NULL DEFAULT 'new'
    CHECK (status IN ('new','contacted','quoted','approved','in_progress','completed','cancelled')),
  admin_notes TEXT DEFAULT '',
  quoted_price NUMERIC(10,2),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ─── CONTENT BLOCKS (CMS) ────────────────────────────────
CREATE TABLE content_blocks (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  page TEXT NOT NULL,
  section TEXT NOT NULL,
  key TEXT NOT NULL,
  value TEXT DEFAULT '',
  type TEXT NOT NULL DEFAULT 'text'
    CHECK (type IN ('text','richtext','image','json')),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE (page, section, key)
);

-- ─── PROJECTS (active builds) ────────────────────────────
CREATE TABLE projects (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  customer_name TEXT NOT NULL,
  customer_email TEXT DEFAULT '',
  vehicle_info TEXT DEFAULT '',
  wrap_type TEXT DEFAULT '',
  cover_image TEXT DEFAULT '',
  status TEXT NOT NULL DEFAULT 'design'
    CHECK (status IN ('design','revision','approved','printing','shipping','installing','completed')),
  progress INT DEFAULT 0 CHECK (progress >= 0 AND progress <= 100),
  start_date DATE DEFAULT CURRENT_DATE,
  estimated_completion DATE,
  notes TEXT DEFAULT '',
  images TEXT[] DEFAULT '{}',
  quote_id UUID REFERENCES quotes(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ─── INDEXES ──────────────────────────────────────────────
CREATE INDEX idx_products_status ON products(status);
CREATE INDEX idx_products_category ON products(category);
CREATE INDEX idx_products_featured ON products(featured) WHERE featured = true;
CREATE INDEX idx_portfolio_images_featured ON portfolio_images(featured) WHERE featured = true;
CREATE INDEX idx_portfolio_videos_featured ON portfolio_videos(featured) WHERE featured = true;
CREATE INDEX idx_quotes_status ON quotes(status);
CREATE INDEX idx_quotes_email ON quotes(email);
CREATE INDEX idx_customers_email ON customers(email);
CREATE INDEX idx_projects_status ON projects(status);
CREATE INDEX idx_content_blocks_page ON content_blocks(page, section);

-- ─── AUTO-UPDATE updated_at TRIGGER ──────────────────────
CREATE OR REPLACE FUNCTION trigger_set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_updated_at_products
  BEFORE UPDATE ON products FOR EACH ROW EXECUTE FUNCTION trigger_set_updated_at();
CREATE TRIGGER set_updated_at_quotes
  BEFORE UPDATE ON quotes FOR EACH ROW EXECUTE FUNCTION trigger_set_updated_at();
CREATE TRIGGER set_updated_at_customers
  BEFORE UPDATE ON customers FOR EACH ROW EXECUTE FUNCTION trigger_set_updated_at();
CREATE TRIGGER set_updated_at_content
  BEFORE UPDATE ON content_blocks FOR EACH ROW EXECUTE FUNCTION trigger_set_updated_at();
CREATE TRIGGER set_updated_at_projects
  BEFORE UPDATE ON projects FOR EACH ROW EXECUTE FUNCTION trigger_set_updated_at();

-- ─── ROW LEVEL SECURITY ──────────────────────────────────
-- Enable RLS on all tables
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE portfolio_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE portfolio_videos ENABLE ROW LEVEL SECURITY;
ALTER TABLE quotes ENABLE ROW LEVEL SECURITY;
ALTER TABLE customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE content_blocks ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;

-- Public read access for products, portfolio, and content
CREATE POLICY "Public can view active products" ON products
  FOR SELECT USING (status = 'active');
CREATE POLICY "Public can view portfolio images" ON portfolio_images
  FOR SELECT USING (true);
CREATE POLICY "Public can view portfolio videos" ON portfolio_videos
  FOR SELECT USING (true);
CREATE POLICY "Public can view content" ON content_blocks
  FOR SELECT USING (true);
CREATE POLICY "Public can view active projects" ON projects
  FOR SELECT USING (status != 'completed');

-- Public can INSERT quotes (submitting a quote request)
CREATE POLICY "Public can submit quotes" ON quotes
  FOR INSERT WITH CHECK (true);

-- Authenticated users (admin) have full access to everything
CREATE POLICY "Admin full access products" ON products
  FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admin full access images" ON portfolio_images
  FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admin full access videos" ON portfolio_videos
  FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admin full access quotes" ON quotes
  FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admin full access customers" ON customers
  FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admin full access content" ON content_blocks
  FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admin full access projects" ON projects
  FOR ALL USING (auth.role() = 'authenticated');

-- ─── SEED: Default content blocks ────────────────────────
INSERT INTO content_blocks (page, section, key, value, type) VALUES
  ('homepage', 'hero', 'heading_1', 'Custom Itasha Wraps', 'text'),
  ('homepage', 'hero', 'sub_1', 'Designed by artists. Printed on premium Avery vinyl. Shipped nationwide.', 'text'),
  ('homepage', 'hero', 'heading_2', 'Your Anime, Your Ride', 'text'),
  ('homepage', 'hero', 'sub_2', 'Full body wraps, partial wraps, hoods — your vision, our craftsmanship.', 'text'),
  ('homepage', 'stats', 'wraps_completed', '500+', 'text'),
  ('homepage', 'stats', 'average_rating', '4.9★', 'text'),
  ('homepage', 'stats', 'years_experience', '5+', 'text'),
  ('homepage', 'cta', 'heading', 'Ready to Turn Heads?', 'text'),
  ('homepage', 'cta', 'subheading', 'Join 500+ customers who turned their vehicles into anime masterpieces.', 'text'),
  ('homepage', 'banner', 'heading', 'Your Vision. Our Craft.', 'text'),
  ('homepage', 'banner', 'subheading', 'Every Itasha wrap starts with your idea and ends with a rolling masterpiece.', 'text'),
  ('pricing', 'intro', 'heading', 'Pricing Calculator', 'text'),
  ('pricing', 'intro', 'subheading', 'Get an instant estimate for your custom wrap project.', 'text'),
  ('contact', 'info', 'phone', '(346) 317-7987', 'text'),
  ('contact', 'info', 'email', 'info@xpressskins.com', 'text'),
  ('contact', 'info', 'address', 'Houston, TX', 'text');

-- ─── RPC: Increment customer quote count ────────────────
CREATE OR REPLACE FUNCTION increment_customer_quotes(customer_id_input UUID)
RETURNS void AS $$
BEGIN
  UPDATE customers SET total_quotes = total_quotes + 1 WHERE id = customer_id_input;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ─── ORDERS (deposits & payments) ────────────────────────
CREATE TABLE orders (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_number TEXT UNIQUE NOT NULL,
  customer_id UUID REFERENCES customers(id) ON DELETE SET NULL,
  quote_id UUID REFERENCES quotes(id) ON DELETE SET NULL,
  customer_email TEXT NOT NULL,
  customer_name TEXT NOT NULL,
  vehicle_info TEXT DEFAULT '',
  wrap_type TEXT DEFAULT '',
  design_tier TEXT DEFAULT '',
  total_price NUMERIC(10,2) NOT NULL DEFAULT 0,
  deposit_amount NUMERIC(10,2) NOT NULL DEFAULT 0,
  amount_paid NUMERIC(10,2) NOT NULL DEFAULT 0,
  stripe_payment_intent TEXT DEFAULT '',
  stripe_checkout_session TEXT DEFAULT '',
  payment_status TEXT NOT NULL DEFAULT 'pending'
    CHECK (payment_status IN ('pending','deposit_paid','partially_paid','paid','refunded')),
  status TEXT NOT NULL DEFAULT 'pending'
    CHECK (status IN ('pending','confirmed','in_production','shipped','installing','completed','cancelled')),
  notes TEXT DEFAULT '',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ─── REVISIONS (design revision requests) ────────────────
CREATE TABLE revisions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
  order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
  customer_email TEXT NOT NULL,
  revision_number INT NOT NULL DEFAULT 1,
  description TEXT NOT NULL,
  reference_images TEXT[] DEFAULT '{}',
  status TEXT NOT NULL DEFAULT 'pending'
    CHECK (status IN ('pending','in_review','in_progress','completed','rejected')),
  admin_response TEXT DEFAULT '',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for new tables
CREATE INDEX idx_orders_customer ON orders(customer_id);
CREATE INDEX idx_orders_email ON orders(customer_email);
CREATE INDEX idx_orders_status ON orders(status);
CREATE INDEX idx_revisions_project ON revisions(project_id);
CREATE INDEX idx_revisions_order ON revisions(order_id);
CREATE INDEX idx_revisions_email ON revisions(customer_email);

-- Triggers for new tables
CREATE TRIGGER set_updated_at_orders
  BEFORE UPDATE ON orders FOR EACH ROW EXECUTE FUNCTION trigger_set_updated_at();
CREATE TRIGGER set_updated_at_revisions
  BEFORE UPDATE ON revisions FOR EACH ROW EXECUTE FUNCTION trigger_set_updated_at();

-- RLS for new tables
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE revisions ENABLE ROW LEVEL SECURITY;

-- Customers can view their own orders/revisions
CREATE POLICY "Customers can view own orders" ON orders
  FOR SELECT USING (customer_email = auth.jwt() ->> 'email');
CREATE POLICY "Customers can view own revisions" ON revisions
  FOR SELECT USING (customer_email = auth.jwt() ->> 'email');
CREATE POLICY "Customers can insert revisions" ON revisions
  FOR INSERT WITH CHECK (customer_email = auth.jwt() ->> 'email');

-- Admin full access
CREATE POLICY "Admin full access orders" ON orders
  FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admin full access revisions" ON revisions
  FOR ALL USING (auth.role() = 'authenticated');

-- Service role inserts for orders (from API routes)
CREATE POLICY "Service can insert orders" ON orders
  FOR INSERT WITH CHECK (true);

-- ═══════════════════════════════════════════════════════════
-- DONE! Now create an admin user in Supabase Auth:
-- Dashboard → Authentication → Users → "Add user"
-- Email: info@xpressskins.com | Password: (your choice)
-- ═══════════════════════════════════════════════════════════
