import Link from 'next/link';
import { FiArrowUpRight, FiStar } from 'react-icons/fi';
import ToolLogo from './ToolLogo';
import { getCategoryTheme } from '@/lib/theme';

interface ToolProps {
  tool: {
    id: string;
    name: string;
    slug: string;
    tagline: string;
    logo_url: string | null;
    website_url: string;
    affiliate_url: string | null;
    pricing_tier: string;
    starting_price: string | null;
    is_free: boolean;
    featured: boolean;
    rating: number | null;
    reviews_count: number;
    categories?: { id: string; name: string; slug: string; icon: string | null }[];
  };
}

const pricingBadge = (tier: string) => {
  const colors: Record<string, string> = {
    Free: 'bg-emerald-100 text-emerald-700',
    Freemium: 'bg-blue-100 text-blue-700',
    Paid: 'bg-amber-100 text-amber-700',
    Enterprise: 'bg-purple-100 text-purple-700',
  };
  return colors[tier] || 'bg-slate-100 text-slate-700';
};

export default function ToolCard({ tool }: ToolProps) {
  const primaryCategory = tool.categories?.[0];
  const catTheme = getCategoryTheme(primaryCategory?.slug);

  return (
    <Link
      href={`/tool/${tool.slug}`}
      className="tool-card card-hover group relative block overflow-hidden rounded-2xl border border-slate-200 bg-white p-5 hover:border-indigo-300"
    >
      {/* hover accent line */}
      <span
        className="absolute inset-x-0 top-0 h-0.5 origin-left scale-x-0 transition-transform duration-300 group-hover:scale-x-100"
        style={{ backgroundImage: `linear-gradient(90deg, ${catTheme.from}, ${catTheme.to})` }}
      />

      <div className="flex items-start gap-4">
        {/* Logo */}
        <div className="w-12 h-12 rounded-xl shrink-0 overflow-hidden ring-1 ring-slate-200/80 shadow-sm">
          <ToolLogo name={tool.name} src={tool.logo_url} monogramClassName="text-lg" />
        </div>

        <div className="flex-1 min-w-0">
          {/* Name + Featured Badge */}
          <div className="flex items-center gap-2 mb-1">
            <h3 className="font-semibold text-slate-900 group-hover:text-indigo-600 transition-colors truncate">
              {tool.name}
            </h3>
            {tool.featured && (
              <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-amber-700 bg-amber-50 px-1.5 py-0.5 rounded-full border border-amber-200">
                <FiStar className="w-2.5 h-2.5 fill-amber-400 text-amber-400" />
                Featured
              </span>
            )}
          </div>

          {/* Tagline */}
          <p className="text-sm text-slate-500 line-clamp-2 mb-3">{tool.tagline}</p>

          {/* Bottom row */}
          <div className="flex items-center gap-2 flex-wrap">
            {/* Pricing badge */}
            <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${pricingBadge(tool.pricing_tier)}`}>
              {tool.starting_price ? `${tool.pricing_tier} • ${tool.starting_price}` : tool.pricing_tier}
            </span>

            {/* Rating */}
            {tool.rating != null && (
              <span className="inline-flex items-center gap-1 text-xs font-medium text-slate-600">
                <FiStar className="w-3 h-3 text-amber-400 fill-amber-400" />
                {tool.rating.toFixed(1)}
                {tool.reviews_count > 0 && (
                  <span className="text-slate-400 font-normal">({tool.reviews_count.toLocaleString()})</span>
                )}
              </span>
            )}

            {/* Primary category chip */}
            {primaryCategory && (
              <span
                className="hidden sm:inline-flex items-center text-[10px] font-medium px-2 py-0.5 rounded-full"
                style={{ backgroundColor: catTheme.tint, color: catTheme.fg }}
              >
                {primaryCategory.icon ? `${primaryCategory.icon} ` : ''}{primaryCategory.name}
              </span>
            )}
          </div>
        </div>

        {/* Arrow */}
        <span className="shrink-0 mt-0.5 flex h-7 w-7 items-center justify-center rounded-full text-slate-300 transition-all group-hover:bg-indigo-50 group-hover:text-indigo-500">
          <FiArrowUpRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
        </span>
      </div>
    </Link>
  );
}
