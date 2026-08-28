"use client";

import React, { useState } from "react";

type Profile = {
  fullName: string;
  email: string;
  program: string;
  targetRole: string;
  targetLocation: string;
  theme: "light" | "dark" | "system";
  landingTab: string;
};

const Icon = ({
  name,
  className = "w-5 h-5",
}: {
  name: string;
  className?: string;
}) => {
  const common = {
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.8,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
  };

  const paths: Record<string, React.ReactNode> = {
    user: (
      <>
        <circle cx="12" cy="8" r="4" {...common} />
        <path d="M5 20a7 7 0 0 1 14 0" {...common} />
      </>
    ),
    briefcase: (
      <>
        <rect x="3" y="7" width="18" height="13" rx="2" {...common} />
        <path d="M8 7V5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" {...common} />
        <path d="M3 12h18" {...common} />
        <path d="M10 12v2h4v-2" {...common} />
      </>
    ),
    settings: (
      <>
        <path
          d="M12 15.5a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7Z"
          {...common}
        />
        <path
          d="M19.4 15a1.7 1.7 0 0 0 .34 1.88l.06.06-1.7 1.7-.06-.06a1.7 1.7 0 0 0-1.88-.34 1.7 1.7 0 0 0-1.03 1.56V20h-2.4v-.2a1.7 1.7 0 0 0-1.03-1.56 1.7 1.7 0 0 0-1.88.34l-.06.06-1.7-1.7.06-.06A1.7 1.7 0 0 0 8.46 15a1.7 1.7 0 0 0-1.56-1.03H6.7v-2.4h.2A1.7 1.7 0 0 0 8.46 10a1.7 1.7 0 0 0-.34-1.88l-.06-.06 1.7-1.7.06.06a1.7 1.7 0 0 0 1.88.34 1.7 1.7 0 0 0 1.03-1.56V5h2.4v.2a1.7 1.7 0 0 0 1.03 1.56 1.7 1.7 0 0 0 1.88-.34l.06-.06 1.7 1.7-.06.06A1.7 1.7 0 0 0 19.4 10a1.7 1.7 0 0 0 1.56 1.03h.2v2.4h-.2A1.7 1.7 0 0 0 19.4 15Z"
          {...common}
        />
      </>
    ),
    lock: (
      <>
        <rect x="4" y="10" width="16" height="11" rx="2" {...common} />
        <path d="M8 10V7a4 4 0 0 1 8 0v3" {...common} />
        <path d="M12 14v3" {...common} />
      </>
    ),
    monitor: (
      <>
        <rect x="3" y="4" width="18" height="13" rx="2" {...common} />
        <path d="M8 21h8M12 17v4" {...common} />
      </>
    ),
    chevron: <path d="m7 10 5 5 5-5" {...common} />,
    check: <path d="m5 12 4 4L19 6" {...common} />,
    arrow: <path d="M5 12h14m-6-6 6 6-6 6" {...common} />,
    key: (
      <>
        <circle cx="8" cy="15" r="4" {...common} />
        <path d="m11 12 8-8M16 7l2 2M14 9l2 2" {...common} />
      </>
    ),
    logout: (
      <>
        <path d="M10 17l5-5-5-5" {...common} />
        <path d="M15 12H3" {...common} />
        <path d="M14 4h5v16h-5" {...common} />
      </>
    ),
    mail: (
      <>
        <rect x="3" y="5" width="18" height="14" rx="2" {...common} />
        <path d="m3 7 9 6 9-6" {...common} />
      </>
    ),
    map: (
      <>
        <path d="m9 18-6 3V6l6-3 6 3 6-3v15l-6 3-6-3Z" {...common} />
        <path d="M9 3v15M15 6v15" {...common} />
      </>
    ),
    alert: (
      <>
        <path d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" {...common} />
      </>
    ),
  };

  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true">
      {paths[name]}
    </svg>
  );
};

function SectionHeader({
  icon,
  title,
  description,
}: {
  icon: string;
  title: string;
  description?: string;
}) {
  return (
    <div className="flex items-start gap-4 pb-5 border-b border-slate-100">
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-slate-700">
        <Icon name={icon} className="h-5 w-5" />
      </div>

      <div>
        <h2 className="text-[16px] font-bold tracking-tight text-slate-900">
          {title}
        </h2>

        {description && (
          <p className="mt-1 text-[13px] leading-5 text-slate-400">
            {description}
          </p>
        )}
      </div>
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
  disabled = false,
  type = "text",
  hint,
  placeholder,
}: {
  label: string;
  value: string;
  onChange?: (value: string) => void;
  disabled?: boolean;
  type?: string;
  hint?: string;
  placeholder?: string;
}) {
  return (
    <div>
      <div className="mb-2 flex items-center justify-between">
        <label className="text-[11px] font-bold uppercase tracking-[0.12em] text-slate-400">
          {label}
        </label>

        {hint && (
          <span className="text-[11px] font-medium text-slate-400">{hint}</span>
        )}
      </div>

      <input
        type={type}
        disabled={disabled}
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange?.(e.target.value)}
        className={`
          h-12 w-full rounded-xl border px-4 text-[14px] font-medium
          outline-none transition-all
          ${
            disabled
              ? "cursor-not-allowed border-slate-100 bg-slate-50 text-slate-400"
              : "border-slate-200 bg-[#FAFAF8] text-slate-800 hover:border-slate-300 focus:border-slate-400 focus:bg-white focus:ring-4 focus:ring-slate-100"
          }
        `}
      />
    </div>
  );
}

export default function SettingsPage() {
  const [profile, setProfile] = useState<Profile>({
    fullName: "Paul Nerie B. Aguirre",
    email: "paul.aguirre@basc.edu.ph",
    program: "BS Information Technology",
    targetRole: "Software Engineer Intern",
    targetLocation: "Candaba, Pampanga",
    theme: "light",
    landingTab: "Dashboard",
  });

  const [saved, setSaved] = useState(false);

  // Modal States
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  // Two-step Password Flow State
  const [passwordStep, setPasswordStep] = useState<"otp" | "change">("otp");
  const [otpCode, setOtpCode] = useState("");
  const [passwordForm, setPasswordForm] = useState({
    current: "",
    new: "",
    confirm: "",
  });

  const update = <K extends keyof Profile>(key: K, value: Profile[K]) => {
    setProfile((prev) => ({
      ...prev,
      [key]: value,
    }));
    setSaved(false);
  };

  const saveChanges = () => {
    setSaved(true);
    setTimeout(() => {
      setSaved(false);
    }, 2500);
  };

  const closePasswordModal = () => {
    setIsPasswordModalOpen(false);
    // Delay resetting the form so the user doesn't see it switch back while fading out
    setTimeout(() => {
      setPasswordStep("otp");
      setOtpCode("");
      setPasswordForm({ current: "", new: "", confirm: "" });
    }, 300);
  };

  return (
    <main className="min-h-screen bg-[#F6F6F3] px-4 pb-32 font-sans text-slate-900 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        {/* STICKY PAGE HEADER WRAPPER */}
        <div className="sticky top-0 z-40 bg-[#F6F6F3] pt-5 pb-6">
          <header className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-[0_10px_35px_rgba(15,23,42,0.06)]">
            <div className="flex flex-col gap-5 px-5 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-7">
              <div className="flex items-center gap-4">
                <div className="hidden h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-slate-900 text-sm font-bold text-white sm:flex">
                  PA
                </div>
                <div>
                  <div className="mb-1 flex items-center gap-2">
                    <span className="text-[10px] font-extrabold uppercase tracking-[0.18em] text-slate-400">
                      Settings
                    </span>
                    <span className="h-1 w-1 rounded-full bg-slate-300" />
                    <span className="text-[10px] font-semibold text-slate-400">
                      Account
                    </span>
                  </div>
                  <h1 className="text-xl font-extrabold tracking-tight text-slate-950 sm:text-2xl">
                    Account Settings
                  </h1>
                  <p className="mt-1 hidden text-[13px] font-medium text-slate-400 sm:block">
                    Manage your profile, application defaults, and preferences.
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                {saved && (
                  <div className="flex items-center gap-2 text-[12px] font-semibold text-emerald-600">
                    <span className="flex h-5 w-5 items-center justify-center rounded-full bg-emerald-50">
                      <Icon name="check" className="h-3.5 w-3.5" />
                    </span>
                    Saved
                  </div>
                )}
                <button
                  onClick={saveChanges}
                  className="flex h-10 items-center gap-2 rounded-xl bg-slate-900 px-4 text-[12px] font-bold text-white shadow-sm transition hover:bg-slate-800 active:scale-[0.98]"
                >
                  Save Changes
                  <Icon name="arrow" className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
            {/* Accent progress line */}
            <div className="h-[3px] bg-gradient-to-r from-slate-900 via-slate-600 to-slate-200" />
          </header>
        </div>

        {/* MAIN CONTENT */}
        <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-12">
          {/* LEFT */}
          <div className="space-y-6 lg:col-span-7">
            {/* PROFILE */}
            <section className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-[0_5px_25px_rgba(15,23,42,0.035)] sm:p-7">
              <SectionHeader
                icon="user"
                title="Account Profile"
                description="Your personal and academic information."
              />
              <div className="mt-6 space-y-5">
                <Field
                  label="Full Name"
                  value={profile.fullName}
                  onChange={(value) => update("fullName", value)}
                />

                {/* Removed the hint="Managed by university" */}
                <Field label="Email" value={profile.email} />

                <Field
                  label="Program / Major"
                  value={profile.program}
                  onChange={(value) => update("program", value)}
                />
              </div>

              <div className="mt-6 flex flex-col gap-3 rounded-xl border border-slate-100 bg-[#FAFAF8] p-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="text-[13px] font-bold text-slate-800">
                    Account security
                  </p>
                  <p className="mt-0.5 text-[11px] text-slate-400">
                    Keep your account protected with a strong password.
                  </p>
                </div>
                {/* Trigger Password Modal */}
                <button
                  onClick={() => setIsPasswordModalOpen(true)}
                  className="flex h-9 items-center justify-center gap-2 rounded-lg border border-slate-200 bg-white px-3 text-[11px] font-bold text-slate-700 transition hover:bg-slate-50"
                >
                  <Icon name="key" className="h-3.5 w-3.5" />
                  Reset Password
                </button>
              </div>
            </section>

            {/* APPLICATION DEFAULTS */}
            <section className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-[0_5px_25px_rgba(15,23,42,0.035)] sm:p-7">
              <SectionHeader
                icon="briefcase"
                title="Application Defaults"
                description="Pre-fill these preferences when creating applications."
              />
              <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2">
                <Field
                  label="Target Role"
                  value={profile.targetRole}
                  onChange={(value) => update("targetRole", value)}
                />
                <Field
                  label="Preferred Location"
                  value={profile.targetLocation}
                  onChange={(value) => update("targetLocation", value)}
                />
              </div>

              {/* Preview */}
              <div className="mt-6 rounded-xl border border-dashed border-slate-200 p-4">
                <div className="mb-3 flex items-center gap-2">
                  <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-slate-100">
                    <Icon
                      name="briefcase"
                      className="h-3.5 w-3.5 text-slate-600"
                    />
                  </span>
                  <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
                    Application Preview
                  </span>
                </div>
                <div className="flex flex-col gap-1">
                  <span className="text-[14px] font-bold text-slate-800">
                    {profile.targetRole}
                  </span>
                  <span className="flex items-center gap-1.5 text-[11px] font-medium text-slate-400">
                    <Icon name="map" className="h-3 w-3" />
                    {profile.targetLocation}
                  </span>
                </div>
              </div>
            </section>
          </div>

          {/* RIGHT */}
          <div className="space-y-6 lg:col-span-5">
            {/* PREFERENCES */}
            <section className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-[0_5px_25px_rgba(15,23,42,0.035)] sm:p-7">
              <SectionHeader
                icon="settings"
                title="System Preferences"
                description="Customize how the application behaves."
              />
              <div className="mt-6 space-y-6">
                {/* Appearance */}
                <div>
                  <label className="mb-3 block text-[11px] font-bold uppercase tracking-[0.12em] text-slate-400">
                    Appearance
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { value: "light", label: "Light" },
                      { value: "system", label: "System" },
                      { value: "dark", label: "Dark" },
                    ].map((option) => {
                      const active = profile.theme === option.value;
                      return (
                        <button
                          key={option.value}
                          onClick={() =>
                            update("theme", option.value as Profile["theme"])
                          }
                          className={`
                            relative flex h-11 items-center justify-center rounded-xl border text-[11px] font-bold transition
                            ${
                              active
                                ? "border-slate-900 bg-slate-900 text-white shadow-sm"
                                : "border-slate-200 bg-[#FAFAF8] text-slate-500 hover:border-slate-300 hover:bg-white"
                            }
                          `}
                        >
                          {option.label}
                          {active && (
                            <span className="absolute right-2 top-2">
                              <Icon name="check" className="h-3 w-3" />
                            </span>
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Landing page */}
                <div>
                  <label className="mb-3 block text-[11px] font-bold uppercase tracking-[0.12em] text-slate-400">
                    Default Landing Page
                  </label>
                  <div className="relative">
                    <select
                      value={profile.landingTab}
                      onChange={(e) => update("landingTab", e.target.value)}
                      className="h-12 w-full appearance-none rounded-xl border border-slate-200 bg-[#FAFAF8] px-4 pr-10 text-[13px] font-semibold text-slate-800 outline-none transition hover:border-slate-300 focus:border-slate-400 focus:bg-white focus:ring-4 focus:ring-slate-100"
                    >
                      <option>Dashboard</option>
                      <option>Applications</option>
                      <option>Reports & Analytics</option>
                    </select>
                    <Icon
                      name="chevron"
                      className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400"
                    />
                  </div>
                </div>
              </div>
            </section>

            {/* SECURITY */}
            <section className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-[0_5px_25px_rgba(15,23,42,0.035)]">
              <div className="p-5 sm:p-7">
                <SectionHeader
                  icon="lock"
                  title="Security"
                  description="Manage access to your account."
                />

                <div className="mt-6 divide-y divide-slate-100">
                  <button
                    onClick={() => setIsPasswordModalOpen(true)}
                    className="group flex w-full items-center gap-4 py-4 text-left"
                  >
                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-slate-50 text-slate-500 transition group-hover:bg-slate-100">
                      <Icon name="key" className="h-4 w-4" />
                    </div>
                    <div className="flex-1">
                      <p className="text-[13px] font-bold text-slate-800">
                        Change password
                      </p>
                      <p className="mt-0.5 text-[11px] text-slate-400">
                        Update your account password
                      </p>
                    </div>
                    <Icon
                      name="arrow"
                      className="h-4 w-4 text-slate-300 transition group-hover:translate-x-0.5 group-hover:text-slate-600"
                    />
                  </button>
                </div>
              </div>

              {/* Sign out */}
              <button className="flex w-full items-center gap-3 border-t border-slate-100 bg-slate-50/70 px-5 py-4 text-left transition hover:bg-slate-100 sm:px-7">
                <Icon name="logout" className="h-4 w-4 text-slate-500" />
                <span className="text-[12px] font-bold text-slate-600">
                  Sign out of account
                </span>
              </button>
            </section>

            {/* DANGER ZONE */}
            <section className="rounded-2xl border border-red-100 bg-red-50/40 p-5 sm:p-6">
              <div className="flex gap-3">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-red-100 text-red-500">
                  <Icon name="alert" className="h-5 w-5" />
                </div>
                <div className="flex-1">
                  <h3 className="text-[13px] font-bold text-red-800">
                    Delete account
                  </h3>
                  <p className="mt-1 text-[11px] leading-5 text-red-600/70">
                    Permanently delete your account and all associated
                    application data. This action cannot be undone.
                  </p>

                  <button
                    onClick={() => setIsDeleteModalOpen(true)}
                    className="mt-4 rounded-lg border border-red-200 bg-white px-3 py-2 text-[11px] font-bold text-red-600 transition hover:bg-red-50"
                  >
                    Delete Account
                  </button>
                </div>
              </div>
            </section>
          </div>
        </div>
      </div>

      {/* --- MODALS --- */}

      {/* Change Password Modal (Two-Step: OTP -> New Password) */}
      {isPasswordModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/40 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl animate-in fade-in zoom-in duration-200">
            {passwordStep === "otp" ? (
              // Step 1: OTP Verification
              <>
                <h3 className="text-lg font-bold text-slate-900">
                  Verify your identity
                </h3>
                <p className="mb-6 mt-1 text-[13px] leading-5 text-slate-500">
                  We've sent a 6-digit security code to your email. Please enter it below to authorize this change.
                </p>

                <div className="space-y-4">
                  <Field
                    label="Authentication Code"
                    type="text"
                    placeholder="Enter 6-digit code"
                    value={otpCode}
                    onChange={setOtpCode}
                  />
                </div>

                <div className="mt-8 flex flex-col-reverse justify-end gap-3 sm:flex-row">
                  <button
                    onClick={closePasswordModal}
                    className="rounded-xl px-4 py-2.5 text-[13px] font-bold text-slate-600 transition hover:bg-slate-100"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => setPasswordStep("change")}
                    className="rounded-xl bg-slate-900 px-6 py-2.5 text-[13px] font-bold text-white shadow-sm transition hover:bg-slate-800"
                  >
                    Verify OTP
                  </button>
                </div>
              </>
            ) : (
              // Step 2: Set New Password
              <>
                <h3 className="text-lg font-bold text-slate-900">
                  Change Password
                </h3>
                <p className="mb-6 mt-1 text-[13px] text-slate-500">
                  Create a new password that is at least 8 characters long.
                </p>

                <div className="space-y-4">
                  <Field
                    label="Current Password"
                    type="password"
                    value={passwordForm.current}
                    onChange={(val) =>
                      setPasswordForm({ ...passwordForm, current: val })
                    }
                  />
                  <Field
                    label="New Password"
                    type="password"
                    value={passwordForm.new}
                    onChange={(val) =>
                      setPasswordForm({ ...passwordForm, new: val })
                    }
                  />
                  <Field
                    label="Confirm New Password"
                    type="password"
                    value={passwordForm.confirm}
                    onChange={(val) =>
                      setPasswordForm({ ...passwordForm, confirm: val })
                    }
                  />
                </div>

                <div className="mt-8 flex flex-col-reverse justify-end gap-3 sm:flex-row">
                  <button
                    onClick={closePasswordModal}
                    className="rounded-xl px-4 py-2.5 text-[13px] font-bold text-slate-600 transition hover:bg-slate-100"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={closePasswordModal}
                    className="rounded-xl bg-slate-900 px-6 py-2.5 text-[13px] font-bold text-white shadow-sm transition hover:bg-slate-800"
                  >
                    Update Password
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {/* Delete Account Confirmation Modal */}
      {isDeleteModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/40 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-2xl border border-red-100 bg-white p-6 shadow-2xl animate-in fade-in zoom-in duration-200">
            <div className="mb-3 flex items-center gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-red-100 text-red-600">
                <Icon name="alert" className="h-5 w-5" />
              </div>
              <h3 className="text-lg font-bold text-red-600">
                Delete Account?
              </h3>
            </div>
            <p className="mb-6 leading-relaxed text-[13px] text-slate-600">
              Are you absolutely sure you want to delete your account? All of
              your tracked applications, interview notes, and profile data will
              be <strong>permanently removed</strong>. This action cannot be
              undone.
            </p>

            <div className="mt-8 flex flex-col-reverse justify-end gap-3 sm:flex-row">
              <button
                onClick={() => setIsDeleteModalOpen(false)}
                className="rounded-xl px-4 py-2.5 text-[13px] font-bold text-slate-600 transition hover:bg-slate-100"
              >
                No, keep my account
              </button>
              <button
                onClick={() => setIsDeleteModalOpen(false)}
                className="rounded-xl bg-red-600 px-6 py-2.5 text-[13px] font-bold text-white shadow-sm transition hover:bg-red-700"
              >
                Yes, delete it
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}