import Link from 'next/link';
import { FiExternalLink, FiStar, FiTrendingUp } from 'react-icons/fi';

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

export default function ToolCard({ tool }: ToolProps) {
  const pricingBadge = (tier: string) => {
    const colors: Record<string, string> = {
      Free: 'bg-emerald-100 text-emerald-700',
      Freemium: 'bg-blue-100 text-blue-700',
      Paid: 'bg-amber-100 text-amber-700',
      Enterprise: 'bg-purple-100 text-purple-700',
    };
    return colors[tier] || 'bg-slate-100 text-slate-700';
  };

  return (
    <Link
      href={`/tool/${tool.slug}`}
      className="tool-card block bg-white border border-slate-200 rounded-xl p-5 hover:border-indigo-300 hover:shadow-md transition-all duration-200 group"
    >
      <div className="flex items-start gap-4">
        {/* Logo */}
        <div className="w-12 h-12 rounded-lg bg-indigo-50 flex items-center justify-center text-xl shrink-0 border border-indigo-100 overflow-hidden">
          {tool.logo_url ? (
            <img src={tool.logo_url} alt={tool.name} className="w-full h-full object-contain p-1" />
          ) : (
            <span className="text-indigo-400">🤖</span>
          )}
        </div>

        <div className="flex-1 min-w-0">
          {/* Name + Featured Badge */}
          <div className="flex items-center gap-2 mb-1">
            <h3 className="font-semibold text-slate-900 group-hover:text-indigo-600 transition-colors truncate">
              {tool.name}
            </h3>
            {tool.featured && (
              <span className="inline-flex items-center gap-1 text-[10px] font-medium text-amber-700 bg-amber-50 px-1.5 py-0.5 rounded-full border border-amber-200">
                <FiStar className="w-2.5 h-2.5" />
                Featured
              </span>
            )}
          </div>

          {/* Tagline */}
          <p className="text-sm text-slate-500 line-clamp-2 mb-3">{tool.tagline}</p>

          {/* Bottom row */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              {/* Pricing badge */}
              <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${pricingBadge(tool.pricing_tier)}`}>
                {tool.starting_price ? `${tool.pricing_tier} • ${tool.starting_price}` : tool.pricing_tier}
              </span>

              {/* Rating */}
              {tool.rating && (
                <span className="inline-flex items-center gap-1 text-xs text-slate-500">
                  <FiStar className="w-3 h-3 text-amber-400 fill-amber-400" />
                  {tool.rating.toFixed(1)}
                </span>
              )}
            </div>

            {/* Categories */}
            {tool.categories && tool.categories.length > 0 && (
              <span className="text-[10px] text-slate-400 truncate ml-2 hidden sm:inline">
                {tool.categories.map(c => c.name).join(', ')}
              </span>
            )}
          </div>
        </div>

        {/* Arrow */}
        <FiExternalLink className="w-4 h-4 text-slate-300 group-hover:text-indigo-500 transition-colors shrink-0 mt-1" />
      </div>
    </Link>
  );
}
