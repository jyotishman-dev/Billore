import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET() {
  try {
    let templates = await prisma.termsTemplate.findMany({
      orderBy: { name: 'asc' },
    });

    if (templates.length === 0) {
      const defaultTpl = {
        id: 'default',
        name: 'Standard Terms',
        content: '1. Payment is due within 15 days of invoice date unless otherwise agreed in writing.\n2. Interest @ 18% p.a. will be charged on overdue payments beyond the due date.\n3. The scope of work is limited to what is explicitly mentioned in the project proposal/agreement. Any additional requirements will be quoted and billed separately.\n4. All intellectual property and source code will be transferred to the client only upon receipt of full payment.\n5. We shall not be liable for any delays caused by incomplete or late submission of content, credentials, or approvals from the client\'s end.\n6. Any change requests after project approval may attract additional charges and revised timelines.\n7. This invoice is subject to the jurisdiction of courts at the service provider\'s registered location.\n8. E. & O.E.',
      };
      await prisma.termsTemplate.create({ data: defaultTpl });
      templates = [defaultTpl as any];
    }

    return NextResponse.json(templates);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const tpl = await req.json();
    if (!tpl.id) tpl.id = 'tpl_' + Date.now();

    await prisma.termsTemplate.upsert({
      where: { id: String(tpl.id) },
      update: {
        name: tpl.name || 'Standard Terms',
        content: tpl.content || '',
      },
      create: {
        id: String(tpl.id),
        name: tpl.name || 'Standard Terms',
        content: tpl.content || '',
      },
    });

    return NextResponse.json({ success: true, id: tpl.id });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
