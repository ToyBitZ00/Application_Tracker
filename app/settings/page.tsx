'use client';

import { useEffect, useState, type ReactNode } from 'react';
import {
  User,
  SlidersHorizontal,
  Palette,
  ChevronRight,
  LogOut,
  Trash2,
  Mail,
  GraduationCap,
  Sun,
  Moon,
  Monitor,
  Check,
  AlertCircle,
  Key,
  X,
} from 'lucide-react';

/* ================================================= */
/* TYPES & CONSTANTS */
/* ================================================= */

type Theme = 'light' | 'dark' | 'system';

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

/* ================================================= */
/* HELPER COMPONENTS */
/* ================================================= */

function SettingsSection({ children }: { children: ReactNode }) {
  return (
    <section className="bg-white/95 backdrop-blur-xl border border-slate-200/80 rounded-2xl overflow-hidden shadow-xl shadow-slate-900/5">
      {children}
    </section>
  );
}

function SectionHeader({ icon, title, description }: { icon: ReactNode; title: string; description: string }) {
  return (
    <div className="px-6 md:px-7 py-5 border-b border-slate-100">
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600">
          {icon}
        </div>
        <div>
          <h2 className="text-sm font-semibold text-slate-950">
            {title}
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            {description}
          </p>
        </div>
      </div>
    </div>
  );
}

function InputField({ label, placeholder, value, onChange }: { label: string; placeholder: string; value?: string; onChange?: (v: string) => void }) {
  return (
    <div>
      <label className="block text-sm font-medium text-slate-700 mb-2">
        {label}
      </label>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange?.(e.target.value)}
        placeholder={placeholder}
        className="w-full h-11 px-4 rounded-xl border border-slate-200 bg-white text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
      />
    </div>
  );
}

function SettingText({ title, description }: { title: string; description: string }) {
  return (
    <div>
      <p className="text-sm font-medium text-slate-800">
        {title}
      </p>
      <p className="text-xs text-slate-400 mt-1">
        {description}
      </p>
    </div>
  );
}

function Toggle({ enabled, onClick }: { enabled: boolean; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={enabled}
      className={`relative w-11 h-6 rounded-full shrink-0 transition-colors duration-300 ease-in-out ${
        enabled ? 'bg-blue-600' : 'bg-slate-200'
      }`}
    >
      <span
        className={`absolute top-1 left-1 w-4 h-4 rounded-full bg-white shadow-sm transition-transform duration-300 ease-in-out ${
          enabled ? 'translate-x-5' : 'translate-x-0'
        }`}
      />
    </button>
  );
}

function ThemeCard({ name, description, icon, active, onClick, preview }: {
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
          ? 'border-blue-500 bg-blue-50/60 ring-1 ring-blue-500'
          : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50'
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
        <div className={`h-2 w-1/2 rounded ${preview === 'dark' ? 'bg-slate-600' : 'bg-slate-200'}`} />
        <div className="flex gap-2 mt-3">
          <div className={`h-7 w-1/3 rounded ${preview === 'dark' ? 'bg-slate-800' : 'bg-slate-100'}`} />
          <div className={`h-7 flex-1 rounded ${preview === 'dark' ? 'bg-slate-800' : 'bg-slate-100'}`} />
        </div>
      </div>
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className={`flex items-center gap-2 text-sm font-semibold ${active ? 'text-blue-700' : 'text-slate-700'}`}>
            {icon}
            {name}
          </div>
          <p className="text-[11px] text-slate-400 mt-1">
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

function ActionRow({ icon, title, description, onClick }: {
  icon: ReactNode;
  title: string;
  description: string;
  onClick?: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="w-full px-6 md:px-7 py-5 flex items-center justify-between text-left hover:bg-slate-50 transition group"
    >
      <div className="flex items-center gap-4">
        <div className="w-9 h-9 rounded-lg bg-slate-100 flex items-center justify-center text-slate-500">
          {icon}
        </div>
        <div>
          <p className="text-sm font-medium text-slate-800">
            {title}
          </p>
          <p className="text-xs text-slate-400 mt-1">
            {description}
          </p>
        </div>
      </div>
      <ChevronRight
        size={17}
        className="text-slate-300 group-hover:text-slate-500 transition"
      />
    </button>
  );
}

/* ================================================= */
/* PREMIUM UNIFORM MODALS */
/* ================================================= */

function ChangePasswordModal({ onCancel, onSuccess }: { onCancel: () => void; onSuccess: () => void }) {
  const [step, setStep] = useState<'otp' | 'change'>('otp');
  const [otp, setOtp] = useState('');
  const [currentPass, setCurrentPass] = useState('');
  const [newPass, setNewPass] = useState('');
  const [confirmPass, setConfirmPass] = useState('');

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onCancel();
    };
    window.addEventListener('keydown', onKeyDown);
    return () => {
      window.removeEventListener('keydown', onKeyDown);
    };
  }, [onCancel]);

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center px-4 sm:p-6">
      <div 
        className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-300" 
        onClick={onCancel} 
      />
      
      <div
        role="dialog"
        aria-modal="true"
        className="relative w-full max-w-[460px] bg-slate-50 rounded-3xl shadow-[0_32px_80px_rgba(15,23,42,0.2)] overflow-hidden animate-in fade-in zoom-in-95 slide-in-from-bottom-4 duration-300 border border-slate-200"
      >
        {/* Dynamic Header (Light Blue Theme) */}
        <div className="relative px-6 py-6 bg-blue-50/80 border-b border-blue-100 flex items-start justify-between rounded-t-3xl">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-white shadow-sm border border-blue-100/50 flex shrink-0 items-center justify-center">
              <Key size={24} className="text-blue-600" strokeWidth={2} />
            </div>
            <div>
              <h3 className="text-[11px] font-bold uppercase tracking-[0.15em] text-blue-400 mb-0.5 mt-1">
                Security
              </h3>
              <span className="text-2xl font-extrabold text-blue-950 leading-none block">
                {step === 'otp' ? 'Verify Identity' : 'Change Password'}
              </span>
            </div>
          </div>
          <button 
            type="button" 
            onClick={onCancel}
            className="w-8 h-8 rounded-full bg-white border border-blue-200/60 flex shrink-0 items-center justify-center text-blue-400 hover:bg-blue-100 hover:text-blue-600 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-200 mt-1 shadow-sm"
          >
            <X size={16} />
          </button>
        </div>

        {/* Modal Body */}
        <div className="px-6 py-6">
          {step === 'otp' ? (
            <div className="animate-in fade-in duration-300">
              <p className="text-sm text-slate-500 mb-6 leading-relaxed">
                We've sent a 6-digit security code to your email. Please enter it below to authorize this change.
              </p>
              <div className="mb-6">
                <label className="block text-[11px] font-bold uppercase tracking-[0.12em] text-slate-400 mb-2">
                  Authentication Code
                </label>
                <input
                  type="text"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  placeholder="Enter 6-digit code"
                  className="w-full h-11 px-4 rounded-xl border border-slate-200 bg-white text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
                />
              </div>
              <div className="flex items-center justify-end gap-3 mt-8">
                <button
                  type="button"
                  onClick={onCancel}
                  className="text-sm font-semibold text-slate-600 hover:text-slate-950 px-3 py-2 transition"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={() => setStep('change')}
                  className="rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-blue-700 transition active:scale-[0.98]"
                >
                  Verify OTP
                </button>
              </div>
            </div>
          ) : (
            <div className="animate-in fade-in duration-300">
              <p className="text-sm text-slate-500 mb-6 leading-relaxed">
                Create a new password that is at least 8 characters long.
              </p>
              <div className="space-y-4 mb-6">
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-[0.12em] text-slate-400 mb-2">
                    Current Password
                  </label>
                  <input
                    type="password"
                    value={currentPass}
                    onChange={(e) => setCurrentPass(e.target.value)}
                    className="w-full h-11 px-4 rounded-xl border border-slate-200 bg-white text-sm text-slate-800 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-[0.12em] text-slate-400 mb-2">
                    New Password
                  </label>
                  <input
                    type="password"
                    value={newPass}
                    onChange={(e) => setNewPass(e.target.value)}
                    className="w-full h-11 px-4 rounded-xl border border-slate-200 bg-white text-sm text-slate-800 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-[0.12em] text-slate-400 mb-2">
                    Confirm New Password
                  </label>
                  <input
                    type="password"
                    value={confirmPass}
                    onChange={(e) => setConfirmPass(e.target.value)}
                    className="w-full h-11 px-4 rounded-xl border border-slate-200 bg-white text-sm text-slate-800 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
                  />
                </div>
              </div>
              <div className="flex items-center justify-end gap-3 mt-8">
                <button
                  type="button"
                  onClick={onCancel}
                  className="text-sm font-semibold text-slate-600 hover:text-slate-950 px-3 py-2 transition"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={onSuccess}
                  className="rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-blue-700 transition active:scale-[0.98]"
                >
                  Update Password
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function SignOutModal({ onCancel, onConfirm }: { onCancel: () => void; onConfirm: () => void; }) {
  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onCancel();
    };
    window.addEventListener('keydown', onKeyDown);
    return () => {
      window.removeEventListener('keydown', onKeyDown);
    };
  }, [onCancel]);

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center px-4 sm:p-6">
      <div 
        className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-300" 
        onClick={onCancel} 
      />
      
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="sign-out-title"
        className="relative w-full max-w-[420px] bg-slate-50 rounded-3xl shadow-[0_32px_80px_rgba(15,23,42,0.2)] overflow-hidden animate-in fade-in zoom-in-95 slide-in-from-bottom-4 duration-300 border border-slate-200"
      >
        {/* Dynamic Header (Slate Theme) */}
        <div className="relative px-6 py-6 bg-slate-100/80 border-b border-slate-200 flex items-start justify-between rounded-t-3xl">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-white shadow-sm border border-slate-200/50 flex shrink-0 items-center justify-center">
              <LogOut size={24} className="text-slate-600" strokeWidth={2} />
            </div>
            <div>
              <h3 className="text-[11px] font-bold uppercase tracking-[0.15em] text-slate-500 mb-0.5 mt-1">
                Session
              </h3>
              <span id="sign-out-title" className="text-2xl font-extrabold text-slate-950 leading-none block">
                Sign Out
              </span>
            </div>
          </div>
          <button 
            type="button" 
            onClick={onCancel}
            className="w-8 h-8 rounded-full bg-white border border-slate-300/60 flex shrink-0 items-center justify-center text-slate-500 hover:bg-slate-200 hover:text-slate-700 transition-colors focus:outline-none focus:ring-2 focus:ring-slate-300 mt-1 shadow-sm"
          >
            <X size={16} />
          </button>
        </div>

        {/* Modal Body */}
        <div className="px-6 py-6">
          <p className="text-sm leading-relaxed text-slate-500">
            Are you sure you want to sign out of your account? You will need to enter your credentials to log back in.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-end gap-3">
            <button
              type="button"
              onClick={onCancel}
              className="text-sm font-semibold text-slate-600 hover:text-slate-950 px-3 py-2 transition"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={onConfirm}
              className="rounded-xl bg-slate-900 px-5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-slate-800 transition active:scale-[0.98]"
            >
              Sign Out
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function DeleteAccountModal({ onCancel, onConfirm }: { onCancel: () => void; onConfirm: () => void; }) {
  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onCancel();
    };
    window.addEventListener('keydown', onKeyDown);
    return () => {
      window.removeEventListener('keydown', onKeyDown);
    };
  }, [onCancel]);

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center px-4 sm:p-6">
      <div 
        className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-300" 
        onClick={onCancel} 
      />
      
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="delete-account-title"
        className="relative w-full max-w-[460px] bg-slate-50 rounded-3xl shadow-[0_32px_80px_rgba(15,23,42,0.2)] overflow-hidden animate-in fade-in zoom-in-95 slide-in-from-bottom-4 duration-300 border border-slate-200"
      >
        {/* Dynamic Header (Red/Danger Theme) */}
        <div className="relative px-6 py-6 bg-red-50/80 border-b border-red-100 flex items-start justify-between rounded-t-3xl">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-white shadow-sm border border-red-100/50 flex shrink-0 items-center justify-center">
              <AlertCircle size={24} className="text-red-600" strokeWidth={2} />
            </div>
            <div>
              <h3 className="text-[11px] font-bold uppercase tracking-[0.15em] text-red-400 mb-0.5 mt-1">
                Danger Zone
              </h3>
              <span id="delete-account-title" className="text-2xl font-extrabold text-red-950 leading-none block">
                Delete Account
              </span>
            </div>
          </div>
          <button 
            type="button" 
            onClick={onCancel}
            className="w-8 h-8 rounded-full bg-white border border-red-200/60 flex shrink-0 items-center justify-center text-red-400 hover:bg-red-100 hover:text-red-600 transition-colors focus:outline-none focus:ring-2 focus:ring-red-200 mt-1 shadow-sm"
          >
            <X size={16} />
          </button>
        </div>

        {/* Modal Body */}
        <div className="px-6 py-6">
          <p className="text-sm leading-relaxed text-slate-600">
            Are you absolutely sure you want to delete your account? All of
            your tracked applications, interview notes, and profile data will
            be{' '}
            <span className="font-bold text-red-600 bg-red-50 px-1.5 py-0.5 rounded">
              permanently removed
            </span>
            . This action cannot be undone.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-end gap-3">
            <button
              type="button"
              onClick={onCancel}
              className="text-sm font-semibold text-slate-700 hover:text-slate-950 px-3 py-2 transition"
            >
              No, keep my account
            </button>
            <button
              type="button"
              onClick={onConfirm}
              className="rounded-xl bg-red-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-red-700 transition active:scale-[0.98]"
            >
              Yes, delete it
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ================================================= */
/* MAIN PAGE COMPONENT */
/* ================================================= */

export default function SettingsPage() {
  const [theme, setTheme] = useState<Theme>('light');
  const [autoRounds, setAutoRounds] = useState(true);

  const [deleteOpen, setDeleteOpen] = useState(false);
  const [passwordOpen, setPasswordOpen] = useState(false);
  const [signOutOpen, setSignOutOpen] = useState(false);

  const [profileSaved, setProfileSaved] = useState(false);
  
  const [profile, setProfile] = useState({
    fullName: 'Paul Nerie B. Aguirre',
    email: 'paul.aguirre@basc.edu.ph',
    program: 'BSCS',
    targetRole: 'Software Engineer Intern',
    targetLocation: 'Candaba, Pampanga',
    landingTab: 'Dashboard',
  });

  const handleUpdateProfile = (key: string, value: string) => {
    setProfile(prev => ({ ...prev, [key]: value }));
  };

  const handleSaveProfile = () => {
    setProfileSaved(true);
    setTimeout(() => {
      setProfileSaved(false);
    }, 2500);
  };

  return (
    <div className="relative h-screen w-full flex flex-col overflow-hidden bg-[#f5f7fb]">
      
      {/* ================================================= */}
      {/* BACKGROUND DESIGN (FIXED) */}
      {/* ================================================= */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden z-0">
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
        className="pointer-events-none fixed inset-0 opacity-[0.35] z-0"
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

      {/* ================================================= */}
      {/* FIXED HEADER (TRANSPARENT) */}
      {/* ================================================= */}
      <div className="relative z-40 w-full shrink-0 pt-8 pb-4 bg-transparent pointer-events-none">
        <div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-8 pointer-events-auto">
          <header>
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-5">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-2 h-2 rounded-full bg-blue-600" />
                  <p className="text-xs font-bold uppercase tracking-[0.18em] text-blue-600">
                    Settings
                  </p>
                </div>
                <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-slate-950">
                  Account Settings
                </h1>
                <p className="mt-2 text-sm md:text-base text-slate-500 max-w-xl">
                  Manage your profile, application preferences,
                  and account data.
                </p>
              </div>
            </div>
          </header>
        </div>
      </div>

      {/* ================================================= */}
      {/* SCROLLABLE CONTENT WITH MASK FOR FADE EFFECT */}
      {/* ================================================= */}
      <main 
        className="flex-1 overflow-y-auto overflow-x-hidden relative z-10 w-full scroll-smooth scrollbar-hide"
        style={{
          maskImage: 'linear-gradient(to bottom, transparent 0px, black 32px, black calc(100% - 80px), transparent 100%)',
          WebkitMaskImage: 'linear-gradient(to bottom, transparent 0px, black 32px, black calc(100% - 80px), transparent 100%)',
        }}
      >
        <div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-8 pt-4 pb-32">
          <div className="space-y-5">
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
                      PA
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
                      <InputField
                        label="Full Name"
                        placeholder="Your full name"
                        value={profile.fullName}
                        onChange={(v) => handleUpdateProfile('fullName', v)}
                      />
                      
                      {/* MODIFIED: Editable Email Field */}
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">
                          Email Address
                        </label>
                        <div className="relative">
                          <Mail
                            size={16}
                            className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
                          />
                          <input
                            type="email"
                            value={profile.email}
                            onChange={(e) => handleUpdateProfile('email', e.target.value)}
                            placeholder="you@example.com"
                            className="w-full h-11 pl-10 pr-4 rounded-xl border border-slate-200 bg-white text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
                          />
                        </div>
                      </div>

                      {/* MODIFIED: Horizontal Button Row with Checkmark & Premium Shadows */}
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">
                          Course / Program
                        </label>
                        <div className="flex items-center gap-1.5 sm:gap-2">
                          {COURSES.map((course) => {
                            const isActive = profile.program === course;
                            return (
                              <button
                                key={course}
                                type="button"
                                onClick={() => handleUpdateProfile('program', course)}
                                className={`flex flex-1 items-center justify-center h-11 rounded-xl border text-[11px] sm:text-[12px] font-bold transition-all duration-200 ${
                                  isActive
                                    ? 'border-blue-600 bg-blue-600 text-white shadow-md shadow-blue-600/25 scale-[1.02] ring-2 ring-blue-600/20 z-10'
                                    : 'border-slate-200 bg-white text-slate-500 hover:border-slate-300 hover:bg-slate-50 hover:text-slate-800'
                                }`}
                              >
                                {isActive && <Check size={14} strokeWidth={3} className="mr-1.5" />}
                                {course}
                              </button>
                            );
                          })}
                        </div>
                      </div>

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
                      </div>
                    </div>
                    
                    <div className="mt-6 flex items-center justify-end gap-4">
                      <div
                        className={`flex items-center gap-1.5 text-sm font-semibold text-emerald-600 transition-all duration-300 ${
                          profileSaved ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-2 pointer-events-none'
                        }`}
                      >
                        <div className="flex h-5 w-5 items-center justify-center rounded-full bg-emerald-100">
                          <Check size={12} strokeWidth={3} />
                        </div>
                        Saved successfully
                      </div>
                      
                      <button
                        type="button"
                        onClick={handleSaveProfile}
                        className="px-5 py-2.5 rounded-xl bg-blue-600 text-white text-sm font-semibold hover:bg-blue-700 active:bg-blue-800 transition shadow-sm"
                      >
                        Save Changes
                      </button>
                    </div>

                  </div>
                </div>
              </div>
            </SettingsSection>

            {/* APPLICATION PREFERENCES */}
            <SettingsSection>
              <SectionHeader
                icon={<SlidersHorizontal size={18} />}
                title="Application Preferences"
                description="Customize how applications are managed"
              />
              <div className="divide-y divide-slate-100">
                <div className="px-6 md:px-7 py-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <SettingText
                    title="Default application status"
                    description="Status assigned when creating a new application"
                  />
                  <select
                    defaultValue="Applied"
                    className="h-10 px-3.5 rounded-xl border border-slate-200 bg-white text-sm text-slate-800 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
                  >
                    <option>Applied</option>
                    <option>Interview</option>
                    <option>Offer</option>
                  </select>
                </div>
                <div className="px-6 md:px-7 py-5 flex items-center justify-between gap-5">
                  <SettingText
                    title="Automatically track interview rounds"
                    description="Suggest the next round when an interview is added"
                  />
                  <Toggle
                    enabled={autoRounds}
                    onClick={() => setAutoRounds((prev) => !prev)}
                  />
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
                      description={item.description}
                      icon={item.icon}
                      active={theme === item.value}
                      onClick={() => setTheme(item.value)}
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
                  onClick={() => setPasswordOpen(true)}
                />
                <ActionRow
                  icon={<LogOut size={18} />}
                  title="Sign out"
                  description="Sign out from this device."
                  onClick={() => setSignOutOpen(true)}
                />
              </div>
            </SettingsSection>

            {/* DANGER ZONE */}
            <section className="border border-red-200 bg-red-50/80 backdrop-blur-xl rounded-2xl overflow-hidden shadow-sm">
              <div className="px-6 md:px-7 py-6">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-red-100 flex items-center justify-center shrink-0">
                    <Trash2 size={18} className="text-red-600" />
                  </div>
                  <div className="flex-1">
                    <h2 className="text-sm font-semibold text-red-700">
                      Delete account
                    </h2>
                    <p className="mt-1 text-xs text-slate-500 max-w-xl leading-relaxed">
                      Permanently delete your account and all
                      application data. This action cannot be undone.
                    </p>
                    <button
                      type="button"
                      onClick={() => setDeleteOpen(true)}
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

      {/* ================================================= */}
      {/* BOTTOM FADE-IN EFFECT */}
      {/* ================================================= */}
      <div className="fixed bottom-0 left-0 right-0 h-28 bg-gradient-to-t from-[#f5f7fb] via-[#f5f7fb]/80 to-transparent z-30 pointer-events-none" />

      {/* ================================================= */}
      {/* MODALS */}
      {/* ================================================= */}

      {passwordOpen && (
        <ChangePasswordModal
          onCancel={() => setPasswordOpen(false)}
          onSuccess={() => setPasswordOpen(false)}
        />
      )}

      {signOutOpen && (
        <SignOutModal
          onCancel={() => setSignOutOpen(false)}
          onConfirm={() => {
            setSignOutOpen(false);
          }}
        />
      )}

      {deleteOpen && (
        <DeleteAccountModal
          onCancel={() => setDeleteOpen(false)}
          onConfirm={() => setDeleteOpen(false)}
        />
      )}

      <style jsx global>{`
        html, body {
          scroll-behavior: smooth;
        }

        /* Hide scrollbar for Chrome, Safari and Opera */
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }

        /* Hide scrollbar for IE, Edge and Firefox */
        .scrollbar-hide {
          -ms-overflow-style: none;  /* IE and Edge */
          scrollbar-width: none;  /* Firefox */
        }
      `}</style>
    </div>
  );
}