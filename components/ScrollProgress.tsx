'use client';

import { useEffect, useRef, useState } from 'react';

const sections = [
  { id: 'hero', label: 'Hero' },
  { id: 'feature-security', label: 'Security' },
  { id: 'feature-pipeline', label: 'Pipeline' },
  { id: 'feature-interviews', label: 'Interviews' },
  { id: 'feature-analytics', label: 'Analytics' },
  { id: 'about', label: 'About Us' },
];

const ITEM_HEIGHT = 68;

export default function ScrollProgress() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const trackRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isDragging) return;

    const handleScroll = () => {
      const atBottom = window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 5;
      if (atBottom) {
        setActiveIndex(sections.length - 1);
        return;
      }

      const triggerLine = window.innerHeight * 0.35;
      let current = 0;
      for (let i = 0; i < sections.length; i++) {
        const el = document.getElementById(sections[i].id);
        if (el && el.getBoundingClientRect().top <= triggerLine) current = i;
      }
      setActiveIndex(current);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isDragging]);

  const scrollToSection = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  const scrubToPosition = (clientY: number) => {
    const track = trackRef.current;
    if (!track) return;
    const rect = track.getBoundingClientRect();
    const pct = Math.min(1, Math.max(0, (clientY - rect.top) / rect.height));

    // Update which label is nearest to the pointer, live
    const nearestIndex = Math.round(pct * (sections.length - 1));
    setActiveIndex(nearestIndex);

    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    window.scrollTo({ top: pct * docHeight, behavior: 'auto' });
  };

  useEffect(() => {
    if (!isDragging) return;
    const handleMove = (e: PointerEvent) => scrubToPosition(e.clientY);
    const handleUp = () => setIsDragging(false);
    window.addEventListener('pointermove', handleMove);
    window.addEventListener('pointerup', handleUp);
    return () => {
      window.removeEventListener('pointermove', handleMove);
      window.removeEventListener('pointerup', handleUp);
    };
  }, [isDragging]);

  return (
    <div className="fixed right-8 top-1/2 -translate-y-1/2 z-[60] hidden md:flex flex-col items-end">
      <div
        ref={trackRef}
        onPointerDown={(e) => {
            setIsDragging(true);
            scrubToPosition(e.clientY);
        }}
        className="relative flex flex-col justify-between py-2 pr-5 cursor-pointer select-none"
        style={{ height: `${sections.length * ITEM_HEIGHT}px` }}
        >
        {/* Track line */}
        <div className="absolute right-0 top-1 bottom-1 w-1 bg-ink/15" />

        {sections.map((s, i) => (
          <button
            key={s.id}
            onClick={(e) => {
              e.stopPropagation();
              scrollToSection(s.id);
            }}
            className="relative flex items-center group"
          >
            <span
              className={`text-base font-medium whitespace-nowrap w-32 text-right pr-5 transition-colors ${
                i === activeIndex ? 'text-ink font-semibold' : 'text-ink/30 group-hover:text-ink/60'
              }`}
            >
              {s.label}
            </span>
            <span
              className={`absolute right-0 -translate-x-1/2 w-2 h-2 rounded-full transition-colors ${
                i === activeIndex ? 'bg-ink' : 'bg-ink/25'
              }`}
            />
            {i === activeIndex && (
              <span className="absolute -right-5 top-1/2 -translate-y-1/2 w-1 h-8 rounded-full bg-ink" />
            )}
          </button>
        ))}
        </div>
    </div>
  );
}