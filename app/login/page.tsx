'use client';

import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  AnimatePresence,
  motion,
  useAnimation,
} from 'framer-motion';

import {
  Lock,
  User,
  ArrowRight,
  AlertCircle,
  Eye,
  EyeOff,
  BriefcaseBusiness,
  CheckCircle2,
  Clock3,
  FileText,
  TrendingUp,
} from 'lucide-react';

import { createClient } from '@/lib/supabase/client';
import { setStoredApplicationUser } from '@/lib/application-session';

const DEBOUNCE_MS = 600;

const USERNAME_ALLOWED_REGEX =
  /^[A-Za-z0-9_.-]+$/;

const PASSWORD_ALLOWED_REGEX =
  /^[A-Za-z0-9!@#$%^&*()_\-+={}[\]:;"'<>,.?/~`|\\]+$/;

type Field =
  | 'fullName'
  | 'username'
  | 'password'
  | 'confirmPassword';

type Errors = Partial<Record<Field, string>>;

// ============================================================
// VALIDATION
// ============================================================

function validateFullName(
  name: string
): string | undefined {
  if (!name.trim()) return undefined;

  if (name.trim().length < 2) {
    return 'Full name is too short.';
  }

  if (!/^[A-Za-zÀ-ÿ.'\- ]+$/.test(name)) {
    return 'Full name contains invalid characters.';
  }

  return undefined;
}

function validateUsername(
  username: string
): string | undefined {
  if (!username.trim()) return undefined;

  if (username.trim().length < 3) {
    return 'Username must be at least 3 characters.';
  }

  if (username.length > 32) {
    return 'Username must be under 32 characters.';
  }

  if (/\s/.test(username)) {
    return 'Username cannot contain spaces.';
  }

  if (!USERNAME_ALLOWED_REGEX.test(username)) {
    return 'Only letters, numbers, . _ and - are allowed.';
  }

  return undefined;
}

function validatePassword(
  password: string
): string | undefined {
  if (!password) return undefined;

  if (password.length < 8) {
    return 'Password must be at least 8 characters.';
  }

  if (password.length > 64) {
    return 'Password must be under 64 characters.';
  }

  if (/\s/.test(password)) {
    return 'Password cannot contain spaces.';
  }

  if (!PASSWORD_ALLOWED_REGEX.test(password)) {
    return 'Password contains unsupported characters.';
  }

  if (!/[A-Za-z]/.test(password)) {
    return 'Password must include at least one letter.';
  }

  if (!/[0-9]/.test(password)) {
    return 'Password must include at least one number.';
  }

  return undefined;
}

function validateFullNameRequired(
  name: string
): string | undefined {
  if (!name.trim()) {
    return 'Full name is required.';
  }

  return validateFullName(name);
}

function validateUsernameRequired(
  username: string
): string | undefined {
  if (!username.trim()) {
    return 'Username is required.';
  }

  return validateUsername(username);
}

function validatePasswordRequired(
  password: string
): string | undefined {
  if (!password) {
    return 'Password is required.';
  }

  return validatePassword(password);
}

// ============================================================
// PAGE
// ============================================================

export default function LoginPage() {
  const router = useRouter();

  const supabase = createClient();

  // ==========================================================
  // MODE
  // ==========================================================

  const [mode, setMode] =
    useState<'login' | 'signup'>('login');

  const isLogin = mode === 'login';

  // ==========================================================
  // FORM STATE
  // ==========================================================

  const [fullName, setFullName] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] =
    useState('');
  const [showPassword, setShowPassword] =
    useState(false);
  const [
    showConfirmPassword,
    setShowConfirmPassword,
  ] = useState(false);

  // ==========================================================
  // UI STATE
  // ==========================================================

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [errors, setErrors] = useState<Errors>({});
  const [showSuccess, setShowSuccess] =
    useState(false);

  // ==========================================================
  // ANIMATION
  // ==========================================================

  const loginShake = useAnimation();
  const signupShake = useAnimation();

  const triggerShake = async (
    controls: ReturnType<typeof useAnimation>
  ) => {
    await controls.start({
      x: [0, -8, 8, -6, 6, -3, 3, 0],
      transition: {
        duration: 0.45,
        ease: 'easeInOut',
      },
    });
  };

  // ==========================================================
  // TIMERS
  // ==========================================================

  const timers = useRef<
    Partial<
      Record<Field, ReturnType<typeof setTimeout>>
    >
  >({});

  const redirectTimer = useRef<
    ReturnType<typeof setTimeout> | null
  >(null);

  // ==========================================================
  // VALIDATION
  // ==========================================================

  const scheduleValidation = (
    field: Field,
    validate: () => string | undefined
  ) => {
    if (timers.current[field]) {
      clearTimeout(timers.current[field]);
    }

    timers.current[field] = setTimeout(() => {
      const message = validate();

      setErrors((prev) => {
        const next = { ...prev };

        if (message) {
          next[field] = message;
        } else {
          delete next[field];
        }

        return next;
      });
    }, DEBOUNCE_MS);
  };

  // ==========================================================
  // CLEANUP
  // ==========================================================

  useEffect(() => {
    return () => {
      Object.values(timers.current).forEach(
        (timer) => {
          if (timer) clearTimeout(timer);
        }
      );

      if (redirectTimer.current) {
        clearTimeout(redirectTimer.current);
      }
    };
  }, []);

  // ==========================================================
  // INPUT HANDLERS
  // ==========================================================

  const handleFullNameChange = (
    value: string
  ) => {
    setFullName(value);

    scheduleValidation(
      'fullName',
      () => validateFullName(value)
    );
  };

  const handleUsernameChange = (
    value: string
  ) => {
    setUsername(value);

    scheduleValidation(
      'username',
      () => validateUsername(value)
    );
  };

  const handlePasswordChange = (
    value: string
  ) => {
    setPassword(value);

    scheduleValidation(
      'password',
      () => validatePassword(value)
    );

    if (!isLogin && confirmPassword) {
      scheduleValidation(
        'confirmPassword',
        () =>
          confirmPassword !== value
            ? 'Passwords do not match.'
            : undefined
      );
    }
  };

  const handleConfirmPasswordChange = (
    value: string
  ) => {
    setConfirmPassword(value);

    scheduleValidation(
      'confirmPassword',
      () =>
        value !== password
          ? 'Passwords do not match.'
          : undefined
    );
  };

  // ==========================================================
  // CLEAR VALIDATION TIMERS
  // ==========================================================

  const clearValidationTimers = () => {
    Object.values(timers.current).forEach(
      (timer) => {
        if (timer) clearTimeout(timer);
      }
    );

    timers.current = {};
  };

  // ==========================================================
  // SWITCH LOGIN / SIGNUP
  // ==========================================================

  const switchMode = (
    next: 'login' | 'signup'
  ) => {
    if (loading) return;

    clearValidationTimers();

    setMode(next);
    setError('');
    setErrors({});

    setPassword('');
    setConfirmPassword('');
    setShowPassword(false);
    setShowConfirmPassword(false);

    if (next === 'login') {
      setFullName('');
    }
  };

  // ==========================================================
  // SAVE USER LOCALLY
  // ==========================================================

  const saveCurrentUser = (
    user: {
      id: string;
      username: string;
      full_name: string;
      account_role?: 'user' | 'admin' | 'super_admin';
      is_blocked?: boolean;
    }
  ) => {
    const currentUser = {
      id: user.id,
      username: user.username,
      fullName: user.full_name,
      role: user.account_role || 'user',
      isBlocked: Boolean(user.is_blocked),
    };

    setStoredApplicationUser(currentUser);

    return currentUser;
  };

  // ==========================================================
  // LOGIN
  // ==========================================================

  const handleLogin = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();

    if (loading) return;

    clearValidationTimers();

    const nextErrors: Errors = {};

    const usernameError =
      validateUsernameRequired(username);

    const passwordError =
      validatePasswordRequired(password);

    if (usernameError) {
      nextErrors.username = usernameError;
    }

    if (passwordError) {
      nextErrors.password = passwordError;
    }

    setErrors(nextErrors);

    if (Object.keys(nextErrors).length > 0) {
      await triggerShake(loginShake);
      return;
    }

    setLoading(true);
    setError('');

    try {
      // ======================================================
      // LOGIN THROUGH SUPABASE RPC
      // ======================================================

      const { data, error: loginError } =
        await supabase.rpc(
          'login_application_user',
          {
            p_username: username
              .trim()
              .toLowerCase(),

            p_password: password,
          }
        );

      if (loginError) {
        console.error(
          'Login RPC error:',
          loginError
        );

        setError(
          'Invalid username or password.'
        );

        setLoading(false);

        await triggerShake(loginShake);

        return;
      }

      if (data?.blocked) {
        setError(
          'This account is blocked. Please contact an administrator.'
        );

        setLoading(false);

        await triggerShake(loginShake);

        return;
      }

      if (!data?.success) {
        setError(
          'Invalid username or password.'
        );

        setLoading(false);

        await triggerShake(loginShake);

        return;
      }

      // ======================================================
      // SAVE USER
      // ======================================================

      const currentUser =
        saveCurrentUser(data);

      // ======================================================
      // SUCCESS
      // ======================================================

      setLoading(false);
      setShowSuccess(true);

      redirectTimer.current =
        setTimeout(() => {
          router.push(
            currentUser.role === 'admin' ||
              currentUser.role ===
                'super_admin'
              ? '/admin/dashboard'
              : '/dashboard'
          );
          router.refresh();
        }, 1600);

    } catch (err) {
      console.error(
        'Login error:',
        err
      );

      setError(
        'Something went wrong. Please try again.'
      );

      setLoading(false);

      await triggerShake(loginShake);
    }
  };

  // ==========================================================
  // SIGNUP
  // ==========================================================

  const handleSignup = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();

    if (loading) return;

    clearValidationTimers();

    const nextErrors: Errors = {};

    const fullNameError =
      validateFullNameRequired(fullName);

    const usernameError =
      validateUsernameRequired(username);

    const passwordError =
      validatePasswordRequired(password);

    if (fullNameError) {
      nextErrors.fullName = fullNameError;
    }

    if (usernameError) {
      nextErrors.username = usernameError;
    }

    if (passwordError) {
      nextErrors.password = passwordError;
    }

    if (!confirmPassword) {
      nextErrors.confirmPassword =
        'Please confirm your password.';
    } else if (
      confirmPassword !== password
    ) {
      nextErrors.confirmPassword =
        'Passwords do not match.';
    }

    setErrors(nextErrors);

    if (Object.keys(nextErrors).length > 0) {
      await triggerShake(signupShake);
      return;
    }

    setLoading(true);
    setError('');

    try {
      // ======================================================
      // CREATE ACCOUNT IN SUPABASE
      // ======================================================

      const { data, error: signupError } =
        await supabase.rpc(
          'create_application_user',
          {
            p_full_name: fullName.trim(),

            p_username: username
              .trim()
              .toLowerCase(),

            p_password: password,
          }
        );

      if (signupError) {
        console.error(
          'Signup RPC error:',
          signupError
        );

        const message =
          signupError.message?.toLowerCase() ||
          '';

        if (
          message.includes(
            'username already exists'
          )
        ) {
          setError(
            'Username already exists. Please choose another one.'
          );
        } else {
          setError(
            signupError.message ||
              'Unable to create your account.'
          );
        }

        setLoading(false);

        await triggerShake(signupShake);

        return;
      }

      if (!data?.success) {
        setError(
          'Account could not be created.'
        );

        setLoading(false);

        await triggerShake(signupShake);

        return;
      }

      // ======================================================
      // SAVE NEW USER LOCALLY
      // ======================================================

      saveCurrentUser(data);

      // ======================================================
      // SUCCESS
      // ======================================================

      setLoading(false);
      setShowSuccess(true);

      redirectTimer.current =
        setTimeout(() => {
          router.push('/dashboard');
          router.refresh();
        }, 1600);

    } catch (err) {
      console.error(
        'Signup error:',
        err
      );

      setError(
        'Something went wrong. Please try again.'
      );

      setLoading(false);

      await triggerShake(signupShake);
    }
  };

  // ==========================================================
  // UI
  // ==========================================================

  return (
    <div className="application-login-page relative min-h-screen overflow-hidden bg-[#f5f7fb] flex items-center justify-center px-5 py-10">

      {/* BACKGROUND */}

      <div className="pointer-events-none absolute inset-0 overflow-hidden">

        <div
          className="
            absolute
            -top-40
            -left-40
            w-[420px]
            h-[420px]
            rounded-full
            bg-blue-500/10
            blur-3xl
            animate-pulse
          "
        />

        <div
          className="
            absolute
            -bottom-48
            -right-40
            w-[500px]
            h-[500px]
            rounded-full
            bg-indigo-500/10
            blur-3xl
            animate-pulse
          "
          style={{
            animationDelay: '1.5s',
          }}
        />

        <div
          className="
            absolute
            top-1/3
            right-1/4
            w-72
            h-72
            rounded-full
            bg-blue-400/5
            blur-3xl
            animate-pulse
          "
          style={{
            animationDelay: '3s',
          }}
        />

      </div>

      {/* GRID */}

      <div
        className="
          pointer-events-none
          absolute
          inset-0
          opacity-[0.35]
        "
        style={{
          backgroundImage: `
            linear-gradient(
              to right,
              #cbd5e1 1px,
              transparent 1px
            ),
            linear-gradient(
              to bottom,
              #cbd5e1 1px,
              transparent 1px
            )
          `,
          backgroundSize: '48px 48px',
          maskImage:
            'linear-gradient(to bottom, transparent 20%, black 50%, transparent 80%)',
          WebkitMaskImage:
            'linear-gradient(to bottom, transparent 20%, black 50%, transparent 80%)',
        }}
      />

      {/* FLOATING CARD 1 */}

      <div
        className="
          pointer-events-none
          absolute
          hidden
          xl:block
          left-[5%]
          top-[22%]
          w-60
        "
        style={{
          animation:
            'float 6s ease-in-out infinite',
        }}
      >
        <div
          className="
            bg-white/80
            backdrop-blur-md
            border
            border-slate-200/80
            rounded-2xl
            p-4
            shadow-xl
            shadow-slate-900/5
          "
        >
          <div className="flex items-center gap-3">

            <div
              className="
                w-10
                h-10
                rounded-xl
                bg-blue-50
                flex
                items-center
                justify-center
              "
            >
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

            <span
              className="
                text-[10px]
                uppercase
                tracking-wider
                font-semibold
                text-slate-400
              "
            >
              Status
            </span>

            <span
              className="
                px-2.5
                py-1
                rounded-full
                bg-blue-50
                text-blue-600
                text-[10px]
                font-semibold
              "
            >
              Applied
            </span>

          </div>
        </div>
      </div>

      {/* FLOATING CARD 2 */}

      <div
        className="
          pointer-events-none
          absolute
          hidden
          xl:block
          right-[5%]
          top-[27%]
          w-64
        "
        style={{
          animation:
            'float 7s ease-in-out infinite',
          animationDelay: '1s',
        }}
      >
        <div
          className="
            bg-white/80
            backdrop-blur-md
            border
            border-slate-200/80
            rounded-2xl
            p-4
            shadow-xl
            shadow-slate-900/5
          "
        >
          <div className="flex items-center justify-between">

            <div className="flex items-center gap-3">

              <div
                className="
                  w-10
                  h-10
                  rounded-xl
                  bg-amber-50
                  flex
                  items-center
                  justify-center
                "
              >
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

            <div
              className="
                flex
                items-center
                justify-between
                text-[10px]
              "
            >
              <span className="text-slate-400">
                Progress
              </span>

              <span className="font-semibold text-slate-600">
                65%
              </span>
            </div>

            <div
              className="
                mt-2
                h-1.5
                bg-slate-100
                rounded-full
                overflow-hidden
              "
            >
              <div
                className="
                  h-full
                  w-[65%]
                  bg-blue-500
                  rounded-full
                "
              />
            </div>

          </div>
        </div>
      </div>

      {/* FLOATING CARD 3 */}

      <div
        className="
          pointer-events-none
          absolute
          hidden
          lg:block
          left-[10%]
          bottom-[16%]
        "
        style={{
          animation:
            'float 8s ease-in-out infinite',
          animationDelay: '2s',
        }}
      >
        <div
          className="
            flex
            items-center
            gap-3
            bg-white/70
            backdrop-blur-md
            border
            border-slate-200/70
            rounded-xl
            px-4
            py-3
            shadow-lg
            shadow-slate-900/5
          "
        >

          <div
            className="
              w-8
              h-8
              rounded-lg
              bg-emerald-50
              flex
              items-center
              justify-center
            "
          >
            <TrendingUp
              size={15}
              className="text-emerald-500"
            />
          </div>

          <div>

            <p
              className="
                text-[10px]
                uppercase
                tracking-wider
                font-semibold
                text-slate-400
              "
            >
              Application Pipeline
            </p>

            <p className="text-xs font-semibold text-slate-700 mt-0.5">
              Track your progress
            </p>

          </div>

        </div>
      </div>

      {/* FLOATING CARD 4 */}

      <div
        className="
          pointer-events-none
          absolute
          hidden
          lg:block
          right-[10%]
          bottom-[15%]
        "
        style={{
          animation:
            'float 7s ease-in-out infinite',
          animationDelay: '3s',
        }}
      >
        <div
          className="
            flex
            items-center
            gap-3
            bg-white/70
            backdrop-blur-md
            border
            border-slate-200/70
            rounded-xl
            px-4
            py-3
            shadow-lg
            shadow-slate-900/5
          "
        >

          <div
            className="
              w-8
              h-8
              rounded-lg
              bg-blue-50
              flex
              items-center
              justify-center
            "
          >
            <FileText
              size={15}
              className="text-blue-500"
            />
          </div>

          <div>

            <p
              className="
                text-[10px]
                uppercase
                tracking-wider
                font-semibold
                text-slate-400
              "
            >
              Applications
            </p>

            <p className="text-xs font-semibold text-slate-700 mt-0.5">
              Stay organized
            </p>

          </div>

        </div>
      </div>

      {/* MAIN */}

      <main
        className="
          relative
          z-10
          w-full
          max-w-5xl
        "
      >

        <div
          className="
            mx-auto
            w-full
            h-[780px]
            flex
            rounded-3xl
            overflow-hidden
            shadow-xl
            shadow-slate-900/10
            border
            border-slate-200/80
            bg-white/95
            backdrop-blur-xl
          "
        >

          {/* LEFT PANEL */}

          <div
            className="
              hidden
              md:flex
              w-1/2
              h-full
              relative
              overflow-hidden
              bg-blue-600
              items-center
              justify-center
              px-12
              py-16
            "
          >

            <div
              className="
                absolute
                -bottom-24
                -left-24
                w-80
                h-80
                rounded-full
                bg-white/10
                blur-3xl
              "
            />

            <div
              className="
                absolute
                top-10
                -right-16
                w-64
                h-64
                rounded-full
                bg-indigo-400/20
                blur-3xl
              "
            />

            <AnimatePresence mode="wait">

              <motion.div
                key={mode}
                initial={{
                  opacity: 0,
                  y: 12,
                }}
                animate={{
                  opacity: 1,
                  y: 0,
                }}
                exit={{
                  opacity: 0,
                  y: -12,
                }}
                transition={{
                  duration: 0.35,
                }}
                className="
                  relative
                  z-10
                  max-w-sm
                  text-white
                "
              >

                <div
                  className="
                    w-12
                    h-12
                    rounded-2xl
                    bg-white/15
                    flex
                    items-center
                    justify-center
                    mb-6
                  "
                >
                  <BriefcaseBusiness
                    size={22}
                  />
                </div>

                <h2
                  className="
                    text-3xl
                    md:text-4xl
                    font-bold
                    leading-tight
                    mb-4
                  "
                >
                  {isLogin
                    ? 'Ready to track your progress?'
                    : 'Companies are waiting for you.'}
                </h2>

                <p
                  className="
                    text-white/70
                    text-base
                    leading-relaxed
                  "
                >
                  {isLogin
                    ? 'Log back in to see where every application stands.'
                    : 'Create an account and get matched with internship openings for your course.'}
                </p>

              </motion.div>

            </AnimatePresence>

          </div>

          {/* RIGHT PANEL */}

          <div
            className="
              flex-1
              h-full
              flex
              items-center
              px-6
              py-10
              md:px-12
              md:py-14
              overflow-y-auto
              [scrollbar-width:none]
              [&::-webkit-scrollbar]:hidden
            "
          >

            <div className="w-full max-w-sm mx-auto">

              {/* HEADER */}

              <div className="mb-6">

                <div className="flex items-center gap-2 mb-2">

                  <div
                    className="
                      w-2
                      h-2
                      rounded-full
                      bg-blue-600
                    "
                  />

                  <p
                    className="
                      text-[11px]
                      font-bold
                      uppercase
                      tracking-[0.18em]
                      text-blue-600
                    "
                  >
                    {isLogin
                      ? 'Welcome back'
                      : 'Get started'}
                  </p>

                </div>

                <h2
                  className="
                    text-xl
                    md:text-2xl
                    font-bold
                    tracking-tight
                    text-slate-950
                  "
                >
                  {isLogin
                    ? 'Sign in to your account'
                    : 'Create your account'}
                </h2>

                <p
                  className="
                    mt-2
                    text-sm
                    text-slate-500
                  "
                >
                  {isLogin
                    ? 'Enter your account details to continue.'
                    : 'Fill in your details to get started.'}
                </p>

              </div>

              {/* ERROR */}

              {error && (
                <div
                  role="alert"
                  className="
                    mb-5
                    rounded-xl
                    border
                    border-red-200
                    bg-red-50
                    px-4
                    py-3
                    text-sm
                    text-red-600
                  "
                >
                  {error}
                </div>
              )}

              {/* FORM */}

              <AnimatePresence mode="wait">

                <motion.form
                  key={mode}
                  noValidate
                  autoComplete="off"
                  onSubmit={
                    isLogin
                      ? handleLogin
                      : handleSignup
                  }
                  initial={{
                    opacity: 0,
                    x: isLogin ? -16 : 16,
                  }}
                  animate={{
                    opacity: 1,
                    x: 0,
                  }}
                  exit={{
                    opacity: 0,
                    x: isLogin ? 16 : -16,
                  }}
                  transition={{
                    duration: 0.3,
                  }}
                  className="space-y-5"
                >

                  {/* FULL NAME */}

                  {!isLogin && (
                    <div>

                      <label
                        htmlFor="fullName"
                        className="
                          block
                          text-sm
                          font-semibold
                          text-slate-700
                          mb-2
                        "
                      >
                        Full name
                      </label>

                      <div className="relative">

                        <User
                          size={17}
                          className="
                            absolute
                            left-3.5
                            top-1/2
                            -translate-y-1/2
                            text-slate-400
                          "
                        />

                        <input
                          id="fullName"
                          type="text"
                          value={fullName}
                          onChange={(e) =>
                            handleFullNameChange(
                              e.target.value
                            )
                          }
                          placeholder="Juan Dela Cruz"
                          disabled={loading}
                          autoComplete="name"
                          className={`
                            w-full
                            h-11
                            pl-10
                            pr-4
                            rounded-xl
                            border
                            bg-white
                            text-sm
                            text-slate-800
                            outline-none
                            transition
                            placeholder:text-slate-400
                            focus:ring-4
                            disabled:bg-slate-50
                            disabled:cursor-not-allowed
                            ${
                              errors.fullName
                                ? `
                                  border-red-400
                                  focus:border-red-400
                                  focus:ring-red-100
                                `
                                : `
                                  border-slate-200
                                  focus:border-blue-500
                                  focus:ring-blue-500/10
                                `
                            }
                          `}
                        />

                      </div>

                      {errors.fullName && (
                        <p
                          className="
                            flex
                            items-center
                            gap-1.5
                            text-xs
                            text-red-500
                            mt-1.5
                          "
                        >
                          <AlertCircle
                            size={13}
                          />
                          {errors.fullName}
                        </p>
                      )}

                    </div>
                  )}

                  {/* USERNAME */}

                  <div>

                    <label
                      htmlFor="applicationTrackerUsername"
                      className="
                        block
                        text-sm
                        font-semibold
                        text-slate-700
                        mb-2
                      "
                    >
                      Username
                    </label>

                    <div className="relative">

                      <User
                        size={17}
                        className="
                          absolute
                          left-3.5
                          top-1/2
                          -translate-y-1/2
                          text-slate-400
                        "
                      />

                      <input
                        id="applicationTrackerUsername"
                        name="applicationTrackerUsername"
                        type="text"
                        value={username}
                        onChange={(e) =>
                          handleUsernameChange(
                            e.target.value
                          )
                        }
                        placeholder="Enter your username"
                        autoComplete="off"
                        disabled={loading}
                        className={`
                          w-full
                          h-11
                          pl-10
                          pr-4
                          rounded-xl
                          border
                          bg-white
                          text-sm
                          text-slate-800
                          outline-none
                          transition
                          placeholder:text-slate-400
                          focus:ring-4
                          disabled:bg-slate-50
                          disabled:cursor-not-allowed
                          ${
                            errors.username
                              ? `
                                border-red-400
                                focus:border-red-400
                                focus:ring-red-100
                              `
                              : `
                                border-slate-200
                                focus:border-blue-500
                                focus:ring-blue-500/10
                              `
                          }
                        `}
                      />

                    </div>

                    {errors.username && (
                      <p
                        className="
                          flex
                          items-center
                          gap-1.5
                          text-xs
                          text-red-500
                          mt-1.5
                        "
                      >
                        <AlertCircle
                          size={13}
                        />
                        {errors.username}
                      </p>
                    )}

                  </div>

                  {/* PASSWORD */}

                  <div>

                    <label
                      htmlFor="applicationTrackerPassword"
                      className="
                        block
                        text-sm
                        font-semibold
                        text-slate-700
                        mb-2
                      "
                    >
                      Password
                    </label>

                    <div className="relative">

                      <Lock
                        size={17}
                        className="
                          absolute
                          left-3.5
                          top-1/2
                          -translate-y-1/2
                          text-slate-400
                        "
                      />

                      <input
                        id="applicationTrackerPassword"
                        name="applicationTrackerPassword"
                        type={
                          showPassword
                            ? 'text'
                            : 'password'
                        }
                        value={password}
                        onChange={(e) =>
                          handlePasswordChange(
                            e.target.value
                          )
                        }
                        placeholder="Enter your password"
                        autoComplete="new-password"
                        disabled={loading}
                        className={`
                          w-full
                          h-11
                          pl-10
                          pr-11
                          rounded-xl
                          border
                          bg-white
                          text-sm
                          text-slate-800
                          outline-none
                          transition
                          placeholder:text-slate-400
                          focus:ring-4
                          disabled:bg-slate-50
                          disabled:cursor-not-allowed
                          ${
                            errors.password
                              ? `
                                border-red-400
                                focus:border-red-400
                                focus:ring-red-100
                              `
                              : `
                                border-slate-200
                                focus:border-blue-500
                                focus:ring-blue-500/10
                              `
                          }
                        `}
                      />

                      <button
                        type="button"
                        onClick={() =>
                          setShowPassword(
                            (previous) =>
                              !previous
                          )
                        }
                        disabled={loading}
                        className="
                          absolute
                          right-3
                          top-1/2
                          -translate-y-1/2
                          rounded-md
                          p-1
                          text-slate-400
                          transition
                          hover:text-slate-700
                          disabled:cursor-not-allowed
                          disabled:opacity-50
                        "
                        aria-label={
                          showPassword
                            ? 'Hide password'
                            : 'Show password'
                        }
                      >
                        {showPassword ? (
                          <EyeOff size={17} />
                        ) : (
                          <Eye size={17} />
                        )}
                      </button>

                    </div>

                    {errors.password ? (
                      <p
                        className="
                          flex
                          items-center
                          gap-1.5
                          text-xs
                          text-red-500
                          mt-1.5
                        "
                      >
                        <AlertCircle
                          size={13}
                        />
                        {errors.password}
                      </p>
                    ) : (
                      !isLogin && (
                        <p
                          className="
                            text-xs
                            text-slate-400
                            mt-1.5
                          "
                        >
                          At least 8 characters,
                          with letters and numbers.
                        </p>
                      )
                    )}

                  </div>

                  {/* CONFIRM PASSWORD */}

                  {!isLogin && (
                    <div>

                      <label
                        htmlFor="applicationTrackerConfirmPassword"
                        className="
                          block
                          text-sm
                          font-semibold
                          text-slate-700
                          mb-2
                        "
                      >
                        Confirm password
                      </label>

                      <div className="relative">

                        <Lock
                          size={17}
                          className="
                            absolute
                            left-3.5
                            top-1/2
                            -translate-y-1/2
                            text-slate-400
                          "
                        />

                        <input
                          id="applicationTrackerConfirmPassword"
                          name="applicationTrackerConfirmPassword"
                          type={
                            showConfirmPassword
                              ? 'text'
                              : 'password'
                          }
                          value={confirmPassword}
                          onChange={(e) =>
                            handleConfirmPasswordChange(
                              e.target.value
                            )
                          }
                          placeholder="Confirm your password"
                          autoComplete="new-password"
                          disabled={loading}
                          className={`
                            w-full
                            h-11
                            pl-10
                            pr-11
                            rounded-xl
                            border
                            bg-white
                            text-sm
                            text-slate-800
                            outline-none
                            transition
                            placeholder:text-slate-400
                            focus:ring-4
                            disabled:bg-slate-50
                            disabled:cursor-not-allowed
                            ${
                              errors.confirmPassword
                                ? `
                                  border-red-400
                                  focus:border-red-400
                                  focus:ring-red-100
                                `
                                : `
                                  border-slate-200
                                  focus:border-blue-500
                                  focus:ring-blue-500/10
                                `
                            }
                          `}
                        />

                        <button
                          type="button"
                          onClick={() =>
                            setShowConfirmPassword(
                              (previous) =>
                                !previous
                            )
                          }
                          disabled={loading}
                          className="
                            absolute
                            right-3
                            top-1/2
                            -translate-y-1/2
                            rounded-md
                            p-1
                            text-slate-400
                            transition
                            hover:text-slate-700
                            disabled:cursor-not-allowed
                            disabled:opacity-50
                          "
                          aria-label={
                            showConfirmPassword
                              ? 'Hide confirm password'
                              : 'Show confirm password'
                          }
                        >
                          {showConfirmPassword ? (
                            <EyeOff size={17} />
                          ) : (
                            <Eye size={17} />
                          )}
                        </button>

                      </div>

                      {errors.confirmPassword && (
                        <p
                          className="
                            flex
                            items-center
                            gap-1.5
                            text-xs
                            text-red-500
                            mt-1.5
                          "
                        >
                          <AlertCircle
                            size={13}
                          />
                          {errors.confirmPassword}
                        </p>
                      )}

                    </div>
                  )}

                  {/* REMEMBER ME */}

                  {isLogin && (
                    <div className="flex items-center gap-2">

                      <input
                        id="remember"
                        name="remember"
                        type="checkbox"
                        className="
                          w-4
                          h-4
                          rounded
                          border-slate-300
                          text-blue-600
                          focus:ring-blue-500
                        "
                      />

                      <label
                        htmlFor="remember"
                        className="
                          text-xs
                          text-slate-500
                        "
                      >
                        Remember me
                      </label>

                    </div>
                  )}

                  {/* SUBMIT */}

                  <motion.button
                    type="submit"
                    disabled={loading}
                    animate={
                      isLogin
                        ? loginShake
                        : signupShake
                    }
                    className="
                      group
                      w-full
                      h-11
                      inline-flex
                      items-center
                      justify-center
                      gap-2
                      rounded-xl
                      bg-blue-600
                      text-white
                      text-sm
                      font-semibold
                      shadow-sm
                      shadow-blue-600/20
                      hover:bg-blue-700
                      hover:shadow-md
                      disabled:opacity-60
                      disabled:cursor-not-allowed
                      transition-all
                    "
                  >

                    {loading ? (
                      <>
                        <span
                          className="
                            w-4
                            h-4
                            border-2
                            border-white/30
                            border-t-white
                            rounded-full
                            animate-spin
                          "
                        />

                        {isLogin
                          ? 'Signing in...'
                          : 'Creating account...'}
                      </>
                    ) : (
                      <>
                        {isLogin
                          ? 'Sign In'
                          : 'Create account'}

                        <ArrowRight
                          size={17}
                          strokeWidth={2.5}
                          className="
                            group-hover:translate-x-0.5
                            transition-transform
                          "
                        />
                      </>
                    )}

                  </motion.button>

                </motion.form>

              </AnimatePresence>

              {/* SWITCH MODE */}

              <div
                className="
                  mt-6
                  pt-6
                  border-t
                  border-slate-100
                  text-center
                "
              >

                <p className="text-sm text-slate-500">

                  {isLogin
                    ? "Don't have an account?"
                    : 'Already have an account?'}

                  {' '}

                  <button
                    type="button"
                    onClick={() =>
                      switchMode(
                        isLogin
                          ? 'signup'
                          : 'login'
                      )
                    }
                    disabled={loading}
                    className="
                      font-semibold
                      text-blue-600
                      hover:text-blue-700
                      transition-colors
                      disabled:opacity-50
                    "
                  >
                    {isLogin
                      ? 'Create an account'
                      : 'Sign in'}
                  </button>

                </p>

              </div>

            </div>

          </div>

        </div>

        {/* FOOTER */}

        <footer className="text-center mt-6">

          <p className="text-xs text-slate-400">
            Application Tracker · Software Engineering 2
          </p>

          <p className="text-[11px] text-slate-300 mt-1">
            Version 1.0.0
          </p>

        </footer>

      </main>

      {/* SUCCESS MODAL */}

      <AnimatePresence>

        {showSuccess && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="
              fixed
              inset-0
              z-50
              flex
              items-center
              justify-center
              bg-slate-900/40
              backdrop-blur-sm
              px-5
            "
          >

            <motion.div
              initial={{
                opacity: 0,
                scale: 0.9,
                y: 12,
              }}
              animate={{
                opacity: 1,
                scale: 1,
                y: 0,
              }}
              exit={{
                opacity: 0,
                scale: 0.95,
                y: -8,
              }}
              transition={{
                duration: 0.3,
                ease: 'easeOut',
              }}
              className="
                bg-white
                rounded-2xl
                shadow-2xl
                shadow-slate-900/20
                px-8
                py-10
                max-w-sm
                w-full
                text-center
              "
            >

              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{
                  delay: 0.1,
                  type: 'spring',
                  stiffness: 200,
                  damping: 14,
                }}
                className="
                  mx-auto
                  w-16
                  h-16
                  rounded-full
                  bg-emerald-50
                  flex
                  items-center
                  justify-center
                  mb-5
                "
              >

                <CheckCircle2
                  size={32}
                  className="text-emerald-500"
                />

              </motion.div>

              <h3
                className="
                  text-xl
                  font-bold
                  text-slate-950
                  mb-2
                "
              >
                {isLogin
                  ? 'Login successful'
                  : 'Account created'}
              </h3>

              <p className="text-sm text-slate-500">
                {isLogin
                  ? 'Welcome back! Taking you to your dashboard...'
                  : 'Your account has been created. Taking you to your dashboard...'}
              </p>

              <div
                className="
                  mt-6
                  h-1
                  bg-slate-100
                  rounded-full
                  overflow-hidden
                "
              >

                <motion.div
                  initial={{
                    width: '0%',
                  }}
                  animate={{
                    width: '100%',
                  }}
                  transition={{
                    duration: 1.6,
                    ease: 'linear',
                  }}
                  className="
                    h-full
                    bg-emerald-500
                    rounded-full
                  "
                />

              </div>

            </motion.div>

          </motion.div>
        )}

      </AnimatePresence>

    </div>
  );
}
