import type { ReactNode } from 'react';
import { motion } from 'framer-motion';
import { fadeUp, staggerParent, viewport } from '@/lib/motion';

interface RevealProps {
  children: ReactNode;
  className?: string;
  delay?: number;
  /** Controlled mode (e.g. wait for the preloader). Omit to reveal when scrolled into view. */
  active?: boolean;
}

export function Reveal({ children, className, delay = 0, active }: RevealProps) {
  const trigger =
    active === undefined
      ? { whileInView: 'show', viewport }
      : { animate: active ? 'show' : 'hidden' };

  return (
    <motion.div className={className} variants={fadeUp} custom={delay} initial="hidden" {...trigger}>
      {children}
    </motion.div>
  );
}

interface StaggerProps {
  children: ReactNode;
  className?: string;
  stagger?: number;
  delay?: number;
}

// Wrap a group; each <StaggerItem> inside reveals in sequence.
export function Stagger({ children, className, stagger = 0.08, delay = 0 }: StaggerProps) {
  return (
    <motion.div
      className={className}
      variants={staggerParent(stagger, delay)}
      initial="hidden"
      whileInView="show"
      viewport={viewport}
    >
      {children}
    </motion.div>
  );
}

export function StaggerItem({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <motion.div className={className} variants={fadeUp}>
      {children}
    </motion.div>
  );
}