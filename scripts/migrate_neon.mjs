import { neon } from '@neondatabase/serverless';
import fs from 'fs';
import path from 'path';

// Read .env.local
const envContent = fs.readFileSync('.env.local', 'utf-8');
const dbUrlMatch = envContent.match(/DATABASE_URL=(.+)/);
const url = dbUrlMatch ? dbUrlMatch[1].trim() : process.env.DATABASE_URL;

if (!url) {
  console.error('No DATABASE_URL found in .env.local');
  process.exit(1);
}

const sql = neon(url);

async function runMigration() {
  console.log('🔄 Checking existing tables in Neon...');
  const existingTables = await sql`
    SELECT table_name 
    FROM information_schema.tables 
    WHERE table_schema = 'public' 
    ORDER BY table_name;
  `;
  console.log('Existing tables:', existingTables.map(t => t.table_name));

  console.log('🚀 Running schema.sql creation statements...');

  // Create businesses table
  await sql`
    CREATE TABLE IF NOT EXISTS businesses (
      id VARCHAR(64) PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      category VARCHAR(100) NOT NULL,
      phone VARCHAR(32) NOT NULL,
      email VARCHAR(255),
      whatsapp_number VARCHAR(32) NOT NULL,
      gst_number VARCHAR(64),
      address TEXT,
      status VARCHAR(32) DEFAULT 'active',
      subscription_tier VARCHAR(32) DEFAULT 'starter',
      catalog_size INT DEFAULT 0,
      monthly_quota JSONB DEFAULT '{"whatsappMessages": 1000, "whatsappMessagesUsed": 0, "aiCalls": 0, "aiCallsUsed": 0, "managerReports": 50, "managerReportsUsed": 0}',
      created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
    );
  `;

  // Create employees table
  await sql`
    CREATE TABLE IF NOT EXISTS employees (
      id VARCHAR(64) PRIMARY KEY,
      business_id VARCHAR(64) REFERENCES businesses(id) ON DELETE CASCADE,
      name VARCHAR(255) NOT NULL,
      role VARCHAR(100) NOT NULL,
      role_category VARCHAR(64) DEFAULT 'site_engineer',
      site_name VARCHAR(255) DEFAULT 'Headquarters',
      phone VARCHAR(32) NOT NULL,
      staff_id VARCHAR(64),
      password VARCHAR(64),
      status VARCHAR(32) DEFAULT 'active',
      current_location VARCHAR(255) DEFAULT 'Headquarters',
      last_update TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
      last_report_note TEXT,
      assigned_tasks INT DEFAULT 0
    );
  `;

  // Create sales_leads table
  await sql`
    CREATE TABLE IF NOT EXISTS sales_leads (
      id VARCHAR(64) PRIMARY KEY,
      business_id VARCHAR(64) REFERENCES businesses(id) ON DELETE CASCADE,
      source VARCHAR(50) NOT NULL,
      client_name VARCHAR(255) NOT NULL,
      phone VARCHAR(32) NOT NULL,
      product_name VARCHAR(255) NOT NULL,
      quantity VARCHAR(100),
      estimated_value NUMERIC(12, 2) DEFAULT 0,
      status VARCHAR(32) DEFAULT 'new',
      ai_score INT DEFAULT 75,
      notes TEXT,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
    );
  `;

  // Create manager_reports table
  await sql`
    CREATE TABLE IF NOT EXISTS manager_reports (
      id VARCHAR(64) PRIMARY KEY,
      business_id VARCHAR(64) REFERENCES businesses(id) ON DELETE CASCADE,
      reporter_name VARCHAR(255) NOT NULL,
      reporter_role VARCHAR(64) NOT NULL,
      title VARCHAR(255) NOT NULL,
      summary TEXT NOT NULL,
      tender_code VARCHAR(100),
      budget_status VARCHAR(100),
      risks_alerts JSONB DEFAULT '[]',
      ai_action_items JSONB DEFAULT '[]',
      submission_channel VARCHAR(32) DEFAULT 'whatsapp',
      created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
    );
  `;

  // Create ai_calls table
  await sql`
    CREATE TABLE IF NOT EXISTS ai_calls (
      id VARCHAR(64) PRIMARY KEY,
      business_id VARCHAR(64) REFERENCES businesses(id) ON DELETE CASCADE,
      recipient_name VARCHAR(255) NOT NULL,
      phone VARCHAR(32) NOT NULL,
      direction VARCHAR(32) DEFAULT 'outbound',
      goal VARCHAR(64) NOT NULL,
      status VARCHAR(32) DEFAULT 'completed',
      duration_seconds INT DEFAULT 0,
      transcript JSONB DEFAULT '[]',
      summary TEXT,
      sentiment VARCHAR(32) DEFAULT 'positive',
      audio_url TEXT,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
    );
  `;

  // Create whatsapp_messages table
  await sql`
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
  `;

  // Create bills table
  await sql`
    CREATE TABLE IF NOT EXISTS bills (
      id VARCHAR(64) PRIMARY KEY,
      business_id VARCHAR(64) REFERENCES businesses(id) ON DELETE CASCADE,
      vendor_name VARCHAR(255) NOT NULL,
      invoice_number VARCHAR(100) NOT NULL,
      amount NUMERIC(12, 2) NOT NULL,
      due_date VARCHAR(64) NOT NULL,
      status VARCHAR(32) DEFAULT 'pending',
      gst_amount NUMERIC(12, 2) DEFAULT 0,
      category VARCHAR(64) DEFAULT 'raw_materials',
      notes TEXT,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
    );
  `;

  // Create attendance_records table
  await sql`
    CREATE TABLE IF NOT EXISTS attendance_records (
      id VARCHAR(64) PRIMARY KEY,
      business_id VARCHAR(64) REFERENCES businesses(id) ON DELETE CASCADE,
      employee_id VARCHAR(64) REFERENCES employees(id) ON DELETE CASCADE,
      date VARCHAR(32) NOT NULL,
      status VARCHAR(32) DEFAULT 'present',
      check_in_time VARCHAR(32),
      check_out_time VARCHAR(32),
      site_name VARCHAR(255),
      labor_count INT DEFAULT 0,
      notes TEXT,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
    );
  `;

  // Create inventory_items table
  await sql`
    CREATE TABLE IF NOT EXISTS inventory_items (
      id VARCHAR(64) PRIMARY KEY,
      business_id VARCHAR(64) REFERENCES businesses(id) ON DELETE CASCADE,
      sku VARCHAR(64) NOT NULL,
      name VARCHAR(255) NOT NULL,
      category VARCHAR(100) NOT NULL,
      stock_level INT DEFAULT 0,
      unit_price NUMERIC(12, 2) DEFAULT 0,
      warehouse_location VARCHAR(255),
      last_restocked TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
    );
  `;

  // Create meta_ad_accounts & campaigns tables
  await sql`
    CREATE TABLE IF NOT EXISTS meta_ad_accounts (
      id VARCHAR(64) PRIMARY KEY,
      business_id VARCHAR(64) REFERENCES businesses(id) ON DELETE CASCADE,
      ad_account_id VARCHAR(64) NOT NULL,
      page_name VARCHAR(255) NOT NULL,
      page_id VARCHAR(64),
      instagram_handle VARCHAR(100),
      access_token TEXT,
      pixel_id VARCHAR(64),
      currency VARCHAR(16) DEFAULT 'INR',
      status VARCHAR(32) DEFAULT 'connected',
      daily_spend_cap NUMERIC(12, 2) DEFAULT 5000,
      current_balance NUMERIC(12, 2) DEFAULT 0,
      api_version VARCHAR(16) DEFAULT 'v21.0',
      last_sync_time VARCHAR(64),
      created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
    );
  `;

  await sql`
    CREATE TABLE IF NOT EXISTS meta_ad_campaigns (
      id VARCHAR(64) PRIMARY KEY,
      business_id VARCHAR(64) REFERENCES businesses(id) ON DELETE CASCADE,
      name VARCHAR(255) NOT NULL,
      objective VARCHAR(64) NOT NULL,
      status VARCHAR(32) DEFAULT 'active',
      daily_budget NUMERIC(12, 2) DEFAULT 1000,
      total_spend NUMERIC(12, 2) DEFAULT 0,
      impressions INT DEFAULT 0,
      video_views_3s INT DEFAULT 0,
      video_completions INT DEFAULT 0,
      clicks INT DEFAULT 0,
      leads INT DEFAULT 0,
      cost_per_lead NUMERIC(12, 2) DEFAULT 0,
      roas NUMERIC(6, 2) DEFAULT 0,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
    );
  `;

  // Check updated table list
  const tablesAfter = await sql`
    SELECT table_name 
    FROM information_schema.tables 
    WHERE table_schema = 'public' 
    ORDER BY table_name;
  `;
  console.log('✅ Tables now active in Neon:');
  tablesAfter.forEach(t => console.log('  - ' + t.table_name));

  // Count existing businesses
  const bizCount = await sql`SELECT count(*)::int as count FROM businesses;`;
  console.log(`📊 Businesses in Neon: ${bizCount[0].count}`);

  return tablesAfter;
}

runMigration().catch(err => {
  console.error('Migration error:', err);
  process.exit(1);
});
