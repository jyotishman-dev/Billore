import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

const DEFAULT_PROFILE = {
  businessName: '',
  address: '',
  state: '',
  gstin: '',
  pan: '',
  email: '',
  phone: '',
  bankName: '',
  accountNumber: '',
  ifsc: '',
  logo: '',
  signature: '',
  upiId: '',
  googleClientId: '',
  googleDriveFolder: 'GST Billing Invoices',
};

export async function GET() {
  try {
    const profile = await prisma.profile.findUnique({
      where: { id: 'default' },
    });

    if (!profile) {
      return NextResponse.json(DEFAULT_PROFILE);
    }

    let parsed = DEFAULT_PROFILE;
    try {
      if (profile.rawData) parsed = { ...DEFAULT_PROFILE, ...JSON.parse(profile.rawData) };
    } catch {}

    return NextResponse.json(parsed);
  } catch (error: any) {
    return NextResponse.json(DEFAULT_PROFILE);
  }
}

export async function POST(req: NextRequest) {
  try {
    const data = await req.json();

    await prisma.profile.upsert({
      where: { id: 'default' },
      update: {
        name: data.businessName || data.name || 'My Business',
        gstin: data.gstin || null,
        rawData: JSON.stringify(data),
      },
      create: {
        id: 'default',
        name: data.businessName || data.name || 'My Business',
        gstin: data.gstin || null,
        rawData: JSON.stringify(data),
      },
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
