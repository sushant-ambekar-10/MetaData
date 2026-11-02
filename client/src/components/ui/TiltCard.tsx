import { useRef, type PointerEvent, type ReactNode } from 'react';
import {
  motion,
  useMotionTemplate,
  useMotionValue,
  useReducedMotion,
  useSpring,
  useTransform,
} from 'framer-motion';
import { useFinePointer } from '@/hooks/useMediaQuery';
import { springValues } from '@/lib/motion';
import { cn } from '@/lib/utils';

interface Props {
  children: ReactNode;
  /** Put the card look (e.g. "bento") and sizing here; overlays inherit its border radius. */
  className?: string;
  max?: number; // max tilt in degrees
}

// 3D tilt + cursor-following spotlight and glowing border. Only transform/opacity are animated.
// Touch devices and reduced-motion users get a plain, static card.
export function TiltCard({ children, className, max = 6 }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const fine = useFinePointer();
  const reduce = useReducedMotion();

  const px = useMotionValue(0); // pointer position in px
  const py = useMotionValue(0);
  const nx = useMotionValue(0.5); // normalised 0..1
  const ny = useMotionValue(0.5);
  const glow = useSpring(0, { stiffness: 200, damping: 30 });

  const rotateX = useSpring(useTransform(ny, [0, 1], [max, -max]), springValues.tilt);
  const rotateY = useSpring(useTransform(nx, [0, 1], [-max, max]), springValues.tilt);

  const fill = useMotionTemplate`radial-gradient(380px circle at ${px}px ${py}px, rgb(var(--a1) / 0.2), transparent 65%)`;
  const edge = useMotionTemplate`radial-gradient(240px circle at ${px}px ${py}px, rgb(var(--a2)), rgb(var(--a1) / 0.65) 50%, transparent 80%)`;

  if (!fine || reduce) return <div className={cn('relative', className)}>{children}</div>;

  const onMove = (e: PointerEvent<HTMLDivElement>) => {
    if (e.pointerType !== 'mouse') return;
    const r = ref.current?.getBoundingClientRect();
    if (!r) return;
    const x = e.clientX - r.left;
    const y = e.clientY - r.top;
    px.set(x);
    py.set(y);
    nx.set(x / r.width);
    ny.set(y / r.height);
  };

  const onLeave = () => {
    glow.set(0);
    nx.set(0.5);
    ny.set(0.5);
  };

  return (
    <motion.div
      ref={ref}
      className={cn('relative', className)}
      style={{ rotateX, rotateY, transformPerspective: 900 }}
      onPointerMove={onMove}
      onPointerEnter={() => glow.set(1)}
      onPointerLeave={onLeave}
    >
      {children}
      <motion.div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 rounded-[inherit]"
        style={{ background: fill, opacity: glow }}
      />
      <motion.div
        aria-hidden="true"
        className="glow-border pointer-events-none absolute inset-0 rounded-[inherit]"
        style={{ background: edge, opacity: glow }}
      />
    </motion.div>
  );
}