import { useEffect, useRef, type ReactNode } from 'react';
import { useAnimate, useReducedMotion, type AnimationPlaybackControls } from 'framer-motion';
import { cn } from '@/lib/utils';

interface Props {
  children: ReactNode;
  reverse?: boolean;
  /** seconds for one full loop */
  duration?: number;
  className?: string;
}

const EDGE_FADE = 'linear-gradient(to right, transparent, #000 8%, #000 92%, transparent)';

// Infinite horizontal loop. Pauses while hovered. Under reduced motion it becomes a static wrapped list.
// Only transform is animated. Put enough children inside to be wider than the screen.
export function Marquee({ children, reverse = false, duration = 45, className }: Props) {
  const reduce = useReducedMotion();
  const [scope, animate] = useAnimate<HTMLDivElement>();
  const controls = useRef<AnimationPlaybackControls | null>(null);

  useEffect(() => {
    if (reduce || !scope.current) return;
    controls.current = animate(
      scope.current,
      { x: reverse ? ['-50%', '0%'] : ['0%', '-50%'] },
      { duration, ease: 'linear', repeat: Infinity }
    );
    return () => {
      controls.current?.stop();
      controls.current = null;
    };
  }, [reduce, reverse, duration, animate, scope]);

  if (reduce) {
    return <div className={cn('flex flex-wrap justify-center gap-3 px-5', className)}>{children}</div>;
  }

  return (
    <div
      className={cn('overflow-hidden', className)}
      style={{ maskImage: EDGE_FADE, WebkitMaskImage: EDGE_FADE }}
      onPointerEnter={() => controls.current?.pause()}
      onPointerLeave={() => controls.current?.play()}
    >
      <div ref={scope} className="flex w-max">
        <div className="flex shrink-0 gap-3 pr-3">{children}</div>
        {/* identical second half makes the -50% loop seamless; hidden from assistive tech */}
        <div aria-hidden="true" className="flex shrink-0 gap-3 pr-3">
          {children}
        </div>
      </div>
    </div>
  );
}