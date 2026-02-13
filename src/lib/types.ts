// ─── Database types matching Supabase schema ─────────────────────────────────

export interface Product {
  id: string;
  name: string;
  slug: string;
  description: string;
  short_description: string;
  category: 'full_wrap' | 'partial_wrap' | 'hood' | 'trunk' | 'color_change' | 'custom';
  base_price: number;
  sale_price: number | null;
  images: string[];           // Array of storage URLs or Drive IDs
  featured: boolean;
  status: 'active' | 'draft' | 'archived';
  sort_order: number;
  created_at: string;
  updated_at: string;
}

export interface PortfolioImage {
  id: string;
  drive_id: string;           // Google Drive file ID
  alt: string;
  category: 'Full Wrap' | 'Partial Wrap' | 'Hood' | 'Trunk' | 'Color Change';
  tags: string[];
  featured: boolean;
  sort_order: number;
  created_at: string;
}

export interface PortfolioVideo {
  id: string;
  drive_id: string;           // Google Drive file ID
  title: string;
  category: 'Showcase' | 'Process' | 'Reveal' | 'Event';
  featured: boolean;
  sort_order: number;
  created_at: string;
}

export interface Quote {
  id: string;
  customer_id: string | null;
  name: string;
  email: string;
  phone: string;
  vehicle_info: string;
  wrap_type: string;
  message: string;
  reference_images: string[];
  status: 'new' | 'contacted' | 'quoted' | 'approved' | 'in_progress' | 'completed' | 'cancelled';
  admin_notes: string;
  quoted_price: number | null;
  created_at: string;
  updated_at: string;
}

export interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  notes: string;
  total_orders: number;
  total_quotes: number;
  total_spent: number;
  created_at: string;
  updated_at: string;
}

export interface ContentBlock {
  id: string;
  page: string;               // e.g. 'homepage', 'about', 'pricing'
  section: string;             // e.g. 'hero', 'features', 'cta'
  key: string;                 // e.g. 'heading', 'subheading', 'body'
  value: string;               // The actual content (text, JSON, URL)
  type: 'text' | 'richtext' | 'image' | 'json';
  updated_at: string;
}

export interface Project {
  id: string;
  title: string;
  customer_name: string;
  customer_email: string;
  vehicle_info: string;
  wrap_type: string;
  cover_image: string;
  status: 'design' | 'revision' | 'approved' | 'printing' | 'shipping' | 'installing' | 'completed';
  progress: number;
  start_date: string;
  estimated_completion: string;
  notes: string;
  images: string[];
  quote_id: string | null;
  created_at: string;
  updated_at: string;
}

// ─── Dashboard stats ──────────────────────────────────────────────────────────
export interface DashboardStats {
  total_products: number;
  total_quotes: number;
  new_quotes: number;
  active_projects: number;
  total_customers: number;
  total_images: number;
  total_videos: number;
  revenue_this_month: number;
}

export interface Order {
  id: string;
  order_number: string;
  customer_id: string | null;
  quote_id: string | null;
  customer_email: string;
  customer_name: string;
  vehicle_info: string;
  wrap_type: string;
  design_tier: string;
  total_price: number;
  deposit_amount: number;
  amount_paid: number;
  square_payment_link_id: string;
  square_order_id: string;
  square_payment_id: string;
  payment_status: 'pending' | 'deposit_paid' | 'partially_paid' | 'paid' | 'refunded';
  status: 'pending' | 'confirmed' | 'in_production' | 'shipped' | 'installing' | 'completed' | 'cancelled';
  notes: string;
  created_at: string;
  updated_at: string;
}

export interface Revision {
  id: string;
  project_id: string | null;
  order_id: string | null;
  customer_email: string;
  revision_number: number;
  description: string;
  reference_images: string[];
  status: 'pending' | 'in_review' | 'in_progress' | 'completed' | 'rejected';
  admin_response: string;
  created_at: string;
  updated_at: string;
}
