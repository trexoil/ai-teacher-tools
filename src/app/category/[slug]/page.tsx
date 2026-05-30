import Link from 'next/link';
import { notFound } from 'next/navigation';
import { FiArrowLeft, FiGrid } from 'react-icons/fi';
import ToolCard from '@/components/ToolCard';
import { getCategoryBySlug, getToolsByCategory } from '@/lib/db';
import { getCategoryTheme, categoryGradient } from '@/lib/theme';

export const dynamic = 'force-dynamic';

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const [category, tools] = await Promise.all([
    getCategoryBySlug(slug),
    getToolsByCategory(slug),
  ]);

  if (!category) {
    notFound();
  }

  const theme = getCategoryTheme(slug);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-slate-500 mb-6">
        <Link href="/" className="hover:text-indigo-600">Home</Link>
        <span>/</span>
        <Link href="/tools" className="hover:text-indigo-600">Tools</Link>
        <span>/</span>
        <span className="text-slate-900 font-medium">{category.name}</span>
      </div>

      {/* Category Header */}
      <div
        className="relative overflow-hidden rounded-3xl border border-slate-200 p-6 sm:p-8 mb-8"
        style={{ background: theme.tint }}
      >
        <span
          className="absolute inset-x-0 top-0 h-1.5"
          style={{ backgroundImage: categoryGradient(slug, 90) }}
        />
        <div className="flex items-start gap-4 sm:gap-5">
          <div
            className="flex h-16 w-16 items-center justify-center rounded-2xl text-3xl shadow-md shrink-0"
            style={{ backgroundImage: categoryGradient(slug) }}
          >
            {category.icon || '📦'}
          </div>
          <div>
            <h1 className="text-3xl sm:text-4xl font-bold text-slate-900">{category.name}</h1>
            {category.description && (
              <p className="text-slate-600 mt-1.5 max-w-2xl">{category.description}</p>
            )}
            <div className="flex items-center gap-2 mt-3 text-sm font-medium" style={{ color: theme.fg }}>
              <FiGrid className="w-4 h-4" />
              <span>{tools.length} {tools.length === 1 ? 'tool' : 'tools'}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Tools Grid */}
      {tools.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {tools.map((tool) => (
            <ToolCard key={tool.id} tool={tool} />
          ))}
        </div>
      ) : (
        <div className="text-center py-16 rounded-3xl border border-dashed border-slate-200 bg-slate-50/50">
          <div className="text-4xl mb-4">🔍</div>
          <h2 className="text-xl font-semibold text-slate-900 mb-2">No tools yet in this category</h2>
          <p className="text-slate-500 mb-6">We are adding new tools regularly. Check back soon!</p>
          <Link
            href="/tools"
            className="btn-primary inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold"
          >
            <FiArrowLeft className="w-4 h-4" />
            Browse All Tools
          </Link>
        </div>
      )}

      {/* Back link */}
      <div className="mt-10">
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
  const category = await getCategoryBySlug(slug);

  if (!category) return { title: 'Category Not Found' };

  return {
    title: `${category.name} AI Tools for Teachers — AI Teacher Tools`,
    description: category.description || `Browse the best AI tools for ${category.name.toLowerCase()}. Compare features, pricing, and reviews.`,
  };
}
