#!/usr/bin/env node
/**
 * Generate an image via OpenRouter and save it into the project.
 *
 * Usage:
 *   OPENROUTER_API_KEY=sk-or-... node scripts/generate-image.mjs "<prompt>" [outFile] [model]
 *
 * Examples:
 *   OPENROUTER_API_KEY=... node scripts/generate-image.mjs \
 *     "flat vector hero illustration of a teacher using AI tools, indigo & violet palette, soft shapes" \
 *     public/generated/hero.png \
 *     google/gemini-2.5-flash-image-preview
 *
 * Notes:
 *   - The API key is read from the environment — never hard-code it, never commit it.
 *     (Put it in .env.local, which is gitignored, or export it in your shell.)
 *   - Requires outbound network access to openrouter.ai. This will NOT work inside the
 *     Claude Code web sandbox (egress is restricted: "Host not in allowlist") — run it
 *     locally or in CI where egress is allowed.
 *   - Pick an image-capable model from https://openrouter.ai/models?fmt=cards&output_modalities=image
 */

import { writeFile, mkdir } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';

const apiKey = process.env.OPENROUTER_API_KEY;
if (!apiKey) {
  console.error('✗ Missing OPENROUTER_API_KEY. Export it or add it to .env.local (gitignored).');
  process.exit(1);
}

const prompt = process.argv[2];
if (!prompt) {
  console.error('Usage: node scripts/generate-image.mjs "<prompt>" [outFile] [model]');
  process.exit(1);
}

const outFile = process.argv[3] || 'public/generated/image.png';
const model =
  process.argv[4] ||
  process.env.OPENROUTER_IMAGE_MODEL ||
  'google/gemini-2.5-flash-image-preview';

console.log(`→ model: ${model}`);
console.log(`→ prompt: ${prompt}`);

const res = await fetch('https://openrouter.ai/api/v1/chat/completions', {
  method: 'POST',
  headers: {
    Authorization: `Bearer ${apiKey}`,
    'Content-Type': 'application/json',
    // Optional attribution headers used by OpenRouter:
    'HTTP-Referer': process.env.OPENROUTER_SITE_URL || 'https://ai-teacher-tools.vercel.app',
    'X-Title': 'AI Teacher Tools',
  },
  body: JSON.stringify({
    model,
    modalities: ['image', 'text'],
    messages: [{ role: 'user', content: prompt }],
  }),
});

if (!res.ok) {
  console.error(`✗ OpenRouter error ${res.status}: ${await res.text()}`);
  process.exit(1);
}

const data = await res.json();
const message = data?.choices?.[0]?.message ?? {};
const image = message.images?.[0];
const dataUrl = image?.image_url?.url || image?.url;

if (!dataUrl || !dataUrl.startsWith('data:')) {
  console.error('✗ No image returned. The model may not support image output.');
  console.error(JSON.stringify(data, null, 2).slice(0, 2000));
  process.exit(1);
}

const base64 = dataUrl.split(',')[1];
const buffer = Buffer.from(base64, 'base64');

const dest = resolve(process.cwd(), outFile);
await mkdir(dirname(dest), { recursive: true });
await writeFile(dest, buffer);

console.log(`✓ Saved ${(buffer.length / 1024).toFixed(1)} KB → ${outFile}`);
