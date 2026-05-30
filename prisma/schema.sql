-- Categories table
CREATE TABLE IF NOT EXISTS categories (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  name TEXT NOT NULL UNIQUE,
  slug TEXT NOT NULL UNIQUE,
  description TEXT,
  icon TEXT,
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tools table
CREATE TABLE IF NOT EXISTS tools (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  name TEXT NOT NULL UNIQUE,
  slug TEXT NOT NULL UNIQUE,
  tagline TEXT NOT NULL,
  description TEXT NOT NULL,
  logo_url TEXT,
  website_url TEXT NOT NULL,
  affiliate_url TEXT,
  affiliate_program TEXT,
  commission_rate TEXT,
  pricing_tier TEXT NOT NULL DEFAULT 'Free' CHECK (pricing_tier IN ('Free', 'Freemium', 'Paid', 'Enterprise')),
  starting_price TEXT,
  is_free BOOLEAN NOT NULL DEFAULT false,
  featured BOOLEAN NOT NULL DEFAULT false,
  visit_count INTEGER NOT NULL DEFAULT 0,
  lead_count INTEGER NOT NULL DEFAULT 0,
  rating REAL,
  reviews_count INTEGER NOT NULL DEFAULT 0,
  best_for TEXT[] DEFAULT '{}',
  subjects TEXT[] DEFAULT '{}',
  grade_levels TEXT[] DEFAULT '{}',
  curriculum TEXT[] DEFAULT '{}',
  languages TEXT[] DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Junction table for tool-category relationship
CREATE TABLE IF NOT EXISTS tool_categories (
  tool_id TEXT NOT NULL REFERENCES tools(id) ON DELETE CASCADE,
  category_id TEXT NOT NULL REFERENCES categories(id) ON DELETE CASCADE,
  PRIMARY KEY (tool_id, category_id)
);

-- Reviews table
CREATE TABLE IF NOT EXISTS reviews (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  tool_id TEXT NOT NULL REFERENCES tools(id) ON DELETE CASCADE,
  name TEXT,
  email TEXT,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  comment TEXT NOT NULL,
  approved BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Leads table
CREATE TABLE IF NOT EXISTS leads (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  tool_id TEXT REFERENCES tools(id) ON DELETE SET NULL,
  name TEXT,
  email TEXT NOT NULL,
  message TEXT,
  type TEXT NOT NULL DEFAULT 'general',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Submissions table
CREATE TABLE IF NOT EXISTS submissions (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  tool_name TEXT NOT NULL,
  tool_url TEXT NOT NULL,
  description TEXT,
  pricing TEXT,
  status TEXT NOT NULL DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_tools_slug ON tools(slug);
CREATE INDEX IF NOT EXISTS idx_tools_featured ON tools(featured) WHERE featured = true;
CREATE INDEX IF NOT EXISTS idx_tools_pricing_tier ON tools(pricing_tier);
CREATE INDEX IF NOT EXISTS idx_categories_slug ON categories(slug);
CREATE INDEX IF NOT EXISTS idx_tool_categories_category ON tool_categories(category_id);
CREATE INDEX IF NOT EXISTS idx_tool_categories_tool ON tool_categories(tool_id);
CREATE INDEX IF NOT EXISTS idx_leads_type ON leads(type);
CREATE INDEX IF NOT EXISTS idx_leads_created ON leads(created_at DESC);
