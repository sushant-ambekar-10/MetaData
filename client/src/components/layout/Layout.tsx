import { useEffect, useRef, useState, type ReactNode } from 'react';
import { useLocation } from 'react-router-dom';
import { ErrorBoundary } from '@/app/ErrorBoundary';
import { SkipLink } from '@/components/ui/SkipLink';
import { ScrollProgress } from '@/components/motion/ScrollProgress';
import { AuroraBackground } from '@/components/motion/AuroraBackground';
import { Preloader } from './Preloader';
import { Cursor } from './Cursor';
import { Navbar } from './Navbar';
import { Footer } from './Footer';

// Tells screen readers about route changes (the title is set by <Seo />)
function RouteAnnouncer() {
  const { pathname } = useLocation();
  const [message, setMessage] = useState('');
  const first = useRef(true);

  useEffect(() => {
    if (first.current) {
      first.current = false;
      return;
    }
    const t = window.setTimeout(() => setMessage(`Navigated to ${document.title}`), 700);
    return () => window.clearTimeout(t);
  }, [pathname]);

  return (
    <div role="status" aria-live="polite" className="sr-only">
      {message}
    </div>
  );
}

export function Layout({ children }: { children: ReactNode }) {
  const { pathname } = useLocation();

  return (
    <>
      <SkipLink />
      <Preloader />
      <ScrollProgress />
      <Cursor />
      <AuroraBackground />

      <div id="app-shell" className="relative flex min-h-dvh flex-col">
        <Navbar />
        <main id="main" tabIndex={-1} className="flex-1 outline-none">
          <ErrorBoundary resetKey={pathname}>{children}</ErrorBoundary>
        </main>
        <Footer />
      </div>

      <RouteAnnouncer />
    </>
  );
}