import { useEffect, type ReactNode } from 'react';
import { motion, useReducedMotion, type Variants } from 'framer-motion';
import { useLocation } from 'react-router-dom';
import { useScrollToTop } from '@/app/SmoothScroll';
import { ease } from '@/lib/motion';

// Curtain wipe: on exit the panels rise from the bottom and cover the screen;
// on enter the new page mounts under them and they lift away upward.
const panel = (delay: number): Variants => ({
  initial: { scaleY: 1, originY: 0 },
  enter: { scaleY: 0, originY: 0, transition: { duration: 0.75, ease: ease.out, delay } },
  exit: {
    scaleY: 1,
    originY: 1,
    transition: { scaleY: { duration: 0.55, ease: ease.inOut, delay }, originY: { duration: 0 } },
  },
});

const noop: Variants = { initial: {}, enter: {}, exit: {} };
const fade: Variants = {
  initial: { opacity: 0 },
  enter: { opacity: 1, transition: { duration: 0.2 } },
  exit: { opacity: 0, transition: { duration: 0.15 } },
};

let lastPath: string | null = null;

export function PageTransition({ children }: { children: ReactNode }) {
  const reduce = useReducedMotion();
  const { pathname } = useLocation();
  const scrollToTop = useScrollToTop();

  // On every navigation (not first load): jump to top while the curtain covers the screen,
  // and move keyboard focus to <main> so screen-reader and keyboard users land on the new page.
  useEffect(() => {
    if (lastPath !== null && lastPath !== pathname) {
      scrollToTop(true);
      document.getElementById('main')?.focus({ preventScroll: true });
    }
    lastPath = pathname;
  }, [pathname, scrollToTop]);

  return (
    <motion.div variants={reduce ? fade : noop} initial="initial" animate="enter" exit="exit">
      {children}
      {!reduce && (
        <>
          <motion.div
            aria-hidden="true"
            variants={panel(0)}
            className="pointer-events-none fixed inset-0 z-[90] bg-aurora"
          />
          <motion.div
            aria-hidden="true"
            variants={panel(0.08)}
            className="pointer-events-none fixed inset-0 z-[90] bg-surface-2"
          />
        </>
      )}
    </motion.div>
  );
}