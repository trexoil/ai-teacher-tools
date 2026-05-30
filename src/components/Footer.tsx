import Link from 'next/link';
import Logo from './Logo';

const categoryLinks = [
  { href: '/category/lesson-planning', label: 'Lesson Planning' },
  { href: '/category/quiz-assessment', label: 'Quiz & Assessment' },
  { href: '/category/grading-feedback', label: 'Grading & Feedback' },
  { href: '/category/presentations', label: 'Presentations' },
];

export default function Footer() {
  return (
    <footer className="relative bg-slate-900 text-slate-400 mt-20">
      {/* gradient hairline */}
      <div className="h-1 w-full bg-gradient-to-r from-indigo-500 via-violet-500 to-fuchsia-500" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="md:col-span-2">
            <Link href="/" className="flex items-center gap-2.5 mb-4">
              <Logo id="footer" className="w-8 h-8" />
              <span className="text-lg font-bold text-white">AI Teacher Tools</span>
            </Link>
            <p className="text-sm leading-relaxed max-w-md">
              The most comprehensive directory of AI tools for teachers and educators.
              Discover, compare, and find the perfect AI tool to save time and enhance your teaching.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2.5 text-sm">
              <li><Link href="/" className="hover:text-white transition-colors">Home</Link></li>
              <li><Link href="/tools" className="hover:text-white transition-colors">All Tools</Link></li>
              <li><Link href="/submit" className="hover:text-white transition-colors">Submit a Tool</Link></li>
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h3 className="text-white font-semibold mb-4">Categories</h3>
            <ul className="space-y-2.5 text-sm">
              {categoryLinks.map((c) => (
                <li key={c.href}>
                  <Link href={c.href} className="hover:text-white transition-colors">{c.label}</Link>
                </li>
              ))}
              <li><Link href="/tools" className="text-indigo-400 hover:text-indigo-300 transition-colors">View All →</Link></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-slate-800 mt-10 pt-8 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-xs">© 2026 AI Teacher Tools. All rights reserved.</p>
          <p className="text-xs">
            Built for teachers, by people who believe in the power of AI in education.
          </p>
        </div>
      </div>
    </footer>
  );
}
