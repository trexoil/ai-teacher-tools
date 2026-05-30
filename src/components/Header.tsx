'use client';

import Link from 'next/link';
import { useState } from 'react';

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <span className="text-2xl">🎓</span>
            <div>
              <span className="text-xl font-bold gradient-text">AI Teacher Tools</span>
              <span className="hidden sm:inline text-sm text-slate-500 ml-2">Directory</span>
            </div>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-6">
            <Link href="/" className="text-sm font-medium text-slate-600 hover:text-indigo-600 transition-colors">
              Home
            </Link>
            <Link href="/tools" className="text-sm font-medium text-slate-600 hover:text-indigo-600 transition-colors">
              All Tools
            </Link>
            <Link href="/submit" className="text-sm font-medium text-slate-600 hover:text-indigo-600 transition-colors">
              Submit Tool
            </Link>
            <Link
              href="/tools"
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-full hover:bg-indigo-700 transition-colors"
            >
              Browse Tools
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </nav>

          {/* Mobile menu button */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="md:hidden p-2 rounded-lg text-slate-600 hover:bg-slate-100"
          >
            {menuOpen ? (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>
        </div>

        {/* Mobile menu */}
        {menuOpen && (
          <div className="md:hidden pb-4 border-t border-slate-100 pt-4">
            <div className="flex flex-col gap-3">
              <Link href="/" className="text-sm font-medium text-slate-600 hover:text-indigo-600" onClick={() => setMenuOpen(false)}>
                Home
              </Link>
              <Link href="/tools" className="text-sm font-medium text-slate-600 hover:text-indigo-600" onClick={() => setMenuOpen(false)}>
                All Tools
              </Link>
              <Link href="/submit" className="text-sm font-medium text-slate-600 hover:text-indigo-600" onClick={() => setMenuOpen(false)}>
                Submit Tool
              </Link>
              <Link
                href="/tools"
                className="inline-flex items-center justify-center gap-1.5 px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-full"
                onClick={() => setMenuOpen(false)}
              >
                Browse All Tools
              </Link>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
