import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({
    version: '1.10.82',
    name: 'Billore Next',
    engine: 'Next.js + Prisma 6 + TypeScript',
  });
}
