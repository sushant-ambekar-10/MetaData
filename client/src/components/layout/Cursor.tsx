import { useEffect, useState } from 'react';
import { motion, useMotionValue, useReducedMotion, useSpring } from 'framer-motion';
import { useFinePointer } from '@/hooks/useMediaQuery';
import { springValues, spring } from '@/lib/motion';
import { cn } from '@/lib/utils';

const INTERACTIVE = 'a[href],button,[role="button"],summary,label[for],select,[data-cursor="hover"]';
const TEXT_FIELD =
  'input:not([type="checkbox"]):not([type="radio"]):not([type="submit"]),textarea,[contenteditable="true"]';

type Mode = 'idle' | 'hover' | 'text' | 'hidden';

function CursorInner() {
  const x = useMotionValue(-100);
  const y = useMotionValue(-100);
  const rx = useSpring(x, springValues.cursor);
  const ry = useSpring(y, springValues.cursor);
  const [mode, setMode] = useState<Mode>('hidden');

  useEffect(() => {
    document.documentElement.classList.add('custom-cursor');

    const move = (e: PointerEvent) => {
      if (e.pointerType !== 'mouse') return;
      x.set(e.clientX);
      y.set(e.clientY);
      setMode((m) => (m === 'hidden' ? 'idle' : m));
    };
    const over = (e: PointerEvent) => {
      const target = e.target;
      if (!(target instanceof Element)) return;
      if (target.closest(TEXT_FIELD)) setMode('text');
      else if (target.closest(INTERACTIVE)) setMode('hover');
      else setMode('idle');
    };
    const leave = () => setMode('hidden');

    window.addEventListener('pointermove', move, { passive: true });
    document.addEventListener('pointerover', over);
    document.documentElement.addEventListener('pointerleave', leave);
    return () => {
      document.documentElement.classList.remove('custom-cursor');
      window.removeEventListener('pointermove', move);
      document.removeEventListener('pointerover', over);
      document.documentElement.removeEventListener('pointerleave', leave);
    };
  }, [x, y]);

  const visible = mode !== 'hidden' && mode !== 'text';

  return (
    <div aria-hidden="true" className="print:hidden">
      {/* Ring: lags behind with a spring, grows over interactive elements */}
      <motion.div
        className={cn(
          'pointer-events-none fixed left-0 top-0 z-[110] -ml-[18px] -mt-[18px] h-9 w-9 rounded-full border',
          mode === 'hover' ? 'border-a2-text bg-a1/15' : 'border-fg/40'
        )}
        style={{ x: rx, y: ry }}
        animate={{ scale: mode === 'hover' ? 1.7 : 1, opacity: visible ? 1 : 0 }}
        transition={spring.snappy}
      />
      {/* Dot: exact pointer position */}
      <motion.div
        className="pointer-events-none fixed left-0 top-0 z-[110] -ml-[3px] -mt-[3px] h-1.5 w-1.5 rounded-full bg-a2-text"
        style={{ x, y }}
        animate={{ scale: mode === 'hover' ? 0.4 : 1, opacity: visible ? 1 : 0 }}
        transition={spring.snappy}
      />
    </div>
  );
}

// Desktop only. Not mounted at all on touch devices or under reduced motion.
export function Cursor() {
  const fine = useFinePointer();
  const reduce = useReducedMotion();
  if (!fine || reduce) return null;
  return <CursorInner />;
}