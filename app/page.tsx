'use client';

import Link from 'next/link';
import { Kanban, Users, BarChart3, ShieldCheck, ArrowRight } from 'lucide-react';
import { siGithub } from 'simple-icons';
import ScrollProgress from '@/components/ScrollProgress';
import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import Lenis from 'lenis';



function GithubIcon({ className }: { className?: string }) {
  return (
    <svg role="img" viewBox="0 0 24 24" width={20} height={20} className={className} fill="currentColor">
      <path d={siGithub.path} />
    </svg>
  );
}

const team = [
  {
    name: 'Aguirre, Paul Nerie',
    year: 'BSCS 4',
    role: 'Project Manager, Lead Programmer',
    github: 'https://github.com/ToyBitZ00',
  },
  {
    name: 'Cunanan, Rob King',
    year: 'BSCS 4',
    role: 'Backend Developer',
    github: 'https://github.com/cunananrobking',
  },
  {
    name: 'Punzalan, Mark MJ',
    year: 'BSCS 4',
    role: 'Frontend Developer',
    github: 'https://github.com/MarkPunzalan',
  },
];

const fadeUp = {
  initial: { opacity: 0, y: 40 }, // offscreen
  whileInView: { opacity: 1, y: 0 }, // onscreen
  viewport: { once: true, amount: 0.3 }, // trigger when 30% of the component is visible
  transition: { duration: 0.6, ease: 'easeOut' as const }, // easing function
};

export default function LandingPage() {
  useEffect(() => {
    const lenis = new Lenis();
    function raf(time: any) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf)
  }, []);


  return (
    <div className="min-h-screen bg-paper">
      <ScrollProgress />
      {/* Hero */}
      <section id="hero" className="px-8 pt-28 pb-24 max-w-4xl mx-auto text-center">
        <p className="text-sm uppercase tracking-widest text-slate mb-6">
          For OJT & Internship Applicants
        </p>
        <h1 className="font-display text-5xl md:text-6xl leading-tight text-ink mb-8">
          Your OJT hunt,{' '}
          <span className="text-coral">organized</span> for once.
        </h1>
        <p className="text-slate text-xl mb-12 max-w-2xl mx-auto leading-relaxed">
          Track every application, every interview round, and every offer
          all in one place, so nothing get left behind during OJT season.
        </p>
        <div className="flex items-center justify-center gap-4">
          <Link
            href="/login"
            className="inline-flex items-center gap-2 px-10 py-5 rounded-xl bg-gradient-to-r from-blue-600 to-blue-500 text-white font-bold text-xl hover:opacity-70 transition-opacity"
          >
            Get Started
            <ArrowRight size={25} />
          </Link>
          <button
            onClick={() => {
              const target = document.getElementById('feature-security');
              if (target) {
                const targetY = target.getBoundingClientRect().top + window.scrollY;
                window.scrollTo({ top: targetY, behavior: 'smooth' });
              }
            }}
            className="inline-flex items-center gap-2 px-10 py-5 rounded-xl bg-white text-ink font-bold text-xl border border-hairline hover:bg-sand transition-colors"
          >
            Explore Features
          </button>
        </div>
      </section>

      {/* Features */}
      <section className="flex flex-col">
        {/* Feature 1 — preview left, text right, sand bg */}
        <div id="feature-security" className="bg-sand px-8 py-32">
          <motion.div
            {...fadeUp}
            className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-20 items-center"
          >
            <div className="order-2 md:order-1 border border-dashed border-hairline rounded-2xl bg-white h-96 flex items-center justify-center">
              <p className="text-base text-slate">Secure storage preview coming soon</p>
            </div>
            <div className="order-1 md:order-2">
              <ShieldCheck size={28} className="text-coral mb-6" />
              <h3 className="font-display text-3xl text-ink mb-5">Your data, kept safe</h3>
              <p className="text-lg text-slate leading-relaxed max-w-md">
                Every card is forgiving by design to edit, undo, or move entries freely without
                fear of losing progress. Behind the scenes, your applications are stored securely,
                so your job search stays private and intact.
              </p>
            </div>
          </motion.div>
        </div>

        {/* Feature 2 — text left, preview right, white bg */}
        <div id="feature-pipeline" className="bg-white px-8 py-32">
          <motion.div
            {...fadeUp}
            className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-20 items-center"
          >
            <div>
              <Kanban size={28} className="text-coral mb-6" />
              <h3 className="font-display text-3xl text-ink mb-5">Pipeline tracking</h3>
              <p className="text-lg text-slate leading-relaxed max-w-md">
                See every application's status at a glance: applied, interviewing, offered, or rejected on a simple Kanban board.
              </p>
            </div>
            <div className="border border-dashed border-hairline rounded-2xl bg-sand h-96 flex items-center justify-center">
              <p className="text-base text-slate">Pipeline tracking preview coming soon</p>
            </div>
          </motion.div>
        </div>

        {/* Feature 3 — preview left, text right, sand bg */}
        <div id="feature-interviews" className="bg-sand px-8 py-32">
          <motion.div
            {...fadeUp}
            className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-20 items-center"
          >
            <div className="order-2 md:order-1 border border-dashed border-hairline rounded-2xl bg-white h-96 flex items-center justify-center">
              <p className="text-base text-slate">Interview rounds preview coming soon</p>
            </div>
            <div className="order-1 md:order-2">
              <Users size={28} className="text-coral mb-6" />
              <h3 className="font-display text-3xl text-ink mb-5">Interview rounds</h3>
              <p className="text-lg text-slate leading-relaxed max-w-md">
                Keep tabs on multiple interview rounds per company without losing track of where you stand.
              </p>
            </div>
          </motion.div>
        </div>

        {/* Feature 4 — text left, preview right, white bg */}
        <div id="feature-analytics" className="bg-white px-8 py-32">
          <motion.div
            {...fadeUp}
            className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-20 items-center"
          >
            <div>
              <BarChart3 size={28} className="text-coral mb-6" />
              <h3 className="font-display text-3xl text-ink mb-5">Overview & analytics</h3>
              <p className="text-lg text-slate leading-relaxed max-w-md">
                Get a quick read on how your search is going with active count, response rate, and where you stand overall.
              </p>
            </div>
            <div className="border border-dashed border-hairline rounded-2xl bg-sand h-96 flex items-center justify-center">
              <p className="text-base text-slate">Overview & analytics preview coming soon</p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* About Us footer */}
      <footer id="about" className="border-t border-hairline bg-paper px-8 py-20">
        <motion.div {...fadeUp} className="max-w-5xl mx-auto">
          <p className="text-4xl font-bold uppercase tracking-widest text-black/70 mb-14">About this project</p>
          <h2 className="font-display text-3xl text-black/60 mb-6">Internship Application Tracker</h2>
          <p className="text-base text-black/70 leading-relaxed max-w-2xl mb-14">
            Built as a Software Engineering 2 course project at St. Paul University at San Miguel,
            this system was created to help OJT and internship applicants stay on top of their job
            search by replacing scattered spreadsheets with a clear, organized view
            of every application's progress.
          </p>

          <p className="text-xl font-bold uppercase tracking-widest text-black/70 mb-6">The team</p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {team.map(({ name, year, role, github }) => (
              <div key={name}>
                <div className="flex items-center gap-2 mb-1">
                  <p className="font-display text-lg text-black">{name}</p>
                  <a href={github} target="_blank" rel="noopener noreferrer" aria-label={`${name} GitHub`}>
                    <GithubIcon className="text-black hover:opacity-30 transition-colors" />
                  </a>
                </div>
                <p className="text-sm text-black/70 mb-1">{year} · St. Paul University at San Miguel</p>
                <p className="text-sm text-coral font-semibold">{role}</p>
              </div>
            ))}
          </div>
        </motion.div>
      </footer>
    </div>
  );
}