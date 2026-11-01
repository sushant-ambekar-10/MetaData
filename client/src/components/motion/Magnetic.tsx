import { useRef, type ReactNode } from 'react';
import { motion, useMotionValue, useReducedMotion, useSpring } from 'framer-motion';
import { useFinePointer } from '@/hooks/useMediaQuery';
import { springValues } from '@/lib/motion';

interface Props {
  children: ReactNode;
  strength?: number; // 0.2 subtle ... 0.5 strong
}

// Element gently follows the pointer while hovered. Disabled on touch and reduced motion.
export function Magnetic({ children, strength = 0.35 }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const fine = useFinePointer();
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, springValues.magnetic);
  const sy = useSpring(y, springValues.magnetic);

  if (reduce || !fine) return <div className="inline-block">{children}</div>;

  return (
    <motion.div
      ref={ref}
      className="inline-block"
      style={{ x: sx, y: sy }}
      onPointerMove={(e) => {
        const r = ref.current?.getBoundingClientRect();
        if (!r) return;
        x.set((e.clientX - (r.left + r.width / 2)) * strength);
        y.set((e.clientY - (r.top + r.height / 2)) * strength);
      }}
      onPointerLeave={() => {
        x.set(0);
        y.set(0);
      }}
    >
      {children}
    </motion.div>
  );
}