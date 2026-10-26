import { neon } from '@neondatabase/serverless';
import fs from 'fs';

const envContent = fs.readFileSync('.env.local', 'utf-8');
const dbUrlMatch = envContent.match(/DATABASE_URL=(.+)/);
const url = dbUrlMatch ? dbUrlMatch[1].trim() : process.env.DATABASE_URL;

const sql = neon(url);

async function test() {
  const biz = await sql`SELECT * FROM businesses LIMIT 1;`;
  console.log('Business:', biz[0]);

  const emps = await sql`SELECT * FROM employees LIMIT 2;`;
  console.log('Employees:', emps);

  const leads = await sql`SELECT * FROM sales_leads LIMIT 2;`;
  console.log('Leads:', leads);

  const bills = await sql`SELECT * FROM bills LIMIT 2;`;
  console.log('Bills:', bills);
}

test().catch(console.error);
