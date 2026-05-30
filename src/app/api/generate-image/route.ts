import { NextRequest, NextResponse } from 'next/server';

// Image generation can take a while — allow up to 60s (Vercel respects this;
// Hobby caps at 60s, Pro/Enterprise allow more).
export const maxDuration = 60;
export const dynamic = 'force-dynamic';

const OPENROUTER_URL = 'https://openrouter.ai/api/v1/chat/completions';
const DEFAULT_MODEL =
  process.env.OPENROUTER_IMAGE_MODEL || 'google/gemini-2.5-flash-image-preview';
const MAX_PROMPT_LENGTH = 2000;

// Minimal shape of the OpenRouter chat-completions response for image output.
interface ORImage {
  type?: string;
  image_url?: { url?: string };
  url?: string;
}
interface ORResponse {
  choices?: { message?: { content?: string; images?: ORImage[] } }[];
  error?: { message?: string };
}

export async function GET() {
  return NextResponse.json({
    usage: 'POST { "prompt": string, "model"?: string, "format"?: "json" | "binary" }',
    defaultModel: DEFAULT_MODEL,
    notes: [
      'Requires OPENROUTER_API_KEY to be set in the environment (Vercel project settings).',
      'Set IMAGE_API_SECRET to require an x-api-secret header (recommended — this endpoint spends credits).',
      'Pick an image-capable model from https://openrouter.ai/models?output_modalities=image',
    ],
  });
}

export async function POST(request: NextRequest) {
  try {
    const apiKey = process.env.OPENROUTER_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: 'OPENROUTER_API_KEY is not configured on the server.' },
        { status: 500 },
      );
    }

    const body = await request.json().catch(() => ({}));
    const prompt: string | undefined = body?.prompt;
    const model: string = body?.model || DEFAULT_MODEL;
    const format: string = body?.format || 'json';

    // Optional shared-secret guard. If IMAGE_API_SECRET is set, callers must
    // provide it (header `x-api-secret` or body `secret`) — prevents anonymous
    // use of a credit-spending endpoint.
    const requiredSecret = process.env.IMAGE_API_SECRET;
    if (requiredSecret) {
      const provided = request.headers.get('x-api-secret') || body?.secret;
      if (provided !== requiredSecret) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
      }
    }

    if (!prompt || typeof prompt !== 'string' || !prompt.trim()) {
      return NextResponse.json({ error: 'A non-empty "prompt" is required.' }, { status: 400 });
    }
    if (prompt.length > MAX_PROMPT_LENGTH) {
      return NextResponse.json(
        { error: `Prompt too long (max ${MAX_PROMPT_LENGTH} chars).` },
        { status: 400 },
      );
    }

    const orRes = await fetch(OPENROUTER_URL, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': process.env.OPENROUTER_SITE_URL || 'https://ai-teacher-tools.vercel.app',
        'X-Title': 'AI Teacher Tools',
      },
      body: JSON.stringify({
        model,
        modalities: ['image', 'text'],
        messages: [{ role: 'user', content: prompt }],
      }),
    });

    if (!orRes.ok) {
      const detail = await orRes.text();
      console.error('OpenRouter error', orRes.status, detail.slice(0, 500));
      return NextResponse.json(
        { error: `OpenRouter request failed (${orRes.status}).`, detail: detail.slice(0, 500) },
        { status: 502 },
      );
    }

    const data = (await orRes.json()) as ORResponse;
    const imageEntry = data.choices?.[0]?.message?.images?.[0];
    const dataUrl = imageEntry?.image_url?.url || imageEntry?.url;

    if (!dataUrl || !dataUrl.startsWith('data:')) {
      return NextResponse.json(
        {
          error: 'No image returned. The chosen model may not support image output.',
          model,
          textResponse: data.choices?.[0]?.message?.content,
        },
        { status: 502 },
      );
    }

    // Return raw bytes when requested (handy for `curl -o image.png`).
    if (format === 'binary') {
      const [meta, base64] = dataUrl.split(',');
      const mime = meta.match(/data:(.*?);base64/)?.[1] || 'image/png';
      const buffer = Buffer.from(base64, 'base64');
      return new NextResponse(new Uint8Array(buffer), {
        status: 200,
        headers: {
          'Content-Type': mime,
          'Cache-Control': 'no-store',
        },
      });
    }

    return NextResponse.json({ image: dataUrl, model, prompt });
  } catch (error) {
    console.error('generate-image API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
