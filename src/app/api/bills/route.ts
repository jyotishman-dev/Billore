import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET() {
  try {
    const invoices = await prisma.invoice.findMany({
      where: { isDeleted: false },
      orderBy: { invoiceDate: 'desc' },
    });

    const parsed = invoices.map((inv) => {
      let meta = {};
      try {
        if (inv.metadata) meta = JSON.parse(inv.metadata);
      } catch {}

      let items = [];
      try {
        if (inv.items) items = JSON.parse(inv.items);
      } catch {}

      let payments = [];
      try {
        if (inv.payments) payments = JSON.parse(inv.payments);
      } catch {}

      return {
        ...meta,
        id: inv.id,
        invoiceNumber: inv.invoiceNumber,
        type: inv.type,
        invoiceDate: inv.invoiceDate.toISOString(),
        dueDate: inv.dueDate ? inv.dueDate.toISOString() : undefined,
        clientId: inv.clientId,
        clientName: inv.clientName,
        clientGstin: inv.clientGstin,
        placeOfSupply: inv.placeOfSupply,
        subtotal: inv.subtotal,
        taxTotal: inv.taxTotal,
        total: inv.total,
        balanceDue: inv.balanceDue,
        status: inv.status,
        items,
        payments,
      };
    });

    return NextResponse.json(parsed);
  } catch (error: any) {
    console.error('Error fetching bills:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const bill = await req.json();
    if (!bill || !bill.id) {
      return NextResponse.json({ error: 'Bill must have an id' }, { status: 400 });
    }

    const { searchParams } = new URL(req.url);
    const overwrite = searchParams.get('overwrite') === '1' || searchParams.get('overwrite') === 'true';

    const existing = await prisma.invoice.findUnique({
      where: { id: String(bill.id) },
    });

    if (existing && !overwrite && !existing.isDeleted) {
      return NextResponse.json(
        {
          error: 'A bill with this invoice number already exists',
          invoiceNumber: bill.id,
        },
        { status: 409 }
      );
    }

    const invDate = bill.invoiceDate ? new Date(bill.invoiceDate) : new Date();
    const dueDate = bill.dueDate ? new Date(bill.dueDate) : null;

    const dataToSave = {
      invoiceNumber: String(bill.invoiceNumber || bill.id),
      type: bill.type || 'tax-invoice',
      invoiceDate: isNaN(invDate.getTime()) ? new Date() : invDate,
      dueDate: dueDate && !isNaN(dueDate.getTime()) ? dueDate : null,
      clientId: bill.clientId || null,
      clientName: bill.clientName || null,
      clientGstin: bill.clientGstin || null,
      placeOfSupply: bill.placeOfSupply || null,
      subtotal: Number(bill.subtotal || 0),
      taxTotal: Number(bill.taxTotal || 0),
      total: Number(bill.total || 0),
      balanceDue: Number(bill.balanceDue ?? bill.total ?? 0),
      status: bill.status || 'unpaid',
      payments: JSON.stringify(bill.payments || []),
      items: JSON.stringify(bill.items || []),
      metadata: JSON.stringify(bill),
      isDeleted: false,
      deletedAt: null,
    };

    await prisma.invoice.upsert({
      where: { id: String(bill.id) },
      update: dataToSave,
      create: {
        id: String(bill.id),
        ...dataToSave,
      },
    });

    return NextResponse.json({ success: true, id: bill.id });
  } catch (error: any) {
    console.error('Error saving bill:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
