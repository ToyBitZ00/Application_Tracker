'use client';

import { useEffect, useState, type ReactNode } from 'react';
import {
  User,
  SlidersHorizontal,
  Palette,
  ChevronRight,
  LogOut,
  Mail,
  Key,
  X,
  Shield,
  Power,
  Check,
} from 'lucide-react';

/* ================================================= */
/* TYPES & CONSTANTS */
/* ================================================= */

/* ================================================= */
/* HELPER COMPONENTS */
/* ================================================= */

function SettingsSection({ children }: { children: ReactNode }) {
  return (
    <section className="bg-white/90 backdrop-blur-xl border border-slate-200/80 rounded-2xl overflow-hidden shadow-sm">
      {children}
    </section>
  );
}

function SectionHeader({ icon, title, description }: { icon: ReactNode; title: string; description: string }) {
  return (
    <div className="px-6 md:px-7 py-5 border-b border-slate-200">
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600">
          {icon}
        </div>
        <div>
          <h2 className="text-sm font-semibold text-slate-950">
            {title}
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            {description}
          </p>
        </div>
      </div>
    </div>
  );
}

function InputField({ label, placeholder, value, onChange, disabled = false }: { label: string; placeholder: string; value?: string; onChange?: (v: string) => void; disabled?: boolean }) {
  return (
    <div>
      <label className="block text-[11px] font-bold uppercase tracking-[0.12em] text-slate-400 mb-2">
        {label}
      </label>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange?.(e.target.value)}
        placeholder={placeholder}
        disabled={disabled}
        className={`w-full h-11 px-4 rounded-xl border border-slate-200 bg-white text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 ${disabled ? 'bg-slate-50 text-slate-500 cursor-not-allowed' : ''}`}
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
      <p className="text-xs text-slate-500 mt-1">
        {description}
      </p>
    </div>
  );
}

function Toggle({ enabled, onClick, danger = false }: { enabled: boolean; onClick: () => void; danger?: boolean }) {
  const activeColor = danger ? 'bg-red-500' : 'bg-blue-600';
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={enabled}
      className={`relative w-11 h-6 rounded-full shrink-0 transition-colors duration-300 ease-in-out focus:outline-none ${
        enabled ? activeColor : 'bg-slate-200'
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
      className="w-full px-6 md:px-7 py-5 flex items-center justify-between text-left hover:bg-slate-50 transition group focus:outline-none"
    >
      <div className="flex items-center gap-4">
        <div className="w-9 h-9 rounded-lg bg-slate-100 flex items-center justify-center text-slate-500">
          {icon}
        </div>
        <div>
          <p className="text-sm font-medium text-slate-800">
            {title}
          </p>
          <p className="text-xs text-slate-500 mt-1">
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
/* MODALS */
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
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [onCancel]);

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center px-4 sm:p-6">
      <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-300" onClick={onCancel} />
      <div role="dialog" aria-modal="true" className="relative w-full max-w-[460px] bg-slate-50 rounded-3xl shadow-[0_32px_80px_rgba(15,23,42,0.2)] overflow-hidden animate-in fade-in zoom-in-95 slide-in-from-bottom-4 duration-300 border border-slate-200">
        <div className="relative px-6 py-6 bg-blue-50/80 border-b border-blue-100 flex items-start justify-between rounded-t-3xl">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-white shadow-sm border border-blue-100/50 flex shrink-0 items-center justify-center">
              <Key size={24} className="text-blue-600" strokeWidth={2} />
            </div>
            <div>
              <h3 className="text-[11px] font-bold uppercase tracking-[0.15em] text-blue-400 mb-0.5 mt-1">Admin Security</h3>
              <span className="text-2xl font-extrabold text-blue-950 leading-none block">
                {step === 'otp' ? 'Verify Identity' : 'Change Password'}
              </span>
            </div>
          </div>
          <button onClick={onCancel} className="w-8 h-8 rounded-full bg-white border border-blue-200/60 flex shrink-0 items-center justify-center text-blue-400 hover:bg-blue-100 hover:text-blue-600 transition-colors mt-1 shadow-sm focus:outline-none">
            <X size={16} />
          </button>
        </div>
        <div className="px-6 py-6">
          {step === 'otp' ? (
            <div className="animate-in fade-in duration-300">
              <p className="text-sm text-slate-500 mb-6 leading-relaxed">
                We've sent a 6-digit security code to the master admin email. Please enter it below to authorize this change.
              </p>
              <div className="mb-6">
                <label className="block text-[11px] font-bold uppercase tracking-[0.12em] text-slate-400 mb-2">Authentication Code</label>
                <input type="text" value={otp} onChange={(e) => setOtp(e.target.value)} placeholder="Enter 6-digit code" className="w-full h-11 px-4 rounded-xl border border-slate-200 bg-white text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10" />
              </div>
              <div className="flex items-center justify-end gap-3 mt-8">
                <button type="button" onClick={onCancel} className="text-sm font-semibold text-slate-600 hover:text-slate-950 px-3 py-2 transition">Cancel</button>
                <button type="button" onClick={() => setStep('change')} className="rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-blue-700 transition active:scale-[0.98]">Verify OTP</button>
              </div>
            </div>
          ) : (
            <div className="animate-in fade-in duration-300">
              <div className="space-y-4 mb-6">
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-[0.12em] text-slate-400 mb-2">Current Password</label>
                  <input type="password" value={currentPass} onChange={(e) => setCurrentPass(e.target.value)} className="w-full h-11 px-4 rounded-xl border border-slate-200 bg-white text-sm text-slate-800 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10" />
                </div>
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-[0.12em] text-slate-400 mb-2">New Password</label>
                  <input type="password" value={newPass} onChange={(e) => setNewPass(e.target.value)} className="w-full h-11 px-4 rounded-xl border border-slate-200 bg-white text-sm text-slate-800 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10" />
                </div>
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-[0.12em] text-slate-400 mb-2">Confirm New Password</label>
                  <input type="password" value={confirmPass} onChange={(e) => setConfirmPass(e.target.value)} className="w-full h-11 px-4 rounded-xl border border-slate-200 bg-white text-sm text-slate-800 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10" />
                </div>
              </div>
              <div className="flex items-center justify-end gap-3 mt-8">
                <button type="button" onClick={onCancel} className="text-sm font-semibold text-slate-600 hover:text-slate-950 px-3 py-2 transition">Cancel</button>
                <button type="button" onClick={onSuccess} className="rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-blue-700 transition active:scale-[0.98]">Update Password</button>
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
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [onCancel]);

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center px-4 sm:p-6">
      <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-300" onClick={onCancel} />
      <div role="dialog" aria-modal="true" className="relative w-full max-w-[420px] bg-slate-50 rounded-3xl shadow-[0_32px_80px_rgba(15,23,42,0.2)] overflow-hidden animate-in fade-in zoom-in-95 slide-in-from-bottom-4 duration-300 border border-slate-200">
        <div className="relative px-6 py-6 bg-slate-100/80 border-b border-slate-200 flex items-start justify-between rounded-t-3xl">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-white shadow-sm border border-slate-200/50 flex shrink-0 items-center justify-center">
              <LogOut size={24} className="text-slate-600" strokeWidth={2} />
            </div>
            <div>
              <h3 className="text-[11px] font-bold uppercase tracking-[0.15em] text-slate-500 mb-0.5 mt-1">Session</h3>
              <span className="text-2xl font-extrabold text-slate-950 leading-none block">Sign Out</span>
            </div>
          </div>
          <button onClick={onCancel} className="w-8 h-8 rounded-full bg-white border border-slate-300/60 flex shrink-0 items-center justify-center text-slate-500 hover:bg-slate-200 transition-colors mt-1 shadow-sm focus:outline-none">
            <X size={16} />
          </button>
        </div>
        <div className="px-6 py-6">
          <p className="text-sm leading-relaxed text-slate-500">
            Are you sure you want to sign out of the Admin panel? You will need your master credentials to log back in.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-end gap-3">
            <button type="button" onClick={onCancel} className="text-sm font-semibold text-slate-600 hover:text-slate-950 px-3 py-2 transition">Cancel</button>
            <button type="button" onClick={onConfirm} className="rounded-xl bg-slate-900 px-5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-slate-800 transition active:scale-[0.98]">Sign Out</button>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ================================================= */
/* MAIN PAGE COMPONENT */
/* ================================================= */

export default function AdminSettingsPage() {
  // Admin-Specific Toggles
  const [allowRegistrations, setAllowRegistrations] = useState(true);

  const [passwordOpen, setPasswordOpen] = useState(false);
  const [signOutOpen, setSignOutOpen] = useState(false);

  const [profileSaved, setProfileSaved] = useState(false);
  
  const [profile, setProfile] = useState({
    fullName: 'System Administrator',
    email: 'admin@basc.edu.ph',
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
    <>
      {/* ================================================= */}
      {/* BACKGROUND DESIGN (UNIFIED) */}
      {/* ================================================= */}
      <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
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
        className="absolute inset-0 pointer-events-none opacity-[0.35] z-0"
        style={{
          backgroundImage: `
            linear-gradient(to right, rgba(148, 163, 184, 0.18) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(148, 163, 184, 0.18) 1px, transparent 1px)
          `,
          backgroundSize: '48px 48px',
          maskImage: 'linear-gradient(to bottom, transparent, rgba(0,0,0,0.78) 18%, rgba(0,0,0,0.9) 82%, transparent)',
          WebkitMaskImage: 'linear-gradient(to bottom, transparent, rgba(0,0,0,0.78) 18%, rgba(0,0,0,0.9) 82%, transparent)',
        }}
      />

      {/* ================================================= */}
      {/* FIXED HEADER (TRANSPARENT & UNIFIED) */}
      {/* ================================================= */}
      <div className="relative z-40 w-full shrink-0 pt-8 pb-4 bg-transparent pointer-events-none">
        <div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-8 pointer-events-auto">
          <header className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-5 animate-header-in">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <div className="w-2 h-2 rounded-full bg-blue-600" />
                <p className="text-xs font-bold uppercase tracking-[0.18em] text-blue-600">
                  Administration
                </p>
              </div>
              <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-slate-950">
                System Settings
              </h1>
              <p className="mt-2 text-sm md:text-base text-slate-500">
                Manage master account and platform configurations.
              </p>
            </div>
          </header>
        </div>
      </div>

      {/* ================================================= */}
      {/* SCROLLABLE CONTENT */}
      {/* ================================================= */}
      <main 
        className="flex-1 overflow-y-auto overflow-x-hidden relative z-10 w-full scroll-smooth scrollbar-hide"
        style={{
          maskImage: 'linear-gradient(to bottom, transparent 0px, black 24px, black calc(100% - 60px), transparent 100%)',
          WebkitMaskImage: 'linear-gradient(to bottom, transparent 0px, black 24px, black calc(100% - 60px), transparent 100%)',
        }}
      >
        <div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-8 pt-8 pb-32 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="space-y-6">
            
            {/* MASTER PROFILE */}
            <SettingsSection>
              <SectionHeader
                icon={<User size={18} />}
                title="Master Profile"
                description="Your administrative credentials"
              />
              <div className="p-6 md:p-7">
                <div className="flex flex-col sm:flex-row gap-6">
                  <div className="shrink-0">
                    <div className="w-[76px] h-[76px] rounded-2xl bg-blue-600 flex items-center justify-center text-white text-xl font-semibold shadow-sm">
                      SA
                    </div>
                  </div>
                  <div className="flex-1">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                      <InputField
                        label="Admin Full Name"
                        placeholder="Administrator Name"
                        value={profile.fullName}
                        onChange={(v) => handleUpdateProfile('fullName', v)}
                      />
                      
                      {/* Email Field */}
                      <div>
                        <label className="block text-[11px] font-bold uppercase tracking-[0.12em] text-slate-400 mb-2">
                          Master Email Address
                        </label>
                        <div className="relative">
                          <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                          <input
                            type="email"
                            value={profile.email}
                            onChange={(e) => handleUpdateProfile('email', e.target.value)}
                            placeholder="admin@example.com"
                            className="w-full h-11 pl-10 pr-4 rounded-xl border border-slate-200 bg-white text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
                          />
                        </div>
                      </div>

                      {/* Admin Role (Disabled) */}
                      <InputField
                        label="System Role"
                        placeholder="Super Administrator"
                        value="Super Administrator"
                        disabled={true}
                      />
                    </div>
                    
                    <div className="mt-6 flex items-center justify-end gap-4">
                      <div className={`flex items-center gap-1.5 text-sm font-semibold text-emerald-600 transition-all duration-300 ${profileSaved ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-2 pointer-events-none'}`}>
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

            {/* PLATFORM CONFIGURATIONS */}
            <SettingsSection>
              <SectionHeader
                icon={<SlidersHorizontal size={18} />}
                title="Platform Configurations"
                description="Manage global system behavior"
              />
              <div className="divide-y divide-slate-100">
                <div className="px-6 md:px-7 py-5 flex items-center justify-between gap-5">
                  <SettingText
                    title="Allow New Registrations"
                    description="Enable or disable students from creating new accounts on the platform."
                  />
                  <Toggle
                    enabled={allowRegistrations}
                    onClick={() => setAllowRegistrations((prev) => !prev)}
                  />
                </div>
              </div>
            </SettingsSection>

            {/* APPEARANCE */}
            <SettingsSection>
              <SectionHeader
                icon={<Palette size={18} />}
                title="Appearance"
                description="Current admin interface styling"
              />
              <div className="p-6 md:p-7">
                <div className="flex items-center justify-between gap-4 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
                  <div>
                    <p className="text-sm font-semibold text-slate-800">Light mode</p>
                    <p className="text-xs text-slate-500 mt-1">The admin panel remains on the standard bright layout.</p>
                  </div>
                  <span className="inline-flex items-center rounded-full bg-blue-100 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-blue-700">
                    Active
                  </span>
                </div>
              </div>
            </SettingsSection>

            {/* ACCOUNT SECURITY */}
            <SettingsSection>
              <SectionHeader
                icon={<Shield size={18} />}
                title="Security & Session"
                description="Manage your master account access"
              />
              <div className="divide-y divide-slate-100">
                <ActionRow
                  icon={<Key size={18} />}
                  title="Change Admin Password"
                  description="Update the master account password."
                  onClick={() => setPasswordOpen(true)}
                />
                <ActionRow
                  icon={<Power size={18} />}
                  title="Sign out of Admin Panel"
                  description="Securely log out of the system."
                  onClick={() => setSignOutOpen(true)}
                />
              </div>
            </SettingsSection>

            {/* FOOTER */}
            <footer className="text-center pt-4 pb-8">
              <p className="text-xs font-medium text-slate-400">
                Application Tracker Admin Interface
              </p>
              <p className="text-[10px] text-slate-300 mt-1 uppercase tracking-wider font-bold">
                v1.0.0
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

      {/* GLOBAL STYLES */}
      <style jsx global>{`
        @keyframes header-in {
          from { opacity: 0; transform: translateY(-12px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-header-in { animation: header-in 0.4s ease-out forwards; }
      `}</style>
    </>
  );
}