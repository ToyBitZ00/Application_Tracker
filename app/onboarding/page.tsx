'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { AnimatePresence, motion } from 'framer-motion';
import {
  ArrowRight,
  ArrowLeft,
  User,
  GraduationCap,
  ClipboardCheck,
  Check,
} from 'lucide-react';

const COURSES = ['BSCS', 'BSBA', 'BEED', 'BSHM', 'BSEd'];

type FormState = {
  sex: string;
  age: string;
  school: string;
  course: string;
};

const STEPS = [
  { key: 'basic', label: 'Basic Info', icon: User },
  { key: 'academic', label: 'Academic Info', icon: GraduationCap },
  { key: 'review', label: 'Review', icon: ClipboardCheck },
] as const;

export default function OnboardingPage() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState<FormState>({ sex: '', age: '', school: '', course: '' });

  const update = (key: keyof FormState, value: string) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  const isStepValid = (index: number) => {
    if (index === 0) return form.sex !== '' && form.age.trim() !== '';
    if (index === 1) return form.school.trim() !== '' && form.course !== '';
    return true;
  };

  const goNext = () => {
    if (!isStepValid(step)) return;
    setStep((s) => Math.min(s + 1, STEPS.length - 1));
  };

  const goBack = () => setStep((s) => Math.max(s - 1, 0));

  const handleFinish = async () => {
    setSubmitting(true);
    // TODO: persist profile to Supabase, then fetch recommended companies for form.course
    // on the dashboard (superadmin manages the companies-per-course table).
    await new Promise((r) => setTimeout(r, 600));
    router.push('/dashboard');
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#f5f7fb] flex items-center justify-center px-5 py-10">
      {/* background, consistent with login/forgot-password */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -left-40 w-[420px] h-[420px] rounded-full bg-blue-500/10 blur-3xl animate-pulse" />
        <div
          className="absolute -bottom-48 -right-40 w-[500px] h-[500px] rounded-full bg-indigo-500/10 blur-3xl animate-pulse"
          style={{ animationDelay: '1.5s' }}
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

      <main className="relative z-10 w-full max-w-lg">
        <div className="rounded-3xl border border-slate-200/80 bg-white/95 backdrop-blur-xl shadow-xl shadow-slate-900/10 p-8 md:p-11">

          {/* ============ STEP INDICATOR ============ */}
          <div className="flex items-center justify-center mb-8">
            {STEPS.map((s, i) => {
              const isDone = i < step;
              const isActive = i === step;
              return (
                <div key={s.key} className="flex items-center">
                  <div className="flex flex-col items-center">
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center text-xs font-bold transition-colors ${
                        isDone
                          ? 'bg-blue-600 text-white'
                          : isActive
                          ? 'bg-blue-600 text-white ring-4 ring-blue-100'
                          : 'bg-slate-100 text-slate-400'
                      }`}
                    >
                      {isDone ? <Check size={16} /> : <s.icon size={16} />}
                    </div>
                    <span
                      className={`mt-1.5 text-[10px] font-semibold uppercase tracking-wide hidden sm:block ${
                        isActive ? 'text-blue-600' : 'text-slate-400'
                      }`}
                    >
                      {s.label}
                    </span>
                  </div>
                  {i < STEPS.length - 1 && (
                    <div
                      className={`w-16 sm:w-20 h-0.5 mx-2 rounded-full transition-colors ${
                        isDone ? 'bg-blue-600' : 'bg-slate-100'
                      }`}
                    />
                  )}
                </div>
              );
            })}
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={step}
              initial={{ opacity: 0, x: 16 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -16 }}
              transition={{ duration: 0.25, ease: 'easeInOut' }}
            >
              {/* ============ STEP 0: BASIC INFO ============ */}
              {step === 0 && (
                <div>
                  <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-slate-950">
                    A bit about you
                  </h1>
                  <p className="mt-2 text-base text-slate-500 mb-7">
                    Helps us tailor company recommendations to you.
                  </p>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-2">Sex</label>
                      <div className="grid grid-cols-2 gap-2">
                        {['male', 'female'].map((option) => (
                          <button
                            key={option}
                            type="button"
                            onClick={() => update('sex', option)}
                            className={`h-11 rounded-xl border text-sm font-semibold capitalize transition-colors ${
                              form.sex === option
                                ? 'border-blue-600 bg-blue-600 text-white'
                                : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300'
                            }`}
                          >
                            {option}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <label htmlFor="age" className="block text-sm font-semibold text-slate-700 mb-2">
                        Age
                      </label>
                      <input
                        id="age"
                        type="number"
                        min={15}
                        max={99}
                        value={form.age}
                        onChange={(e) => update('age', e.target.value)}
                        placeholder="20"
                        className="w-full h-11 px-4 rounded-xl border border-slate-200 bg-white text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* ============ STEP 1: ACADEMIC INFO ============ */}
              {step === 1 && (
                <div>
                  <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-slate-950">
                    Your school & course
                  </h1>
                  <p className="mt-2 text-base text-slate-500 mb-7">
                    We&apos;ll match you with companies open to your program.
                  </p>

                  <div className="space-y-4">
                    <div>
                      <label htmlFor="school" className="block text-sm font-semibold text-slate-700 mb-2">
                        School
                      </label>
                      <input
                        id="school"
                        type="text"
                        value={form.school}
                        onChange={(e) => update('school', e.target.value)}
                        placeholder="St. Paul University at San Miguel"
                        className="w-full h-11 px-4 rounded-xl border border-slate-200 bg-white text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-2">Course</label>
                      <div className="grid grid-cols-2 gap-2">
                        {COURSES.map((course) => (
                          <button
                            key={course}
                            type="button"
                            onClick={() => update('course', course)}
                            className={`h-11 rounded-xl border text-sm font-semibold transition-colors ${
                              form.course === course
                                ? 'border-blue-600 bg-blue-600 text-white'
                                : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300'
                            }`}
                          >
                            {course}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* ============ STEP 2: REVIEW ============ */}
              {step === 2 && (
                <div>
                  <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-slate-950">
                    Review your details
                  </h1>
                  <p className="mt-2 text-base text-slate-500 mb-7">
                    We&apos;ll use this to find matching companies on your dashboard.
                  </p>

                  <div className="rounded-2xl border border-slate-200 divide-y divide-slate-100 overflow-hidden">
                    {[
                      ['Sex', form.sex || '—'],
                      ['Age', form.age || '—'],
                      ['School', form.school || '—'],
                      ['Course', form.course || '—'],
                    ].map(([label, value]) => (
                      <div key={label} className="flex items-center justify-between px-4 py-3">
                        <span className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                          {label}
                        </span>
                        <span className="text-sm font-semibold text-slate-800 capitalize">{value}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </motion.div>
          </AnimatePresence>

          {/* ============ NAVIGATION ============ */}
          <div className="flex items-center gap-3 mt-8">
            {step > 0 && (
              <button
                type="button"
                onClick={goBack}
                className="flex items-center justify-center gap-2 h-11 px-4 rounded-xl border border-slate-200 text-sm font-semibold text-slate-600 hover:bg-slate-50 transition-colors"
              >
                <ArrowLeft size={16} />
                Back
              </button>
            )}

            {step < STEPS.length - 1 ? (
              <button
                type="button"
                onClick={goNext}
                disabled={!isStepValid(step)}
                className="flex-1 flex items-center justify-center gap-2 h-11 rounded-xl bg-blue-600 text-white font-semibold text-sm hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Continue
                <ArrowRight size={16} />
              </button>
            ) : (
              <button
                type="button"
                onClick={handleFinish}
                disabled={submitting}
                className="flex-1 flex items-center justify-center gap-2 h-11 rounded-xl bg-blue-600 text-white font-semibold text-sm hover:bg-blue-700 disabled:opacity-60 transition-colors"
              >
                {submitting ? (
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    Finish
                    <Check size={16} />
                  </>
                )}
              </button>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}