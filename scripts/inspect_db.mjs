import { neon } from '@neondatabase/serverless';
import fs from 'fs';

const env = fs.readFileSync('.env.local', 'utf8');
const match = env.match(/DATABASE_URL=(.+)/);
const sql = neon(match[1].trim());

async function check() {
  const tables = ['businesses', 'employees', 'sales_leads', 'bills', 'inventory_items', 'whatsapp_messages', 'ai_calls', 'manager_reports', 'attendance_records', 'meta_ad_accounts', 'meta_ad_campaigns'];
  for (const t of tables) {
    try {
      const res = await sql(`SELECT count(*)::int as count FROM ${t};`);
      console.log(`${t}: ${res[0].count} rows`);
    } catch(e) {
      console.log(`${t} error: ${e.message}`);
    }
  }
}

check().catch(console.error);
