'use client';

import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import {
  Mail,
  ArrowLeft,
  ArrowRight,
  AlertCircle,
  CheckCircle2,
  BriefcaseBusiness,
  Clock3,
  FileText,
  TrendingUp,
} from 'lucide-react';

import { createClient } from '@/lib/supabase/client';

const DEBOUNCE_MS = 600;
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function validateEmail(email: string): string | undefined {
  if (!email.trim()) return undefined;
  if (!EMAIL_REGEX.test(email)) return 'Enter a valid email address.';
  return undefined;
}

function validateEmailRequired(email: string): string | undefined {
  if (!email.trim()) return 'Email is required.';
  return validateEmail(email);
}

export default function ForgotPasswordPage() {
  const supabase = createClient();

  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState<string | undefined>();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [sent, setSent] = useState(false);

  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (timer.current) clearTimeout(timer.current);
    };
  }, []);

  const handleEmailChange = (value: string) => {
    setEmail(value);
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => {
      setEmailError(validateEmail(value));
    }, DEBOUNCE_MS);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (timer.current) clearTimeout(timer.current);

    const requiredError = validateEmailRequired(email);
    setEmailError(requiredError);
    if (requiredError) return;

    setLoading(true);
    setError('');

    try {
      const { error: supabaseError } = await supabase.auth.resetPasswordForEmail(
        email.trim(),
        { redirectTo: `${window.location.origin}/reset-password` }
      );

      if (supabaseError) {
        console.error('Reset password error:', supabaseError);
        setError('Unable to send reset link. Please try again.');
        setLoading(false);
        return;
      }

      setSent(true);
      setLoading(false);
    } catch (err) {
      console.error('Reset password error:', err);
      setError('Something went wrong. Please try again.');
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#f5f7fb] flex items-center justify-center px-5 py-10">

      {/* ================= BACKGROUND DESIGN ================= */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -left-40 w-[420px] h-[420px] rounded-full bg-blue-500/10 blur-3xl animate-pulse" />
        <div
          className="absolute -bottom-48 -right-40 w-[500px] h-[500px] rounded-full bg-indigo-500/10 blur-3xl animate-pulse"
          style={{ animationDelay: '1.5s' }}
        />
        <div
          className="absolute top-1/3 right-1/4 w-72 h-72 rounded-full bg-blue-400/5 blur-3xl animate-pulse"
          style={{ animationDelay: '3s' }}
        />
      </div>

      <div
        className="pointer-events-none absolute inset-0 opacity-[0.35]"
        style={{
          backgroundImage: `
            linear-gradient(to right, #cbd5e1 1px, transparent 1px),
            linear-gradient(to bottom, #cbd5e1 1px, transparent 1px)
          `,
          backgroundSize: '48px 48px',
          maskImage: 'linear-gradient(to bottom, transparent 20%, black 50%, transparent 80%)',
          WebkitMaskImage: 'linear-gradient(to bottom, transparent 20%, black 50%, transparent 80%)',
        }}
      />

      {/* ================= FLOATING CARDS ================= */}
      <div
        className="pointer-events-none absolute hidden xl:block left-[5%] top-[22%] w-60"
        style={{ animation: 'float 6s ease-in-out infinite' }}
      >
        <div className="bg-white/80 backdrop-blur-md border border-slate-200/80 rounded-2xl p-4 shadow-xl shadow-slate-900/5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center">
              <BriefcaseBusiness size={19} className="text-blue-600" />
            </div>
            <div>
              <p className="text-xs font-semibold text-slate-900">Software Developer</p>
              <p className="text-[11px] text-slate-400 mt-0.5">Tech Solutions Inc.</p>
            </div>
          </div>
          <div className="mt-4 flex items-center justify-between">
            <span className="text-[10px] uppercase tracking-wider font-semibold text-slate-400">Status</span>
            <span className="px-2.5 py-1 rounded-full bg-blue-50 text-blue-600 text-[10px] font-semibold">Applied</span>
          </div>
        </div>
      </div>

      <div
        className="pointer-events-none absolute hidden xl:block right-[5%] top-[27%] w-64"
        style={{ animation: 'float 7s ease-in-out infinite', animationDelay: '1s' }}
      >
        <div className="bg-white/80 backdrop-blur-md border border-slate-200/80 rounded-2xl p-4 shadow-xl shadow-slate-900/5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center">
                <Clock3 size={19} className="text-amber-500" />
              </div>
              <div>
                <p className="text-xs font-semibold text-slate-900">Interview</p>
                <p className="text-[11px] text-slate-400 mt-0.5">Application progress</p>
              </div>
            </div>
            <CheckCircle2 size={17} className="text-emerald-500" />
          </div>
          <div className="mt-4">
            <div className="flex items-center justify-between text-[10px]">
              <span className="text-slate-400">Progress</span>
              <span className="font-semibold text-slate-600">65%</span>
            </div>
            <div className="mt-2 h-1.5 bg-slate-100 rounded-full overflow-hidden">
              <div className="h-full w-[65%] bg-blue-500 rounded-full" />
            </div>
          </div>
        </div>
      </div>

      <div
        className="pointer-events-none absolute hidden lg:block left-[10%] bottom-[16%]"
        style={{ animation: 'float 8s ease-in-out infinite', animationDelay: '2s' }}
      >
        <div className="flex items-center gap-3 bg-white/70 backdrop-blur-md border border-slate-200/70 rounded-xl px-4 py-3 shadow-lg shadow-slate-900/5">
          <div className="w-8 h-8 rounded-lg bg-emerald-50 flex items-center justify-center">
            <TrendingUp size={15} className="text-emerald-500" />
          </div>
          <div>
            <p className="text-[10px] uppercase tracking-wider font-semibold text-slate-400">Application Pipeline</p>
            <p className="text-xs font-semibold text-slate-700 mt-0.5">Track your progress</p>
          </div>
        </div>
      </div>

      <div
        className="pointer-events-none absolute hidden lg:block right-[10%] bottom-[15%]"
        style={{ animation: 'float 7s ease-in-out infinite', animationDelay: '3s' }}
      >
        <div className="flex items-center gap-3 bg-white/70 backdrop-blur-md border border-slate-200/70 rounded-xl px-4 py-3 shadow-lg shadow-slate-900/5">
          <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center">
            <FileText size={15} className="text-blue-500" />
          </div>
          <div>
            <p className="text-[10px] uppercase tracking-wider font-semibold text-slate-400">Applications</p>
            <p className="text-xs font-semibold text-slate-700 mt-0.5">Stay organized</p>
          </div>
        </div>
      </div>

      {/* ================= MAIN SPLIT CARD (slides in on mount) ================= */}
      <motion.main
        initial={{ opacity: 0, x: 60 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.45, ease: 'easeOut' }}
        className="relative z-10 w-full max-w-5xl"
      >
        <div className="mx-auto w-full h-[560px] flex rounded-3xl overflow-hidden shadow-xl shadow-slate-900/10 border border-slate-200/80 bg-white/95 backdrop-blur-xl">

          {/* LEFT — decorative brand panel */}
          <div className="hidden md:flex w-1/2 h-full relative overflow-hidden bg-blue-600 items-center justify-center px-12 py-16">
            <div className="absolute -bottom-24 -left-24 w-80 h-80 rounded-full bg-white/10 blur-3xl" />
            <div className="absolute top-10 -right-16 w-64 h-64 rounded-full bg-indigo-400/20 blur-3xl" />

            <div className="relative z-10 max-w-sm text-white">
              <div className="w-12 h-12 rounded-2xl bg-white/15 flex items-center justify-center mb-6">
                <BriefcaseBusiness size={22} strokeWidth={2} />
              </div>
              <h2 className="text-3xl md:text-4xl font-bold leading-tight mb-4">
                Forgot your password?
              </h2>
              <p className="text-white/70 text-base leading-relaxed">
                No worries, we'll send you a link to get back into your account.
              </p>
            </div>
          </div>

          {/* RIGHT — form panel */}
          <div className="flex-1 h-full flex items-center px-6 py-10 md:px-12 md:py-14">
            <div className="w-full max-w-sm mx-auto">

              {sent ? (
                <div className="text-center">
                  <div className="mx-auto w-14 h-14 rounded-2xl bg-emerald-50 flex items-center justify-center mb-6">
                    <CheckCircle2 size={28} className="text-emerald-500" />
                  </div>
                  <h2 className="text-xl md:text-2xl font-bold tracking-tight text-slate-950 mb-2">
                    Check your email
                  </h2>
                  <p className="text-sm text-slate-500 mb-8">
                    We sent a password reset link to <span className="font-semibold text-slate-700">{email}</span>.
                    Follow the link to set a new password.
                  </p>
                  <Link
                    href="/login"
                    className="inline-flex items-center justify-center gap-1.5 text-sm font-semibold text-blue-600 hover:text-blue-700 transition-colors"
                  >
                    <ArrowLeft size={14} />
                    Back to login
                  </Link>
                </div>
              ) : (
                <>
                  <div className="mb-6">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-2 h-2 rounded-full bg-blue-600" />
                      <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-blue-600">
                        Reset password
                      </p>
                    </div>
                    <h2 className="text-xl md:text-2xl font-bold tracking-tight text-slate-950">
                      Forgot your password?
                    </h2>
                    <p className="mt-2 text-sm text-slate-500">
                      Enter your email and we&apos;ll send you a reset link.
                    </p>
                  </div>

                  {error && (
                    <div role="alert" className="mb-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
                      {error}
                    </div>
                  )}

                  <form onSubmit={handleSubmit} noValidate className="space-y-5">
                    <div>
                      <label htmlFor="email" className="block text-sm font-semibold text-slate-700 mb-2">
                        Email
                      </label>
                      <div className="relative">
                        <Mail size={17} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                        <input
                          id="email"
                          name="email"
                          type="email"
                          value={email}
                          onChange={(e) => handleEmailChange(e.target.value)}
                          placeholder="you@example.com"
                          autoComplete="email"
                          disabled={loading}
                          className={`w-full h-11 pl-10 pr-4 rounded-xl border bg-white text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:ring-4 disabled:bg-slate-50 disabled:cursor-not-allowed ${
                            emailError
                              ? 'border-red-400 focus:border-red-400 focus:ring-red-100'
                              : 'border-slate-200 focus:border-blue-500 focus:ring-blue-500/10'
                          }`}
                        />
                      </div>
                      {emailError && (
                        <p className="flex items-center gap-1.5 text-xs text-red-500 mt-1.5">
                          <AlertCircle size={13} /> {emailError}
                        </p>
                      )}
                    </div>

                    <button
                      type="submit"
                      disabled={loading}
                      className="group w-full h-11 inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 text-white text-sm font-semibold shadow-sm shadow-blue-600/20 hover:bg-blue-700 hover:shadow-md disabled:opacity-60 disabled:cursor-not-allowed transition-all"
                    >
                      {loading ? (
                        <>
                          <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                          Sending...
                        </>
                      ) : (
                        <>
                          Send reset link
                          <ArrowRight size={17} strokeWidth={2.5} className="group-hover:translate-x-0.5 transition-transform" />
                        </>
                      )}
                    </button>
                  </form>

                  <Link
                    href="/login"
                    className="flex items-center justify-center gap-1.5 text-sm text-slate-500 hover:text-slate-700 mt-8 transition-colors"
                  >
                    <ArrowLeft size={14} />
                    Back to login
                  </Link>
                </>
              )}

            </div>
          </div>

        </div>

        <footer className="text-center mt-6">
          <p className="text-xs text-slate-400">Application Tracker · Software Engineering 2</p>
          <p className="text-[11px] text-slate-300 mt-1">Version 1.0.0</p>
        </footer>

      </motion.main>

    </div>
  );
}