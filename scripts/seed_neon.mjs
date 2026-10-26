import { neon } from '@neondatabase/serverless';
import fs from 'fs';

const envContent = fs.readFileSync('.env.local', 'utf-8');
const dbUrlMatch = envContent.match(/DATABASE_URL=(.+)/);
const url = dbUrlMatch ? dbUrlMatch[1].trim() : process.env.DATABASE_URL;

const sql = neon(url);

async function seed() {
  const count = await sql`SELECT count(*)::int as count FROM businesses;`;
  if (count[0].count > 0) {
    console.log(`Database already has ${count[0].count} business(es). Skipping seed.`);
    return;
  }

  console.log('🌱 Seeding initial Enterprise Business to Neon...');
  
  // 1. Business
  await sql`
    INSERT INTO businesses (
      id, name, category, phone, email, whatsapp_number, gst_number, address, status, subscription_tier, catalog_size, monthly_quota
    ) VALUES (
      'biz_apex_industries',
      'Apex Industrial & Engineering Solutions',
      'Industrial Manufacturing & Tenders',
      '+91 98765 43210',
      'operations@apexindustrial.in',
      '+91 98765 43210',
      '07AAACA1234F1Z8',
      'Plot 42, Udyog Vihar Phase 4, Gurugram, Haryana',
      'active',
      'premium',
      142,
      '{"whatsappMessages": 25000, "whatsappMessagesUsed": 4210, "aiCalls": 500, "aiCallsUsed": 84, "managerReports": 300, "managerReportsUsed": 49}'
    );
  `;

  // 2. Employees
  await sql`
    INSERT INTO employees (id, business_id, name, role, role_category, site_name, phone, staff_id, password, status, current_location, last_report_note, assigned_tasks) VALUES
    ('emp_1', 'biz_apex_industries', 'Vikram Sharma', 'Senior Site Engineer', 'site_engineer', 'Sector 62 Metro Depot Site', '+91 98111 22334', 'ENG-NOID-401', 'pass_8392', 'on_site', 'Sector 62 Metro Depot Site, Noida', '18 labor active. Concrete pouring completed.', 4),
    ('emp_2', 'biz_apex_industries', 'Sunita Rao', 'Tender & Bid Manager', 'tender_manager', 'Corporate HQ, Gurugram', '+91 98222 33445', 'TNDR-CORP-102', 'pass_9182', 'active', 'Corporate HQ, Gurugram', 'NTPC STPP bid submission complete. EMD verified.', 3),
    ('emp_3', 'biz_apex_industries', 'Harish Chandra', 'Dispatch & Warehouse Supervisor', 'dispatch_manager', 'Manesar Hub 2', '+91 98333 44556', 'DISP-MANE-205', 'pass_1049', 'active', 'Warehouse Hub 2, Manesar', 'ReadyMix batch dispatched to Noida.', 2),
    ('emp_4', 'biz_apex_industries', 'Rajesh Verma', 'Project Director', 'project_manager', 'IOCL Panipat Refinery Site', '+91 98444 55667', 'PM-PANI-311', 'pass_7721', 'on_site', 'IOCL Panipat Refinery Site', 'Piping milestone 85% inspected.', 5);
  `;

  // 3. Sales Leads
  await sql`
    INSERT INTO sales_leads (id, business_id, source, client_name, phone, product_name, quantity, estimated_value, status, ai_score, notes) VALUES
    ('lead_1', 'biz_apex_industries', 'indiamart', 'Aditya Engineering Works', '+91 99100 88201', 'DN200 Butterfly Valves PN16', '150 Units', 320000, 'negotiation', 94, 'Inquired via IndiaMart. AI quotation generated & dispatched via WhatsApp.'),
    ('lead_2', 'biz_apex_industries', 'google_shop', 'Kaveri Steel Mills', '+91 98200 77112', 'Industrial Gate Valves 4 Inch', '60 Units', 180000, 'contacted', 82, 'Google Business profile search inquiry.'),
    ('lead_3', 'biz_apex_industries', 'whatsapp', 'Bharat Petroleum Sub-contractor', '+91 97300 66223', 'High Pressure Ball Valves Stainless Steel', '40 Units', 290000, 'new', 88, 'Inbound WhatsApp request from BPCL vendor.'),
    ('lead_4', 'biz_apex_industries', 'website', 'Tata Power Solar EPC', '+91 98400 55334', 'Control Valves & Pneumatic Actuators', '25 Sets', 440000, 'negotiation', 91, 'Direct RFP uploaded on website catalog.');
  `;

  // 4. Bills
  await sql`
    INSERT INTO bills (id, business_id, vendor_name, invoice_number, amount, due_date, status, gst_amount, category, notes) VALUES
    ('bill_1', 'biz_apex_industries', 'Kaveri Steel Mills Ltd', 'INV-2026-892', 175000, '15-Oct', 'pending', 31500, 'raw_materials', 'Mild steel plate buffer stock.'),
    ('bill_2', 'biz_apex_industries', 'Noida ReadyMix Logistics', 'INV-2026-904', 84000, '18-Oct', 'pending', 15120, 'logistics', 'Sector 62 concrete transit.'),
    ('bill_3', 'biz_apex_industries', 'Schneider Electric Actuators', 'INV-2026-781', 320000, '05-Oct', 'paid', 57600, 'components', 'Actuator motors for NTPC tender milestone.');
  `;

  // 5. Inventory
  await sql`
    INSERT INTO inventory_items (id, business_id, sku, name, category, stock_level, unit_price, warehouse_location) VALUES
    ('inv_1', 'biz_apex_industries', 'VLV-DN200-PN16', 'DN200 Butterfly Valve PN16', 'Valves', 285, 3230, 'Warehouse Hub 1, Sector 4, Gurugram'),
    ('inv_2', 'biz_apex_industries', 'PMP-15HP-CENT', 'Multi-Stage Centrifugal Pump 15HP', 'Pumps', 42, 30000, 'Warehouse Hub 2, Manesar'),
    ('inv_3', 'biz_apex_industries', 'RAW-MS-PLT-12', 'Mild Steel Plates 12mm IS 2062', 'Raw Materials', 580, 3500, 'Open Yard 3, Faridabad'),
    ('inv_4', 'biz_apex_industries', 'ACT-PNU-MOD', 'Pneumatic Rotary Actuator 90-deg', 'Actuators', 72, 9000, 'Warehouse Hub 1, Sector 4, Gurugram');
  `;

  // 6. Meta Ad Account
  await sql`
    INSERT INTO meta_ad_accounts (
      id, business_id, ad_account_id, page_name, page_id, instagram_handle, access_token, pixel_id, currency, status, daily_spend_cap, current_balance, api_version, last_sync_time
    ) VALUES (
      'meta_acc_1',
      'biz_apex_industries',
      'act_84920194829',
      'Apex Industrial & Engineering Solutions',
      '109284719283719',
      '@apex_industrial_solutions',
      'EAAG9284719284EAAX98274109824_LIVE_APP',
      'pix_9918274619',
      'INR',
      'connected',
      8000,
      32450,
      'v21.0',
      'Live Neon Synced'
    );
  `;

  console.log('✅ Seed complete! All enterprise entities populated in Neon PostgreSQL.');
}

seed().catch(err => {
  console.error('Seed error:', err);
  process.exit(1);
});
