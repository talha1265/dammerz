import { NextResponse } from 'next/server';
import { neon } from '@neondatabase/serverless';

export async function POST(req: Request) {
  try {
    const { connectionString } = await req.json();
    const url = connectionString || process.env.DATABASE_URL || process.env.NEON_DATABASE_URL;

    if (!url) {
      return NextResponse.json(
        {
          success: false,
          error: 'No Neon connection string provided. Please enter your postgresql:// connection URI.',
        },
        { status: 400 }
      );
    }

    const sql = neon(url);

    // Create core tables
    await sql`
      CREATE TABLE IF NOT EXISTS businesses (
        id VARCHAR(64) PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        category VARCHAR(100) NOT NULL,
        phone VARCHAR(32) NOT NULL,
        email VARCHAR(255),
        whatsapp_number VARCHAR(32) NOT NULL,
        subscription_tier VARCHAR(32) DEFAULT 'starter',
        catalog_size INT DEFAULT 0,
        monthly_quota JSONB DEFAULT '{"whatsappMessages": 1000, "whatsappMessagesUsed": 0, "aiCalls": 0, "aiCallsUsed": 0, "managerReports": 50, "managerReportsUsed": 0}',
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      )
    `;

    await sql`
      CREATE TABLE IF NOT EXISTS employees (
        id VARCHAR(64) PRIMARY KEY,
        business_id VARCHAR(64),
        name VARCHAR(255) NOT NULL,
        role VARCHAR(100) NOT NULL,
        phone VARCHAR(32) NOT NULL,
        status VARCHAR(32) DEFAULT 'active',
        current_location VARCHAR(255) DEFAULT 'Headquarters',
        last_update TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        last_report_note TEXT,
        assigned_tasks INT DEFAULT 0
      )
    `;

    await sql`
      CREATE TABLE IF NOT EXISTS sales_leads (
        id VARCHAR(64) PRIMARY KEY,
        business_id VARCHAR(64),
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
      )
    `;

    await sql`
      CREATE TABLE IF NOT EXISTS manager_reports (
        id VARCHAR(64) PRIMARY KEY,
        business_id VARCHAR(64),
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
      )
    `;

    await sql`
      CREATE TABLE IF NOT EXISTS ai_calls (
        id VARCHAR(64) PRIMARY KEY,
        business_id VARCHAR(64),
        recipient_name VARCHAR(255) NOT NULL,
        phone VARCHAR(32) NOT NULL,
        direction VARCHAR(32) DEFAULT 'outbound',
        goal VARCHAR(64) NOT NULL,
        status VARCHAR(32) DEFAULT 'completed',
        duration_seconds INT DEFAULT 0,
        transcript JSONB DEFAULT '[]',
        summary TEXT,
        sentiment VARCHAR(32) DEFAULT 'positive',
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      )
    `;

    await sql`
      CREATE TABLE IF NOT EXISTS whatsapp_messages (
        id VARCHAR(64) PRIMARY KEY,
        business_id VARCHAR(64),
        sender_phone VARCHAR(32) NOT NULL,
        sender_name VARCHAR(255) NOT NULL,
        text TEXT NOT NULL,
        is_bot BOOLEAN DEFAULT FALSE,
        intent VARCHAR(64) DEFAULT 'general',
        metadata JSONB DEFAULT '{}',
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      )
    `;

    await sql`
      CREATE TABLE IF NOT EXISTS bills (
        id VARCHAR(64) PRIMARY KEY,
        business_id VARCHAR(64),
        bill_number VARCHAR(64) NOT NULL,
        party_name VARCHAR(255) NOT NULL,
        type VARCHAR(64) NOT NULL,
        amount NUMERIC(12, 2) DEFAULT 0,
        gst_amount NUMERIC(12, 2) DEFAULT 0,
        total_amount NUMERIC(12, 2) DEFAULT 0,
        due_date VARCHAR(32),
        status VARCHAR(32) DEFAULT 'pending',
        description TEXT,
        site_reference VARCHAR(255),
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      )
    `;

    await sql`
      CREATE TABLE IF NOT EXISTS inventory_items (
        id VARCHAR(64) PRIMARY KEY,
        business_id VARCHAR(64),
        sku VARCHAR(64) NOT NULL,
        name VARCHAR(255) NOT NULL,
        category VARCHAR(100) NOT NULL,
        quantity NUMERIC(10, 2) DEFAULT 0,
        unit VARCHAR(32) DEFAULT 'units',
        unit_price NUMERIC(10, 2) DEFAULT 0,
        total_value NUMERIC(12, 2) DEFAULT 0,
        warehouse_location VARCHAR(255),
        status VARCHAR(32) DEFAULT 'in_stock',
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      )
    `;

    await sql`
      CREATE TABLE IF NOT EXISTS attendance_records (
        id VARCHAR(64) PRIMARY KEY,
        business_id VARCHAR(64),
        employee_id VARCHAR(64),
        employee_name VARCHAR(255) NOT NULL,
        role VARCHAR(100),
        date VARCHAR(32) NOT NULL,
        check_in_time VARCHAR(32),
        check_out_time VARCHAR(32),
        working_hours NUMERIC(5, 2) DEFAULT 8.0,
        overtime_hours NUMERIC(5, 2) DEFAULT 0,
        status VARCHAR(32) DEFAULT 'present',
        location VARCHAR(255),
        daily_wage NUMERIC(10, 2) DEFAULT 0,
        overtime_pay NUMERIC(10, 2) DEFAULT 0,
        total_payable NUMERIC(10, 2) DEFAULT 0,
        salary_status VARCHAR(32) DEFAULT 'pending',
        notes TEXT,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      )
    `;

    // Create Indexes
    await sql`CREATE INDEX IF NOT EXISTS idx_emp_biz ON employees(business_id);`;
    await sql`CREATE INDEX IF NOT EXISTS idx_leads_biz ON sales_leads(business_id);`;
    await sql`CREATE INDEX IF NOT EXISTS idx_att_biz ON attendance_records(business_id);`;
    await sql`CREATE INDEX IF NOT EXISTS idx_msg_biz ON whatsapp_messages(business_id);`;

    return NextResponse.json({
      success: true,
      message: 'Neon PostgreSQL schema verified and synced successfully! All tables and indexes are ready.',
    });
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        error: error.message || 'Failed to connect to Neon PostgreSQL.',
      },
      { status: 500 }
    );
  }
}
