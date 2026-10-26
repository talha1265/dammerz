import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { checkRateLimit, getClientIp, createRateLimitResponse } from '@/lib/rateLimit';
import { generateSecureToken } from '@/lib/auth';

export async function POST(req: Request) {
  try {
    const ip = getClientIp(req);
    // Rate limit: 10 login attempts per minute per IP to prevent credential brute-forcing
    const rateCheck = checkRateLimit(`login_${ip}`, { limit: 10, windowMs: 60000 });
    if (!rateCheck.success) {
      return createRateLimitResponse(rateCheck.reset);
    }

    const { staffId, password } = await req.json();

    if (!staffId || !password) {
      return NextResponse.json(
        { error: 'Staff ID and Password are required' },
        { status: 400 }
      );
    }

    const employee = await db.authenticateStaff(staffId, password);

    if (!employee) {
      return NextResponse.json(
        { error: 'Invalid Staff ID or Password. Please check credentials issued by business owner.' },
        { status: 401 }
      );
    }

    return NextResponse.json({
      success: true,
      staff: {
        id: employee.id,
        name: employee.name,
        role: employee.role,
        roleCategory: employee.roleCategory,
        siteName: employee.siteName,
        phone: employee.phone,
        staffId: employee.staffId,
        status: employee.status,
        currentLocation: employee.currentLocation,
        businessId: employee.businessId,
        token: `staff_session_${generateSecureToken(16)}`,
      },
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
