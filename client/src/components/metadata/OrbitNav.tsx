import { useEffect, useRef, type CSSProperties, type KeyboardEvent } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { spring } from '@/lib/motion';
import { cn } from '@/lib/utils';
import { TABS, type TabId } from './tabs';

interface Props {
  active: TabId;
  onSelect: (id: TabId) => void;
}

const RADIUS = 38; // % of the container; nodes sit on this circle
const HOVER_DELAY = 120; // ms, so sweeping the mouse across doesn't flicker

const position = (i: number) => {
  const angle = ((-90 + i * (360 / TABS.length)) * Math.PI) / 180;
  return { x: 50 + RADIUS * Math.cos(angle), y: 50 + RADIUS * Math.sin(angle) };
};

// Desktop: nodes orbit a centre label. Small screens: the same buttons become a wrapping dock.
// Input: hover (mouse), tap/click, or keyboard (arrows/Home/End move focus; Enter or Space selects).
export function OrbitNav({ active, onSelect }: Props) {
  const reduce = useReducedMotion();
  const refs = useRef<Array<HTMLButtonElement | null>>([]);
  const timer = useRef<number | undefined>(undefined);
  const current = TABS.find((t) => t.id === active) ?? TABS[0];

  useEffect(() => () => window.clearTimeout(timer.current), []);

  const focusAt = (i: number) => refs.current[(i + TABS.length) % TABS.length]?.focus();

  const onKeyDown = (e: KeyboardEvent<HTMLButtonElement>, i: number) => {
    switch (e.key) {
      case 'ArrowRight':
      case 'ArrowDown':
        e.preventDefault();
        focusAt(i + 1);
        break;
      case 'ArrowLeft':
      case 'ArrowUp':
        e.preventDefault();
        focusAt(i - 1);
        break;
      case 'Home':
        e.preventDefault();
        focusAt(0);
        break;
      case 'End':
        e.preventDefault();
        focusAt(TABS.length - 1);
        break;
    }
  };

  return (
    <div className="relative mx-auto w-full lg:aspect-square lg:max-w-[28rem]">
      {/* Decorative rings and centre label (desktop only) */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 hidden lg:block">
        <div
          className="absolute inset-[18%] rounded-full"
          style={{ background: 'radial-gradient(closest-side, rgb(var(--a1) / 0.22), transparent)' }}
        />
        <div className="absolute inset-[12%] rounded-full border border-line-strong" />
        <motion.div
          className="absolute inset-[3%] rounded-full border border-dashed border-line-strong"
          animate={reduce ? undefined : { rotate: 360 }}
          transition={{ duration: 90, repeat: Infinity, ease: 'linear' }}
        />
        <div className="absolute left-1/2 top-1/2 w-[38%] -translate-x-1/2 -translate-y-1/2 text-center">
          <p className="label-mono">Me-taData</p>
          <AnimatePresence mode="wait" initial={false}>
            <motion.p
              key={active}
              className="mt-2 font-heading text-xl font-semibold"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8, transition: { duration: 0.12 } }}
              transition={spring.snappy}
            >
              {current.label}
            </motion.p>
          </AnimatePresence>
        </div>
      </div>

      <div
        role="tablist"
        aria-label="Me-taData categories"
        className="flex flex-wrap items-center justify-center gap-3 lg:absolute lg:inset-0 lg:block"
      >
        {TABS.map((tab, i) => {
          const { x, y } = position(i);
          const isActive = tab.id === active;
          return (
            <div
              key={tab.id}
              role="presentation"
              className="lg:absolute lg:left-[var(--x)] lg:top-[var(--y)] lg:-translate-x-1/2 lg:-translate-y-1/2"
              style={{ '--x': `${x}%`, '--y': `${y}%` } as CSSProperties}
            >
              <motion.button
                ref={(el) => {
                  refs.current[i] = el;
                }}
                type="button"
                role="tab"
                id={`tab-${tab.id}`}
                aria-selected={isActive}
                aria-controls="metadata-panel"
                tabIndex={isActive ? 0 : -1}
                onClick={() => onSelect(tab.id)}
                onKeyDown={(e) => onKeyDown(e, i)}
                onPointerEnter={(e) => {
                  if (e.pointerType !== 'mouse') return;
                  window.clearTimeout(timer.current);
                  timer.current = window.setTimeout(() => onSelect(tab.id), HOVER_DELAY);
                }}
                onPointerLeave={() => window.clearTimeout(timer.current)}
                whileHover={{ scale: 1.08 }}
                whileTap={{ scale: 0.92 }}
                transition={spring.snappy}
                className={cn(
                  'relative grid h-14 w-14 place-items-center rounded-full border border-line-strong lg:h-16 lg:w-16',
                  isActive ? 'bg-surface-2 text-fg' : 'bg-surface text-muted hover:text-fg'
                )}
              >
                {isActive && (
                  <motion.span
                    layoutId="orbit-active"
                    aria-hidden="true"
                    className="absolute -inset-1.5 rounded-full border-2 border-a2-text shadow-glow"
                    transition={spring.snappy}
                  />
                )}
                <tab.Icon className="relative h-6 w-6" aria-hidden="true" />
                <span
                  className={cn(
                    'label-mono sr-only lg:not-sr-only lg:absolute lg:left-1/2 lg:top-full lg:mt-3 lg:-translate-x-1/2 lg:whitespace-nowrap',
                    isActive && 'text-fg'
                  )}
                >
                  {tab.label}
                </span>
              </motion.button>
            </div>
          );
        })}
      </div>
    </div>
  );
}