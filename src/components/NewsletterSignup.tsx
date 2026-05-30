'use client';

import { FiMail, FiSend } from 'react-icons/fi';
import { useState } from 'react';

export default function NewsletterSignup() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setStatus('loading');
    try {
      const res = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, type: 'newsletter' }),
      });

      if (res.ok) {
        setStatus('success');
        setMessage("You're in! We'll send you the best AI tools for teachers every week.");
        setEmail('');
      } else {
        setStatus('error');
        setMessage('Something went wrong. Please try again.');
      }
    } catch {
      setStatus('error');
      setMessage('Something went wrong. Please try again.');
    }
  };

  return (
    <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-indigo-600 via-violet-600 to-purple-700 p-8 sm:p-12 text-white glow">
      {/* decorative layers */}
      <div className="absolute inset-0 dot-grid opacity-30" />
      <div className="blob w-64 h-64 bg-fuchsia-400 -top-16 -right-10 opacity-40" />
      <div className="blob w-56 h-56 bg-indigo-400 -bottom-16 -left-10 opacity-40" />

      <div className="relative max-w-xl mx-auto text-center">
        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-white/15 backdrop-blur">
          <FiMail className="w-7 h-7" />
        </div>
        <h2 className="text-2xl sm:text-3xl font-bold mb-2">Get New Tools Every Week</h2>
        <p className="text-indigo-100 mb-6 text-sm sm:text-base">
          Join 1,000+ teachers getting our weekly AI tool recommendations. No spam, just tools that save you time.
        </p>

        {status === 'success' ? (
          <div className="bg-white/15 backdrop-blur rounded-xl p-4 text-sm font-medium">
            {message} 🎉
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your@email.com"
              required
              aria-label="Email address"
              className="flex-1 px-4 py-3 rounded-xl text-slate-900 text-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-white/70 shadow-sm"
            />
            <button
              type="submit"
              disabled={status === 'loading'}
              className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-white text-indigo-700 font-semibold rounded-xl text-sm hover:bg-indigo-50 transition-colors disabled:opacity-50 shadow-sm"
            >
              {status === 'loading' ? 'Subscribing...' : 'Subscribe'}
              <FiSend className="w-4 h-4" />
            </button>
          </form>
        )}

        {status === 'error' && (
          <p className="text-red-100 text-sm mt-2">{message}</p>
        )}
      </div>
    </section>
  );
}
