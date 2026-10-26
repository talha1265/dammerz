import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { processWhatsAppAgentMessage } from '@/lib/gemini';

export async function POST(req: Request) {
  try {
    const { staffId, text, location } = await req.json();

    if (!staffId || !text) {
      return NextResponse.json({ error: 'Staff ID and report text are required' }, { status: 400 });
    }

    const employees = await db.getEmployees();
    const staff = employees.find((e) => e.staffId.toLowerCase() === staffId.toLowerCase() || e.id === staffId);

    const business = await db.getBusiness();
    const staffName = staff ? staff.name : 'Site Staff';
    const staffPhone = staff ? staff.phone : '+91 98111 22334';
    const siteName = staff ? staff.siteName : 'Assigned Project Site';

    // 1. Check if staff is asking a query (e.g. inventory value, attendance, or bill lookup)
    const intel = await db.queryBusinessIntelligence(text);
    if (intel.handled) {
      return NextResponse.json({
        success: true,
        reply: intel.reply,
        intent: intel.type,
        actionTaken: { type: `QUERY_${intel.type.toUpperCase()}`, details: intel.data },
        timestamp: new Date().toLocaleTimeString(),
      });
    }

    // 2. Process with Bilingual Gemini AI
    const aiResult = await processWhatsAppAgentMessage(
      text,
      `${staffName} (${staff?.role || 'Staff'})`,
      staffPhone,
      business.name,
      business.subscriptionTier
    );

    // 3. Update Employee record & Attendance Log
    if (staff) {
      await db.updateEmployeeStatus(
        staff.id,
        'on_site',
        location || siteName,
        text
      );

      await db.addAttendanceRecord({
        employeeId: staff.id,
        employeeName: staff.name,
        role: staff.role,
        date: new Date().toISOString().split('T')[0],
        checkInTime: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        status: 'on_site',
        location: location || siteName,
        source: 'staff_portal',
        notes: text,
      });

      await db.addTeamChatMessage({
        senderName: staff.name,
        senderRole: staff.roleCategory === 'tender_manager' || staff.roleCategory === 'project_manager' ? 'manager' : 'staff',
        text,
        category: 'attendance',
        extractedData: {
          type: 'attendance_log',
          summary: `Reported from ${siteName} via Staff Portal`,
        },
      });
    }

    // If it's a manager submitting tender or milestone report, log report
    if (staff?.roleCategory === 'tender_manager' || staff?.roleCategory === 'project_manager' || text.toLowerCase().includes('tender') || text.toLowerCase().includes('bid')) {
      await db.addReport({
        reporterName: staffName,
        reporterRole: staff?.roleCategory === 'tender_manager' ? 'tender_manager' : 'project_manager',
        title: `${siteName} - Daily Operations Log`,
        summary: text,
        risksAlerts: ['Review inspection timeline before scheduled audit'],
        aiActionItems: ['Update material dispatch status in warehouse inventory'],
        submissionChannel: 'portal',
      });
    }

    return NextResponse.json({
      success: true,
      reply: aiResult.reply,
      intent: aiResult.intent,
      languageDetected: aiResult.languageDetected,
      actionTaken: aiResult.actionTaken,
      updatedStatus: 'on_site',
      timestamp: new Date().toLocaleTimeString(),
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
