import Link from 'next/link';
import { FiArrowRight, FiStar, FiSearch, FiGrid, FiZap, FiBookOpen } from 'react-icons/fi';
import ToolCard from '@/components/ToolCard';
import SearchBar from '@/components/SearchBar';
import NewsletterSignup from '@/components/NewsletterSignup';
import { getAllCategories, getAllTools } from '@/lib/db';

export default async function HomePage() {
  const [categories, tools] = await Promise.all([
    getAllCategories(),
    getAllTools({ featured: true, limit: 12 }),
  ]);

  const stats = [
    { label: 'AI Tools Listed', value: '66+' },
    { label: 'Categories', value: '10' },
    { label: 'Teachers Using AI', value: 'Millions' },
    { label: 'Avg Rating', value: '4.5/5' },
  ];

  const categoryIcons: Record<string, string> = {};
  categories.forEach(c => { categoryIcons[c.slug] = c.icon || '📦'; });

  return (
    <div>
      {/* HERO SECTION */}
      <section className="relative overflow-hidden bg-gradient-to-br from-indigo-50 via-white to-purple-50">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(99,102,241,0.06),transparent_50%)]"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24 relative">
          <div className="text-center max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 bg-indigo-100 text-indigo-700 text-xs font-medium px-3 py-1.5 rounded-full mb-6">
              <FiZap className="w-3.5 h-3.5" />
              Discover the Best AI Tools for Teaching
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-slate-900 mb-4">
              The <span className="gradient-text">AI Tool Directory</span>
              <br />
              Built for Teachers
            </h1>
            <p className="text-lg sm:text-xl text-slate-600 mb-8 max-w-2xl mx-auto">
              Save hours every week. Discover 66+ AI tools for lesson planning, 
              quiz creation, grading, presentations, and classroom management.
            </p>
            <SearchBar />
            <div className="flex flex-wrap justify-center gap-2 mt-4 text-sm text-slate-500">
              <span>Popular:</span>
              {['Lesson Planning', 'Quiz Maker', 'Grading', 'Presentations'].map((tag) => (
                <Link
                  key={tag}
                  href={`/tools?q=${encodeURIComponent(tag.toLowerCase())}`}
                  className="px-2.5 py-1 bg-white border border-slate-200 rounded-full text-xs text-slate-600 hover:border-indigo-300 hover:text-indigo-600 transition-colors"
                >
                  {tag}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* STATS BANNER */}
      <section className="border-y border-slate-200 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {stats.map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="text-2xl sm:text-3xl font-bold text-indigo-600">{stat.value}</div>
                <div className="text-xs sm:text-sm text-slate-500 mt-1">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CATEGORIES SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="flex items-center justify-between mb-8">
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
          {categories.map((cat) => (
            <Link
              key={cat.id}
              href={`/category/${cat.slug}`}
              className="group flex flex-col items-center gap-2 p-4 sm:p-5 bg-white border border-slate-200 rounded-xl hover:border-indigo-300 hover:shadow-sm transition-all duration-200"
            >
              <span className="text-2xl sm:text-3xl">{categoryIcons[cat.slug]}</span>
              <span className="text-sm font-medium text-slate-700 group-hover:text-indigo-600 text-center">
                {cat.name}
              </span>
              <span className="text-xs text-slate-400">Browse →</span>
            </Link>
          ))}
        </div>

        <div className="sm:hidden mt-4 text-center">
          <Link
            href="/tools"
            className="inline-flex items-center gap-1.5 text-sm font-medium text-indigo-600"
          >
            View All Categories <FiArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>

      {/* FEATURED TOOLS */}
      <section className="bg-slate-50 border-t border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="flex items-center justify-between mb-8">
            <div>
              <div className="inline-flex items-center gap-1.5 text-amber-600 text-sm font-medium mb-1">
                <FiStar className="w-4 h-4 fill-amber-400" />
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

          <div className="text-center mt-8">
            <Link
              href="/tools"
              className="inline-flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white font-semibold rounded-xl text-sm hover:bg-indigo-700 transition-colors"
            >
              <FiGrid className="w-4 h-4" />
              Browse All 66+ Tools
              <FiArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* WHY USE AI SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12">
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-3">Why Teachers Are Using AI</h2>
          <p className="text-slate-500 max-w-2xl mx-auto">
            AI tools help teachers save 5-10 hours per week on planning, grading, and admin work.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { icon: FiZap, title: 'Save Hours Weekly', desc: 'Generate lesson plans, quizzes, and worksheets in seconds instead of hours.' },
            { icon: FiBookOpen, title: 'Create Better Content', desc: 'Design engaging, differentiated materials that meet every student where they are.' },
            { icon: FiStar, title: 'Focus on Teaching', desc: 'Spend less time on admin and grading — more time connecting with students.' },
          ].map((item) => (
            <div key={item.title} className="bg-white border border-slate-200 rounded-xl p-6 text-center">
              <div className="w-12 h-12 bg-indigo-50 rounded-xl flex items-center justify-center mx-auto mb-4">
                <item.icon className="w-6 h-6 text-indigo-600" />
              </div>
              <h3 className="font-semibold text-slate-900 mb-2">{item.title}</h3>
              <p className="text-sm text-slate-500">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* NEWSLETTER */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <NewsletterSignup />
      </section>
    </div>
  );
}
