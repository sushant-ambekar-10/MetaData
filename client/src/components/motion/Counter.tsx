import { useEffect, useMemo, useRef } from 'react';
import { animate, motion, useInView, useMotionValue, useReducedMotion, useTransform } from 'framer-motion';
import { ease } from '@/lib/motion';

interface Props {
  value: number;
  decimals?: number;
  suffix?: string;
  className?: string;
}

// Counts up when scrolled into view. Screen readers get the final value immediately.
export function Counter({ value, decimals = 0, suffix = '', className }: Props) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.6 });
  const reduce = useReducedMotion();
  const mv = useMotionValue(0);

  const fmt = useMemo(
    () => new Intl.NumberFormat('en-US', { minimumFractionDigits: decimals, maximumFractionDigits: decimals }),
    [decimals]
  );
  const text = useTransform(mv, (v) => fmt.format(v));

  useEffect(() => {
    if (reduce) {
      mv.set(value);
      return;
    }
    if (!inView) return;
    const controls = animate(mv, value, { duration: 1.8, ease: ease.out });
    return () => controls.stop();
  }, [inView, reduce, value, mv]);

  return (
    <span ref={ref} className={className}>
      <span className="sr-only">
        {fmt.format(value)}
        {suffix}
      </span>
      <span aria-hidden="true">
        <motion.span>{text}</motion.span>
        {suffix}
      </span>
    </span>
  );
}