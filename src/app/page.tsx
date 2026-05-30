import Link from 'next/link';
import {
  FiArrowRight, FiStar, FiZap, FiBookOpen, FiGrid, FiLayers,
  FiUsers, FiClock, FiCheck, FiHeart, FiTrendingUp,
} from 'react-icons/fi';
import ToolCard from '@/components/ToolCard';
import SearchBar from '@/components/SearchBar';
import NewsletterSignup from '@/components/NewsletterSignup';
import { getAllCategories, getAllTools } from '@/lib/db';
import { categoryGradient, getCategoryTheme } from '@/lib/theme';

export const dynamic = 'force-dynamic';

const stats = [
  { label: 'AI Tools Listed', value: '66+', icon: FiGrid },
  { label: 'Categories', value: '10', icon: FiLayers },
  { label: 'Teachers Using AI', value: 'Millions', icon: FiUsers },
  { label: 'Avg Rating', value: '4.5/5', icon: FiStar },
];

const floatingChips = [
  { emoji: '📋', label: 'Lesson plan in 30s', className: 'top-6 left-0', delay: '0s' },
  { emoji: '📝', label: 'Quiz generated', className: 'top-24 right-2', delay: '-2s' },
  { emoji: '✅', label: 'Essays graded', className: 'bottom-10 left-6', delay: '-4s' },
  { emoji: '🎯', label: 'Differentiated', className: 'bottom-2 right-10', delay: '-1s' },
];

const popularTags = ['Lesson Planning', 'Quiz Maker', 'Grading', 'Presentations'];

const whyCards = [
  { icon: FiClock, title: 'Save Hours Weekly', desc: 'Generate lesson plans, quizzes, and worksheets in seconds instead of hours.', from: '#6366f1', to: '#8b5cf6' },
  { icon: FiBookOpen, title: 'Create Better Content', desc: 'Design engaging, differentiated materials that meet every student where they are.', from: '#10b981', to: '#22d3ee' },
  { icon: FiHeart, title: 'Focus on Teaching', desc: 'Spend less time on admin and grading — more time connecting with students.', from: '#ec4899', to: '#f43f5e' },
];

export default async function HomePage() {
  const [categories, tools] = await Promise.all([
    getAllCategories(),
    getAllTools({ featured: true, limit: 12 }),
  ]);

  const categoryIcons: Record<string, string> = {};
  categories.forEach((c) => { categoryIcons[c.slug] = c.icon || '📦'; });

  return (
    <div>
      {/* ───────────────── HERO ───────────────── */}
      <section className="relative overflow-hidden">
        {/* background layers */}
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-50 via-white to-fuchsia-50/60" />
        <div className="blob blob-animate w-72 h-72 bg-indigo-300 -top-12 -left-10" />
        <div className="blob blob-animate w-72 h-72 bg-fuchsia-300 top-16 -right-8" style={{ animationDelay: '-6s' }} />
        <div className="blob blob-animate w-64 h-64 bg-violet-300 bottom-0 left-1/3" style={{ animationDelay: '-12s' }} />
        <div className="absolute inset-0 grid-lines" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-28">
          {/* floating chips (desktop only) */}
          <div className="pointer-events-none absolute inset-0 hidden lg:block">
            {floatingChips.map((chip) => (
              <div
                key={chip.label}
                className={`animate-float absolute ${chip.className} flex items-center gap-2 rounded-full border border-slate-200 bg-white/90 px-3.5 py-2 text-sm font-medium text-slate-700 shadow-lg backdrop-blur`}
                style={{ animationDelay: chip.delay }}
              >
                <span className="text-base">{chip.emoji}</span>
                {chip.label}
              </div>
            ))}
          </div>

          <div className="text-center max-w-3xl mx-auto">
            <div className="badge-pulse inline-flex items-center gap-2 bg-white/80 backdrop-blur text-indigo-700 text-xs font-semibold px-3.5 py-1.5 rounded-full mb-6 border border-indigo-100 shadow-sm">
              <FiZap className="w-3.5 h-3.5 text-amber-500" />
              Discover the Best AI Tools for Teaching
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-slate-900 mb-5">
              The <span className="gradient-text-animated">AI Tool Directory</span>
              <br />
              Built for Teachers
            </h1>
            <p className="text-lg sm:text-xl text-slate-600 mb-8 max-w-2xl mx-auto">
              Save hours every week. Discover 66+ AI tools for lesson planning,
              quiz creation, grading, presentations, and classroom management.
            </p>

            {/* elevated search */}
            <div className="relative max-w-2xl mx-auto">
              <div className="absolute -inset-2 rounded-full bg-gradient-to-r from-indigo-400/25 via-violet-400/20 to-fuchsia-400/25 blur-xl" />
              <div className="relative">
                <SearchBar />
              </div>
            </div>

            <div className="flex flex-wrap justify-center items-center gap-2 mt-5 text-sm text-slate-500">
              <span className="font-medium">Popular:</span>
              {popularTags.map((tag) => (
                <Link
                  key={tag}
                  href={`/tools?q=${encodeURIComponent(tag.toLowerCase())}`}
                  className="px-3 py-1 bg-white/80 backdrop-blur border border-slate-200 rounded-full text-xs text-slate-600 hover:border-indigo-300 hover:text-indigo-600 transition-colors"
                >
                  {tag}
                </Link>
              ))}
            </div>

            {/* trust row */}
            <div className="mt-8 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-xs text-slate-500">
              <span className="inline-flex items-center gap-1.5"><FiCheck className="w-4 h-4 text-emerald-500" /> Free &amp; paid options</span>
              <span className="inline-flex items-center gap-1.5"><FiCheck className="w-4 h-4 text-emerald-500" /> Curated for educators</span>
              <span className="inline-flex items-center gap-1.5"><FiCheck className="w-4 h-4 text-emerald-500" /> Updated weekly</span>
            </div>
          </div>
        </div>
      </section>

      {/* ───────────────── STATS ───────────────── */}
      <section className="border-y border-slate-200 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {stats.map((stat) => (
              <div key={stat.label} className="flex flex-col items-center text-center">
                <div className="mb-2 flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
                  <stat.icon className="w-5 h-5" />
                </div>
                <div className="text-2xl sm:text-3xl font-extrabold gradient-text">{stat.value}</div>
                <div className="text-xs sm:text-sm text-slate-500 mt-1">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ───────────────── CATEGORIES ───────────────── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="flex items-end justify-between mb-8">
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900">Browse by Category</h2>
            <p className="text-slate-500 mt-1">Find the right AI tool for your specific teaching need</p>
          </div>
          <Link
            href="/tools"
            className="hidden sm:inline-flex items-center gap-1.5 text-sm font-medium text-indigo-600 hover:text-indigo-700"
          >
            View All <FiArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4">
          {categories.map((cat) => {
            const theme = getCategoryTheme(cat.slug);
            return (
              <Link
                key={cat.id}
                href={`/category/${cat.slug}`}
                className="group relative flex flex-col gap-3 p-5 rounded-2xl border border-slate-200 bg-white card-hover overflow-hidden"
              >
                <span
                  aria-hidden
                  className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  style={{ background: theme.tint }}
                />
                <span
                  aria-hidden
                  className="pointer-events-none absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  style={{ boxShadow: `inset 0 0 0 1.5px ${theme.from}` }}
                />
                <span
                  className="relative flex h-11 w-11 items-center justify-center rounded-xl text-xl shadow-sm transition-transform duration-200 group-hover:scale-110 group-hover:-rotate-3"
                  style={{ backgroundImage: categoryGradient(cat.slug) }}
                >
                  {categoryIcons[cat.slug]}
                </span>
                <span className="relative">
                  <span className="block text-sm font-semibold text-slate-800">{cat.name}</span>
                  <span className="mt-0.5 inline-flex items-center gap-1 text-xs text-slate-400 group-hover:text-indigo-600 transition-colors">
                    Browse <FiArrowRight className="w-3 h-3 transition-transform group-hover:translate-x-0.5" />
                  </span>
                </span>
              </Link>
            );
          })}
        </div>

        <div className="sm:hidden mt-5 text-center">
          <Link href="/tools" className="inline-flex items-center gap-1.5 text-sm font-medium text-indigo-600">
            View All Categories <FiArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>

      {/* ───────────────── FEATURED TOOLS ───────────────── */}
      <section className="bg-slate-50 border-t border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="flex items-end justify-between mb-8">
            <div>
              <div className="inline-flex items-center gap-1.5 text-amber-600 text-sm font-semibold mb-1">
                <FiStar className="w-4 h-4 fill-amber-400 text-amber-400" />
                Featured Tools
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-900">Top AI Tools for Teachers</h2>
            </div>
            <Link
              href="/tools"
              className="hidden sm:inline-flex items-center gap-1.5 text-sm font-medium text-indigo-600 hover:text-indigo-700"
            >
              View All <FiArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {tools.map((tool) => (
              <ToolCard key={tool.id} tool={tool} />
            ))}
          </div>

          <div className="text-center mt-10">
            <Link
              href="/tools"
              className="btn-primary inline-flex items-center gap-2 px-6 py-3 font-semibold rounded-xl text-sm"
            >
              <FiGrid className="w-4 h-4" />
              Browse All 66+ Tools
              <FiArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* ───────────────── WHY AI ───────────────── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-1.5 text-indigo-600 text-sm font-semibold mb-2">
            <FiTrendingUp className="w-4 h-4" />
            The AI Advantage
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-3">Why Teachers Are Using AI</h2>
          <p className="text-slate-500 max-w-2xl mx-auto">
            AI tools help teachers save 5-10 hours per week on planning, grading, and admin work.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {whyCards.map((item) => (
            <div
              key={item.title}
              className="group relative rounded-2xl border border-slate-200 bg-white p-7 text-center card-hover"
            >
              <div
                className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-2xl text-white shadow-md transition-transform duration-200 group-hover:scale-110"
                style={{ backgroundImage: `linear-gradient(135deg, ${item.from}, ${item.to})` }}
              >
                <item.icon className="w-6 h-6" />
              </div>
              <h3 className="font-semibold text-slate-900 mb-2">{item.title}</h3>
              <p className="text-sm text-slate-500 leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ───────────────── NEWSLETTER ───────────────── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <NewsletterSignup />
      </section>
    </div>
  );
}
