import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  try {
    const inv = await prisma.invoice.findUnique({
      where: { id },
    });

    if (!inv || inv.isDeleted) {
      return NextResponse.json({ error: 'Invoice not found' }, { status: 404 });
    }

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

    return NextResponse.json({
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
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const { searchParams } = new URL(req.url);
  const permanent = searchParams.get('permanent') === '1' || searchParams.get('permanent') === 'true';

  try {
    const inv = await prisma.invoice.findUnique({
      where: { id },
    });

    if (!inv) {
      return NextResponse.json({ success: true });
    }

    if (permanent) {
      await prisma.invoice.delete({ where: { id } });
    } else {
      await prisma.invoice.update({
        where: { id },
        data: { isDeleted: true, deletedAt: new Date() },
      });
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
