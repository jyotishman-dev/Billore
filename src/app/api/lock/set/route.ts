import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import { getCurrentLock, pinHash, pinMatches, saveLock } from '@/src/lib/lock';

const PIN_RE = /^(\d{6}|\d{8})$/;

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => ({}));
  const { pin, currentPin } = body;

  if (pin !== null && !PIN_RE.test(String(pin ?? ''))) {
    return NextResponse.json({ error: 'bad-request' }, { status: 400 });
  }

  const lock = await getCurrentLock();
  if (lock && !pinMatches(lock, currentPin)) {
    return NextResponse.json({ ok: false, error: 'wrong-pin' }, { status: 401 });
  }

  if (pin === null) {
    await saveLock(null);
  } else {
    const salt = crypto.randomBytes(16).toString('hex');
    await saveLock({
      salt,
      hash: pinHash(pin, salt),
      length: String(pin).length,
    });
  }

  return NextResponse.json({ ok: true, enabled: pin !== null });
}
