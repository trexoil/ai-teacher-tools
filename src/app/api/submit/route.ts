import { NextRequest, NextResponse } from 'next/server';
import { createSubmission } from '@/lib/db';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email, toolName, toolUrl, description, pricing } = body;

    if (!name || !email || !toolName || !toolUrl) {
      return NextResponse.json(
        { error: 'Name, email, tool name, and tool URL are required' },
        { status: 400 }
      );
    }

    await createSubmission(name, email, toolName, toolUrl, description, pricing);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Submit API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
