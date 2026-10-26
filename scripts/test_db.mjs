import { neon } from '@neondatabase/serverless';

const url = 'postgresql://neondb_owner:npg_dRqFN6ILMJ0U@ep-steep-snow-b5kqqdkc-pooler.c-7.us-east-2.aws.neon.tech/neondb?sslmode=require&channel_binding=require';

async function main() {
  try {
    const sql = neon(url);
    const result = await sql`SELECT NOW() as current_time, current_database() as db_name, version() as pg_version;`;
    console.log('✅ NEON CONNECTED SUCCESSFULLY!');
    console.log('Result:', result);
  } catch (err) {
    console.error('❌ NEON CONNECTION FAILED:', err);
  }
}

main();
