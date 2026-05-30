import Link from 'next/link';
import { FiArrowRight, FiSearch } from 'react-icons/fi';
import ToolCard from '@/components/ToolCard';
import { getAllTools, getAllCategories } from '@/lib/db';
import { categoryGradient } from '@/lib/theme';

export const dynamic = 'force-dynamic';

export default async function ToolsPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; category?: string }>;
}) {
  const { q, category } = await searchParams;

  const [allTools, categories] = await Promise.all([
    getAllTools({ search: q || undefined, category, limit: 100 }),
    getAllCategories(),
  ]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-slate-500 mb-6">
        <Link href="/" className="hover:text-indigo-600">Home</Link>
        <span>/</span>
        <span className="text-slate-900 font-medium">All Tools</span>
      </div>

      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl sm:text-4xl font-bold text-slate-900">
          All AI Tools for <span className="gradient-text">Teachers</span>
        </h1>
        <p className="text-slate-500 mt-2">
          {q
            ? `Showing results for "${q}" — ${allTools.length} ${allTools.length === 1 ? 'tool' : 'tools'} found`
            : `Browse all ${allTools.length} AI tools for teachers and educators`}
        </p>
      </div>

      {/* Category Filter Pills */}
      <div className="flex flex-wrap gap-2 mb-8">
        <Link
          href="/tools"
          className={`text-xs font-semibold px-3.5 py-1.5 rounded-full border transition-all ${
            !category && !q
              ? 'text-white border-transparent shadow-sm'
              : 'bg-white text-slate-600 border-slate-200 hover:border-indigo-300 hover:text-indigo-600'
          }`}
          style={!category && !q ? { backgroundImage: categoryGradient('lesson-planning') } : undefined}
        >
          All Tools
        </Link>
        {categories.map((cat) => {
          const active = category === cat.slug;
          return (
            <Link
              key={cat.id}
              href={`/tools?category=${cat.slug}`}
              className={`text-xs font-semibold px-3.5 py-1.5 rounded-full border transition-all ${
                active
                  ? 'text-white border-transparent shadow-sm'
                  : 'bg-white text-slate-600 border-slate-200 hover:border-indigo-300 hover:text-indigo-600'
              }`}
              style={active ? { backgroundImage: categoryGradient(cat.slug) } : undefined}
            >
              {cat.icon} {cat.name}
            </Link>
          );
        })}
      </div>

      {/* Tools Grid */}
      {allTools.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {allTools.map((tool) => (
            <ToolCard key={tool.id} tool={tool} />
          ))}
        </div>
      ) : (
        <div className="text-center py-16 rounded-3xl border border-dashed border-slate-200 bg-slate-50/50">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-white shadow-sm">
            <FiSearch className="w-6 h-6 text-slate-400" />
          </div>
          <h2 className="text-xl font-semibold text-slate-900 mb-2">No tools found</h2>
          <p className="text-slate-500 mb-6">
            {q ? `No tools matching "${q}"` : 'No tools in this category yet'}
          </p>
          <Link
            href="/tools"
            className="btn-primary inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold"
          >
            View All Tools
          </Link>
        </div>
      )}

      {/* Bottom CTA */}
      <div className="mt-12 text-center border-t border-slate-200 pt-8">
        <p className="text-slate-500 text-sm mb-4">Know an AI tool that should be here?</p>
        <Link
          href="/submit"
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-white border border-slate-200 text-slate-700 font-medium rounded-xl text-sm hover:border-indigo-300 hover:text-indigo-600 transition-colors"
        >
          Submit a Tool
          <FiArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
}

export async function generateMetadata({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; category?: string }>;
}) {
  const { q } = await searchParams;

  if (q) {
    return { title: `${q} — AI Tools for Teachers | AI Teacher Tools`, description: `Browse AI tools for teachers matching "${q}". Compare pricing and features.` };
  }

  return {
    title: 'All AI Tools for Teachers — AI Teacher Tools Directory',
    description: 'Browse 66+ AI tools for teachers and educators. Compare lesson planning, quiz, grading, and presentation tools.',
  };
}
