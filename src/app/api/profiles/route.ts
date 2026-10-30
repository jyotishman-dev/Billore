import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET() {
  try {
    const profiles = await prisma.profile.findMany({
      where: { NOT: { id: 'default' } },
      orderBy: { name: 'asc' },
    });

    const parsed = profiles.map((p) => {
      let raw = {};
      try {
        if (p.rawData) raw = JSON.parse(p.rawData);
      } catch {}
      return {
        ...raw,
        id: p.id,
        name: p.name,
        gstin: p.gstin || '',
      };
    });

    return NextResponse.json(parsed);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const profile = await req.json();
    if (!profile.id) profile.id = 'prof_' + Date.now();

    await prisma.profile.upsert({
      where: { id: String(profile.id) },
      update: {
        name: profile.businessName || profile.name || 'Business',
        gstin: profile.gstin || null,
        rawData: JSON.stringify(profile),
      },
      create: {
        id: String(profile.id),
        name: profile.businessName || profile.name || 'Business',
        gstin: profile.gstin || null,
        rawData: JSON.stringify(profile),
      },
    });

    return NextResponse.json({ success: true, id: profile.id });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
