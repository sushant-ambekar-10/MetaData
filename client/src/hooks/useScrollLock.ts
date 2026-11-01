import { useEffect } from 'react';
import { useLenis } from '@/app/SmoothScroll';

// Locks page scroll while `locked` is true (preloader, mobile menu).
export function useScrollLock(locked: boolean) {
  const lenis = useLenis();

  useEffect(() => {
    if (!locked) return;
    const html = document.documentElement;
    const previous = html.style.overflow;
    html.style.overflow = 'hidden';
    lenis?.stop();
    return () => {
      html.style.overflow = previous;
      lenis?.start();
    };
  }, [locked, lenis]);
}