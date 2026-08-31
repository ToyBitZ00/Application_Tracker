'use client';

import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence, type PanInfo } from 'framer-motion';

const SLIDES = [
  { key: 'dashboard', label: 'Dashboard', src: '/previews/preview-dashboard.png' },
  { key: 'applications', label: 'Applications', src: '/previews/preview-applications.png' },
  { key: 'reports', label: 'Reports & Analytics', src: '/previews/preview-reports.png' },
  { key: 'settings', label: 'Settings', src: '/previews/preview-settings.png' },
] as const;

const INITIAL_DELAY = 2000;
const SLIDE_INTERVAL = 3000;
const RESUME_AFTER_INTERACTION = 4000;

export default function DashboardPreviewCarousel() {
  const [index, setIndex] = useState(0);
  const [direction, setDirection] = useState(1);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isFirstRun = useRef(true);

  const goTo = (next: number, dir: number) => {
    setDirection(dir);
    setIndex((prev) => {
      const total = SLIDES.length;
      return ((next % total) + total) % total;
    });
  };

  const scheduleNext = (delay: number) => {
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
      goTo(index + 1, 1);
    }, delay);
  };

  useEffect(() => {
    const delay = isFirstRun.current ? INITIAL_DELAY : SLIDE_INTERVAL;
    isFirstRun.current = false;
    scheduleNext(delay);
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [index]);

  const pauseAndResume = () => {
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
      goTo(index + 1, 1);
    }, RESUME_AFTER_INTERACTION);
  };

  const handleDragEnd = (_: unknown, info: PanInfo) => {
    const swipeThreshold = 60;
    if (info.offset.x < -swipeThreshold) {
      goTo(index + 1, 1);
    } else if (info.offset.x > swipeThreshold) {
      goTo(index - 1, -1);
    }
    pauseAndResume();
  };

  const activeSlide = SLIDES[index];
  const prevSlide = SLIDES[(index - 1 + SLIDES.length) % SLIDES.length];
  const nextSlide = SLIDES[(index + 1) % SLIDES.length];

  const previewCards = [
    { slide: prevSlide, side: 'left', x: -140, rotate: -4, scale: 0.9, opacity: 0.45, z: 1 },
    { slide: activeSlide, side: 'center', x: 0, rotate: 0, scale: 1, opacity: 1, z: 3 },
    { slide: nextSlide, side: 'right', x: 140, rotate: 4, scale: 0.9, opacity: 0.45, z: 2 },
  ] as const;

  return (
    <div className="relative mt-20 max-w-5xl mx-auto pb-20">
      <div className="absolute -inset-4 bg-blue-600/10 blur-3xl rounded-3xl" />

      <div className="relative h-[320px] sm:h-[360px] md:h-[420px] overflow-visible">
        {previewCards.map(({ slide, side, x, rotate, scale, opacity, z }) => (
          <motion.div
            key={`${slide.key}-${side}`}
            drag={side === 'center' ? 'x' : false}
            dragConstraints={side === 'center' ? { left: 0, right: 0 } : undefined}
            dragElastic={side === 'center' ? 0.12 : 0}
            onDragStart={() => {
              if (side === 'center' && timerRef.current) clearTimeout(timerRef.current);
            }}
            onDragEnd={side === 'center' ? handleDragEnd : undefined}
            initial={side === 'center' ? { opacity: 0, x: direction > 0 ? 32 : -32, scale: 0.98 } : { opacity: 0, x: 0, scale: 0.9 }}
            animate={{
              x,
              rotate,
              scale,
              opacity,
              zIndex: z,
              y: side === 'center' ? 0 : 14,
            }}
            exit={side === 'center' ? { opacity: 0, x: direction > 0 ? -32 : 32, scale: 0.98 } : { opacity: 0.2 }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            className={`absolute left-1/2 top-0 w-[78%] sm:w-[70%] md:w-[65%] -translate-x-1/2 ${
              side === 'center' ? 'cursor-grab active:cursor-grabbing' : 'pointer-events-none'
            }`}
          >
            <div className="rounded-2xl border border-slate-200 bg-white shadow-2xl shadow-slate-900/10 overflow-hidden">
              <div className="h-12 border-b border-slate-200 bg-slate-50 flex items-center px-5 gap-2 relative z-10">
                <div className="w-3 h-3 rounded-full bg-slate-300" />
                <div className="w-3 h-3 rounded-full bg-slate-300" />
                <div className="w-3 h-3 rounded-full bg-slate-300" />
                <div className="ml-5 h-7 flex-1 max-w-md mx-auto rounded-md bg-white border border-slate-200" />
              </div>

              <div className="relative bg-slate-50 overflow-hidden select-none" style={{ touchAction: 'pan-y' }}>
                <AnimatePresence initial={false} custom={direction} mode="wait">
                  <motion.div
                    key={slide.key}
                    custom={direction}
                    initial={side === 'center' ? { opacity: 0, x: direction > 0 ? 18 : -18 } : { opacity: 0 }}
                    animate={side === 'center' ? { opacity: 1, x: 0 } : { opacity: 1 }}
                    exit={side === 'center' ? { opacity: 0, x: direction > 0 ? -18 : 18 } : { opacity: 0.8 }}
                    transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
                  >
                    <img
                      src={slide.src}
                      alt={`${slide.label} preview`}
                      className="w-full h-auto block"
                      draggable={false}
                    />
                  </motion.div>
                </AnimatePresence>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Dots */}
      <div className="mt-6 flex items-center justify-center gap-2">
        {SLIDES.map((slide, i) => (
          <button
            key={slide.key}
            type="button"
            aria-label={`Show ${slide.label} preview`}
            onClick={() => {
              goTo(i, i > index ? 1 : -1);
              pauseAndResume();
            }}
            className={`h-2 rounded-full transition-all duration-300 ${
              i === index ? 'w-6 bg-blue-600' : 'w-2 bg-slate-300 hover:bg-slate-400'
            }`}
          />
        ))}
      </div>
    </div>
  );
}
