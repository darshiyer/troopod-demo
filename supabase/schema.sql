-- GrowthPilot AI PostgreSQL Schema for Supabase

CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS audits (
  id TEXT PRIMARY KEY,
  url TEXT NOT NULL,
  company_name TEXT NOT NULL,
  domain TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  overall_growth_score INT NOT NULL,
  conversion_score INT NOT NULL,
  trust_score INT NOT NULL,
  ux_score INT NOT NULL,
  readability_score INT NOT NULL,
  copy_score INT NOT NULL,
  audit_data JSONB NOT NULL,
  revenue_opportunity JSONB NOT NULL
);

CREATE TABLE IF NOT EXISTS crm_leads (
  id TEXT PRIMARY KEY,
  company_name TEXT NOT NULL,
  domain TEXT NOT NULL,
  url TEXT NOT NULL,
  audit_id TEXT REFERENCES audits(id) ON DELETE SET NULL,
  contact_name TEXT,
  contact_email TEXT,
  status TEXT NOT NULL DEFAULT 'New',
  owner TEXT DEFAULT 'Growth Team',
  estimated_arr_lift NUMERIC DEFAULT 0,
  notes TEXT,
  tags TEXT[],
  follow_up_date DATE,
  last_contacted TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS outreach_campaigns (
  id TEXT PRIMARY KEY,
  audit_id TEXT REFERENCES audits(id) ON DELETE CASCADE,
  company_name TEXT NOT NULL,
  campaign_data JSONB NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
