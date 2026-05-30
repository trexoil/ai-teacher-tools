// Shared visual theming helpers so colors stay consistent across
// the home page, category pages, tool cards, and filters.

export type CategoryTheme = {
  /** gradient start (hex) */
  from: string;
  /** gradient end (hex) */
  to: string;
  /** soft tint background (rgba/hex) */
  tint: string;
  /** foreground text color for the tint chip (hex) */
  fg: string;
};

// Each category gets a distinct, education-friendly gradient identity.
export const categoryThemes: Record<string, CategoryTheme> = {
  'lesson-planning':      { from: '#6366f1', to: '#8b5cf6', tint: 'rgba(99,102,241,0.10)',  fg: '#4f46e5' },
  'quiz-assessment':      { from: '#8b5cf6', to: '#d946ef', tint: 'rgba(168,85,247,0.10)',  fg: '#7e22ce' },
  'grading-feedback':     { from: '#10b981', to: '#22d3ee', tint: 'rgba(16,185,129,0.12)',  fg: '#047857' },
  'presentations':        { from: '#f59e0b', to: '#f97316', tint: 'rgba(245,158,11,0.12)',  fg: '#b45309' },
  'content-creation':     { from: '#ec4899', to: '#f43f5e', tint: 'rgba(236,72,153,0.10)',  fg: '#be185d' },
  'classroom-management': { from: '#0ea5e9', to: '#6366f1', tint: 'rgba(14,165,233,0.12)',  fg: '#0369a1' },
  'video-multimedia':     { from: '#a855f7', to: '#ec4899', tint: 'rgba(168,85,247,0.10)',  fg: '#9333ea' },
  'language-learning':    { from: '#14b8a6', to: '#0ea5e9', tint: 'rgba(20,184,166,0.12)',  fg: '#0f766e' },
  'differentiation':      { from: '#f43f5e', to: '#fb7185', tint: 'rgba(244,63,94,0.10)',   fg: '#be123c' },
  'administration':       { from: '#64748b', to: '#0ea5e9', tint: 'rgba(100,116,139,0.12)', fg: '#475569' },
};

const fallbackTheme: CategoryTheme = {
  from: '#6366f1', to: '#a855f7', tint: 'rgba(99,102,241,0.10)', fg: '#4f46e5',
};

export function getCategoryTheme(slug?: string | null): CategoryTheme {
  if (!slug) return fallbackTheme;
  return categoryThemes[slug] ?? fallbackTheme;
}

/** A linear-gradient CSS string for a category. */
export function categoryGradient(slug?: string | null, angle = 135): string {
  const t = getCategoryTheme(slug);
  return `linear-gradient(${angle}deg, ${t.from}, ${t.to})`;
}

// Deterministic gradient pairs for tool logo fallbacks (monograms).
const monogramPalette: Array<[string, string]> = [
  ['#6366f1', '#8b5cf6'],
  ['#8b5cf6', '#d946ef'],
  ['#0ea5e9', '#6366f1'],
  ['#10b981', '#22d3ee'],
  ['#f59e0b', '#f97316'],
  ['#ec4899', '#f43f5e'],
  ['#14b8a6', '#0ea5e9'],
  ['#a855f7', '#ec4899'],
];

function hashString(input: string): number {
  let hash = 0;
  for (let i = 0; i < input.length; i++) {
    hash = (hash << 5) - hash + input.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash);
}

/** A stable gradient for a tool's monogram fallback, derived from its name. */
export function monogramGradient(seed: string, angle = 135): string {
  const [from, to] = monogramPalette[hashString(seed) % monogramPalette.length];
  return `linear-gradient(${angle}deg, ${from}, ${to})`;
}

/** First meaningful character of a name, uppercased. */
export function initial(name: string): string {
  const match = name.match(/[a-z0-9]/i);
  return (match?.[0] ?? '•').toUpperCase();
}
