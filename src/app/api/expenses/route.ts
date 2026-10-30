import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET() {
  try {
    const expenses = await prisma.expense.findMany({
      orderBy: { date: 'desc' },
    });

    const parsed = expenses.map((e) => {
      let raw = {};
      try {
        if (e.rawData) raw = JSON.parse(e.rawData);
      } catch {}
      return {
        ...raw,
        id: e.id,
        date: e.date.toISOString(),
        category: e.category,
        description: e.description || '',
        amount: e.amount,
        paymentMode: e.paymentMode || '',
        vendor: e.vendor || '',
        gstin: e.gstin || '',
        itcEligible: e.itcEligible,
      };
    });

    return NextResponse.json(parsed);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const expense = await req.json();
    if (!expense.id) expense.id = 'exp_' + Date.now();
    const expDate = expense.date ? new Date(expense.date) : new Date();

    await prisma.expense.upsert({
      where: { id: String(expense.id) },
      update: {
        date: isNaN(expDate.getTime()) ? new Date() : expDate,
        category: expense.category || 'General',
        description: expense.description || '',
        amount: Number(expense.amount || 0),
        paymentMode: expense.paymentMode || null,
        vendor: expense.vendor || null,
        gstin: expense.gstin || null,
        itcEligible: Boolean(expense.itcEligible),
        rawData: JSON.stringify(expense),
      },
      create: {
        id: String(expense.id),
        date: isNaN(expDate.getTime()) ? new Date() : expDate,
        category: expense.category || 'General',
        description: expense.description || '',
        amount: Number(expense.amount || 0),
        paymentMode: expense.paymentMode || null,
        vendor: expense.vendor || null,
        gstin: expense.gstin || null,
        itcEligible: Boolean(expense.itcEligible),
        rawData: JSON.stringify(expense),
      },
    });

    return NextResponse.json({ success: true, id: expense.id });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
