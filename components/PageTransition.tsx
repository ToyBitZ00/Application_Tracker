'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { usePathname } from 'next/navigation';

export default function PageTransition({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const skipTransition = pathname === '/settings';

  return (
    <AnimatePresence initial={false}>
      <motion.div
        key={pathname}
        initial={skipTransition ? false : { opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{
          duration: skipTransition ? 0 : 0.35,
          ease: 'easeOut',
        }}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}
