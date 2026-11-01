import { useEffect, useRef } from 'react';
import { motion, useMotionValue, useReducedMotion, useSpring } from 'framer-motion';
import { useFinePointer } from '@/hooks/useMediaQuery';
import { springValues } from '@/lib/motion';

interface Props {
  size?: number;
}

// Soft aurora blob that slowly chases the cursor. Place inside a `relative overflow-hidden` section.
// Touch / reduced motion: it simply rests in place.
export function FollowBlob({ size = 560 }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const fine = useFinePointer();
  const reduce = useReducedMotion();
  const enabled = fine && !reduce;
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, springValues.blob);
  const sy = useSpring(y, springValues.blob);

  useEffect(() => {
    const parent = ref.current?.parentElement;
    if (!parent) return;

    const rest = parent.getBoundingClientRect();
    x.set(rest.width * 0.65 - size / 2);
    y.set(rest.height * 0.3 - size / 2);
    if (!enabled) return;

    const onMove = (e: PointerEvent) => {
      const r = parent.getBoundingClientRect();
      x.set(e.clientX - r.left - size / 2);
      y.set(e.clientY - r.top - size / 2);
    };
    window.addEventListener('pointermove', onMove, { passive: true });
    return () => window.removeEventListener('pointermove', onMove);
  }, [enabled, size, x, y]);

  return (
    <motion.div
      ref={ref}
      aria-hidden="true"
      className="pointer-events-none absolute left-0 top-0 rounded-full"
      style={{
        x: sx,
        y: sy,
        width: size,
        height: size,
        background:
          'radial-gradient(closest-side, rgb(var(--a1) / 0.35), rgb(var(--a2) / 0.14) 60%, transparent)',
      }}
    />
  );
}