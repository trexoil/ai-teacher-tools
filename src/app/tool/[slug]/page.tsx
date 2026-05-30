import Link from 'next/link';
import { notFound } from 'next/navigation';
import {
  FiExternalLink, FiStar, FiClock, FiTag, FiUsers,
  FiCheckCircle, FiArrowLeft, FiShare2, FiDollarSign, FiGlobe,
} from 'react-icons/fi';
import NewsletterSignup from '@/components/NewsletterSignup';
import { getToolBySlug, incrementToolVisit, getAllTools } from '@/lib/db';

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
  const categorySlugs = tool.categories?.map((c: any) => c.slug) || [];
  const allTools = await getAllTools({ limit: 10 });
  const related = allTools
    .filter((t: any) => t.slug !== slug)
    .slice(0, 4);

  const pricingClass = (tier: string) => {
    const map: Record<string, string> = {
      Free: 'pricing-free',
      Freemium: 'pricing-freemium',
      Paid: 'pricing-paid',
      Enterprise: 'pricing-enterprise',
    };
    return map[tier] || 'bg-slate-100 text-slate-700';
  };

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
      <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start gap-4 mb-6">
          <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-3xl sm:text-4xl shrink-0 overflow-hidden">
            {tool.logo_url ? (
              <img src={tool.logo_url} alt={tool.name} className="w-full h-full object-contain p-2" />
            ) : (
              <span>🤖</span>
            )}
          </div>
          <div className="flex-1">
            <div className="flex flex-wrap items-center gap-2 mb-1">
              <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">{tool.name}</h1>
              {tool.featured && (
                <span className="inline-flex items-center gap-1 text-xs font-medium text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">
                  <FiStar className="w-3 h-3 fill-amber-400" />
                  Featured
                </span>
              )}
            </div>
            <p className="text-base sm:text-lg text-slate-600">{tool.tagline}</p>

            {/* Rating */}
            {tool.rating && (
              <div className="flex items-center gap-2 mt-2">
                <div className="flex items-center gap-0.5">
                  {[...Array(5)].map((_, i) => (
                    <FiStar
                      key={i}
                      className={`w-4 h-4 ${i < Math.round(tool.rating) ? 'fill-amber-400 text-amber-400' : 'text-slate-200'}`}
                    />
                  ))}
                </div>
                <span className="text-sm font-medium text-slate-900">{tool.rating.toFixed(1)}</span>
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
            href={tool.websiteUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-indigo-600 text-white font-medium rounded-xl text-sm hover:bg-indigo-700 transition-colors"
          >
            <FiExternalLink className="w-4 h-4" />
            Visit Website
          </a>
          {tool.affiliateUrl && (
            <a
              href={tool.affiliateUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-emerald-600 text-white font-medium rounded-xl text-sm hover:bg-emerald-700 transition-colors"
            >
              <FiCheckCircle className="w-4 h-4" />
              Try for Free
            </a>
          )}
        </div>

        {/* Info Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
          <div className="bg-slate-50 rounded-xl p-3 sm:p-4">
            <div className="flex items-center gap-2 text-xs text-slate-500 mb-1">
              <FiDollarSign className="w-3.5 h-3.5" />
              Pricing
            </div>
            <span className={`text-xs font-medium px-2 py-0.5 rounded-full inline-block ${pricingClass(tool.pricing_tier)}`}>
              {tool.pricing_tier}{tool.starting_price ? ` • ${tool.starting_price}` : ''}
            </span>
          </div>
          <div className="bg-slate-50 rounded-xl p-3 sm:p-4">
            <div className="flex items-center gap-2 text-xs text-slate-500 mb-1">
              <FiTag className="w-3.5 h-3.5" />
              Best For
            </div>
            <div className="text-sm font-medium text-slate-900">{tool.best_for?.[0] || 'General'}</div>
          </div>
          <div className="bg-slate-50 rounded-xl p-3 sm:p-4">
            <div className="flex items-center gap-2 text-xs text-slate-500 mb-1">
              <FiGlobe className="w-3.5 h-3.5" />
              Affiliate
            </div>
            <div className="text-sm font-medium text-slate-900">
              {tool.commissionRate || 'N/A'}
            </div>
          </div>
          <div className="bg-slate-50 rounded-xl p-3 sm:p-4">
            <div className="flex items-center gap-2 text-xs text-slate-500 mb-1">
              <FiUsers className="w-3.5 h-3.5" />
              Audience
            </div>
            <div className="text-sm font-medium text-slate-900">
              {tool.grade_levels?.[0] || 'All'}
            </div>
          </div>
        </div>

        {/* Description */}
        <div className="mb-8">
          <h2 className="text-lg font-semibold text-slate-900 mb-3">About This Tool</h2>
          <p className="text-slate-600 leading-relaxed whitespace-pre-line">{tool.description}</p>
        </div>

        {/* Tags */}
        {tool.best_for && tool.best_for.length > 0 && (
          <div className="mb-8">
            <h3 className="text-sm font-semibold text-slate-700 mb-2">Best For</h3>
            <div className="flex flex-wrap gap-2">
              {tool.best_for.map((item: string) => (
                <span key={item} className="text-xs bg-indigo-50 text-indigo-700 px-2.5 py-1 rounded-full">
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
              {tool.categories.map((cat: any) => (
                <Link
                  key={cat.id}
                  href={`/category/${cat.slug}`}
                  className="inline-flex items-center gap-1.5 text-xs bg-white border border-slate-200 text-slate-600 px-3 py-1.5 rounded-full hover:border-indigo-300 hover:text-indigo-600 transition-colors"
                >
                  {cat.icon} {cat.name}
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Related Tools */}
      {related.length > 0 && (
        <div className="mt-12">
          <h2 className="text-xl font-bold text-slate-900 mb-6">Related AI Tools</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {related.map((t: any) => (
              <Link
                key={t.id}
                href={`/tool/${t.slug}`}
                className="flex items-start gap-3 bg-white border border-slate-200 rounded-xl p-4 hover:border-indigo-300 hover:shadow-sm transition-all group"
              >
                <div className="w-10 h-10 rounded-lg bg-indigo-50 flex items-center justify-center text-lg border border-indigo-100 shrink-0 overflow-hidden">
                  {t.logo_url ? (
                    <img src={t.logo_url} alt={t.name} className="w-full h-full object-contain p-1" />
                  ) : (
                    <span>🤖</span>
                  )}
                </div>
                <div className="min-w-0">
                  <h3 className="font-semibold text-sm text-slate-900 group-hover:text-indigo-600 truncate">{t.name}</h3>
                  <p className="text-xs text-slate-500 line-clamp-1">{t.tagline}</p>
                </div>
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
        <Link
          href="/tools"
          className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-indigo-600"
        >
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
