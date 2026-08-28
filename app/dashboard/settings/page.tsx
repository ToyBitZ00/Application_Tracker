'use client';

import { useState } from 'react';
import {
  User,
  Bell,
  SlidersHorizontal,
  Palette,
  Download,
  ShieldCheck,
  ChevronRight,
  LogOut,
  Trash2,
  Mail,
  GraduationCap,
  Sun,
  Moon,
  Monitor,
  Check,
} from 'lucide-react';

type Theme = 'light' | 'dark' | 'system';

export default function SettingsPage() {
  const [theme, setTheme] = useState<Theme>('light');

  const [autoRounds, setAutoRounds] = useState(true);

  const [notifications, setNotifications] = useState({
    interview: true,
    followUp: true,
    updates: false,
  });

  const toggleNotification = (
    key: keyof typeof notifications
  ) => {
    setNotifications((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#f5f7fb]">

      {/* ================================================= */}
      {/* BACKGROUND DESIGN */}
      {/* ================================================= */}

      <div className="pointer-events-none absolute inset-0 overflow-hidden">

        {/* Top-left blue glow */}
        <div className="absolute -top-40 -left-40 w-[420px] h-[420px] rounded-full bg-blue-500/10 blur-3xl animate-pulse" />

        {/* Bottom-right indigo glow */}
        <div
          className="absolute -bottom-48 -right-40 w-[500px] h-[500px] rounded-full bg-indigo-500/10 blur-3xl animate-pulse"
          style={{ animationDelay: '1.5s' }}
        />

        {/* Center subtle blue glow */}
        <div
          className="absolute top-1/3 right-1/4 w-72 h-72 rounded-full bg-blue-400/5 blur-3xl animate-pulse"
          style={{ animationDelay: '3s' }}
        />

      </div>


      {/* ================================================= */}
      {/* SQUARE GRID */}
      {/* ================================================= */}

      <div
        className="pointer-events-none absolute inset-0 opacity-[0.35]"
        style={{
          backgroundImage: `
            linear-gradient(to right, #cbd5e1 1px, transparent 1px),
            linear-gradient(to bottom, #cbd5e1 1px, transparent 1px)
          `,
          backgroundSize: '48px 48px',
          maskImage:
            'linear-gradient(to bottom, transparent, black 15%, black 85%, transparent)',
          WebkitMaskImage:
            'linear-gradient(to bottom, transparent, black 15%, black 85%, transparent)',
        }}
      />


      {/* ================================================= */}
      {/* CONTENT */}
      {/* ================================================= */}

      <main className="relative z-10 max-w-7xl mx-auto px-5 sm:px-6 lg:px-8 py-8 lg:py-10">

        {/* ================= HEADER ================= */}

        <header className="mb-8">

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
                notifications, and account data.
              </p>

            </div>

          </div>

        </header>


        {/* ================= SETTINGS CONTENT ================= */}

        <div className="space-y-5">


          {/* ================= PROFILE ================= */}

          <section className="bg-white/95 backdrop-blur-xl border border-slate-200/80 rounded-2xl overflow-hidden shadow-sm">

            <SectionHeader
              icon={<User size={18} />}
              title="Profile"
              description="Your personal information"
            />

            <div className="p-6 md:p-7">

              <div className="flex flex-col sm:flex-row gap-6">

                {/* Avatar */}

                <div className="shrink-0">

                  <div className="w-[76px] h-[76px] rounded-2xl bg-blue-600 flex items-center justify-center text-white text-xl font-semibold shadow-sm shadow-blue-600/20">
                    RK
                  </div>

                  <button className="mt-2 text-xs font-semibold text-blue-600 hover:text-blue-700 transition">
                    Change photo
                  </button>

                </div>


                {/* Profile Fields */}

                <div className="flex-1">

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

                    <InputField
                      label="Full Name"
                      placeholder="Your full name"
                    />


                    {/* Email */}

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
                          placeholder="you@example.com"
                          className="w-full h-11 pl-10 pr-4 rounded-xl border border-slate-200 bg-white text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
                        />

                      </div>

                    </div>


                    {/* Course */}

                    <div>

                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        Course / Program
                      </label>

                      <div className="relative">

                        <GraduationCap
                          size={17}
                          className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
                        />

                        <input
                          type="text"
                          placeholder="e.g. BSCS"
                          className="w-full h-11 pl-10 pr-4 rounded-xl border border-slate-200 bg-white text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
                        />

                      </div>

                    </div>


                    {/* Year Level */}

                    <div>

                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        Year Level
                      </label>

                      <select
                        defaultValue=""
                        className="w-full h-11 px-4 rounded-xl border border-slate-200 bg-white text-sm text-slate-600 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
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


                  <div className="mt-6 flex justify-end">

                    <button className="px-5 py-2.5 rounded-xl bg-blue-600 text-white text-sm font-semibold hover:bg-blue-700 active:bg-blue-800 transition shadow-sm shadow-blue-600/20">
                      Save Changes
                    </button>

                  </div>

                </div>

              </div>

            </div>

          </section>


          {/* ================= APPLICATION PREFERENCES ================= */}

          <section className="bg-white/95 backdrop-blur-xl border border-slate-200/80 rounded-2xl overflow-hidden shadow-sm">

            <SectionHeader
              icon={<SlidersHorizontal size={18} />}
              title="Application Preferences"
              description="Customize how applications are managed"
            />

            <div className="divide-y divide-slate-100">

              {/* Default Status */}

              <div className="px-6 md:px-7 py-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">

                <SettingText
                  title="Default application status"
                  description="Status assigned when creating a new application"
                />

                <select
                  defaultValue="Applied"
                  className="h-10 px-3.5 rounded-xl border border-slate-200 bg-white text-sm text-slate-600 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
                >

                  <option>Applied</option>
                  <option>Interview</option>
                  <option>Offer</option>

                </select>

              </div>


              {/* Auto Interview */}

              <div className="px-6 md:px-7 py-5 flex items-center justify-between gap-5">

                <SettingText
                  title="Automatically track interview rounds"
                  description="Suggest the next round when an interview is added"
                />

                <Toggle
                  enabled={autoRounds}
                  onClick={() => setAutoRounds(!autoRounds)}
                />

              </div>

            </div>

          </section>


          {/* ================= NOTIFICATIONS ================= */}

          <section className="bg-white/95 backdrop-blur-xl border border-slate-200/80 rounded-2xl overflow-hidden shadow-sm">

            <SectionHeader
              icon={<Bell size={18} />}
              title="Notifications"
              description="Choose which reminders you receive"
            />

            <div className="divide-y divide-slate-100">

              <NotificationRow
                title="Interview reminders"
                description="Get reminded before a scheduled interview."
                enabled={notifications.interview}
                onClick={() => toggleNotification('interview')}
              />

              <NotificationRow
                title="Follow-up reminders"
                description="Get reminded when an application needs attention."
                enabled={notifications.followUp}
                onClick={() => toggleNotification('followUp')}
              />

              <NotificationRow
                title="Application updates"
                description="Receive notifications when application details change."
                enabled={notifications.updates}
                onClick={() => toggleNotification('updates')}
              />

            </div>

          </section>


          {/* ================= APPEARANCE ================= */}

          <section className="bg-white/95 backdrop-blur-xl border border-slate-200/80 rounded-2xl overflow-hidden shadow-sm">

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

                <ThemeCard
                  name="Light"
                  description="Clean and bright"
                  icon={<Sun size={18} />}
                  active={theme === 'light'}
                  onClick={() => setTheme('light')}
                  preview="light"
                />

                <ThemeCard
                  name="Dark"
                  description="Easy on the eyes"
                  icon={<Moon size={18} />}
                  active={theme === 'dark'}
                  onClick={() => setTheme('dark')}
                  preview="dark"
                />

                <ThemeCard
                  name="System"
                  description="Use device preference"
                  icon={<Monitor size={18} />}
                  active={theme === 'system'}
                  onClick={() => setTheme('system')}
                  preview="system"
                />

              </div>

            </div>

          </section>


          {/* ================= DATA & PRIVACY ================= */}

          <section className="bg-white/95 backdrop-blur-xl border border-slate-200/80 rounded-2xl overflow-hidden shadow-sm">

            <SectionHeader
              icon={<ShieldCheck size={18} />}
              title="Data & Privacy"
              description="Manage your application data"
            />

            <div className="divide-y divide-slate-100">

              <ActionRow
                icon={<Download size={18} />}
                title="Export application data"
                description="Download your applications and interview records."
              />

            </div>

          </section>


          {/* ================= ACCOUNT ================= */}

          <section className="bg-white/95 backdrop-blur-xl border border-slate-200/80 rounded-2xl overflow-hidden shadow-sm">

            <SectionHeader
              icon={<User size={18} />}
              title="Account"
              description="Manage your account access"
            />

            <div className="divide-y divide-slate-100">

              <ActionRow
                icon={<LogOut size={18} />}
                title="Sign out"
                description="Sign out from this device."
              />

            </div>

          </section>


          {/* ================= DANGER ZONE ================= */}

          <section className="bg-white/90 backdrop-blur-xl border border-red-200 rounded-2xl overflow-hidden shadow-sm">

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
                    Permanently delete your account and all
                    application data. This action cannot be undone.
                  </p>

                  <button className="mt-4 px-4 py-2 rounded-lg bg-white border border-red-200 text-red-600 text-xs font-semibold hover:bg-red-50 transition">
                    Delete Account
                  </button>

                </div>

              </div>

            </div>

          </section>


          {/* ================= FOOTER ================= */}

          <footer className="text-center pt-2 pb-8">

            <p className="text-xs text-slate-400">
              Application Tracker · Software Engineering 2
            </p>

            <p className="text-[11px] text-slate-300 mt-1">
              Version 1.0.0
            </p>

          </footer>

        </div>

      </main>

    </div>
  );
}


/* ================================================= */
/* SECTION HEADER */
/* ================================================= */

function SectionHeader({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
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


/* ================================================= */
/* INPUT */
/* ================================================= */

function InputField({
  label,
  placeholder,
}: {
  label: string;
  placeholder: string;
}) {
  return (
    <div>

      <label className="block text-sm font-medium text-slate-700 mb-2">
        {label}
      </label>

      <input
        type="text"
        placeholder={placeholder}
        className="w-full h-11 px-4 rounded-xl border border-slate-200 bg-white text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
      />

    </div>
  );
}


/* ================================================= */
/* SETTING TEXT */
/* ================================================= */

function SettingText({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
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


/* ================================================= */
/* TOGGLE */
/* ================================================= */

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
      onClick={onClick}
      aria-pressed={enabled}
      className={`relative w-11 h-6 rounded-full shrink-0 transition-colors ${
        enabled ? 'bg-blue-600' : 'bg-slate-200'
      }`}
    >

      <span
        className={`absolute top-1 w-4 h-4 rounded-full bg-white shadow-sm transition-all ${
          enabled ? 'right-1' : 'left-1'
        }`}
      />

    </button>
  );
}


/* ================================================= */
/* NOTIFICATION */
/* ================================================= */

function NotificationRow({
  title,
  description,
  enabled,
  onClick,
}: {
  title: string;
  description: string;
  enabled: boolean;
  onClick: () => void;
}) {
  return (
    <div className="px-6 md:px-7 py-5 flex items-center justify-between gap-5">

      <SettingText
        title={title}
        description={description}
      />

      <Toggle
        enabled={enabled}
        onClick={onClick}
      />

    </div>
  );
}


/* ================================================= */
/* THEME CARD */
/* ================================================= */

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
  icon: React.ReactNode;
  active: boolean;
  onClick: () => void;
  preview: 'light' | 'dark' | 'system';
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

      {/* Preview */}

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
                : 'text-slate-700'
            }`}
          >
            {icon}
            {name}
          </div>

          <p className="text-[11px] text-slate-400 mt-1">
            {description}
          </p>

        </div>


        {active && (
          <div className="w-5 h-5 rounded-full bg-blue-600 flex items-center justify-center shrink-0">

            <Check
              size={12}
              className="text-white"
            />

          </div>
        )}

      </div>

    </button>
  );
}


/* ================================================= */
/* ACTION ROW */
/* ================================================= */

function ActionRow({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <button className="w-full px-6 md:px-7 py-5 flex items-center justify-between text-left hover:bg-slate-50 transition group">

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