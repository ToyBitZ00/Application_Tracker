'use client';

import { useEffect, useState, type ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import {
  User,
  Palette,
  ChevronRight,
  LogOut,
  Trash2,
  Mail,
  Sun,
  Moon,
  Monitor,
  Check,
  AlertCircle,
  Key,
  X,
  Loader2,
} from 'lucide-react';

import { createClient } from '@/lib/supabase/client';
import {
  clearStoredApplicationUser,
  getStoredApplicationUser,
  getStoredUsername,
  setStoredApplicationUser,
} from '@/lib/application-session';

/* =========================================================
   TYPES
========================================================= */

type Theme = 'light' | 'dark' | 'system';

type ApplicationUser = {
  id: string;
  full_name: string | null;
  username: string;
  created_at: string;
  updated_at: string;
};

/* =========================================================
   CONSTANTS
========================================================= */

const THEMES: {
  name: string;
  description: string;
  icon: ReactNode;
  value: Theme;
}[] = [
  {
    name: 'Light',
    description: 'Clean and bright',
    icon: <Sun size={18} />,
    value: 'light',
  },
  {
    name: 'Dark',
    description: 'Easy on the eyes',
    icon: <Moon size={18} />,
    value: 'dark',
  },
  {
    name: 'System',
    description: 'Use device preference',
    icon: <Monitor size={18} />,
    value: 'system',
  },
];

const COURSES = ['BSCS', 'BSBA', 'BSHM', 'BEED', 'BSEd'];

const THEME_STORAGE_KEY = 'application_tracker_theme';

/* =========================================================
   SUPABASE
========================================================= */

const supabase = createClient();

function isTheme(value: string | null): value is Theme {
  return value === 'light' || value === 'dark' || value === 'system';
}

function applyDocumentTheme(theme: Theme) {
  if (typeof window === 'undefined') {
    return;
  }

  const prefersDark = window.matchMedia(
    '(prefers-color-scheme: dark)'
  ).matches;

  const shouldUseDark =
    theme === 'dark' ||
    (theme === 'system' && prefersDark);

  document.documentElement.classList.toggle(
    'dark',
    shouldUseDark
  );

  document.documentElement.dataset.theme = theme;
}

/* =========================================================
   HELPER COMPONENTS
========================================================= */

function SettingsSection({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <section className="bg-white/95 backdrop-blur-xl border border-slate-200/80 rounded-2xl overflow-hidden shadow-xl shadow-slate-900/5 dark:bg-slate-900/95 dark:border-slate-700/80 dark:shadow-black/20">
      {children}
    </section>
  );
}

function SectionHeader({
  icon,
  title,
  description,
}: {
  icon: ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div className="px-6 md:px-7 py-5 border-b border-slate-100 dark:border-slate-800">
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600 dark:bg-blue-500/15 dark:text-blue-300">
          {icon}
        </div>

        <div>
          <h2 className="text-sm font-semibold text-slate-950 dark:text-slate-100">
            {title}
          </h2>

          <p className="text-xs text-slate-400 mt-0.5 dark:text-slate-500">
            {description}
          </p>
        </div>
      </div>
    </div>
  );
}

function InputField({
  label,
  placeholder,
  value,
  onChange,
}: {
  label: string;
  placeholder: string;
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div>
      <label className="block text-sm font-medium text-slate-700 mb-2 dark:text-slate-300">
        {label}
      </label>

      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full h-11 px-4 rounded-xl border border-slate-200 bg-white text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100 dark:placeholder:text-slate-600"
      />
    </div>
  );
}

function ThemeCard({
  name,
  description,
  icon,
  active,
  onClick,
  preview,
}: {
  name: string;
  description: string;
  icon: ReactNode;
  active: boolean;
  onClick: () => void;
  preview: Theme;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`text-left rounded-xl border p-4 transition-all ${
        active
          ? 'border-blue-500 bg-blue-50/60 ring-1 ring-blue-500 dark:bg-blue-500/10'
          : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50 dark:border-slate-700 dark:hover:border-slate-600 dark:hover:bg-slate-800'
      }`}
    >
      <div
        className={`h-20 rounded-lg border p-3 mb-4 ${
          preview === 'dark'
            ? 'bg-[#0f172a] border-slate-700'
            : preview === 'system'
            ? 'bg-gradient-to-r from-white via-white to-[#0f172a] border-slate-200'
            : 'bg-white border-slate-200'
        }`}
      >
        <div
          className={`h-2 w-1/2 rounded ${
            preview === 'dark'
              ? 'bg-slate-600'
              : 'bg-slate-200'
          }`}
        />

        <div className="flex gap-2 mt-3">
          <div
            className={`h-7 w-1/3 rounded ${
              preview === 'dark'
                ? 'bg-slate-800'
                : 'bg-slate-100'
            }`}
          />

          <div
            className={`h-7 flex-1 rounded ${
              preview === 'dark'
                ? 'bg-slate-800'
                : 'bg-slate-100'
            }`}
          />
        </div>
      </div>

      <div className="flex items-start justify-between gap-3">
        <div>
          <div
            className={`flex items-center gap-2 text-sm font-semibold ${
              active
                ? 'text-blue-700'
                : 'text-slate-700 dark:text-slate-200'
            }`}
          >
            {icon}
            {name}
          </div>

          <p className="text-[11px] text-slate-400 mt-1 dark:text-slate-500">
            {description}
          </p>
        </div>

        {active && (
          <div className="w-5 h-5 rounded-full bg-blue-600 flex items-center justify-center shrink-0">
            <Check size={12} className="text-white" />
          </div>
        )}
      </div>
    </button>
  );
}

function ActionRow({
  icon,
  title,
  description,
  onClick,
}: {
  icon: ReactNode;
  title: string;
  description: string;
  onClick?: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="w-full px-6 md:px-7 py-5 flex items-center justify-between text-left hover:bg-slate-50 transition group dark:hover:bg-slate-800/70"
    >
      <div className="flex items-center gap-4">
        <div className="w-9 h-9 rounded-lg bg-slate-100 flex items-center justify-center text-slate-500 dark:bg-slate-800 dark:text-slate-400">
          {icon}
        </div>

        <div>
          <p className="text-sm font-medium text-slate-800 dark:text-slate-100">
            {title}
          </p>

          <p className="text-xs text-slate-400 mt-1 dark:text-slate-500">
            {description}
          </p>
        </div>
      </div>

      <ChevronRight
        size={17}
        className="text-slate-300 group-hover:text-slate-500 transition dark:text-slate-600 dark:group-hover:text-slate-400"
      />
    </button>
  );
}

/* =========================================================
   CHANGE PASSWORD MODAL
========================================================= */

function ChangePasswordModal({
  username,
  userId,
  onCancel,
  onSuccess,
}: {
  username: string;
  userId: string;
  onCancel: () => void;
  onSuccess: () => void;
}) {
  const [step, setStep] = useState<'verify' | 'change'>(
    'verify'
  );

  const [currentPass, setCurrentPass] = useState('');
  const [newPass, setNewPass] = useState('');
  const [confirmPass, setConfirmPass] = useState('');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onCancel();
      }
    };

    window.addEventListener('keydown', onKeyDown);

    return () => {
      window.removeEventListener('keydown', onKeyDown);
    };
  }, [onCancel]);

  async function handlePasswordChange() {
    setError('');

    if (!currentPass) {
      setError('Please enter your current password.');
      return;
    }

    if (!newPass) {
      setError('Please enter a new password.');
      return;
    }

    if (newPass.length < 8) {
      setError(
        'New password must be at least 8 characters long.'
      );
      return;
    }

    if (newPass !== confirmPass) {
      setError('New passwords do not match.');
      return;
    }

    setLoading(true);

    try {
      const { data, error: supabaseError } =
        await supabase.rpc(
          'change_application_user_password',
          {
            p_user_id: userId,
            p_username: username,
            p_current_password: currentPass,
            p_new_password: newPass,
          }
        );

      if (supabaseError) {
        throw new Error(
          supabaseError.message ||
            'Unable to change password.'
        );
      }

      const result = data as {
        success?: boolean;
      } | null;

      if (!result?.success) {
        throw new Error(
          'Unable to change password.'
        );
      }

      setCurrentPass('');
      setNewPass('');
      setConfirmPass('');
      onSuccess();
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'Unable to change password.'
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center px-4 sm:p-6">
      <div
        className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-300 dark:bg-black/60"
        onClick={onCancel}
      />

      <div
        role="dialog"
        aria-modal="true"
        className="relative w-full max-w-[460px] bg-slate-50 rounded-3xl shadow-[0_32px_80px_rgba(15,23,42,0.2)] overflow-hidden animate-in fade-in zoom-in-95 slide-in-from-bottom-4 duration-300 border border-slate-200 dark:border-slate-700 dark:bg-slate-900"
      >
        <div className="relative px-6 py-6 bg-blue-50/80 border-b border-blue-100 flex items-start justify-between rounded-t-3xl dark:border-blue-500/20 dark:bg-blue-500/10">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-white shadow-sm border border-blue-100/50 flex shrink-0 items-center justify-center dark:border-blue-500/20 dark:bg-slate-950">
              <Key
                size={24}
                className="text-blue-600 dark:text-blue-300"
                strokeWidth={2}
              />
            </div>

            <div>
              <h3 className="text-[11px] font-bold uppercase tracking-[0.15em] text-blue-400 mb-0.5 mt-1 dark:text-blue-300">
                Security
              </h3>

              <span className="text-2xl font-extrabold text-blue-950 leading-none block dark:text-slate-100">
                Change Password
              </span>
            </div>
          </div>

          <button
            type="button"
            onClick={onCancel}
            className="w-8 h-8 rounded-full bg-white border border-blue-200/60 flex shrink-0 items-center justify-center text-blue-400 hover:bg-blue-100 hover:text-blue-600 transition-colors dark:border-slate-700 dark:bg-slate-950 dark:text-slate-400 dark:hover:bg-slate-800"
          >
            <X size={16} />
          </button>
        </div>

        <div className="px-6 py-6">
          {step === 'verify' ? (
            <div>
              <p className="text-sm text-slate-500 mb-6 leading-relaxed dark:text-slate-400">
                Enter your current password to verify your
                identity before creating a new password.
              </p>

              <div>
                <label className="block text-[11px] font-bold uppercase tracking-[0.12em] text-slate-400 mb-2 dark:text-slate-500">
                  Current Password
                </label>

                <input
                  type="password"
                  value={currentPass}
                  onChange={(e) =>
                    setCurrentPass(e.target.value)
                  }
                  className="w-full h-11 px-4 rounded-xl border border-slate-200 bg-white text-sm text-slate-800 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100"
                />
              </div>

              {error && (
                <div className="mt-4 flex items-start gap-2 rounded-xl bg-red-50 border border-red-100 px-3 py-3 text-sm text-red-600">
                  <AlertCircle
                    size={16}
                    className="shrink-0 mt-0.5"
                  />
                  <span>{error}</span>
                </div>
              )}

              <div className="flex items-center justify-end gap-3 mt-8">
                <button
                  type="button"
                  onClick={onCancel}
                  className="text-sm font-semibold text-slate-600 hover:text-slate-950 px-3 py-2 dark:text-slate-400 dark:hover:text-slate-100"
                >
                  Cancel
                </button>

                <button
                  type="button"
                  onClick={() => {
                    if (!currentPass) {
                      setError(
                        'Please enter your current password.'
                      );
                      return;
                    }

                    setError('');
                    setStep('change');
                  }}
                  className="rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-blue-700 transition"
                >
                  Continue
                </button>
              </div>
            </div>
          ) : (
            <div>
              <p className="text-sm text-slate-500 mb-6 leading-relaxed dark:text-slate-400">
                Create a new password that is at least 8
                characters long.
              </p>

              <div className="space-y-4">
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-[0.12em] text-slate-400 mb-2 dark:text-slate-500">
                    New Password
                  </label>

                  <input
                    type="password"
                    value={newPass}
                    onChange={(e) =>
                      setNewPass(e.target.value)
                    }
                    className="w-full h-11 px-4 rounded-xl border border-slate-200 bg-white text-sm text-slate-800 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-[0.12em] text-slate-400 mb-2 dark:text-slate-500">
                    Confirm New Password
                  </label>

                  <input
                    type="password"
                    value={confirmPass}
                    onChange={(e) =>
                      setConfirmPass(e.target.value)
                    }
                    className="w-full h-11 px-4 rounded-xl border border-slate-200 bg-white text-sm text-slate-800 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100"
                  />
                </div>
              </div>

              {error && (
                <div className="mt-4 flex items-start gap-2 rounded-xl bg-red-50 border border-red-100 px-3 py-3 text-sm text-red-600">
                  <AlertCircle
                    size={16}
                    className="shrink-0 mt-0.5"
                  />
                  <span>{error}</span>
                </div>
              )}

              <div className="flex items-center justify-end gap-3 mt-8">
                <button
                  type="button"
                  onClick={onCancel}
                  className="text-sm font-semibold text-slate-600 hover:text-slate-950 px-3 py-2 dark:text-slate-400 dark:hover:text-slate-100"
                >
                  Cancel
                </button>

                <button
                  type="button"
                  disabled={loading}
                  onClick={handlePasswordChange}
                  className="rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-blue-700 transition disabled:opacity-60 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  {loading && (
                    <Loader2
                      size={15}
                      className="animate-spin"
                    />
                  )}

                  {loading
                    ? 'Updating...'
                    : 'Update Password'}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/* =========================================================
   SIGN OUT MODAL
========================================================= */

function SignOutModal({
  onCancel,
  onConfirm,
}: {
  onCancel: () => void;
  onConfirm: () => void;
}) {
  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onCancel();
      }
    };

    window.addEventListener('keydown', onKeyDown);

    return () => {
      window.removeEventListener('keydown', onKeyDown);
    };
  }, [onCancel]);

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center px-4 sm:p-6">
      <div
        className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
        onClick={onCancel}
      />

      <div
        role="dialog"
        aria-modal="true"
        className="relative w-full max-w-[420px] bg-slate-50 rounded-3xl shadow-[0_32px_80px_rgba(15,23,42,0.2)] overflow-hidden border border-slate-200"
      >
        <div className="relative px-6 py-6 bg-slate-100/80 border-b border-slate-200 flex items-start justify-between rounded-t-3xl">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-white shadow-sm border border-slate-200/50 flex shrink-0 items-center justify-center">
              <LogOut
                size={24}
                className="text-slate-600"
              />
            </div>

            <div>
              <h3 className="text-[11px] font-bold uppercase tracking-[0.15em] text-slate-500 mb-0.5 mt-1">
                Session
              </h3>

              <span className="text-2xl font-extrabold text-slate-950 leading-none block">
                Sign Out
              </span>
            </div>
          </div>

          <button
            type="button"
            onClick={onCancel}
            className="w-8 h-8 rounded-full bg-white border border-slate-300/60 flex items-center justify-center text-slate-500 hover:bg-slate-200 transition"
          >
            <X size={16} />
          </button>
        </div>

        <div className="px-6 py-6">
          <p className="text-sm leading-relaxed text-slate-500">
            Are you sure you want to sign out of your account?
          </p>

          <div className="mt-8 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onCancel}
              className="text-sm font-semibold text-slate-600 hover:text-slate-950 px-3 py-2"
            >
              Cancel
            </button>

            <button
              type="button"
              onClick={onConfirm}
              className="rounded-xl bg-slate-900 px-5 py-2.5 text-sm font-semibold text-white hover:bg-slate-800 transition"
            >
              Sign Out
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

/* =========================================================
   DELETE ACCOUNT MODAL
========================================================= */

function DeleteAccountModal({
  onCancel,
  onConfirm,
  loading,
}: {
  onCancel: () => void;
  onConfirm: () => void;
  loading: boolean;
}) {
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center px-4 sm:p-6">
      <div
        className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
        onClick={onCancel}
      />

      <div
        role="dialog"
        aria-modal="true"
        className="relative w-full max-w-[460px] bg-slate-50 rounded-3xl shadow-[0_32px_80px_rgba(15,23,42,0.2)] overflow-hidden border border-slate-200"
      >
        <div className="relative px-6 py-6 bg-red-50/80 border-b border-red-100 flex items-start justify-between rounded-t-3xl">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-white shadow-sm border border-red-100/50 flex shrink-0 items-center justify-center">
              <AlertCircle
                size={24}
                className="text-red-600"
              />
            </div>

            <div>
              <h3 className="text-[11px] font-bold uppercase tracking-[0.15em] text-red-400 mb-0.5 mt-1">
                Danger Zone
              </h3>

              <span className="text-2xl font-extrabold text-red-950 leading-none block">
                Delete Account
              </span>
            </div>
          </div>

          <button
            type="button"
            onClick={onCancel}
            className="w-8 h-8 rounded-full bg-white border border-red-200/60 flex items-center justify-center text-red-400 hover:bg-red-100 transition"
          >
            <X size={16} />
          </button>
        </div>

        <div className="px-6 py-6">
          <p className="text-sm leading-relaxed text-slate-600">
            Are you absolutely sure you want to delete
            your account? Your account data will be
            permanently removed. This action cannot be
            undone.
          </p>

          <div className="mt-8 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onCancel}
              className="text-sm font-semibold text-slate-700 hover:text-slate-950 px-3 py-2"
            >
              No, keep my account
            </button>

            <button
              type="button"
              disabled={loading}
              onClick={onConfirm}
              className="rounded-xl bg-red-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-red-700 transition disabled:opacity-60 flex items-center gap-2"
            >
              {loading && (
                <Loader2
                  size={15}
                  className="animate-spin"
                />
              )}

              {loading
                ? 'Deleting...'
                : 'Yes, delete it'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

/* =========================================================
   MAIN SETTINGS PAGE
========================================================= */

export default function SettingsPage() {
  const router = useRouter();

  const [theme, setTheme] = useState<Theme>(() => {
    if (typeof window === 'undefined') {
      return 'light';
    }

    const storedTheme = localStorage.getItem(
      THEME_STORAGE_KEY
    );

    return isTheme(storedTheme)
      ? storedTheme
      : 'light';
  });

  const [deleteOpen, setDeleteOpen] = useState(false);
  const [passwordOpen, setPasswordOpen] = useState(false);
  const [signOutOpen, setSignOutOpen] = useState(false);

  const [profileSaved, setProfileSaved] = useState(false);

  const [loadingAccount, setLoadingAccount] =
    useState(true);

  const [savingProfile, setSavingProfile] =
    useState(false);

  const [deleteLoading, setDeleteLoading] =
    useState(false);

  const [accountError, setAccountError] =
    useState('');

  const [user, setUser] =
    useState<ApplicationUser | null>(null);

  const [profile, setProfile] = useState({
    fullName: '',
    email: '',
    program: 'BSCS',
    targetRole: 'Software Engineer Intern',
    targetLocation: '',
    landingTab: 'Dashboard',
  });

  /* =====================================================
     THEME
  ===================================================== */

  useEffect(() => {
    localStorage.setItem(THEME_STORAGE_KEY, theme);
    applyDocumentTheme(theme);

    if (theme !== 'system') {
      return undefined;
    }

    const media = window.matchMedia(
      '(prefers-color-scheme: dark)'
    );

    const handleChange = () => {
      applyDocumentTheme('system');
    };

    media.addEventListener('change', handleChange);

    return () => {
      media.removeEventListener('change', handleChange);
    };
  }, [theme]);

  /* =====================================================
     LOAD ACCOUNT FROM SUPABASE
  ===================================================== */

  useEffect(() => {
    let mounted = true;

    async function loadAccount() {
      setLoadingAccount(true);
      setAccountError('');

      try {
        const storedUser =
          getStoredApplicationUser();

        const username =
          storedUser?.username ||
          getStoredUsername();

        if (!username) {
          if (mounted) {
            setAccountError(
              'No logged-in account was found. Please sign in again.'
            );
            setLoadingAccount(false);
          }

          return;
        }

        const { data, error } = await supabase.rpc(
          'get_application_user_profile',
          {
            p_user_id: storedUser?.id || null,
            p_username: username,
          }
        );

        if (error) {
          console.error(
            'Supabase account fetch error:',
            error
          );

          throw new Error(
            error.message ||
              'Unable to load your account.'
          );
        }

        const account = data as ApplicationUser | null;

        if (!account) {
          throw new Error(
            'Your account could not be found in Supabase.'
          );
        }

        if (!mounted) return;

        setUser(account);
        setStoredApplicationUser({
          id: account.id,
          username: account.username,
          fullName: account.full_name || '',
        });

        setProfile((prev) => ({
          ...prev,
          fullName: account.full_name || '',
        }));
      } catch (error) {
        console.error(error);

        if (mounted) {
          setAccountError(
            error instanceof Error
              ? error.message
              : 'Unable to load account.'
          );
        }
      } finally {
        if (mounted) {
          setLoadingAccount(false);
        }
      }
    }

    loadAccount();

    return () => {
      mounted = false;
    };
  }, []);

  /* =====================================================
     UPDATE PROFILE
  ===================================================== */

  function handleUpdateProfile(
    key: string,
    value: string
  ) {
    setProfile((prev) => ({
      ...prev,
      [key]: value,
    }));
  }

  async function handleSaveProfile() {
    if (!user) {
      return;
    }

    if (!profile.fullName.trim()) {
      setAccountError('Full name cannot be empty.');
      return;
    }

    setSavingProfile(true);
    setAccountError('');

    try {
      const { data, error } = await supabase.rpc(
        'update_application_user_full_name',
        {
          p_user_id: user.id,
          p_username: user.username,
          p_full_name: profile.fullName.trim(),
        }
      );

      if (error) {
        console.error(
          'Supabase profile update error:',
          error
        );

        throw new Error(
          error.message ||
            'Unable to save profile.'
        );
      }

      const updatedUser =
        data as ApplicationUser;

      setUser(updatedUser);
      setStoredApplicationUser({
        id: updatedUser.id,
        username: updatedUser.username,
        fullName: updatedUser.full_name || '',
      });

      setProfile((prev) => ({
        ...prev,
        fullName:
          updatedUser.full_name || '',
      }));

      setProfileSaved(true);

      setTimeout(() => {
        setProfileSaved(false);
      }, 2500);
    } catch (error) {
      console.error(error);

      setAccountError(
        error instanceof Error
          ? error.message
          : 'Unable to save profile.'
      );
    } finally {
      setSavingProfile(false);
    }
  }

  /* =====================================================
     SIGN OUT
  ===================================================== */

  function handleSignOut() {
    clearStoredApplicationUser();
    setSignOutOpen(false);

    router.push('/login');
    router.refresh();
  }

  /* =====================================================
     DELETE ACCOUNT
  ===================================================== */

  async function handleDeleteAccount() {
    if (!user) {
      return;
    }

    setDeleteLoading(true);
    setAccountError('');

    try {
      const { error } = await supabase
        .from('application_users')
        .delete()
        .eq('id', user.id);

      if (error) {
        console.error(
          'Supabase delete account error:',
          error
        );

        throw new Error(
          error.message ||
            'Unable to delete account.'
        );
      }

      clearStoredApplicationUser();
      setDeleteOpen(false);

      router.push('/login');
      router.refresh();
    } catch (error) {
      console.error(error);

      setAccountError(
        error instanceof Error
          ? error.message
          : 'Unable to delete account.'
      );
    } finally {
      setDeleteLoading(false);
    }
  }

  /* =====================================================
     LOADING
  ===================================================== */

  if (loadingAccount) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-[#f5f7fb] dark:bg-slate-950">
        <div className="flex flex-col items-center gap-3">
          <div className="w-11 h-11 rounded-xl bg-blue-600 flex items-center justify-center shadow-lg shadow-blue-600/20">
            <Loader2
              size={22}
              className="text-white animate-spin"
            />
          </div>

          <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
            Loading account...
          </p>
        </div>
      </div>
    );
  }

  /* =====================================================
     ERROR
  ===================================================== */

  if (!user) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-[#f5f7fb] px-5 dark:bg-slate-950">
        <div className="w-full max-w-md bg-white rounded-2xl border border-slate-200 shadow-xl p-7 text-center dark:border-slate-700 dark:bg-slate-900">
          <div className="mx-auto w-12 h-12 rounded-xl bg-red-50 flex items-center justify-center">
            <AlertCircle
              size={24}
              className="text-red-600"
            />
          </div>

          <h1 className="mt-4 text-xl font-bold text-slate-950 dark:text-slate-100">
            Unable to load account
          </h1>

          <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
            {accountError ||
              'Please sign in again.'}
          </p>

          <button
            type="button"
            onClick={() => router.push('/login')}
            className="mt-6 rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-blue-700 transition"
          >
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  /* =====================================================
     PAGE
  ===================================================== */

  return (
    <div className="fixed inset-0 flex flex-col overflow-hidden bg-[#f5f7fb] dark:bg-slate-950">
      {/* BACKGROUND */}

      <div className="pointer-events-none absolute inset-0 overflow-hidden z-0">
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
        className="pointer-events-none absolute inset-0 opacity-[0.35] z-0"
        style={{
          backgroundImage: `
            linear-gradient(to right, #cbd5e1 1px, transparent 1px),
            linear-gradient(to bottom, #cbd5e1 1px, transparent 1px)
          `,
          backgroundSize: '48px 48px',
          maskImage:
            'linear-gradient(to bottom, transparent, black 20%, black 80%, transparent)',
          WebkitMaskImage:
            'linear-gradient(to bottom, transparent, black 20%, black 80%, transparent)',
        }}
      />

      {/* HEADER */}

      <div className="relative z-40 w-full shrink-0 pt-8 pb-4 bg-transparent">
        <div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-8">
          <header className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-5 animate-header-in">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <div className="w-2 h-2 rounded-full bg-blue-600" />

                <p className="text-xs font-bold uppercase tracking-[0.18em] text-blue-600 dark:text-blue-300">
                  Settings
                </p>
              </div>

              <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-slate-950 dark:text-slate-50">
                Account Settings
              </h1>

              <p className="mt-2 text-sm md:text-base text-slate-500 max-w-xl dark:text-slate-400">
                Manage your profile, application
                preferences, and account data.
              </p>
            </div>
          </header>
        </div>
      </div>

      {/* CONTENT */}

      <main
        className="flex-1 overflow-y-auto overflow-x-hidden relative z-10 w-full scroll-smooth scrollbar-hide"
        style={{
          maskImage:
            'linear-gradient(to bottom, transparent 0px, black 24px, black calc(100% - 60px), transparent 100%)',
          WebkitMaskImage:
            'linear-gradient(to bottom, transparent 0px, black 24px, black calc(100% - 60px), transparent 100%)',
        }}
      >
        <div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-8 pt-4 pb-32">
          <div className="space-y-5">
            {/* ACCOUNT ERROR */}

            {accountError && (
              <div className="rounded-2xl border border-red-200 bg-red-50 px-5 py-4 flex items-start gap-3">
                <AlertCircle
                  size={18}
                  className="text-red-600 shrink-0 mt-0.5"
                />

                <p className="text-sm text-red-700">
                  {accountError}
                </p>

                <button
                  type="button"
                  onClick={() =>
                    setAccountError('')
                  }
                  className="ml-auto text-red-400 hover:text-red-600"
                >
                  <X size={16} />
                </button>
              </div>
            )}

            {/* PROFILE */}

            <SettingsSection>
              <SectionHeader
                icon={<User size={18} />}
                title="Profile"
                description="Your personal information"
              />

              <div className="p-6 md:p-7">
                <div className="flex flex-col sm:flex-row gap-6">
                  <div className="shrink-0">
                    <div className="w-[76px] h-[76px] rounded-2xl bg-blue-600 flex items-center justify-center text-white text-xl font-semibold shadow-sm">
                      {profile.fullName
                        ? profile.fullName
                            .split(' ')
                            .filter(Boolean)
                            .slice(0, 2)
                            .map((name) =>
                              name[0]?.toUpperCase()
                            )
                            .join('')
                        : 'U'}
                    </div>

                    <button
                      type="button"
                      className="mt-2 text-xs font-semibold text-blue-600 hover:text-blue-700 transition w-full text-center"
                    >
                      Change photo
                    </button>
                  </div>

                  <div className="flex-1">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                      {/* FULL NAME */}

                      <InputField
                        label="Full Name"
                        placeholder="Your full name"
                        value={profile.fullName}
                        onChange={(v) =>
                          handleUpdateProfile(
                            'fullName',
                            v
                          )
                        }
                      />

                      {/* USERNAME */}

                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">
                          Username
                        </label>

                        <div className="relative">
                          <User
                            size={16}
                            className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
                          />

                          <input
                            type="text"
                            value={user.username}
                            readOnly
                            className="w-full h-11 pl-10 pr-4 rounded-xl border border-slate-200 bg-slate-50 text-sm text-slate-500 outline-none cursor-not-allowed"
                          />
                        </div>

                        <p className="text-[11px] text-slate-400 mt-1.5">
                          Username is managed by your account.
                        </p>
                      </div>

                      {/* EMAIL */}

                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">
                          Email Address
                        </label>

                        <div className="relative">
                          <Mail
                            size={16}
                            className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
                          />

                          <input
                            type="email"
                            value={profile.email}
                            onChange={(e) =>
                              handleUpdateProfile(
                                'email',
                                e.target.value
                              )
                            }
                            placeholder="Email not stored"
                            className="w-full h-11 pl-10 pr-4 rounded-xl border border-slate-200 bg-white text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
                          />
                        </div>

                        <p className="text-[11px] text-slate-400 mt-1.5">
                          Email is not currently a column in
                          application_users.
                        </p>
                      </div>

                      {/* PROGRAM */}

                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">
                          Course / Program
                        </label>

                        <div className="flex items-center gap-1.5 sm:gap-2">
                          {COURSES.map((course) => {
                            const isActive =
                              profile.program ===
                              course;

                            return (
                              <button
                                key={course}
                                type="button"
                                onClick={() =>
                                  handleUpdateProfile(
                                    'program',
                                    course
                                  )
                                }
                                className={`flex flex-1 items-center justify-center h-11 rounded-xl border text-[11px] sm:text-[12px] font-bold transition-all duration-200 ${
                                  isActive
                                    ? 'border-blue-600 bg-blue-600 text-white shadow-md shadow-blue-600/25 scale-[1.02] ring-2 ring-blue-600/20 z-10'
                                    : 'border-slate-200 bg-white text-slate-500 hover:border-slate-300 hover:bg-slate-50 hover:text-slate-800'
                                }`}
                              >
                                {isActive && (
                                  <Check
                                    size={14}
                                    strokeWidth={3}
                                    className="mr-1.5"
                                  />
                                )}

                                {course}
                              </button>
                            );
                          })}
                        </div>

                        <p className="text-[11px] text-slate-400 mt-1.5">
                          Course is currently a local setting
                          because application_users does not
                          contain a program column.
                        </p>
                      </div>

                      {/* YEAR */}

                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">
                          Year Level
                        </label>

                        <select
                          defaultValue="3rd Year"
                          className="w-full h-11 px-4 rounded-xl border border-slate-200 bg-white text-sm text-slate-800 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
                        >
                          <option value="" disabled>
                            Select year level
                          </option>

                          <option>1st Year</option>
                          <option>2nd Year</option>
                          <option>3rd Year</option>
                          <option>4th Year</option>
                        </select>

                        <p className="text-[11px] text-slate-400 mt-1.5">
                          Year level is currently a local setting
                          because the existing table has no year
                          level column.
                        </p>
                      </div>
                    </div>

                    <div className="mt-6 flex items-center justify-end gap-4">
                      <div
                        className={`flex items-center gap-1.5 text-sm font-semibold text-emerald-600 transition-all duration-300 ${
                          profileSaved
                            ? 'opacity-100 translate-x-0'
                            : 'opacity-0 translate-x-2 pointer-events-none'
                        }`}
                      >
                        <div className="flex h-5 w-5 items-center justify-center rounded-full bg-emerald-100">
                          <Check
                            size={12}
                            strokeWidth={3}
                          />
                        </div>

                        Saved successfully
                      </div>

                      <button
                        type="button"
                        disabled={savingProfile}
                        onClick={handleSaveProfile}
                        className="px-5 py-2.5 rounded-xl bg-blue-600 text-white text-sm font-semibold hover:bg-blue-700 active:bg-blue-800 transition shadow-sm disabled:opacity-60 disabled:cursor-not-allowed flex items-center gap-2"
                      >
                        {savingProfile && (
                          <Loader2
                            size={15}
                            className="animate-spin"
                          />
                        )}

                        {savingProfile
                          ? 'Saving...'
                          : 'Save Changes'}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </SettingsSection>

            {/* APPEARANCE */}

            <SettingsSection>
              <SectionHeader
                icon={<Palette size={18} />}
                title="Appearance"
                description="Choose how Application Tracker looks"
              />

              <div className="p-6 md:p-7">
                <p className="text-sm font-semibold text-slate-700 mb-4">
                  Theme
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {THEMES.map((item) => (
                    <ThemeCard
                      key={item.value}
                      name={item.name}
                      description={
                        item.description
                      }
                      icon={item.icon}
                      active={
                        theme === item.value
                      }
                      onClick={() =>
                        setTheme(item.value)
                      }
                      preview={item.value}
                    />
                  ))}
                </div>
              </div>
            </SettingsSection>

            {/* ACCOUNT */}

            <SettingsSection>
              <SectionHeader
                icon={<User size={18} />}
                title="Account"
                description="Manage your account access"
              />

              <div className="divide-y divide-slate-100">
                <ActionRow
                  icon={<Key size={18} />}
                  title="Change password"
                  description="Update your account password."
                  onClick={() =>
                    setPasswordOpen(true)
                  }
                />

                <ActionRow
                  icon={<LogOut size={18} />}
                  title="Sign out"
                  description="Sign out from this device."
                  onClick={() =>
                    setSignOutOpen(true)
                  }
                />
              </div>
            </SettingsSection>

            {/* DANGER ZONE */}

            <section className="border border-red-200 bg-red-50/80 backdrop-blur-xl rounded-2xl overflow-hidden shadow-sm">
              <div className="px-6 md:px-7 py-6">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-red-100 flex items-center justify-center shrink-0">
                    <Trash2
                      size={18}
                      className="text-red-600"
                    />
                  </div>

                  <div className="flex-1">
                    <h2 className="text-sm font-semibold text-red-700">
                      Delete account
                    </h2>

                    <p className="mt-1 text-xs text-slate-500 max-w-xl leading-relaxed">
                      Permanently delete your account and
                      all account data. This action cannot
                      be undone.
                    </p>

                    <button
                      type="button"
                      onClick={() =>
                        setDeleteOpen(true)
                      }
                      className="mt-4 px-4 py-2 rounded-lg bg-white border border-red-200 text-red-600 text-xs font-semibold hover:bg-red-50 transition"
                    >
                      Delete Account
                    </button>
                  </div>
                </div>
              </div>
            </section>

            {/* FOOTER */}

            <footer className="text-center pt-2 pb-8">
              <p className="text-xs text-slate-400">
                Application Tracker · Software Engineering 2
              </p>

              <p className="text-[11px] text-slate-300 mt-1">
                Version 1.0.0
              </p>
            </footer>
          </div>
        </div>
      </main>

      {/* BOTTOM FADE */}

      <div className="fixed bottom-0 left-0 right-0 h-28 bg-gradient-to-t from-[#f5f7fb] via-[#f5f7fb]/80 to-transparent z-30 pointer-events-none" />

      {/* PASSWORD */}

      {passwordOpen && (
        <ChangePasswordModal
          username={user.username}
          userId={user.id}
          onCancel={() =>
            setPasswordOpen(false)
          }
          onSuccess={() => {
            setPasswordOpen(false);
          }}
        />
      )}

      {/* SIGN OUT */}

      {signOutOpen && (
        <SignOutModal
          onCancel={() =>
            setSignOutOpen(false)
          }
          onConfirm={handleSignOut}
        />
      )}

      {/* DELETE */}

      {deleteOpen && (
        <DeleteAccountModal
          loading={deleteLoading}
          onCancel={() =>
            setDeleteOpen(false)
          }
          onConfirm={handleDeleteAccount}
        />
      )}

      {/* GLOBAL STYLES */}

      <style jsx global>{`
        html,
        body {
          scroll-behavior: smooth;
        }

        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }

        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }

        @keyframes header-in {
          from {
            opacity: 0;
            transform: translateY(-12px);
          }

          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-header-in {
          animation: header-in 0.4s ease-out forwards;
        }
      `}</style>
    </div>
  );
}
