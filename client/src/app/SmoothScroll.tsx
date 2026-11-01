import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from 'react';
import Lenis from 'lenis';
import { useReducedMotion } from 'framer-motion';

const LenisContext = createContext<Lenis | null>(null);

export function SmoothScroll({ children }: { children: ReactNode }) {
  const reduce = useReducedMotion();
  const [lenis, setLenis] = useState<Lenis | null>(null);

  useEffect(() => {
    if (reduce) return; // native scrolling for reduced motion
    const instance = new Lenis({ lerp: 0.1, smoothWheel: true });
    setLenis(instance);

    let raf = 0;
    const loop = (time: number) => {
      instance.raf(time);
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(raf);
      instance.destroy();
      setLenis(null);
    };
  }, [reduce]);

  return <LenisContext.Provider value={lenis}>{children}</LenisContext.Provider>;
}

export const useLenis = () => useContext(LenisContext);

export function useScrollToTop() {
  const lenis = useLenis();
  return useCallback(
    (immediate = false) => {
      if (lenis) {
        lenis.scrollTo(0, { immediate, force: true });
        return;
      }
      const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      window.scrollTo({ top: 0, behavior: immediate || reduce ? 'auto' : 'smooth' });
    },
    [lenis]
  );
}