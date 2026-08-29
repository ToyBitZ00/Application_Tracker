import Link from 'next/link';
import { siGithub } from 'simple-icons';
import {
  Kanban,
  Users,
  BarChart3,
  ArrowRight,
  CheckCircle2,
  BriefcaseBusiness,
} from 'lucide-react';

const team = [
  {
    name: 'Aguirre, Paul Nerie',
    year: 'BSCS 4',
    role: 'Project Manager, Lead Programmer',
    initials: 'AP',
    github: 'https://github.com/ToyBitZ00',
    avatar: 'https://github.com/ToyBitZ00.png',
  },
  {
    name: 'Cunanan, Rob King',
    year: 'BSCS 4',
    role: 'Full Stack Developer',
    initials: 'CR',
    github: 'https://github.com/cunananrobking',
    avatar: 'https://github.com/cunananrobking.png',
  },
  {
    name: 'Punzalan, Mark MJ',
    year: 'BSCS 4',
    role: 'Full Stack Developer',
    initials: 'PM',
    github: 'https://github.com/markmjpunzalan',
    avatar: 'https://github.com/markmjpunzalan.png',
  },
];

const applications = [
  {
    company: 'Tech Solutions Inc.',
    position: 'Software Developer Intern',
    status: 'Interview',
  },
  {
    company: 'Digital Innovations',
    position: 'Web Developer Intern',
    status: 'Applied',
  },
  {
    company: 'NextGen Systems',
    position: 'Frontend Developer',
    status: 'Offered',
  },
];

function GithubIcon({ className }: { className?: string }) {
  return (
    <svg role="img" viewBox="0 0 24 24" width={20} height={20} className={className} fill="currentColor">
      <path d={siGithub.path} />
    </svg>
  );
}

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-900">

      {/* Navbar */}
      <nav className="border-b border-slate-200/80 bg-white/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-6 lg:px-8 h-20 flex items-center justify-between">
          
          <Link href="/" className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center shadow-sm">
              <BriefcaseBusiness size={21} className="text-white" />
            </div>

            <div>
              <p className="font-bold text-slate-900 leading-none">
                Application Tracker
              </p>
              <p className="text-xs text-slate-500 mt-1">
                OJT & Internship
              </p>
            </div>
          </Link>

          <Link
            href="/login"
            className="hidden sm:inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-slate-900 text-white text-sm font-semibold hover:bg-slate-800 transition"
          >
            Sign In
            <ArrowRight size={16} />
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative overflow-hidden">
        
        {/* Background decoration */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute -top-32 -right-32 w-96 h-96 bg-blue-200/40 rounded-full blur-3xl" />
          <div className="absolute top-64 -left-32 w-80 h-80 bg-indigo-200/30 rounded-full blur-3xl" />
        </div>

        <div className="relative max-w-6xl mx-auto px-6 lg:px-8 pt-24 pb-20 lg:pt-32 lg:pb-28">
          <div className="max-w-4xl mx-auto text-center">

            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-50 border border-blue-100 text-blue-700 text-sm font-medium mb-7">
              <span className="w-2 h-2 rounded-full bg-blue-600 animate-pulse" />
              Built for OJT & Internship Applicants
            </div>

            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight leading-[1.05] text-slate-950">
              Manage your job search
              <span className="block text-blue-600 mt-2">
                without the chaos.
              </span>
            </h1>

            <p className="mt-7 max-w-2xl mx-auto text-lg md:text-xl text-slate-600 leading-relaxed">
              Keep track of every application, interview round, and offer
              in one organized workspace. Spend less time managing
              spreadsheets and more time preparing for your next opportunity.
            </p>

            <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/login"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-xl bg-blue-600 text-white font-semibold shadow-lg shadow-blue-600/20 hover:bg-blue-700 hover:-translate-y-0.5 transition-all"
              >
                Get Started
                <ArrowRight size={18} />
              </Link>

              <a
                href="#features"
                className="w-full sm:w-auto inline-flex items-center justify-center px-7 py-3.5 rounded-xl border border-slate-300 bg-white text-slate-700 font-semibold hover:bg-slate-50 transition"
              >
                Explore Features
              </a>
            </div>
          </div>

          {/* Dashboard Preview */}
          <div className="relative mt-20 max-w-5xl mx-auto">
            <div className="absolute -inset-4 bg-blue-600/10 blur-3xl rounded-3xl" />

            <div className="relative rounded-2xl border border-slate-200 bg-white shadow-2xl shadow-slate-900/10 overflow-hidden">
              
              {/* Browser Header */}
              <div className="h-12 border-b border-slate-200 bg-slate-50 flex items-center px-5 gap-2">
                <div className="w-3 h-3 rounded-full bg-slate-300" />
                <div className="w-3 h-3 rounded-full bg-slate-300" />
                <div className="w-3 h-3 rounded-full bg-slate-300" />

                <div className="ml-5 h-7 flex-1 max-w-md mx-auto rounded-md bg-white border border-slate-200" />
              </div>

              {/* Dashboard */}
              <div className="p-6 md:p-8 bg-slate-50">
                
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-7">
                  <div>
                    <p className="text-xs uppercase tracking-wider text-slate-400 font-semibold">
                      Dashboard
                    </p>
                    <h2 className="text-2xl font-bold text-slate-900 mt-1">
                      Application Overview
                    </h2>
                  </div>

                  <div className="px-4 py-2 rounded-lg bg-blue-600 text-white text-sm font-medium">
                    + Add Application
                  </div>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                  {[
                    ['12', 'Total Applications'],
                    ['5', 'Active'],
                    ['4', 'Interviews'],
                    ['2', 'Offers'],
                  ].map(([number, label]) => (
                    <div
                      key={label}
                      className="bg-white border border-slate-200 rounded-xl p-5"
                    >
                      <p className="text-2xl font-bold text-slate-900">
                        {number}
                      </p>
                      <p className="text-xs text-slate-500 mt-1">
                        {label}
                      </p>
                    </div>
                  ))}
                </div>

                {/* Application List */}
                <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
                  <div className="px-5 py-4 border-b border-slate-200 flex items-center justify-between">
                    <p className="font-semibold text-slate-900">
                      Recent Applications
                    </p>
                    <p className="text-xs text-blue-600 font-medium">
                      View all
                    </p>
                  </div>

                  <div className="divide-y divide-slate-100">
                    {applications.map((application) => (
                      <div
                        key={application.company}
                        className="px-5 py-4 flex items-center justify-between gap-4"
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <div className="w-10 h-10 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center font-bold text-sm shrink-0">
                            {application.company.charAt(0)}
                          </div>

                          <div className="min-w-0">
                            <p className="font-medium text-slate-900 truncate">
                              {application.company}
                            </p>
                            <p className="text-xs text-slate-500 truncate">
                              {application.position}
                            </p>
                          </div>
                        </div>

                        <span
                          className={`text-xs font-semibold px-3 py-1.5 rounded-full whitespace-nowrap ${
                            application.status === 'Offered'
                              ? 'bg-emerald-50 text-emerald-700'
                              : application.status === 'Interview'
                              ? 'bg-amber-50 text-amber-700'
                              : 'bg-blue-50 text-blue-700'
                          }`}
                        >
                          {application.status}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="bg-white border-y border-slate-200">
        <div className="max-w-6xl mx-auto px-6 lg:px-8 py-24">
          
          <div className="max-w-2xl mb-14">
            <p className="text-sm uppercase tracking-widest text-blue-600 font-bold mb-3">
              Everything in one place
            </p>

            <h2 className="text-3xl md:text-4xl font-bold text-slate-950">
              Built to make your application process easier.
            </h2>

            <p className="mt-4 text-lg text-slate-600 leading-relaxed">
              Stay organized from your first application until you receive
              your final offer.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* Feature 1 */}
            <div className="group rounded-2xl border border-slate-200 bg-slate-50 p-7 hover:bg-white hover:border-blue-200 hover:shadow-xl hover:shadow-slate-900/5 transition-all">
              <div className="w-12 h-12 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center mb-6">
                <Kanban size={24} />
              </div>

              <h3 className="text-xl font-bold text-slate-900 mb-3">
                Pipeline Tracking
              </h3>

              <p className="text-slate-600 leading-relaxed">
                Organize applications by their current status and instantly
                see which opportunities need your attention.
              </p>

              <div className="mt-6 flex items-center gap-2 text-sm text-blue-600 font-semibold">
                Applied → Interview → Offer
              </div>
            </div>

            {/* Feature 2 */}
            <div className="group rounded-2xl border border-slate-200 bg-slate-50 p-7 hover:bg-white hover:border-blue-200 hover:shadow-xl hover:shadow-slate-900/5 transition-all">
              <div className="w-12 h-12 rounded-xl bg-indigo-100 text-indigo-600 flex items-center justify-center mb-6">
                <Users size={24} />
              </div>

              <h3 className="text-xl font-bold text-slate-900 mb-3">
                Interview Management
              </h3>

              <p className="text-slate-600 leading-relaxed">
                Keep track of multiple interview rounds, schedules, notes,
                and your current progress with each company.
              </p>

              <div className="mt-6 flex items-center gap-2 text-sm text-indigo-600 font-semibold">
                Round 1 → Round 2 → Final
              </div>
            </div>

            {/* Feature 3 */}
            <div className="group rounded-2xl border border-slate-200 bg-slate-50 p-7 hover:bg-white hover:border-blue-200 hover:shadow-xl hover:shadow-slate-900/5 transition-all">
              <div className="w-12 h-12 rounded-xl bg-violet-100 text-violet-600 flex items-center justify-center mb-6">
                <BarChart3 size={24} />
              </div>

              <h3 className="text-xl font-bold text-slate-900 mb-3">
                Overview & Analytics
              </h3>

              <p className="text-slate-600 leading-relaxed">
                Understand your job search through simple statistics,
                application counts, response rates, and progress summaries.
              </p>

              <div className="mt-6 flex items-center gap-2 text-sm text-violet-600 font-semibold">
                Track → Analyze → Improve
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Why Section */}
      <section className="bg-slate-950 text-white">
        <div className="max-w-6xl mx-auto px-6 lg:px-8 py-24">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            
            <div>
              <p className="text-sm uppercase tracking-widest text-blue-400 font-bold mb-4">
                Why Application Tracker?
              </p>

              <h2 className="text-3xl md:text-4xl font-bold leading-tight">
                Stop losing track of opportunities.
              </h2>

              <p className="mt-5 text-slate-400 text-lg leading-relaxed">
                During OJT and internship season, managing multiple
                applications can quickly become confusing. Application Tracker
                gives you a single place to organize everything.
              </p>
            </div>

            <div className="space-y-4">
              {[
                'Centralize all your applications',
                'Monitor every interview round',
                'Track application status',
                'Review your overall progress',
              ].map((item) => (
                <div
                  key={item}
                  className="flex items-center gap-4 p-4 rounded-xl bg-white/5 border border-white/10"
                >
                  <CheckCircle2
                    size={22}
                    className="text-blue-400 shrink-0"
                  />

                  <span className="text-slate-200">
                    {item}
                  </span>
                </div>
              ))}
            </div>

          </div>
        </div>
      </section>

      {/* Team */}
      <section className="bg-slate-50">
        <div className="max-w-6xl mx-auto px-6 lg:px-8 py-24">
          
          <div className="text-center max-w-2xl mx-auto mb-14">
            <p className="text-sm uppercase tracking-widest text-blue-600 font-bold mb-3">
              The Team
            </p>

            <h2 className="text-3xl md:text-4xl font-bold text-slate-950">
              Developed by BSCS students
            </h2>

            <p className="mt-4 text-slate-600">
              A Software Engineering 2 course project from St. Paul University
              at San Miguel.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
            {team.map(({ name, year, role, initials, github, avatar }) => (
              <div
                key={name}
                className="bg-white border border-slate-200 rounded-2xl p-7 hover:-translate-y-1 hover:shadow-xl hover:shadow-slate-900/5 transition-all"
                >
                <div className="w-14 h-14 rounded-full overflow-hidden bg-blue-100 mb-6">
                  <img
                    src={avatar}
                    alt={`${name} avatar`}
                    className="w-full h-full object-cover"
                    
                  />
                  <div className="hidden w-14 h-14 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-bold">
                    {initials}
                  </div>
                </div>

                <h3 className="font-bold text-lg text-slate-900 flex items-center gap-2">
                  <span>{name}</span>
                  <a
                    href={github}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`${name} GitHub`}
                    className="shrink-0"
                    >
                    <GithubIcon className="text-black hover:opacity-30 transition-colors" />
                  </a>
                </h3>
        
                <p className="text-sm text-slate-500 mt-1">
                  {year} · St. Paul University at San Miguel
                </p>

                <div className="mt-5 pt-5 border-t border-slate-100">
                  <p className="text-sm font-semibold text-blue-600">
                    {role}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-white">
        <div className="max-w-5xl mx-auto px-6 lg:px-8 py-24 text-center">
          <div className="rounded-3xl bg-blue-600 px-8 py-16 md:px-16 shadow-2xl shadow-blue-600/20">
            
            <h2 className="text-3xl md:text-4xl font-bold text-white">
              Ready to organize your applications?
            </h2>

            <p className="mt-4 max-w-xl mx-auto text-blue-100 text-lg">
              Keep every application, interview, and opportunity within reach.
            </p>

            <Link
              href="/login"
              className="mt-8 inline-flex items-center gap-2 px-7 py-3.5 rounded-xl bg-white text-blue-600 font-bold hover:bg-blue-50 transition"
            >
              Get Started
              <ArrowRight size={18} />
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-slate-50">
        <div className="max-w-6xl mx-auto px-6 lg:px-8 py-10">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-blue-600 flex items-center justify-center">
                <BriefcaseBusiness size={18} className="text-white" />
              </div>

              <div>
                <p className="font-bold text-slate-900 text-sm">
                  Application Tracker
                </p>
                <p className="text-xs text-slate-500">
                  St. Paul University at San Miguel
                </p>
              </div>
            </div>

            <p className="text-sm text-slate-500 text-center md:text-right">
              © 2026 Application Tracker. Software Engineering 2 Project.
            </p>
          </div>
        </div>
      </footer>

    </div>
  );
}