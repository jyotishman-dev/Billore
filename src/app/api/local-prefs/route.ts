import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET() {
  try {
    const prefs = await prisma.localPref.findMany({
      where: {
        NOT: {
          key: { startsWith: 'meta_' },
        },
      },
    });

    const map: Record<string, string> = {};
    for (const p of prefs) {
      map[p.key] = p.value;
    }

    return NextResponse.json({ value: map });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const { set = {}, remove = [] } = body;

    if (set && typeof set === 'object' && !Array.isArray(set)) {
      for (const [k, v] of Object.entries(set)) {
        if (typeof v === 'string') {
          await prisma.localPref.upsert({
            where: { key: k },
            update: { value: v },
            create: { key: k, value: v },
          });
        }
      }
    }

    if (Array.isArray(remove)) {
      for (const k of remove) {
        await prisma.localPref.deleteMany({
          where: { key: String(k) },
        });
      }
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
