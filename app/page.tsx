import Link from 'next/link';
import { Kanban, Users, BarChart3 } from 'lucide-react';

const team = [
  {
    name: 'Aguirre, Paul Nerie',
    year: 'BSCS 4',
    role: 'Project Manager, Lead Programmer',
  },
  {
    name: 'Cunanan, Rob King',
    year: 'BSCS 4',
    role: 'Backend Developer',
  },
  {
    name: 'Punzalan, Mark MJ',
    year: 'BSCS 4',
    role: 'Frontend Developer',
  },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-paper">
      {/* Hero */}
      <section className="px-8 pt-28 pb-24 max-w-4xl mx-auto text-center">
        <p className="text-sm uppercase tracking-widest text-slate mb-6">
          For OJT & Internship Applicants
        </p>
        <h1 className="font-display text-5xl md:text-6xl leading-tight text-ink mb-8">
          Your job hunt,{' '}
          <span className="text-coral">organized</span> for once.
        </h1>
        <p className="text-slate text-xl mb-12 max-w-2xl mx-auto leading-relaxed">
          Track every application, every interview round, and every offer
          all in one place, so nothing slips through the cracks during OJT season.
        </p>
        <Link
          href="/login"
          className="inline-block px-10 py-5 rounded-full bg-gradient-to-r from-blue-600 to-blue-500 text-white font-semibold text-base hover:opacity-90 transition-opacity"
        >
          Get Started
        </Link>
      </section>

      {/* Features */}
      <section className="px-8 pb-28 max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="border border-hairline rounded-xl p-8 bg-white">
          <Kanban size={28} className="text-coral mb-5" />
          <h3 className="font-display text-xl text-ink mb-3">Pipeline tracking</h3>
          <p className="text-base text-slate leading-relaxed">
            See every application's status at a glance — applied, interviewing, offered, or rejected — on a simple Kanban board.
          </p>
        </div>
        <div className="border border-hairline rounded-xl p-8 bg-white">
          <Users size={28} className="text-coral mb-5" />
          <h3 className="font-display text-xl text-ink mb-3">Interview rounds</h3>
          <p className="text-base text-slate leading-relaxed">
            Keep tabs on multiple interview rounds per company without losing track of where you stand.
          </p>
        </div>
        <div className="border border-hairline rounded-xl p-8 bg-white">
          <BarChart3 size={28} className="text-coral mb-5" />
          <h3 className="font-display text-xl text-ink mb-3">Overview & analytics</h3>
          <p className="text-base text-slate leading-relaxed">
            Get a quick read on how your search is going — active count, response rate, and where you stand overall.
          </p>
        </div>
      </section>

      {/* Preview placeholder */}
      <section className="px-8 pb-28 max-w-5xl mx-auto">
        <div className="border border-dashed border-hairline rounded-2xl bg-white/50 h-72 flex items-center justify-center">
          <p className="text-base text-slate">Dashboard preview coming soon</p>
        </div>
      </section>

      {/* About Us footer */}
      <footer className="border-t border-hairline bg-white px-8 py-20">
        <div className="max-w-5xl mx-auto">
          <p className="text-sm uppercase tracking-widest text-slate mb-4">About this project</p>
          <h2 className="font-display text-2xl text-ink mb-6">Application Tracker</h2>
          <p className="text-base text-slate leading-relaxed max-w-2xl mb-14">
            Built as a Software Engineering 2 course project at St. Paul University at San Miguel,
            this system was created to help OJT and internship applicants stay on top of their job
            search by replacing scattered spreadsheets with clear, organized view
            of every application's progress.
          </p>

          <p className="text-sm uppercase tracking-widest text-slate mb-6">The team</p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {team.map(({ name, year, role }) => (
              <div key={name}>
                <p className="font-display text-lg text-ink mb-1">{name}</p>
                <p className="text-sm text-slate mb-1">{year} · St. Paul University at San Miguel</p>
                <p className="text-sm text-coral font-semibold">{role}</p>
              </div>
            ))}
          </div>
        </div>
      </footer>
    </div>
  );
}