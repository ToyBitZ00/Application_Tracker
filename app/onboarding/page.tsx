'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowRight } from 'lucide-react';

const COURSES = ['BSCS', 'BSBA', 'BEED', 'BSHM'];

export default function OnboardingPage() {
  const router = useRouter();
  const [form, setForm] = useState({ sex: '', age: '', school: '', course: '' });

  const update = (key: keyof typeof form, value: string) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: save profile, then fetch recommended companies for form.course
    router.push('/dashboard');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-paper px-6">
      <div className="w-full max-w-sm">
        <div className="text-center mb-10">
          <h1 className="font-display text-3xl text-ink mb-2">Tell us about you</h1>
          <p className="text-slate text-sm">
            We&apos;ll use this to recommend companies for your course.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wide text-slate mb-2">
              Sex
            </label>
            <select
              value={form.sex}
              onChange={(e) => update('sex', e.target.value)}
              className="w-full h-12 px-4 rounded-xl border border-hairline bg-white text-ink text-sm outline-none focus:border-ink/40 focus:ring-4 focus:ring-ink/5 transition"
            >
              <option value="" disabled>Select sex</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wide text-slate mb-2">
              Age
            </label>
            <input
              type="number"
              min={15}
              max={99}
              value={form.age}
              onChange={(e) => update('age', e.target.value)}
              placeholder="20"
              className="w-full h-12 px-4 rounded-xl border border-hairline bg-white text-ink text-sm outline-none focus:border-ink/40 focus:ring-4 focus:ring-ink/5 transition"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wide text-slate mb-2">
              School
            </label>
            <input
              type="text"
              value={form.school}
              onChange={(e) => update('school', e.target.value)}
              placeholder="St. Paul University at San Miguel"
              className="w-full h-12 px-4 rounded-xl border border-hairline bg-white text-ink text-sm outline-none focus:border-ink/40 focus:ring-4 focus:ring-ink/5 transition"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wide text-slate mb-2">
              Course
            </label>
            <select
              value={form.course}
              onChange={(e) => update('course', e.target.value)}
              className="w-full h-12 px-4 rounded-xl border border-hairline bg-white text-ink text-sm outline-none focus:border-ink/40 focus:ring-4 focus:ring-ink/5 transition"
            >
              <option value="" disabled>Select course</option>
              {COURSES.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>

          <button
            type="submit"
            className="w-full flex items-center justify-center gap-2 h-12 rounded-xl bg-gradient-to-r from-blue-600 to-blue-500 text-white font-bold text-sm hover:opacity-70 transition-opacity mt-2"
          >
            Continue
            <ArrowRight size={16} />
          </button>
        </form>
      </div>
    </div>
  );
}