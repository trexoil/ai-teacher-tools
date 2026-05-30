interface LogoProps {
  /** unique suffix so multiple instances don't share gradient ids */
  id?: string;
  className?: string;
}

/**
 * Brand mark: a stylized graduation cap (mortarboard) with a warm tassel bead
 * and an AI "spark", rendered in the brand gradient. Pure SVG — crisp at any size.
 */
export default function Logo({ id = 'logo', className = 'w-9 h-9' }: LogoProps) {
  const grad = `lg-${id}`;
  const spark = `sp-${id}`;
  return (
    <svg
      viewBox="0 0 32 32"
      fill="none"
      role="img"
      aria-label="AI Teacher Tools logo"
      className={className}
    >
      <defs>
        <linearGradient id={grad} x1="2" y1="3" x2="29" y2="29" gradientUnits="userSpaceOnUse">
          <stop stopColor="#6366f1" />
          <stop offset="0.5" stopColor="#8b5cf6" />
          <stop offset="1" stopColor="#d946ef" />
        </linearGradient>
        <linearGradient id={spark} x1="22" y1="3" x2="28" y2="9" gradientUnits="userSpaceOnUse">
          <stop stopColor="#fbbf24" />
          <stop offset="1" stopColor="#f59e0b" />
        </linearGradient>
      </defs>

      {/* Mortarboard cup (head) */}
      <path
        d="M8 14.2v4.9c0 .62.32 1.19.85 1.5C11 21.9 13.4 22.7 16 22.7s5-.8 7.15-2.1c.53-.31.85-.88.85-1.5v-4.9L16 17.8 8 14.2Z"
        fill={`url(#${grad})`}
        opacity="0.5"
      />
      {/* Mortarboard top (diamond) */}
      <path
        d="M16 5 29.5 11 16 17 2.5 11 16 5Z"
        fill={`url(#${grad})`}
      />
      {/* Tassel */}
      <path d="M29.5 11v6.4" stroke={`url(#${grad})`} strokeWidth="1.5" strokeLinecap="round" />
      <circle cx="29.5" cy="18.8" r="1.7" fill={`url(#${spark})`} />

      {/* AI spark */}
      <path
        d="M23.4 4.2c.16-.53.9-.53 1.06 0l.38 1.27 1.27.38c.53.16.53.9 0 1.06l-1.27.38-.38 1.27c-.16.53-.9.53-1.06 0l-.38-1.27-1.27-.38c-.53-.16-.53-.9 0-1.06l1.27-.38.38-1.27Z"
        fill={`url(#${spark})`}
      />
    </svg>
  );
}
