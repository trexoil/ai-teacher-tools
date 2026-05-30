import Link from 'next/link';
import { notFound } from 'next/navigation';
import {
  FiExternalLink, FiStar, FiTag, FiUsers,
  FiCheckCircle, FiArrowLeft, FiDollarSign, FiGlobe, FiArrowUpRight,
} from 'react-icons/fi';
import NewsletterSignup from '@/components/NewsletterSignup';
import ToolLogo from '@/components/ToolLogo';
import { getToolBySlug, incrementToolVisit, getAllTools } from '@/lib/db';
import { getCategoryTheme } from '@/lib/theme';

export const dynamic = 'force-dynamic';

export default async function ToolPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const tool = await getToolBySlug(slug);

  if (!tool) {
    notFound();
  }

  // Track visit (don't await)
  incrementToolVisit(slug).catch(() => {});

  // Get related tools (same categories)
  const allTools = await getAllTools({ limit: 10 });
  const related = allTools.filter((t) => t.slug !== slug).slice(0, 4);

  const headerTheme = getCategoryTheme(tool.categories?.[0]?.slug);
  const rating = tool.rating;

  const infoCards = [
    {
      icon: FiDollarSign, label: 'Pricing', from: '#10b981', to: '#22d3ee',
      value: `${tool.pricing_tier}${tool.starting_price ? ` • ${tool.starting_price}` : ''}`,
    },
    { icon: FiTag, label: 'Best For', from: '#6366f1', to: '#8b5cf6', value: tool.best_for?.[0] || 'General' },
    { icon: FiGlobe, label: 'Commission', from: '#f59e0b', to: '#f97316', value: tool.commission_rate || 'N/A' },
    { icon: FiUsers, label: 'Audience', from: '#ec4899', to: '#f43f5e', value: tool.grade_levels?.[0] || 'All' },
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-slate-500 mb-6">
        <Link href="/" className="hover:text-indigo-600">Home</Link>
        <span>/</span>
        <Link href="/tools" className="hover:text-indigo-600">Tools</Link>
        <span>/</span>
        <span className="text-slate-900 font-medium">{tool.name}</span>
      </div>

      {/* Main Content */}
      <div className="relative overflow-hidden bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-sm">
        {/* gradient top accent */}
        <span
          className="absolute inset-x-0 top-0 h-1.5"
          style={{ backgroundImage: `linear-gradient(90deg, ${headerTheme.from}, ${headerTheme.to})` }}
        />

        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start gap-5 mb-6 pt-2">
          <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl shrink-0 overflow-hidden ring-1 ring-slate-200 shadow-sm">
            <ToolLogo name={tool.name} src={tool.logo_url} monogramClassName="text-3xl" />
          </div>
          <div className="flex-1">
            <div className="flex flex-wrap items-center gap-2 mb-1.5">
              <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">{tool.name}</h1>
              {tool.featured && (
                <span className="inline-flex items-center gap-1 text-xs font-semibold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">
                  <FiStar className="w-3 h-3 fill-amber-400 text-amber-400" />
                  Featured
                </span>
              )}
            </div>
            <p className="text-base sm:text-lg text-slate-600">{tool.tagline}</p>

            {/* Rating */}
            {rating != null && (
              <div className="flex items-center gap-2 mt-2.5">
                <div className="flex items-center gap-0.5">
                  {[...Array(5)].map((_, i) => (
                    <FiStar
                      key={i}
                      className={`w-4 h-4 ${i < Math.round(rating) ? 'fill-amber-400 text-amber-400' : 'text-slate-200'}`}
                    />
                  ))}
                </div>
                <span className="text-sm font-semibold text-slate-900">{rating.toFixed(1)}</span>
                {tool.reviews_count > 0 && (
                  <span className="text-sm text-slate-500">({tool.reviews_count.toLocaleString()} reviews)</span>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap gap-3 mb-8">
          <a
            href={tool.website_url}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-primary inline-flex items-center gap-2 px-5 py-2.5 font-semibold rounded-xl text-sm"
          >
            <FiExternalLink className="w-4 h-4" />
            Visit Website
          </a>
          {tool.affiliate_url && (
            <a
              href={tool.affiliate_url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-emerald-600 text-white font-semibold rounded-xl text-sm hover:bg-emerald-700 transition-colors shadow-sm"
            >
              <FiCheckCircle className="w-4 h-4" />
              Try for Free
            </a>
          )}
        </div>

        {/* Info Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 mb-8">
          {infoCards.map((card) => (
            <div key={card.label} className="rounded-2xl border border-slate-100 bg-slate-50/70 p-4">
              <div className="flex items-center gap-2 text-xs text-slate-500 mb-2">
                <span
                  className="flex h-6 w-6 items-center justify-center rounded-lg text-white"
                  style={{ backgroundImage: `linear-gradient(135deg, ${card.from}, ${card.to})` }}
                >
                  <card.icon className="w-3.5 h-3.5" />
                </span>
                {card.label}
              </div>
              <div className="text-sm font-semibold text-slate-900 truncate">{card.value}</div>
            </div>
          ))}
        </div>

        {/* Description */}
        <div className="mb-8">
          <h2 className="text-lg font-semibold text-slate-900 mb-3">About This Tool</h2>
          <p className="text-slate-600 leading-relaxed whitespace-pre-line">{tool.description}</p>
        </div>

        {/* Best For tags */}
        {tool.best_for && tool.best_for.length > 0 && (
          <div className="mb-8">
            <h3 className="text-sm font-semibold text-slate-700 mb-2">Best For</h3>
            <div className="flex flex-wrap gap-2">
              {tool.best_for.map((item: string) => (
                <span key={item} className="text-xs font-medium bg-indigo-50 text-indigo-700 px-2.5 py-1 rounded-full border border-indigo-100">
                  {item}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Subjects & Curriculum */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8">
          {tool.subjects && tool.subjects.length > 0 && (
            <div>
              <h3 className="text-sm font-semibold text-slate-700 mb-2">Subjects</h3>
              <div className="flex flex-wrap gap-1.5">
                {tool.subjects.map((s: string) => (
                  <span key={s} className="text-xs bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full">{s}</span>
                ))}
              </div>
            </div>
          )}
          {tool.curriculum && tool.curriculum.length > 0 && (
            <div>
              <h3 className="text-sm font-semibold text-slate-700 mb-2">Curriculum</h3>
              <div className="flex flex-wrap gap-1.5">
                {tool.curriculum.map((c: string) => (
                  <span key={c} className="text-xs bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full">{c}</span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Categories */}
        {tool.categories && tool.categories.length > 0 && (
          <div className="border-t border-slate-200 pt-6">
            <h3 className="text-sm font-semibold text-slate-700 mb-3">Categories</h3>
            <div className="flex flex-wrap gap-2">
              {tool.categories.map((cat) => {
                const t = getCategoryTheme(cat.slug);
                return (
                  <Link
                    key={cat.id}
                    href={`/category/${cat.slug}`}
                    className="inline-flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-full transition-transform hover:scale-105"
                    style={{ backgroundColor: t.tint, color: t.fg }}
                  >
                    {cat.icon} {cat.name}
                  </Link>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Related Tools */}
      {related.length > 0 && (
        <div className="mt-12">
          <h2 className="text-xl font-bold text-slate-900 mb-6">Related AI Tools</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {related.map((t) => (
              <Link
                key={t.id}
                href={`/tool/${t.slug}`}
                className="card-hover group flex items-start gap-3 bg-white border border-slate-200 rounded-2xl p-4 hover:border-indigo-300"
              >
                <div className="w-10 h-10 rounded-xl overflow-hidden ring-1 ring-slate-200 shrink-0">
                  <ToolLogo name={t.name} src={t.logo_url} monogramClassName="text-base" />
                </div>
                <div className="min-w-0 flex-1">
                  <h3 className="font-semibold text-sm text-slate-900 group-hover:text-indigo-600 truncate">{t.name}</h3>
                  <p className="text-xs text-slate-500 line-clamp-1">{t.tagline}</p>
                </div>
                <FiArrowUpRight className="w-4 h-4 text-slate-300 group-hover:text-indigo-500 transition-colors shrink-0" />
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Newsletter */}
      <div className="mt-12">
        <NewsletterSignup />
      </div>

      {/* Back link */}
      <div className="mt-8">
        <Link href="/tools" className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-indigo-600">
          <FiArrowLeft className="w-4 h-4" />
          Back to All Tools
        </Link>
      </div>
    </div>
  );
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const tool = await getToolBySlug(slug);

  if (!tool) return { title: 'Tool Not Found' };

  return {
    title: `${tool.name} — AI Tool for Teachers | AI Teacher Tools`,
    description: tool.tagline || `Learn about ${tool.name}, an AI tool for teachers. ${tool.description?.substring(0, 150) || ''}`,
  };
}
