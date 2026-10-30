import { NextRequest, NextResponse } from 'next/server';
import { getCurrentLock, pinMatches } from '@/src/lib/lock';

let pinTries = { wrong: 0, until: 0 };

export async function POST(req: NextRequest) {
  const lock = await getCurrentLock();
  if (!lock) return NextResponse.json({ ok: true });

  const wait = Math.ceil((pinTries.until - Date.now()) / 1000);
  if (wait > 0) {
    return NextResponse.json({ ok: false, wait }, { status: 429 });
  }

  const body = await req.json().catch(() => ({}));
  if (pinMatches(lock, body?.pin)) {
    pinTries.wrong = 0;
    return NextResponse.json({ ok: true });
  }

  pinTries.wrong += 1;
  if (pinTries.wrong >= 5) {
    pinTries.wrong = 0;
    pinTries.until = Date.now() + 30000;
  }

  return NextResponse.json({ ok: false, error: 'wrong-pin' }, { status: 401 });
}
