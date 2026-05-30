'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { FiArrowRight, FiMenu, FiX } from 'react-icons/fi';
import Logo from './Logo';

const navLinks = [
  { href: '/', label: 'Home' },
  { href: '/tools', label: 'All Tools' },
  { href: '/submit', label: 'Submit Tool' },
];

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = usePathname();

  const isActive = (href: string) =>
    href === '/' ? pathname === '/' : pathname.startsWith(href);

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200/70 bg-white/80 backdrop-blur-md supports-[backdrop-filter]:bg-white/65">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 group">
            <span className="transition-transform duration-200 group-hover:-rotate-6 group-hover:scale-105">
              <Logo id="header" className="w-9 h-9" />
            </span>
            <span className="flex items-baseline gap-2">
              <span className="text-lg font-bold gradient-text tracking-tight">AI Teacher Tools</span>
              <span className="hidden sm:inline text-xs font-medium text-slate-400">Directory</span>
            </span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`relative px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                  isActive(link.href)
                    ? 'text-indigo-600'
                    : 'text-slate-600 hover:text-indigo-600 hover:bg-slate-50'
                }`}
              >
                {link.label}
                {isActive(link.href) && (
                  <span className="absolute left-3 right-3 -bottom-px h-0.5 rounded-full bg-gradient-to-r from-indigo-500 to-fuchsia-500" />
                )}
              </Link>
            ))}
            <Link
              href="/tools"
              className="btn-primary ml-2 inline-flex items-center gap-1.5 px-4 py-2 text-sm font-semibold rounded-full"
            >
              Browse Tools
              <FiArrowRight className="w-4 h-4" />
            </Link>
          </nav>

          {/* Mobile menu button */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle menu"
            aria-expanded={menuOpen}
            className="md:hidden p-2 rounded-lg text-slate-600 hover:bg-slate-100 transition-colors"
          >
            {menuOpen ? <FiX className="w-6 h-6" /> : <FiMenu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile menu */}
        {menuOpen && (
          <div className="md:hidden pb-4 border-t border-slate-100 pt-3 animate-fade-up">
            <div className="flex flex-col gap-1">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMenuOpen(false)}
                  className={`px-3 py-2.5 text-sm font-medium rounded-lg transition-colors ${
                    isActive(link.href)
                      ? 'text-indigo-600 bg-indigo-50'
                      : 'text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  {link.label}
                </Link>
              ))}
              <Link
                href="/tools"
                onClick={() => setMenuOpen(false)}
                className="btn-primary mt-2 inline-flex items-center justify-center gap-1.5 px-4 py-2.5 text-sm font-semibold rounded-full"
              >
                Browse All Tools
                <FiArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
