import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET() {
  try {
    const items = await prisma.recurringInvoice.findMany({
      orderBy: { clientName: 'asc' },
    });

    const parsed = items.map((item) => {
      let tpl = {};
      try {
        if (item.templateData) tpl = JSON.parse(item.templateData);
      } catch {}
      return {
        ...tpl,
        id: item.id,
        clientName: item.clientName,
        frequency: item.frequency,
        startDate: item.startDate.toISOString(),
        nextDate: item.nextDate ? item.nextDate.toISOString() : undefined,
        status: item.status,
        lastGenerated: item.lastGenerated ? item.lastGenerated.toISOString() : undefined,
      };
    });

    return NextResponse.json(parsed);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const item = await req.json();
    if (!item.id) item.id = 'rec_' + Date.now();
    const startDate = item.startDate ? new Date(item.startDate) : new Date();
    const nextDate = item.nextDate ? new Date(item.nextDate) : null;

    await prisma.recurringInvoice.upsert({
      where: { id: String(item.id) },
      update: {
        clientName: item.clientName || '',
        frequency: item.frequency || 'monthly',
        startDate: isNaN(startDate.getTime()) ? new Date() : startDate,
        nextDate: nextDate && !isNaN(nextDate.getTime()) ? nextDate : null,
        status: item.status || 'active',
        templateData: JSON.stringify(item),
      },
      create: {
        id: String(item.id),
        clientName: item.clientName || '',
        frequency: item.frequency || 'monthly',
        startDate: isNaN(startDate.getTime()) ? new Date() : startDate,
        nextDate: nextDate && !isNaN(nextDate.getTime()) ? nextDate : null,
        status: item.status || 'active',
        templateData: JSON.stringify(item),
      },
    });

    return NextResponse.json({ success: true, id: item.id });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
