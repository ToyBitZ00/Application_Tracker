'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { AnimatePresence, motion } from 'framer-motion';
import { Mail, Lock, User, Eye, EyeOff, ArrowRight, AlertCircle } from 'lucide-react';

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PASSWORD_ALLOWED_REGEX = /^[A-Za-z0-9!@#$%^&*()_\-+={}[\]:;"'<>,.?/~`|\\]+$/;
const DEBOUNCE_MS = 600;

type Field = 'fullName' | 'email' | 'password' | 'confirmPassword';
type Errors = Partial<Record<Field, string>>;

function validateEmail(email: string): string | undefined {
  if (!email.trim()) return undefined; // don't nag on empty until submit
  if (!EMAIL_REGEX.test(email)) return 'Enter a valid email address.';
  return undefined;
}

function validatePassword(password: string): string | undefined {
  if (!password) return undefined;
  if (password.length < 8) return 'Password must be at least 8 characters.';
  if (password.length > 64) return 'Password must be under 64 characters.';
  if (/\s/.test(password)) return 'Password cannot contain spaces.';
  if (!PASSWORD_ALLOWED_REGEX.test(password)) return 'Password contains unsupported characters.';
  if (!/[A-Za-z]/.test(password) || !/[0-9]/.test(password)) {
    return 'Password must include at least one letter and one number.';
  }
  return undefined;
}

function validateFullName(name: string): string | undefined {
  if (!name.trim()) return undefined;
  if (name.trim().length < 2) return 'Full name is too short.';
  if (!/^[A-Za-zÀ-ÿ.'\- ]+$/.test(name)) return 'Full name contains invalid characters.';
  return undefined;
}

// Required-field checks used only at submit time (empty fields shouldn't show errors while typing)
function validateEmailRequired(email: string): string | undefined {
  if (!email.trim()) return 'Email is required.';
  return validateEmail(email);
}
function validatePasswordRequired(password: string): string | undefined {
  if (!password) return 'Password is required.';
  return validatePassword(password);
}
function validateFullNameRequired(name: string): string | undefined {
  if (!name.trim()) return 'Full name is required.';
  return validateFullName(name);
}

export default function LoginPage() {
  const [mode, setMode] = useState<'login' | 'signup'>('login');
  const [showPassword, setShowPassword] = useState(false);
  const isLogin = mode === 'login';

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errors, setErrors] = useState<Errors>({});

  const timers = useRef<Partial<Record<Field, ReturnType<typeof setTimeout>>>>({});

  // Debounce a single field's live validation
  const scheduleValidation = (field: Field, validate: () => string | undefined) => {
    if (timers.current[field]) clearTimeout(timers.current[field]);
    timers.current[field] = setTimeout(() => {
      setErrors((prev) => ({ ...prev, [field]: validate() }));
    }, DEBOUNCE_MS);
  };

  useEffect(() => {
    // clear any pending timers on unmount
    return () => {
      Object.values(timers.current).forEach((t) => t && clearTimeout(t));
    };
  }, []);

  const handleFullNameChange = (value: string) => {
    setFullName(value);
    scheduleValidation('fullName', () => validateFullName(value));
  };

  const handleEmailChange = (value: string) => {
    setEmail(value);
    scheduleValidation('email', () => validateEmail(value));
  };

  const handlePasswordChange = (value: string) => {
    setPassword(value);
    scheduleValidation('password', () => validatePassword(value));
    // re-check confirm match live too, if it's already been touched
    if (!isLogin && confirmPassword) {
      scheduleValidation('confirmPassword', () =>
        confirmPassword !== value ? 'Passwords do not match.' : undefined
      );
    }
  };

  const handleConfirmPasswordChange = (value: string) => {
    setConfirmPassword(value);
    scheduleValidation('confirmPassword', () =>
      value !== password ? 'Passwords do not match.' : undefined
    );
  };

  const switchMode = (next: 'login' | 'signup') => {
    setMode(next);
    setErrors({});
    Object.values(timers.current).forEach((t) => t && clearTimeout(t));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    Object.values(timers.current).forEach((t) => t && clearTimeout(t));

    const nextErrors: Errors = {
      email: validateEmailRequired(email),
      password: validatePasswordRequired(password),
    };

    if (!isLogin) {
      nextErrors.fullName = validateFullNameRequired(fullName);
      if (confirmPassword !== password) {
        nextErrors.confirmPassword = 'Passwords do not match.';
      }
    }

    (Object.keys(nextErrors) as Field[]).forEach((k) => {
      if (nextErrors[k] === undefined) delete nextErrors[k];
    });

    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    // TODO: hook up Supabase auth here — validation passed
    console.log('Validated', { mode, fullName, email, password });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-paper px-4 py-10 md:px-6 md:py-12">
      <div className="w-full max-w-[1400px] h-[850px] rounded-3xl overflow-hidden shadow-[0_25px_70px_-15px_rgba(15,23,42,0.25)] border border-hairline flex flex-col md:flex-row bg-white">

        {/* DECORATIVE PANEL */}
        <div className="w-full md:w-1/2 h-full relative overflow-hidden bg-ink flex items-center justify-center px-8 py-10 md:px-16">
          <div className="absolute -bottom-24 -left-24 w-96 h-96 rounded-full bg-coral/30 blur-3xl" />
          <div className="absolute top-10 -right-16 w-72 h-72 rounded-full bg-offer/20 blur-3xl" />

          <AnimatePresence mode="wait">
            <motion.div
              key={mode}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.35 }}
              className="relative z-10 max-w-md text-center md:text-left"
            >
              <h2 className="font-display text-4xl md:text-5xl text-white leading-tight mb-5 md:mb-6">
                {isLogin ? 'Ready to track your progress?' : 'Companies are waiting for you.'}
              </h2>
              <p className="text-white/60 text-lg md:text-xl leading-relaxed">
                {isLogin
                  ? 'Log back in to see where every application stands.'
                  : 'Create an account and get matched with internship openings for your course.'}
              </p>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* FORM PANEL */}
        <div className="flex-1 h-full flex items-center justify-center px-6 py-10 md:px-20 overflow-y-auto">
          <div className="w-full max-w-lg">
            <div className="text-center mb-10 md:mb-12">
              <h1 className="font-display text-4xl md:text-4xl text-ink mb-3">
                {isLogin ? 'Welcome back' : 'Create your account'}
              </h1>
              <p className="text-slate text-base md:text-lg">
                {isLogin ? 'Log in to keep your applications on track.' : 'Start tracking your OJT search.'}
              </p>
            </div>

            <AnimatePresence mode="wait">
              <motion.form
                key={mode}
                onSubmit={handleSubmit}
                noValidate
                initial={{ opacity: 0, x: isLogin ? -16 : 16 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: isLogin ? 16 : -16 }}
                transition={{ duration: 0.3 }}
                className="space-y-5 md:space-y-6"
              >
                {!isLogin && (
                  <div>
                    <label className="block text-sm font-semibold uppercase tracking-wide text-slate mb-2">
                      Full name
                    </label>
                    <div className="relative">
                      <User size={22} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate" />
                      <input
                        type="text"
                        value={fullName}
                        onChange={(e) => handleFullNameChange(e.target.value)}
                        placeholder="Juan Dela Cruz"
                        className={`w-full h-16 pl-12 pr-4 rounded-xl border bg-white text-ink text-lg outline-none focus:ring-4 transition ${
                          errors.fullName
                            ? 'border-red-400 focus:border-red-400 focus:ring-red-100'
                            : 'border-hairline focus:border-ink/40 focus:ring-ink/5'
                        }`}
                      />
                    </div>
                    {errors.fullName && (
                      <p className="flex items-center gap-1.5 text-sm text-red-500 mt-2">
                        <AlertCircle size={14} /> {errors.fullName}
                      </p>
                    )}
                  </div>
                )}

                <div>
                  <label className="block text-sm font-semibold uppercase tracking-wide text-slate mb-2">
                    Email
                  </label>
                  <div className="relative">
                    <Mail size={22} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate" />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => handleEmailChange(e.target.value)}
                      placeholder="you@example.com"
                      className={`w-full h-16 pl-12 pr-4 rounded-xl border bg-white text-ink text-lg outline-none focus:ring-4 transition ${
                        errors.email
                          ? 'border-red-400 focus:border-red-400 focus:ring-red-100'
                          : 'border-hairline focus:border-ink/40 focus:ring-ink/5'
                      }`}
                    />
                  </div>
                  {errors.email && (
                    <p className="flex items-center gap-1.5 text-sm text-red-500 mt-2">
                      <AlertCircle size={14} /> {errors.email}
                    </p>
                  )}
                </div>

                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-sm font-semibold uppercase tracking-wide text-slate">
                      Password
                    </label>
                    {isLogin && (
                      <Link href="/forgot-password" className="text-sm font-semibold text-coral hover:opacity-70">
                        Forgot password?
                      </Link>
                    )}
                  </div>
                  <div className="relative">
                    <Lock size={22} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => handlePasswordChange(e.target.value)}
                      placeholder="••••••••"
                      className={`w-full h-16 pl-12 pr-12 rounded-xl border bg-white text-ink text-lg outline-none focus:ring-4 transition ${
                        errors.password
                          ? 'border-red-400 focus:border-red-400 focus:ring-red-100'
                          : 'border-hairline focus:border-ink/40 focus:ring-ink/5'
                      }`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((v) => !v)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-slate hover:text-ink"
                    >
                      {showPassword ? <EyeOff size={22} /> : <Eye size={22} />}
                    </button>
                  </div>
                  {errors.password ? (
                    <p className="flex items-center gap-1.5 text-sm text-red-500 mt-2">
                      <AlertCircle size={14} /> {errors.password}
                    </p>
                  ) : (
                    !isLogin && (
                      <p className="text-sm text-slate mt-2">
                        At least 8 characters, with letters and numbers.
                      </p>
                    )
                  )}
                </div>

                {!isLogin && (
                  <div>
                    <label className="block text-sm font-semibold uppercase tracking-wide text-slate mb-2">
                      Confirm password
                    </label>
                    <div className="relative">
                      <Lock size={22} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate" />
                      <input
                        type={showPassword ? 'text' : 'password'}
                        value={confirmPassword}
                        onChange={(e) => handleConfirmPasswordChange(e.target.value)}
                        placeholder="••••••••"
                        className={`w-full h-16 pl-12 pr-4 rounded-xl border bg-white text-ink text-lg outline-none focus:ring-4 transition ${
                          errors.confirmPassword
                            ? 'border-red-400 focus:border-red-400 focus:ring-red-100'
                            : 'border-hairline focus:border-ink/40 focus:ring-ink/5'
                        }`}
                      />
                    </div>
                    {errors.confirmPassword && (
                      <p className="flex items-center gap-1.5 text-sm text-red-500 mt-2">
                        <AlertCircle size={14} /> {errors.confirmPassword}
                      </p>
                    )}
                  </div>
                )}

                <button
                  type="submit"
                  className="w-full flex items-center justify-center gap-2 h-16 rounded-xl bg-gradient-to-r from-blue-600 to-blue-500 text-white font-bold text-lg hover:opacity-70 transition-opacity mt-2"
                >
                  {isLogin ? 'Log in' : 'Create account'}
                  <ArrowRight size={20} />
                </button>
              </motion.form>
            </AnimatePresence>

            <p className="text-center text-base md:text-lg text-slate mt-10">
              {isLogin ? "Don't have an account?" : 'Already have an account?'}{' '}
              <button
                type="button"
                onClick={() => switchMode(isLogin ? 'signup' : 'login')}
                className="font-semibold text-ink hover:text-coral"
              >
                {isLogin ? 'Sign up' : 'Log in'}
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}