'use client';

import { useState } from 'react';
import { FiSend, FiCheckCircle } from 'react-icons/fi';
import Link from 'next/link';

export default function SubmitPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    toolName: '',
    toolUrl: '',
    description: '',
    pricing: '',
  });
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errorMsg, setErrorMsg] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');

    try {
      const res = await fetch('/api/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        setStatus('success');
        setFormData({ name: '', email: '', toolName: '', toolUrl: '', description: '', pricing: '' });
      } else {
        const data = await res.json();
        setStatus('error');
        setErrorMsg(data.error || 'Something went wrong');
      }
    } catch {
      setStatus('error');
      setErrorMsg('Network error. Please try again.');
    }
  };

  if (status === 'success') {
    return (
      <div className="max-w-lg mx-auto px-4 py-20 text-center">
        <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <FiCheckCircle className="w-8 h-8 text-emerald-600" />
        </div>
        <h1 className="text-2xl font-bold text-slate-900 mb-2">Thanks for the suggestion! 🎉</h1>
        <p className="text-slate-500 mb-8">We&apos;ll review your submission and add the tool to our directory if it fits.</p>
        <Link
          href="/"
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-indigo-600 text-white font-medium rounded-xl text-sm hover:bg-indigo-700"
        >
          Back to Home
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-slate-500 mb-6">
        <Link href="/" className="hover:text-indigo-600">Home</Link>
        <span>/</span>
        <span className="text-slate-900 font-medium">Submit a Tool</span>
      </div>

      <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-2">Submit an AI Tool</h1>
      <p className="text-slate-500 mb-8">
        Know a great AI tool for teachers that is not in our directory? Let us know!
      </p>

      <form onSubmit={handleSubmit} className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 space-y-5">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">Your Name *</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="John Smith"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">Your Email *</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="john@school.edu"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1.5">Tool Name *</label>
          <input
            type="text"
            name="toolName"
            value={formData.toolName}
            onChange={handleChange}
            required
            className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            placeholder="e.g. MagicSchool.ai"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1.5">Tool Website URL *</label>
          <input
            type="url"
            name="toolUrl"
            value={formData.toolUrl}
            onChange={handleChange}
            required
            className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            placeholder="https://magicschool.ai"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1.5">Short Description</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows={3}
            className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
            placeholder="What does this tool do for teachers?"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1.5">Pricing Model</label>
          <select
            name="pricing"
            value={formData.pricing}
            onChange={handleChange}
            className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="">Select pricing model</option>
            <option value="Free">Free</option>
            <option value="Freemium">Freemium (Free + Paid features)</option>
            <option value="Paid">Paid</option>
            <option value="Enterprise">Enterprise</option>
          </select>
        </div>

        {status === 'error' && (
          <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-xl p-3">
            {errorMsg}
          </div>
        )}

        <button
          type="submit"
          disabled={status === 'loading'}
          className="w-full inline-flex items-center justify-center gap-2 px-6 py-3 bg-indigo-600 text-white font-semibold rounded-xl text-sm hover:bg-indigo-700 transition-colors disabled:opacity-50"
        >
          {status === 'loading' ? (
            'Submitting...'
          ) : (
            <>
              <FiSend className="w-4 h-4" />
              Submit Tool
            </>
          )}
        </button>
      </form>
    </div>
  );
}
