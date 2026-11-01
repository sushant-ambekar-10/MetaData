import { useEffect } from 'react';
import { AnimatePresence, animate, motion, useMotionValue, useTransform } from 'framer-motion';
import { useReady } from '@/app/ReadyProvider';
import { useScrollLock } from '@/hooks/useScrollLock';
import { ease, spring } from '@/lib/motion';
import { SITE } from '@/lib/site';

const LETTERS = Array.from(SITE.name);

// Shown once per session (and never under reduced motion). Skippable.
export function Preloader() {
  const { ready, finish } = useReady();
  const count = useMotionValue(0);
  const rounded = useTransform(count, (v) => Math.round(v));
  const progress = useTransform(count, (v) => v / 100);

  useScrollLock(!ready);

  // Keep the page behind the overlay out of the tab order / accessibility tree
  useEffect(() => {
    if (ready) return;
    const shell = document.getElementById('app-shell');
    shell?.setAttribute('inert', '');
    return () => shell?.removeAttribute('inert');
  }, [ready]);

  useEffect(() => {
    if (ready) return;
    let timer: number | undefined;
    const controls = animate(count, 100, {
      duration: 1.9,
      delay: 0.35,
      ease: ease.out,
      onComplete: () => {
        timer = window.setTimeout(finish, 300);
      },
    });
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') finish();
    };
    window.addEventListener('keydown', onKey);
    return () => {
      controls.stop();
      window.clearTimeout(timer);
      window.removeEventListener('keydown', onKey);
    };
  }, [ready, count, finish]);

  return (
    <AnimatePresence>
      {!ready && (
        <motion.div
          key="preloader"
          role="status"
          aria-label="Loading portfolio"
          className="fixed inset-0 z-[100] grid place-items-center bg-bg"
          initial={{ clipPath: 'inset(0% 0% 0% 0%)' }}
          animate={{ clipPath: 'inset(0% 0% 0% 0%)' }}
          exit={{ clipPath: 'inset(0% 0% 100% 0%)', transition: { duration: 0.9, ease: ease.out } }}
        >
          <div
            aria-hidden="true"
            className="absolute inset-0"
            style={{
              background:
                'radial-gradient(50% 40% at 50% 45%, rgb(var(--a1) / 0.28), transparent 70%), radial-gradient(35% 30% at 70% 60%, rgb(var(--a2) / 0.16), transparent 70%)',
            }}
          />

          <div className="relative flex flex-col items-center px-6">
            <p aria-hidden="true" className="flex flex-wrap justify-center font-heading text-display-lg font-bold">
              {LETTERS.map((ch, i) => (
                <span key={i} className="inline-block overflow-hidden py-[0.1em] -my-[0.1em]">
                  <motion.span
                    className="inline-block"
                    initial={{ y: '110%' }}
                    animate={{ y: 0 }}
                    transition={{ ...spring.soft, delay: 0.1 + i * 0.04 }}
                  >
                    {ch === ' ' ? '\u00A0' : ch}
                  </motion.span>
                </span>
              ))}
            </p>

            <div className="mt-10 flex w-[min(80vw,24rem)] items-center gap-4 font-mono text-xs text-muted">
              <div className="h-[2px] flex-1 overflow-hidden bg-line-strong">
                <motion.div className="h-full origin-left bg-aurora" style={{ scaleX: progress }} />
              </div>
              <span className="flex w-12 justify-end tabular-nums">
                <motion.span>{rounded}</motion.span>%
              </span>
            </div>
          </div>

          <button
            type="button"
            onClick={finish}
            autoFocus
            className="label-mono absolute bottom-8 right-8 rounded-pill px-3 py-2 underline-offset-4 hover:text-fg hover:underline"
          >
            Skip intro
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}