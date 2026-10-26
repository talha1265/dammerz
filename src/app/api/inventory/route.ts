import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const format = searchParams.get('format');
    const [inventory, summary] = await Promise.all([
      db.getInventory(),
      db.getInventorySummary(),
    ]);

    if (format === 'csv') {
      const headers = 'SKU,Name,Category,Quantity,Unit,Unit Price (INR),Total Valuation (INR),Warehouse Location,Status,Last Updated\n';
      const rows = inventory
        .map(
          (i) =>
            `"${i.sku}","${i.name}","${i.category}",${i.quantity},"${i.unit}",${i.unitPrice},${i.totalValue},"${i.warehouseLocation}","${i.status}","${i.lastUpdated}"`
        )
        .join('\n');

      return new Response(headers + rows, {
        headers: {
          'Content-Type': 'text/csv',
          'Content-Disposition': 'attachment; filename="bizzup_inventory_valuation.csv"',
        },
      });
    }

    return NextResponse.json({ success: true, inventory, summary });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, sku, category, quantity, unit, unitPrice, warehouseLocation } = body;

    if (!name || !quantity || !unitPrice) {
      return NextResponse.json({ error: 'Name, quantity, and unit price are required' }, { status: 400 });
    }

    const newItem = await db.addInventoryItem({
      name,
      sku: sku || `SKU-${Date.now().toString().slice(-4)}`,
      category: category || 'General Supplies',
      quantity: Number(quantity),
      unit: unit || 'units',
      unitPrice: Number(unitPrice),
      totalValue: Number(quantity) * Number(unitPrice),
      warehouseLocation: warehouseLocation || 'Central Depot',
      status: Number(quantity) < 20 ? 'low_stock' : 'in_stock',
    });

    return NextResponse.json({ success: true, item: newItem });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
