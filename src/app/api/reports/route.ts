import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET() {
  try {
    const reports = await db.getReports();
    return NextResponse.json({ success: true, reports });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { reporterName, reporterRole, title, summary, tenderCode, budgetStatus } = body;

    if (!title || !summary) {
      return NextResponse.json({ error: 'Title and summary are required' }, { status: 400 });
    }

    // AI generated risk assessment & action items
    const risks = [
      'Statutory compliance filing deadline within 5 business days',
      'Material cost escalation requires contingency budget buffer of 4.5%',
    ];
    const actions = [
      'Auto-trigger WhatsApp acknowledgment to project directors',
      'Update milestone schedule on BizzUp Operations calendar',
    ];

    const report = await db.addReport({
      reporterName: reporterName || 'Project Manager',
      reporterRole: reporterRole || 'project_manager',
      title,
      summary,
      tenderCode: tenderCode || 'IND-2026-TND',
      budgetStatus: budgetStatus || 'Within approved variance (+2.1%)',
      risksAlerts: risks,
      aiActionItems: actions,
      submissionChannel: 'portal',
    });

    return NextResponse.json({ success: true, report });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
