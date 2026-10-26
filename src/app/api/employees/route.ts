import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET() {
  try {
    const employees = await db.getEmployees();
    return NextResponse.json({ success: true, employees });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { action, id, status, location, note, employee, actorRole, hoursData } = body;

    if (action === 'update_status') {
      const updated = await db.updateEmployeeStatus(id, status, location, note);
      return NextResponse.json({ success: true, employee: updated });
    }

    if (action === 'log_hours') {
      const res = await db.logWorkingHours(hoursData);
      return NextResponse.json({ success: true, ...res });
    }

    if (action === 'create') {
      // Permission check: only business owners and managers can add staff
      const allowedRoles = ['business_owner', 'project_manager', 'site_manager', 'admin'];
      if (actorRole && !allowedRoles.includes(actorRole)) {
        return NextResponse.json({ 
          error: 'Permission Denied: Site Staff and Workers can only be provisioned and added by Business Owners and Managers.' 
        }, { status: 403 });
      }

      const created = await db.addEmployee(employee);
      return NextResponse.json({ success: true, employee: created });
    }

    return NextResponse.json({ error: 'Unknown action' }, { status: 400 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
