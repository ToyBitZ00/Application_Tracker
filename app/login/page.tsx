'use client';

import Link from 'next/link';
import {
  Mail,
  Lock,
  ArrowRight,
  BriefcaseBusiness,
  CheckCircle2,
  Clock3,
  FileText,
  TrendingUp,
} from 'lucide-react';

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
    <div className="relative min-h-screen overflow-hidden bg-[#f5f7fb] flex items-center justify-center px-5 py-10">

      {/* ================= BACKGROUND DESIGN ================= */}

      {/* Soft animated glow */}
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


      {/* Subtle grid */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.35]"
        style={{
          backgroundImage: `
            linear-gradient(to right, #cbd5e1 1px, transparent 1px),
            linear-gradient(to bottom, #cbd5e1 1px, transparent 1px)
          `,
          backgroundSize: '48px 48px',
          maskImage:
            'linear-gradient(to bottom, transparent, black 20%, black 80%, transparent)',
        }}
      />


      {/* ================= FLOATING APPLICATION CARDS ================= */}

      {/* Left card */}
      <div
        className="pointer-events-none absolute hidden xl:block left-[5%] top-[22%] w-60"
        style={{
          animation: 'float 6s ease-in-out infinite',
        }}
      >
        <div className="bg-white/80 backdrop-blur-md border border-slate-200/80 rounded-2xl p-4 shadow-xl shadow-slate-900/5">

          <div className="flex items-center gap-3">

            <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center">
              <BriefcaseBusiness
                size={19}
                className="text-blue-600"
              />
            </div>

            <div>
              <p className="text-xs font-semibold text-slate-900">
                Software Developer
              </p>

              <p className="text-[11px] text-slate-400 mt-0.5">
                Tech Solutions Inc.
              </p>
            </div>

          </div>

          <div className="mt-4 flex items-center justify-between">

            <span className="text-[10px] uppercase tracking-wider font-semibold text-slate-400">
              Status
            </span>

            <span className="px-2.5 py-1 rounded-full bg-blue-50 text-blue-600 text-[10px] font-semibold">
              Applied
            </span>

          </div>

        </div>
      </div>


      {/* Right card */}
      <div
        className="pointer-events-none absolute hidden xl:block right-[5%] top-[27%] w-64"
        style={{
          animation: 'float 7s ease-in-out infinite',
          animationDelay: '1s',
        }}
      >
        <div className="bg-white/80 backdrop-blur-md border border-slate-200/80 rounded-2xl p-4 shadow-xl shadow-slate-900/5">

          <div className="flex items-center justify-between">

            <div className="flex items-center gap-3">

              <div className="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center">
                <Clock3
                  size={19}
                  className="text-amber-500"
                />
              </div>

              <div>
                <p className="text-xs font-semibold text-slate-900">
                  Interview
                </p>

                <p className="text-[11px] text-slate-400 mt-0.5">
                  Application progress
                </p>
              </div>

            </div>

            <CheckCircle2
              size={17}
              className="text-emerald-500"
            />

          </div>

          <div className="mt-4">

            <div className="flex items-center justify-between text-[10px]">
              <span className="text-slate-400">
                Progress
              </span>

              <span className="font-semibold text-slate-600">
                65%
              </span>
            </div>

            <div className="mt-2 h-1.5 bg-slate-100 rounded-full overflow-hidden">

              <div className="h-full w-[65%] bg-blue-500 rounded-full" />

            </div>

          </div>

        </div>
      </div>


      {/* Bottom left mini card */}
      <div
        className="pointer-events-none absolute hidden lg:block left-[10%] bottom-[16%]"
        style={{
          animation: 'float 8s ease-in-out infinite',
          animationDelay: '2s',
        }}
      >
        <div className="flex items-center gap-3 bg-white/70 backdrop-blur-md border border-slate-200/70 rounded-xl px-4 py-3 shadow-lg shadow-slate-900/5">

          <div className="w-8 h-8 rounded-lg bg-emerald-50 flex items-center justify-center">
            <TrendingUp
              size={15}
              className="text-emerald-500"
            />
          </div>

          <div>
            <p className="text-[10px] uppercase tracking-wider font-semibold text-slate-400">
              Application Pipeline
            </p>

            <p className="text-xs font-semibold text-slate-700 mt-0.5">
              Track your progress
            </p>
          </div>

        </div>
      </div>


      {/* Bottom right mini card */}
      <div
        className="pointer-events-none absolute hidden lg:block right-[10%] bottom-[15%]"
        style={{
          animation: 'float 7s ease-in-out infinite',
          animationDelay: '3s',
        }}
      >
        <div className="flex items-center gap-3 bg-white/70 backdrop-blur-md border border-slate-200/70 rounded-xl px-4 py-3 shadow-lg shadow-slate-900/5">

          <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center">
            <FileText
              size={15}
              className="text-blue-500"
            />
          </div>

          <div>
            <p className="text-[10px] uppercase tracking-wider font-semibold text-slate-400">
              Applications
            </p>

            <p className="text-xs font-semibold text-slate-700 mt-0.5">
              Stay organized
            </p>
          </div>

        </div>
      </div>


      {/* ================= MAIN CONTENT ================= */}

      <main className="relative z-10 w-full max-w-md">

        {/* Logo / Brand */}
        <div className="text-center mb-8">

          <div className="mx-auto w-12 h-12 rounded-2xl bg-blue-600 flex items-center justify-center shadow-sm shadow-blue-600/20">
            <BriefcaseBusiness
              size={23}
              className="text-white"
              strokeWidth={2}
            />
          </div>

          <h1 className="mt-5 text-2xl md:text-3xl font-bold tracking-tight text-slate-950">
            Application Tracker
          </h1>

          <p className="mt-2 text-sm text-slate-500">
            Manage your OJT and internship applications.
          </p>

        </div>


        {/* Login Card */}
        <section className="bg-white/95 backdrop-blur-xl border border-slate-200/80 rounded-2xl p-6 md:p-7 shadow-xl shadow-slate-900/5">

          {/* Header */}
          <div className="mb-6">

            <div className="flex items-center gap-2 mb-2">

              <div className="w-2 h-2 rounded-full bg-blue-600" />

              <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-blue-600">
                Welcome back
              </p>

            </div>

            <h2 className="text-xl md:text-2xl font-bold tracking-tight text-slate-950">
              Sign in to your account
            </h2>

            <p className="mt-2 text-sm text-slate-500">
              Enter your account details to continue.
            </p>

          </div>


          {/* Form */}
          <form className="space-y-5">

            {/* Email */}
            <div>

              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Email Address
              </label>

              <div className="relative">

                <Mail
                  size={17}
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
                />

                <input
                  type="email"
                  placeholder="you@example.com"
                  className="w-full h-11 pl-10 pr-4 rounded-xl border border-slate-200 bg-white text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
                />

              </div>

            </div>


            {/* Password */}
            <div>

              <div className="flex items-center justify-between mb-2">

                <label className="block text-sm font-semibold text-slate-700">
                  Password
                </label>

                <Link
                  href="/forgot-password"
                  className="text-xs font-semibold text-blue-600 hover:text-blue-700 transition"
                >
                  Forgot password?
                </Link>

              </div>

              <div className="relative">

                <Lock
                  size={17}
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
                />

                <input
                  type="password"
                  placeholder="Enter your password"
                  className="w-full h-11 pl-10 pr-4 rounded-xl border border-slate-200 bg-white text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
                />

              </div>

            </div>


            {/* Remember Me */}
            <div className="flex items-center gap-2">

              <input
                id="remember"
                type="checkbox"
                className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
              />

              <label
                htmlFor="remember"
                className="text-xs text-slate-500"
              >
                Remember me
              </label>

            </div>


            {/* Login Button */}
            <button
              type="submit"
              className="group w-full h-11 inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 text-white text-sm font-semibold shadow-sm shadow-blue-600/20 hover:bg-blue-700 hover:shadow-md transition-all"
            >
              Sign In

              <ArrowRight
                size={17}
                strokeWidth={2.5}
                className="group-hover:translate-x-0.5 transition-transform"
              />

            </button>

          </form>


          {/* Register */}
          <div className="mt-6 pt-6 border-t border-slate-100 text-center">

            <p className="text-sm text-slate-500">
              Don't have an account?{' '}

              <Link
                href="/register"
                className="font-semibold text-blue-600 hover:text-blue-700 transition"
              >
                Create an account
              </Link>
            </p>

          </div>

        </section>


        {/* Footer */}
        <footer className="text-center mt-6">

          <p className="text-xs text-slate-400">
            Application Tracker · Software Engineering 2
          </p>

          <p className="text-[11px] text-slate-300 mt-1">
            Version 1.0.0
          </p>

        </footer>

      </main>


      {/* Animation */}
      <style jsx>{`
        @keyframes float {
          0%,
          100% {
            transform: translateY(0px);
          }

          50% {
            transform: translateY(-12px);
          }
        }
      `}</style>

    </div>
  );
}