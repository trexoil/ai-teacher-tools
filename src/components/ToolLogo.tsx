'use client';

import { useState } from 'react';
import { monogramGradient, initial } from '@/lib/theme';

interface ToolLogoProps {
  name: string;
  src?: string | null;
  /** extra classes for the monogram letter (size) */
  monogramClassName?: string;
}

/**
 * Renders a tool's logo, gracefully falling back to a branded gradient
 * monogram when there's no logo URL or the image fails to load.
 * Fills its parent box (parent controls size / rounding / border).
 */
export default function ToolLogo({ name, src, monogramClassName = 'text-lg' }: ToolLogoProps) {
  const [failed, setFailed] = useState(false);
  const showImage = !!src && !failed;

  if (showImage) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={src as string}
        alt={`${name} logo`}
        loading="lazy"
        onError={() => setFailed(true)}
        className="w-full h-full object-contain p-1.5 bg-white"
      />
    );
  }

  return (
    <div
      aria-hidden
      className={`w-full h-full flex items-center justify-center font-bold text-white ${monogramClassName}`}
      style={{ backgroundImage: monogramGradient(name) }}
    >
      {initial(name)}
    </div>
  );
}
