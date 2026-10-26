-- Neon PostgreSQL Production Schema for BizzUp AI Operations Suite

CREATE TABLE IF NOT EXISTS businesses (
  id VARCHAR(64) PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  category VARCHAR(100) NOT NULL,
  phone VARCHAR(32) NOT NULL,
  email VARCHAR(255),
  whatsapp_number VARCHAR(32) NOT NULL,
  subscription_tier VARCHAR(32) DEFAULT 'starter', -- 'starter', 'growth', 'premium'
  catalog_size INT DEFAULT 0,
  monthly_quota JSONB DEFAULT '{"whatsappMessages": 1000, "whatsappMessagesUsed": 0, "aiCalls": 0, "aiCallsUsed": 0, "managerReports": 50, "managerReportsUsed": 0}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS employees (
  id VARCHAR(64) PRIMARY KEY,
  business_id VARCHAR(64) REFERENCES businesses(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  role VARCHAR(100) NOT NULL,
  phone VARCHAR(32) NOT NULL,
  status VARCHAR(32) DEFAULT 'active', -- 'active', 'on_site', 'on_break', 'offline'
  current_location VARCHAR(255) DEFAULT 'Headquarters',
  last_update TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  last_report_note TEXT,
  assigned_tasks INT DEFAULT 0
);

CREATE TABLE IF NOT EXISTS sales_leads (
  id VARCHAR(64) PRIMARY KEY,
  business_id VARCHAR(64) REFERENCES businesses(id) ON DELETE CASCADE,
  source VARCHAR(50) NOT NULL, -- 'indiamart', 'google_shop', 'whatsapp', 'website'
  client_name VARCHAR(255) NOT NULL,
  phone VARCHAR(32) NOT NULL,
  product_name VARCHAR(255) NOT NULL,
  quantity VARCHAR(100),
  estimated_value NUMERIC(12, 2) DEFAULT 0,
  status VARCHAR(32) DEFAULT 'new', -- 'new', 'contacted', 'negotiation', 'converted', 'lost'
  ai_score INT DEFAULT 75,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS manager_reports (
  id VARCHAR(64) PRIMARY KEY,
  business_id VARCHAR(64) REFERENCES businesses(id) ON DELETE CASCADE,
  reporter_name VARCHAR(255) NOT NULL,
  reporter_role VARCHAR(64) NOT NULL, -- 'project_manager', 'tender_manager', 'operations_head'
  title VARCHAR(255) NOT NULL,
  summary TEXT NOT NULL,
  tender_code VARCHAR(100),
  budget_status VARCHAR(100),
  risks_alerts JSONB DEFAULT '[]',
  ai_action_items JSONB DEFAULT '[]',
  submission_channel VARCHAR(32) DEFAULT 'whatsapp',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS ai_calls (
  id VARCHAR(64) PRIMARY KEY,
  business_id VARCHAR(64) REFERENCES businesses(id) ON DELETE CASCADE,
  recipient_name VARCHAR(255) NOT NULL,
  phone VARCHAR(32) NOT NULL,
  direction VARCHAR(32) DEFAULT 'outbound',
  goal VARCHAR(64) NOT NULL, -- 'lead_qualification', 'tender_followup', 'payment_reminder'
  status VARCHAR(32) DEFAULT 'completed',
  duration_seconds INT DEFAULT 0,
  transcript JSONB DEFAULT '[]',
  summary TEXT,
  sentiment VARCHAR(32) DEFAULT 'positive',
  audio_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS whatsapp_messages (
  id VARCHAR(64) PRIMARY KEY,
  business_id VARCHAR(64) REFERENCES businesses(id) ON DELETE CASCADE,
  sender_phone VARCHAR(32) NOT NULL,
  sender_name VARCHAR(255) NOT NULL,
  text TEXT NOT NULL,
  is_bot BOOLEAN DEFAULT FALSE,
  intent VARCHAR(64) DEFAULT 'general',
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Optimized query indexes
CREATE INDEX IF NOT EXISTS idx_employees_business ON employees(business_id);
CREATE INDEX IF NOT EXISTS idx_leads_business ON sales_leads(business_id);
CREATE INDEX IF NOT EXISTS idx_reports_business ON manager_reports(business_id);
CREATE INDEX IF NOT EXISTS idx_calls_business ON ai_calls(business_id);
CREATE INDEX IF NOT EXISTS idx_whatsapp_business ON whatsapp_messages(business_id);
