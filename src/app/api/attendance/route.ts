import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const format = searchParams.get('format');
    const [attendance, employees] = await Promise.all([
      db.getAttendance(),
      db.getEmployees(),
    ]);

    if (format === 'csv') {
      const headers = 'Staff ID,Employee Name,Role,Tender or Project,Reporting Manager,Date,Check-In,Check-Out,Hours Worked,Overtime Hours,Daily Wage (INR),Overtime Pay (INR),Total Payable (INR),Attendance Status,Salary Status,Location,Notes\n';
      const rows = attendance
        .map((a) => {
          const emp = employees.find(e => e.id === a.employeeId || e.name.toLowerCase() === a.employeeName.toLowerCase());
          const staffId = emp?.staffId || 'EMP-100';
          const projectTender = a.projectTender || emp?.projectTender || 'Metro Rail Phase 4 - Tender #MR-402';
          const repManager = a.reportingManagerName || emp?.reportingManagerName || 'Rajesh Khanna (PM)';
          const hrs = a.workingHours || emp?.workingHoursToday || 8.0;
          const ot = a.overtimeHours || emp?.overtimeHoursToday || 0;
          const baseWage = a.dailyWage || emp?.dailyWageRate || 950;
          const otPay = a.overtimePay || Math.round(ot * (emp?.overtimeRate || 140));
          const totalPay = a.totalPayable || (baseWage + otPay);
          const salStatus = a.salaryStatus || emp?.salaryStatus || 'pending';

          return `"${staffId}","${a.employeeName}","${a.role}","${projectTender}","${repManager}","${a.date}","${a.checkInTime}","${a.checkOutTime || '05:30 PM'}",${hrs},${ot},${baseWage},${otPay},${totalPay},"${a.status}","${salStatus}","${a.location}","${(a.notes || '').replace(/"/g, '""')}"`;
        })
        .join('\n');

      return new Response(headers + rows, {
        headers: {
          'Content-Type': 'text/csv; charset=utf-8',
          'Content-Disposition': 'attachment; filename="bizzup_attendance_salary_ledger.csv"',
        },
      });
    }

    return NextResponse.json({ success: true, attendance, employees });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { 
      action,
      attendanceId,
      salaryStatus,
      employeeId, 
      employeeName, 
      role, 
      location, 
      status, 
      notes,
      workingHours,
      overtimeHours,
      dailyWage,
      projectTender,
      reportingManagerName
    } = body;

    if (action === 'update_salary_status' && attendanceId) {
      const updated = await db.updateAttendanceSalaryStatus(attendanceId, salaryStatus || 'paid');
      return NextResponse.json({ success: true, record: updated });
    }

    if (!employeeName) {
      return NextResponse.json({ error: 'Employee name is required' }, { status: 400 });
    }

    const hrs = Number(workingHours) || 8.0;
    const ot = Number(overtimeHours) || 0;
    const baseWage = Number(dailyWage) || 950;
    const otPay = Math.round(ot * 140);
    const totalPay = baseWage + otPay;

    const newRecord = await db.addAttendanceRecord({
      employeeId,
      employeeName,
      role: role || 'Site Staff',
      date: new Date().toISOString().split('T')[0],
      checkInTime: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      checkOutTime: '05:30 PM',
      workingHours: hrs,
      overtimeHours: ot,
      status: status || 'on_site',
      location: location || 'Project Site',
      projectTender: projectTender || 'Metro Rail Phase 4 - Tender #MR-402',
      reportingManagerName: reportingManagerName || 'Senior Project Manager',
      dailyWage: baseWage,
      overtimePay: otPay,
      totalPayable: totalPay,
      salaryStatus: 'pending',
      source: 'manual',
      notes: notes || 'Logged via Dashboard',
    });

    return NextResponse.json({ success: true, record: newRecord });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

