import crypto from 'crypto';
import prisma from '@/lib/prisma';

const PIN_RE = /^(\d{6}|\d{8})$/;

export const pinHash = (pin: string | number, salt: string) =>
  crypto.scryptSync(String(pin), salt, 32).toString('hex');

export const pinMatches = (lock: { salt: string; hash: string }, pin: string | number) => {
  if (!lock?.salt || !lock?.hash || !PIN_RE.test(String(pin ?? ''))) return false;
  const a = Buffer.from(pinHash(pin, lock.salt), 'hex');
  const b = Buffer.from(lock.hash, 'hex');
  return a.length === b.length && crypto.timingSafeEqual(a, b);
};

export async function getCurrentLock() {
  const record = await prisma.localPref.findUnique({
    where: { key: 'internal_lock' },
  });
  if (!record) return null;
  try {
    return JSON.parse(record.value);
  } catch {
    return null;
  }
}

export async function saveLock(lock: any | null) {
  if (!lock) {
    await prisma.localPref.deleteMany({ where: { key: 'internal_lock' } });
  } else {
    await prisma.localPref.upsert({
      where: { key: 'internal_lock' },
      update: { value: JSON.stringify(lock) },
      create: { key: 'internal_lock', value: JSON.stringify(lock) },
    });
  }
}
