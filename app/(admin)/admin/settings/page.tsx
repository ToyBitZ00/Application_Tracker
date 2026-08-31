'use client';

import { useEffect, useMemo, useState, type ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import {
  AlertCircle,
  Check,
  ChevronRight,
  Key,
  Loader2,
  LogOut,
  Monitor,
  Moon,
  Palette,
  Power,
  Save,
  Shield,
  SlidersHorizontal,
  Sun,
  User,
  X,
} from 'lucide-react';

import {
  clearStoredApplicationUser,
  getStoredApplicationUser,
  setStoredApplicationUser,
} from '@/lib/application-session';
import { createClient } from '@/lib/supabase/client';

type Theme = 'light' | 'dark' | 'system';

type AdminProfile = {
  id: string;
  full_name: string | null;
  username: string;
  email?: string | null;
  account_role?: 'user' | 'admin' | 'super_admin';
  is_blocked?: boolean;
};

const THEME_STORAGE_KEY = 'application_tracker_theme';
const REGISTRATION_STORAGE_KEY = 'admin_allow_registrations';

function isTheme(value: string | null): value is Theme {
  return value === 'light' || value === 'dark' || value === 'system';
}

function applyDocumentTheme(theme: Theme) {
  if (typeof window === 'undefined') return;

  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  document.documentElement.classList.toggle(
    'dark',
    theme === 'dark' || (theme === 'system' && prefersDark)
  );
}

function SettingsSection({ children }: { children: ReactNode }) {
  return (
    <section className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white/90 shadow-sm backdrop-blur-xl dark:border-slate-800/80 dark:bg-slate-900/90">
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
    <div className="border-b border-slate-200 px-6 py-5 dark:border-slate-800 md:px-7">
      <div className="flex items-center gap-3">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-50 text-blue-600 dark:bg-blue-500/10 dark:text-blue-300">
          {icon}
        </div>
        <div>
          <h2 className="text-sm font-semibold text-slate-950 dark:text-slate-50">
            {title}
          </h2>
          <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
            {description}
          </p>
        </div>
      </div>
    </div>
  );
}

function InputField({
  label,
  value,
  onChange,
  placeholder,
  disabled = false,
  type = 'text',
}: {
  label: string;
  value: string;
  onChange?: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
  type?: string;
}) {
  return (
    <div>
      <label className="mb-2 block text-[11px] font-bold uppercase tracking-[0.12em] text-slate-400">
        {label}
      </label>
      <input
        type={type}
        value={value}
        onChange={(event) => onChange?.(event.target.value)}
        placeholder={placeholder}
        disabled={disabled}
        className="h-11 w-full rounded-xl border border-slate-200 bg-white px-4 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 disabled:cursor-not-allowed disabled:bg-slate-50 disabled:text-slate-500 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100 dark:placeholder:text-slate-600 dark:disabled:bg-slate-900 dark:disabled:text-slate-500"
      />
    </div>
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
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="group flex w-full items-center justify-between px-6 py-5 text-left transition hover:bg-slate-50 focus:outline-none dark:hover:bg-slate-800/70 md:px-7"
    >
      <div className="flex items-center gap-4">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-300">
          {icon}
        </div>
        <div>
          <p className="text-sm font-medium text-slate-800 dark:text-slate-100">
            {title}
          </p>
          <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
            {description}
          </p>
        </div>
      </div>
      <ChevronRight
        size={17}
        className="text-slate-300 transition group-hover:text-slate-500 dark:text-slate-600 dark:group-hover:text-slate-300"
      />
    </button>
  );
}

function Toggle({
  enabled,
  onClick,
}: {
  enabled: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      aria-pressed={enabled}
      onClick={onClick}
      className={`relative h-6 w-11 shrink-0 rounded-full transition-colors focus:outline-none ${
        enabled ? 'bg-blue-600' : 'bg-slate-200 dark:bg-slate-700'
      }`}
    >
      <span
        className={`absolute left-1 top-1 h-4 w-4 rounded-full bg-white shadow-sm transition-transform ${
          enabled ? 'translate-x-5' : 'translate-x-0'
        }`}
      />
    </button>
  );
}

function ThemeCard({
  theme,
  activeTheme,
  icon,
  label,
  onSelect,
}: {
  theme: Theme;
  activeTheme: Theme;
  icon: ReactNode;
  label: string;
  onSelect: (theme: Theme) => void;
}) {
  const active = theme === activeTheme;

  return (
    <button
      type="button"
      onClick={() => onSelect(theme)}
      className={`flex items-center gap-3 rounded-2xl border px-4 py-3 text-left transition focus:outline-none ${
        active
          ? 'border-blue-300 bg-blue-50 text-blue-700 ring-4 ring-blue-500/10 dark:border-blue-500/60 dark:bg-blue-500/10 dark:text-blue-200'
          : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-300 dark:hover:border-slate-600'
      }`}
    >
      <span>{icon}</span>
      <span className="text-sm font-semibold">{label}</span>
      {active && <Check size={16} className="ml-auto" />}
    </button>
  );
}

function ChangePasswordModal({
  userId,
  username,
  onCancel,
  onSuccess,
}: {
  userId: string;
  username: string;
  onCancel: () => void;
  onSuccess: () => void;
}) {
  const supabase = useMemo(() => createClient(), []);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onCancel();
    };

    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [onCancel]);

  async function handleSubmit() {
    setError('');

    if (!currentPassword) {
      setError('Enter your current password first.');
      return;
    }

    if (newPassword.length < 8) {
      setError('New password must be at least 8 characters.');
      return;
    }

    if (newPassword !== confirmPassword) {
      setError('New passwords do not match.');
      return;
    }

    setLoading(true);

    const { error: updateError } = await supabase.rpc(
      'change_application_user_password',
      {
        p_user_id: userId,
        p_username: username,
        p_current_password: currentPassword,
        p_new_password: newPassword,
      }
    );

    setLoading(false);

    if (updateError) {
      setError(updateError.message || 'Unable to update password.');
      return;
    }

    onSuccess();
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center px-4 sm:p-6">
      <div
        className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm"
        onClick={onCancel}
      />
      <div className="relative w-full max-w-[460px] overflow-hidden rounded-3xl border border-slate-200 bg-slate-50 shadow-[0_32px_80px_rgba(15,23,42,0.2)] dark:border-slate-700 dark:bg-slate-900">
        <div className="flex items-start justify-between border-b border-blue-100 bg-blue-50/80 px-6 py-6 dark:border-blue-500/20 dark:bg-blue-500/10">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-blue-100/50 bg-white shadow-sm dark:border-blue-500/20 dark:bg-slate-950">
              <Key size={24} className="text-blue-600 dark:text-blue-300" />
            </div>
            <div>
              <p className="text-[11px] font-bold uppercase tracking-[0.15em] text-blue-400">
                Admin Security
              </p>
              <h3 className="text-2xl font-extrabold leading-none text-blue-950 dark:text-blue-100">
                Change Password
              </h3>
            </div>
          </div>
          <button
            type="button"
            onClick={onCancel}
            className="flex h-8 w-8 items-center justify-center rounded-full border border-blue-200/60 bg-white text-blue-400 transition hover:bg-blue-100 hover:text-blue-600 dark:border-slate-700 dark:bg-slate-900"
          >
            <X size={16} />
          </button>
        </div>

        <div className="space-y-4 px-6 py-6">
          {error && (
            <div className="flex items-start gap-2 rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-xs font-semibold text-red-600 dark:border-red-500/30 dark:bg-red-500/10 dark:text-red-300">
              <AlertCircle size={15} className="mt-0.5 shrink-0" />
              {error}
            </div>
          )}
          <InputField
            label="Current Password"
            value={currentPassword}
            onChange={setCurrentPassword}
            type="password"
          />
          <InputField
            label="New Password"
            value={newPassword}
            onChange={setNewPassword}
            type="password"
          />
          <InputField
            label="Confirm New Password"
            value={confirmPassword}
            onChange={setConfirmPassword}
            type="password"
          />

          <div className="flex items-center justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={onCancel}
              className="px-3 py-2 text-sm font-semibold text-slate-600 transition hover:text-slate-950 dark:text-slate-300 dark:hover:text-white"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSubmit}
              disabled={loading}
              className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-70"
            >
              {loading && <Loader2 size={15} className="animate-spin" />}
              Update Password
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function SignOutModal({
  onCancel,
  onConfirm,
}: {
  onCancel: () => void;
  onConfirm: () => void;
}) {
  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onCancel();
    };

    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [onCancel]);

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center px-4 sm:p-6">
      <div
        className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm"
        onClick={onCancel}
      />
      <div className="relative w-full max-w-[420px] overflow-hidden rounded-3xl border border-slate-200 bg-slate-50 shadow-[0_32px_80px_rgba(15,23,42,0.2)] dark:border-slate-700 dark:bg-slate-900">
        <div className="flex items-start justify-between border-b border-slate-200 bg-slate-100/80 px-6 py-6 dark:border-slate-800 dark:bg-slate-800/70">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-slate-200/50 bg-white shadow-sm dark:border-slate-700 dark:bg-slate-950">
              <LogOut size={24} className="text-slate-600 dark:text-slate-300" />
            </div>
            <div>
              <p className="text-[11px] font-bold uppercase tracking-[0.15em] text-slate-500 dark:text-slate-400">
                Session
              </p>
              <h3 className="text-2xl font-extrabold leading-none text-slate-950 dark:text-white">
                Sign Out
              </h3>
            </div>
          </div>
          <button
            type="button"
            onClick={onCancel}
            className="flex h-8 w-8 items-center justify-center rounded-full border border-slate-300/60 bg-white text-slate-500 transition hover:bg-slate-200 dark:border-slate-700 dark:bg-slate-900"
          >
            <X size={16} />
          </button>
        </div>
        <div className="px-6 py-6">
          <p className="text-sm leading-relaxed text-slate-500 dark:text-slate-400">
            Sign out of the admin panel and return to the login page.
          </p>
          <div className="mt-8 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onCancel}
              className="px-3 py-2 text-sm font-semibold text-slate-600 transition hover:text-slate-950 dark:text-slate-300 dark:hover:text-white"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={onConfirm}
              className="rounded-xl bg-slate-900 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-slate-800 dark:bg-white dark:text-slate-950"
            >
              Sign Out
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function AdminSettingsPage() {
  const router = useRouter();
  const supabase = useMemo(() => createClient(), []);
  const storedUser = getStoredApplicationUser();

  const [allowRegistrations, setAllowRegistrations] = useState(() => {
    if (typeof window === 'undefined') {
      return true;
    }

    const savedRegistrations = localStorage.getItem(REGISTRATION_STORAGE_KEY);
    return savedRegistrations ? savedRegistrations === 'true' : true;
  });
  const [theme, setTheme] = useState<Theme>(() => {
    if (typeof window === 'undefined') {
      return 'system';
    }

    const savedTheme = localStorage.getItem(THEME_STORAGE_KEY);
    return isTheme(savedTheme) ? savedTheme : 'system';
  });
  const [passwordOpen, setPasswordOpen] = useState(false);
  const [signOutOpen, setSignOutOpen] = useState(false);
  const [profileSaved, setProfileSaved] = useState(false);
  const [passwordSaved, setPasswordSaved] = useState(false);
  const [savingProfile, setSavingProfile] = useState(false);
  const [loadingProfile, setLoadingProfile] = useState(true);
  const [error, setError] = useState('');
  const [profile, setProfile] = useState({
    id: '',
    username: '',
    fullName: '',
    email: '',
    role: 'admin',
  });

  useEffect(() => {
    applyDocumentTheme(theme);
  }, [theme]);

  useEffect(() => {
    let mounted = true;

    async function loadProfile() {
      if (!storedUser?.id) {
        setLoadingProfile(false);
        return;
      }

      const { data, error: profileError } = await supabase.rpc(
        'get_application_user_profile',
        {
          p_user_id: storedUser.id,
          p_username: storedUser.username,
        }
      );

      const account = data as AdminProfile | null;

      if (!mounted) return;

      if (profileError || !account) {
        setError(profileError?.message || 'Unable to load admin profile.');
        setLoadingProfile(false);
        return;
      }

      setProfile({
        id: account.id,
        username: account.username,
        fullName: account.full_name || '',
        email: account.email || '',
        role: account.account_role === 'super_admin' ? 'super_admin' : 'admin',
      });
      setStoredApplicationUser({
        id: account.id,
        username: account.username,
        fullName: account.full_name || '',
        role: account.account_role || 'user',
        isBlocked: Boolean(account.is_blocked),
      });
      setLoadingProfile(false);
    }

    loadProfile();

    return () => {
      mounted = false;
    };
  }, [storedUser?.id, storedUser?.username, supabase]);

  function handleThemeChange(nextTheme: Theme) {
    setTheme(nextTheme);
    localStorage.setItem(THEME_STORAGE_KEY, nextTheme);
    applyDocumentTheme(nextTheme);
  }

  function handleRegistrationsChange() {
    setAllowRegistrations((current) => {
      const next = !current;
      localStorage.setItem(REGISTRATION_STORAGE_KEY, String(next));
      return next;
    });
  }

  async function handleSaveProfile() {
    setError('');
    setProfileSaved(false);

    if (!profile.id || !profile.username) {
      setError('Admin profile is not loaded yet.');
      return;
    }

    if (profile.fullName.trim().length < 2) {
      setError('Admin full name is required.');
      return;
    }

    setSavingProfile(true);

    const { data, error: saveError } = await supabase.rpc(
      'update_application_user_profile',
      {
        p_user_id: profile.id,
        p_username: profile.username,
        p_full_name: profile.fullName,
        p_email: profile.email,
      }
    );

    setSavingProfile(false);

    if (saveError) {
      setError(saveError.message || 'Unable to save admin profile.');
      return;
    }

    const account = data as AdminProfile | null;

    setStoredApplicationUser({
      id: profile.id,
      username: profile.username,
      fullName: account?.full_name || profile.fullName.trim(),
      role:
        account?.account_role ||
        (profile.role as 'admin' | 'super_admin'),
      isBlocked: Boolean(account?.is_blocked),
    });
    setProfile((current) => ({
      ...current,
      fullName: account?.full_name || current.fullName.trim(),
      email: account?.email || current.email.trim(),
    }));
    setProfileSaved(true);
    window.setTimeout(() => setProfileSaved(false), 2500);
  }

  function handleSignOut() {
    clearStoredApplicationUser();
    setSignOutOpen(false);
    router.replace('/login');
    router.refresh();
  }

  const initials = profile.fullName
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((word) => word[0]?.toUpperCase())
    .join('') || 'A';
  const roleLabel =
    profile.role === 'super_admin' ? 'Super Administrator' : 'Administrator';

  return (
    <>
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -left-40 h-[420px] w-[420px] rounded-full bg-blue-500/10 blur-3xl blue-glow-animation" />
        <div
          className="absolute -bottom-48 -right-40 h-[500px] w-[500px] rounded-full bg-indigo-500/10 blur-3xl blue-glow-animation"
          style={{ animationDelay: '1.5s' }}
        />
        <div
          className="absolute top-1/3 right-1/4 h-72 w-72 rounded-full bg-blue-400/5 blur-3xl blue-glow-animation"
          style={{ animationDelay: '3s' }}
        />
      </div>

      <div
        className="absolute inset-0 z-0 pointer-events-none opacity-[0.28]"
        style={{
          backgroundImage: `
            linear-gradient(to right, rgba(148, 163, 184, 0.18) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(148, 163, 184, 0.18) 1px, transparent 1px)
          `,
          backgroundSize: '48px 48px',
          maskImage:
            'linear-gradient(to bottom, transparent, rgba(0,0,0,0.78) 18%, rgba(0,0,0,0.9) 82%, transparent)',
          WebkitMaskImage:
            'linear-gradient(to bottom, transparent, rgba(0,0,0,0.78) 18%, rgba(0,0,0,0.9) 82%, transparent)',
        }}
      />

      <main className="relative z-10 flex-1 overflow-y-auto overflow-x-hidden scroll-smooth scrollbar-hide">
        <div className="mx-auto max-w-7xl px-5 pb-32 pt-10 sm:px-6 lg:px-8">
          <header className="mb-8 flex flex-col gap-2">
            <div className="flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-blue-600" />
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-blue-600 dark:text-blue-300">
                Administration
              </p>
            </div>
            <h1 className="text-3xl font-bold tracking-tight text-slate-950 dark:text-white md:text-4xl">
              System Settings
            </h1>
            <p className="text-sm text-slate-500 dark:text-slate-400 md:text-base">
              Manage the master profile, appearance, security, and session.
            </p>
          </header>

          {error && (
            <div className="mb-6 flex items-start gap-2 rounded-2xl border border-red-200 bg-red-50 px-5 py-4 text-sm font-semibold text-red-600 dark:border-red-500/30 dark:bg-red-500/10 dark:text-red-300">
              <AlertCircle size={18} className="mt-0.5 shrink-0" />
              {error}
            </div>
          )}

          {loadingProfile ? (
            <div className="flex items-center justify-center rounded-2xl border border-slate-200 bg-white/90 py-16 text-sm font-semibold text-slate-500 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300">
              <Loader2 size={20} className="mr-2 animate-spin text-blue-600" />
              Loading admin profile...
            </div>
          ) : (
            <div className="space-y-6">
              <SettingsSection>
                <SectionHeader
                  icon={<User size={18} />}
                  title="Master Profile"
                  description="Synced from the logged-in admin account"
                />
                <div className="p-6 md:p-7">
                  <div className="flex flex-col gap-6 sm:flex-row">
                    <div className="flex h-[76px] w-[76px] shrink-0 items-center justify-center rounded-2xl bg-blue-600 text-xl font-semibold text-white shadow-sm">
                      {initials}
                    </div>
                    <div className="flex-1">
                      <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                        <InputField
                          label="Admin Full Name"
                          value={profile.fullName}
                          onChange={(value) =>
                            setProfile((current) => ({
                              ...current,
                              fullName: value,
                            }))
                          }
                          placeholder="Administrator Name"
                        />
                        <InputField
                          label="Master Email Address"
                          value={profile.email}
                          onChange={(value) =>
                            setProfile((current) => ({
                              ...current,
                              email: value,
                            }))
                          }
                          placeholder="admin@example.com"
                          type="email"
                        />
                        <InputField
                          label="Username"
                          value={`@${profile.username}`}
                          disabled
                        />
                        <InputField
                          label="System Role"
                          value={roleLabel}
                          disabled
                        />
                      </div>

                      <div className="mt-6 flex flex-wrap items-center justify-end gap-4">
                        <div
                          className={`flex items-center gap-1.5 text-sm font-semibold text-emerald-600 transition ${
                            profileSaved
                              ? 'opacity-100'
                              : 'pointer-events-none opacity-0'
                          }`}
                        >
                          <Check size={15} />
                          Saved successfully
                        </div>
                        <button
                          type="button"
                          onClick={handleSaveProfile}
                          disabled={savingProfile}
                          className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-70"
                        >
                          {savingProfile ? (
                            <Loader2 size={15} className="animate-spin" />
                          ) : (
                            <Save size={15} />
                          )}
                          Save Changes
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </SettingsSection>

              <SettingsSection>
                <SectionHeader
                  icon={<SlidersHorizontal size={18} />}
                  title="Platform Configurations"
                  description="Admin preferences saved on this device"
                />
                <div className="flex items-center justify-between gap-5 px-6 py-5 md:px-7">
                  <div>
                    <p className="text-sm font-medium text-slate-800 dark:text-slate-100">
                      Allow New Registrations
                    </p>
                    <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                      Controls the admin preference for the registration flow.
                    </p>
                  </div>
                  <Toggle
                    enabled={allowRegistrations}
                    onClick={handleRegistrationsChange}
                  />
                </div>
              </SettingsSection>

              <SettingsSection>
                <SectionHeader
                  icon={<Palette size={18} />}
                  title="Appearance"
                  description="Matches the theme controls used in user pages"
                />
                <div className="grid grid-cols-1 gap-3 p-6 md:grid-cols-3 md:p-7">
                  <ThemeCard
                    theme="light"
                    activeTheme={theme}
                    icon={<Sun size={18} />}
                    label="Light"
                    onSelect={handleThemeChange}
                  />
                  <ThemeCard
                    theme="dark"
                    activeTheme={theme}
                    icon={<Moon size={18} />}
                    label="Dark"
                    onSelect={handleThemeChange}
                  />
                  <ThemeCard
                    theme="system"
                    activeTheme={theme}
                    icon={<Monitor size={18} />}
                    label="System"
                    onSelect={handleThemeChange}
                  />
                </div>
              </SettingsSection>

              <SettingsSection>
                <SectionHeader
                  icon={<Shield size={18} />}
                  title="Security & Session"
                  description="Manage your admin account access"
                />
                <div className="divide-y divide-slate-100 dark:divide-slate-800">
                  {passwordSaved && (
                    <div className="px-6 py-3 text-xs font-semibold text-emerald-600 dark:text-emerald-300 md:px-7">
                      Password updated successfully.
                    </div>
                  )}
                  <ActionRow
                    icon={<Key size={18} />}
                    title="Change Admin Password"
                    description="Requires the current password before saving a new one."
                    onClick={() => setPasswordOpen(true)}
                  />
                  <ActionRow
                    icon={<Power size={18} />}
                    title="Sign out of Admin Panel"
                    description="Clear this session and return to login."
                    onClick={() => setSignOutOpen(true)}
                  />
                </div>
              </SettingsSection>

              <footer className="pb-8 pt-4 text-center">
                <p className="text-xs font-medium text-slate-400">
                  Application Tracker Admin Interface
                </p>
              </footer>
            </div>
          )}
        </div>
      </main>

      <div className="pointer-events-none fixed bottom-0 left-0 right-0 z-30 h-28 bg-gradient-to-t from-[#f5f7fb] via-[#f5f7fb]/80 to-transparent dark:from-slate-950 dark:via-slate-950/80" />

      {passwordOpen && (
        <ChangePasswordModal
          userId={profile.id}
          username={profile.username}
          onCancel={() => setPasswordOpen(false)}
          onSuccess={() => {
            setPasswordOpen(false);
            setPasswordSaved(true);
            window.setTimeout(() => setPasswordSaved(false), 2500);
          }}
        />
      )}

      {signOutOpen && (
        <SignOutModal
          onCancel={() => setSignOutOpen(false)}
          onConfirm={handleSignOut}
        />
      )}
    </>
  );
}
