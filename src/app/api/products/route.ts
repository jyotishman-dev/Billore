import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET() {
  try {
    const products = await prisma.product.findMany({
      orderBy: { name: 'asc' },
    });

    const parsed = products.map((p) => {
      let raw = {};
      try {
        if (p.rawData) raw = JSON.parse(p.rawData);
      } catch {}
      return {
        ...raw,
        id: p.id,
        name: p.name,
        hsn: p.hsn || '',
        unit: p.unit || 'PCS',
        price: p.price,
        rate: p.price,
        purchasePrice: p.purchasePrice ?? undefined,
        taxRate: p.taxRate,
        gst: p.taxRate,
        stock: p.stock ?? undefined,
        lowStockAlert: p.lowStockAlert ?? undefined,
        cess: p.cess ?? undefined,
        cessType: p.cessType || undefined,
        category: p.category || '',
      };
    });

    return NextResponse.json(parsed);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const product = await req.json();
    if (!product.id) product.id = 'prod_' + Date.now();

    await prisma.product.upsert({
      where: { id: String(product.id) },
      update: {
        name: product.name || '',
        hsn: product.hsn || null,
        unit: product.unit || null,
        price: Number(product.price || product.rate || 0),
        purchasePrice: product.purchasePrice !== undefined ? Number(product.purchasePrice) : null,
        taxRate: Number(product.taxRate || product.gst || 0),
        stock: product.stock !== undefined ? Number(product.stock) : null,
        lowStockAlert: product.lowStockAlert !== undefined ? Number(product.lowStockAlert) : null,
        cess: product.cess !== undefined ? Number(product.cess) : null,
        cessType: product.cessType || null,
        category: product.category || null,
        rawData: JSON.stringify(product),
      },
      create: {
        id: String(product.id),
        name: product.name || '',
        hsn: product.hsn || null,
        unit: product.unit || null,
        price: Number(product.price || product.rate || 0),
        purchasePrice: product.purchasePrice !== undefined ? Number(product.purchasePrice) : null,
        taxRate: Number(product.taxRate || product.gst || 0),
        stock: product.stock !== undefined ? Number(product.stock) : null,
        lowStockAlert: product.lowStockAlert !== undefined ? Number(product.lowStockAlert) : null,
        cess: product.cess !== undefined ? Number(product.cess) : null,
        cessType: product.cessType || null,
        category: product.category || null,
        rawData: JSON.stringify(product),
      },
    });

    return NextResponse.json({ success: true, id: product.id });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
