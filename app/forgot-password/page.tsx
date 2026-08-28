'use client';

import Link from 'next/link';
import { Mail, ArrowLeft } from 'lucide-react';

export default function ForgotPasswordPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-paper px-6">
      <div className="w-full max-w-sm">
        <div className="text-center mb-10">
          <h1 className="font-display text-3xl text-ink mb-2">Reset password</h1>
          <p className="text-slate text-sm">
            Enter your email and we&apos;ll send you a reset link.
          </p>
        </div>

        <form className="space-y-4">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wide text-slate mb-2">
              Email
            </label>
            <div className="relative">
              <Mail size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate" />
              <input
                type="email"
                placeholder="you@example.com"
                className="w-full h-12 pl-11 pr-4 rounded-xl border border-hairline bg-white text-ink text-sm outline-none focus:border-ink/40 focus:ring-4 focus:ring-ink/5 transition"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full h-12 rounded-xl bg-gradient-to-r from-blue-600 to-blue-500 text-white font-bold text-sm hover:opacity-70 transition-opacity mt-2"
          >
            Send reset link
          </button>
        </form>

        <Link
          href="/login"
          className="flex items-center justify-center gap-1 text-sm text-slate hover:text-ink mt-8"
        >
          <ArrowLeft size={14} />
          Back to login
        </Link>
      </div>
    </div>
  );
}