import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const format = searchParams.get('format');
    const bills = await db.getBills();

    // Export as CSV / Excel format
    if (format === 'csv') {
      const headers = 'Bill Number,Party Name,Type,Amount (INR),GST (INR),Total (INR),Due Date,Status,Site Reference\n';
      const rows = bills
        .map(
          (b) =>
            `"${b.billNumber}","${b.partyName}","${b.type}",${b.amount},${b.gstAmount},${b.totalAmount},"${b.dueDate}","${b.status}","${b.siteReference || 'HQ'}"`
        )
        .join('\n');

      return new Response(headers + rows, {
        headers: {
          'Content-Type': 'text/csv',
          'Content-Disposition': 'attachment; filename="bizzup_bills_ledger.csv"',
        },
      });
    }

    return NextResponse.json({ success: true, bills });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { billNumber, partyName, type, amount, gstAmount, dueDate, status, description, siteReference } = body;

    if (!billNumber || !partyName || !amount) {
      return NextResponse.json({ error: 'Bill Number, Party Name, and Amount are required' }, { status: 400 });
    }

    const numericAmount = Number(amount);
    const numericGst = Number(gstAmount || Math.round(numericAmount * 0.18));
    const totalAmount = numericAmount + numericGst;

    const newBill = await db.addBill({
      billNumber,
      partyName,
      type: type || 'vendor_purchase',
      amount: numericAmount,
      gstAmount: numericGst,
      totalAmount,
      dueDate: dueDate || new Date(Date.now() + 15 * 86400000).toISOString().split('T')[0],
      status: status || 'pending',
      description: description || 'Commercial transaction logged via BizzUp engine',
      siteReference: siteReference || 'Project Site',
    });

    return NextResponse.json({ success: true, bill: newBill });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
