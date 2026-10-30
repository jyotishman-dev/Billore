import { NextResponse } from 'next/server';
import { getCurrentLock } from '@/src/lib/lock';

export async function GET() {
  const lock = await getCurrentLock();
  return NextResponse.json({
    enabled: !!lock,
    length: lock?.length || 0,
  });
}
