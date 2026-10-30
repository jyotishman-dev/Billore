import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET() {
  try {
    const receipts = await prisma.receiptVoucher.findMany({
      orderBy: { date: 'desc' },
    });

    const parsed = receipts.map((r) => {
      let raw = {};
      try {
        if (r.rawData) raw = JSON.parse(r.rawData);
      } catch {}
      return {
        ...raw,
        id: r.id,
        voucherNumber: r.voucherNumber,
        date: r.date.toISOString(),
        clientName: r.clientName,
        amount: r.amount,
        paymentMode: r.paymentMode,
        referenceNo: r.referenceNo,
        notes: r.notes,
      };
    });

    return NextResponse.json(parsed);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const receipt = await req.json();
    if (!receipt.id) receipt.id = 'recp_' + Date.now();
    const rDate = receipt.date ? new Date(receipt.date) : new Date();

    await prisma.receiptVoucher.upsert({
      where: { id: String(receipt.id) },
      update: {
        voucherNumber: receipt.voucherNumber || null,
        date: isNaN(rDate.getTime()) ? new Date() : rDate,
        clientName: receipt.clientName || '',
        amount: Number(receipt.amount || 0),
        paymentMode: receipt.paymentMode || null,
        referenceNo: receipt.referenceNo || null,
        notes: receipt.notes || null,
        rawData: JSON.stringify(receipt),
      },
      create: {
        id: String(receipt.id),
        voucherNumber: receipt.voucherNumber || null,
        date: isNaN(rDate.getTime()) ? new Date() : rDate,
        clientName: receipt.clientName || '',
        amount: Number(receipt.amount || 0),
        paymentMode: receipt.paymentMode || null,
        referenceNo: receipt.referenceNo || null,
        notes: receipt.notes || null,
        rawData: JSON.stringify(receipt),
      },
    });

    return NextResponse.json({ success: true, id: receipt.id });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
