import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

const MAX_START_NUMBER = 1000000;

function nextCounterValue(current: any, start: any = 1) {
  const last = Math.max(0, Math.floor(Number(current) || 0));
  const from = Math.min(MAX_START_NUMBER, Math.max(1, Math.floor(Number(start) || 1)));
  return Math.max(last + 1, from);
}

export async function GET(req: NextRequest, { params }: { params: Promise<{ slug: string[] }> }) {
  const { slug } = await params;
  const key = slug.join('/');

  if (key === 'appLock') {
    return NextResponse.json({ error: 'forbidden' }, { status: 403 });
  }

  try {
    const record = await prisma.localPref.findUnique({
      where: { key: `meta_${key}` },
    });

    if (!record) {
      return NextResponse.json({ value: null });
    }

    try {
      return NextResponse.json({ value: JSON.parse(record.value) });
    } catch {
      return NextResponse.json({ value: record.value });
    }
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest, { params }: { params: Promise<{ slug: string[] }> }) {
  const { slug } = await params;

  if (slug.length >= 2 && slug[slug.length - 1] === 'increment') {
    const key = slug.slice(0, -1).join('/');
    if (key === 'appLock') {
      return NextResponse.json({ error: 'forbidden' }, { status: 403 });
    }

    try {
      const body = await req.json().catch(() => ({}));
      const record = await prisma.localPref.findUnique({
        where: { key: `meta_${key}` },
      });

      let currentVal = 0;
      if (record) {
        try {
          currentVal = Number(JSON.parse(record.value)) || 0;
        } catch {
          currentVal = Number(record.value) || 0;
        }
      }

      const nextVal = nextCounterValue(currentVal, body?.start);

      await prisma.localPref.upsert({
        where: { key: `meta_${key}` },
        update: { value: JSON.stringify(nextVal) },
        create: { key: `meta_${key}`, value: JSON.stringify(nextVal) },
      });

      return NextResponse.json({ value: nextVal });
    } catch (error: any) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
  }

  const key = slug.join('/');
  if (key === 'appLock') {
    return NextResponse.json({ error: 'forbidden' }, { status: 403 });
  }

  try {
    const body = await req.json();
    if (!body || !('value' in body)) {
      return NextResponse.json({ error: 'bad-request' }, { status: 400 });
    }

    await prisma.localPref.upsert({
      where: { key: `meta_${key}` },
      update: { value: JSON.stringify(body.value) },
      create: { key: `meta_${key}`, value: JSON.stringify(body.value) },
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
