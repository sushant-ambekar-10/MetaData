// The motion library: every animation in the site pulls from here so the feel stays consistent.
import type { Transition, Variants } from 'framer-motion';

type Bezier = [number, number, number, number];

// Used only for clip-path wipes and the preloader counter, where a spring would overshoot.
export const ease = {
  out: [0.22, 1, 0.36, 1] as Bezier,
  inOut: [0.76, 0, 0.24, 1] as Bezier,
  in: [0.64, 0, 0.78, 0] as Bezier,
};

// Spring presets for transitions
export const spring = {
  soft: { type: 'spring', stiffness: 110, damping: 20, mass: 0.9 },
  snappy: { type: 'spring', stiffness: 420, damping: 32 },
  bouncy: { type: 'spring', stiffness: 320, damping: 16 },
  gentle: { type: 'spring', stiffness: 60, damping: 18 },
} satisfies Record<string, Transition>;

// Spring options for useSpring() (pointer-following effects)
export const springValues = {
  cursor: { stiffness: 520, damping: 42, mass: 0.35 },
  blob: { stiffness: 40, damping: 18, mass: 1.2 },
  magnetic: { stiffness: 220, damping: 16, mass: 0.2 },
  tilt: { stiffness: 260, damping: 22, mass: 0.4 },
  progress: { stiffness: 140, damping: 30, restDelta: 0.001 },
};

export const viewport = { once: true, amount: 0.25 } as const;

// Variants. `custom` carries an optional delay in seconds.
export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 28 },
  show: (delay: number = 0) => ({ opacity: 1, y: 0, transition: { ...spring.soft, delay } }),
};

export const scaleIn: Variants = {
  hidden: { opacity: 0, scale: 0.92 },
  show: (delay: number = 0) => ({ opacity: 1, scale: 1, transition: { ...spring.soft, delay } }),
};

export const staggerParent = (stagger = 0.08, delayChildren = 0): Variants => ({
  hidden: {},
  show: { transition: { staggerChildren: stagger, delayChildren } },
});