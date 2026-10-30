import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET() {
  try {
    const purchases = await prisma.purchaseBill.findMany({
      orderBy: { date: 'desc' },
    });

    const parsed = purchases.map((p) => {
      let raw = {};
      try {
        if (p.rawData) raw = JSON.parse(p.rawData);
      } catch {}

      let items = [];
      try {
        if (p.items) items = JSON.parse(p.items);
      } catch {}

      return {
        ...raw,
        id: p.id,
        billNumber: p.billNumber,
        date: p.date.toISOString(),
        vendorName: p.vendorName,
        vendorGstin: p.vendorGstin,
        total: p.total,
        items,
      };
    });

    return NextResponse.json(parsed);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const purchase = await req.json();
    if (!purchase.id) purchase.id = 'pur_' + Date.now();
    const pDate = purchase.date ? new Date(purchase.date) : new Date();

    await prisma.purchaseBill.upsert({
      where: { id: String(purchase.id) },
      update: {
        billNumber: purchase.billNumber || null,
        date: isNaN(pDate.getTime()) ? new Date() : pDate,
        vendorName: purchase.vendorName || '',
        vendorGstin: purchase.vendorGstin || null,
        total: Number(purchase.total || 0),
        items: JSON.stringify(purchase.items || []),
        rawData: JSON.stringify(purchase),
      },
      create: {
        id: String(purchase.id),
        billNumber: purchase.billNumber || null,
        date: isNaN(pDate.getTime()) ? new Date() : pDate,
        vendorName: purchase.vendorName || '',
        vendorGstin: purchase.vendorGstin || null,
        total: Number(purchase.total || 0),
        items: JSON.stringify(purchase.items || []),
        rawData: JSON.stringify(purchase),
      },
    });

    return NextResponse.json({ success: true, id: purchase.id });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
