import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET() {
  try {
    const clients = await prisma.client.findMany({
      orderBy: { name: 'asc' },
    });

    const parsed = clients.map((c) => {
      let raw = {};
      try {
        if (c.rawData) raw = JSON.parse(c.rawData);
      } catch {}
      return {
        ...raw,
        id: c.id,
        name: c.name,
        gstin: c.gstin || '',
        pan: c.pan || '',
        email: c.email || '',
        phone: c.phone || '',
        billingAddress: c.billingAddress || '',
        shippingAddress: c.shippingAddress || '',
        state: c.state || '',
        stateCode: c.stateCode || '',
        creditLimit: c.creditLimit ?? undefined,
        openingBalance: c.openingBalance ?? undefined,
        notes: c.notes || '',
      };
    });

    return NextResponse.json(parsed);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const client = await req.json();
    if (!client.id) client.id = 'cli_' + Date.now();

    await prisma.client.upsert({
      where: { id: String(client.id) },
      update: {
        name: client.name || '',
        gstin: client.gstin || null,
        pan: client.pan || null,
        email: client.email || null,
        phone: client.phone || null,
        billingAddress: client.billingAddress || client.address || null,
        shippingAddress: client.shippingAddress || null,
        state: client.state || null,
        stateCode: client.stateCode ? String(client.stateCode) : null,
        creditLimit: client.creditLimit !== undefined ? Number(client.creditLimit) : null,
        openingBalance: client.openingBalance !== undefined ? Number(client.openingBalance) : null,
        notes: client.notes || null,
        rawData: JSON.stringify(client),
      },
      create: {
        id: String(client.id),
        name: client.name || '',
        gstin: client.gstin || null,
        pan: client.pan || null,
        email: client.email || null,
        phone: client.phone || null,
        billingAddress: client.billingAddress || client.address || null,
        shippingAddress: client.shippingAddress || null,
        state: client.state || null,
        stateCode: client.stateCode ? String(client.stateCode) : null,
        creditLimit: client.creditLimit !== undefined ? Number(client.creditLimit) : null,
        openingBalance: client.openingBalance !== undefined ? Number(client.openingBalance) : null,
        notes: client.notes || null,
        rawData: JSON.stringify(client),
      },
    });

    return NextResponse.json({ success: true, id: client.id });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
