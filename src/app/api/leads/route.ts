import { NextRequest, NextResponse } from 'next/server';
import { createLead } from '@/lib/db';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, type, name, message } = body;

    if (!email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 });
    }

    await createLead(email, type || 'general', name, message);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Lead API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
