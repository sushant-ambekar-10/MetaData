import { useCallback, useEffect, useRef, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, useMotionValueEvent, useScroll } from 'framer-motion';
import { FileText, Menu } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { ThemeToggle } from '@/components/ui/ThemeToggle';
import { MobileMenu } from '@/components/layout/MobileMenu';
import { useScrollLock } from '@/hooks/useScrollLock';
import { spring } from '@/lib/motion';
import { NAV } from '@/lib/site';
import { cn, isActivePath } from '@/lib/utils';

function Brand() {
  return (
    <Link to="/" aria-label="Sushant Ambekar, home" className="flex items-center gap-2.5 rounded-pill pr-2">
      <span className="text-gradient grid h-9 w-9 place-items-center rounded-full border border-line-strong bg-surface-2 font-heading text-sm font-bold">
        SA
      </span>
      <span className="hidden font-heading text-sm font-semibold sm:block">Sushant Ambekar</span>
    </Link>
  );
}

// Floating Resume button for small screens (the desktop pill has its own)
function ResumeFab() {
  const { pathname } = useLocation();
  if (pathname === '/resume') return null;
  return (
    <motion.div
      className="fixed bottom-4 right-4 z-40 lg:hidden print:hidden"
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ ...spring.bouncy, delay: 1.2 }}
    >
      <Button to="/resume" size="md" className="shadow-glow">
        <FileText className="h-4 w-4" aria-hidden="true" />
        Resume
      </Button>
    </motion.div>
  );
}

export function Navbar() {
  const { pathname } = useLocation();
  const { scrollY } = useScroll();
  const [hidden, setHidden] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const toggleRef = useRef<HTMLButtonElement>(null);

  // Hide on scroll down, show on scroll up
  useMotionValueEvent(scrollY, 'change', (latest) => {
    const previous = scrollY.getPrevious() ?? 0;
    setHidden(latest > previous && latest > 140);
  });

  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  useScrollLock(menuOpen);

  const closeMenu = useCallback(() => {
    setMenuOpen(false);
    toggleRef.current?.focus();
  }, []);

  return (
    <>
      <motion.header
        className="pointer-events-none fixed inset-x-0 top-0 z-50 flex justify-center px-3 pt-3 sm:pt-4 print:hidden"
        animate={{ y: hidden && !menuOpen ? '-130%' : '0%' }}
        transition={spring.soft}
        onFocusCapture={() => setHidden(false)}
      >
        <nav
          aria-label="Primary"
          className="glass pointer-events-auto flex w-full max-w-5xl items-center justify-between gap-2 rounded-pill p-1.5 pl-2 lg:w-auto lg:max-w-none lg:gap-4"
        >
          <Brand />

          <ul className="hidden items-center gap-0.5 lg:flex">
            {NAV.map((item) => {
              const active = isActivePath(pathname, item.to);
              return (
                <li key={item.to}>
                  <Link
                    to={item.to}
                    title={item.hint}
                    aria-current={active ? 'page' : undefined}
                    className={cn(
                      'relative block rounded-pill px-4 py-2 text-sm font-medium transition-colors duration-200',
                      active ? 'text-fg' : 'text-muted hover:text-fg'
                    )}
                  >
                    {active && (
                      <motion.span
                        layoutId="nav-active"
                        className="absolute inset-0 rounded-pill bg-surface-2 ring-1 ring-line-strong"
                        transition={spring.snappy}
                      />
                    )}
                    <span className="relative">{item.label}</span>
                  </Link>
                </li>
              );
            })}
          </ul>

          <div className="flex items-center gap-1.5">
            <Button to="/resume" size="sm" className="hidden lg:inline-flex">
              Resume
            </Button>
            <ThemeToggle />
            <button
              ref={toggleRef}
              type="button"
              onClick={() => setMenuOpen((o) => !o)}
              aria-expanded={menuOpen}
              aria-controls="mobile-menu"
              aria-label={menuOpen ? 'Close menu' : 'Open menu'}
              className="grid h-9 w-9 place-items-center rounded-full text-fg transition-colors duration-200 hover:bg-surface-2 lg:hidden"
            >
              <Menu className="h-5 w-5" aria-hidden="true" />
            </button>
          </div>
        </nav>
      </motion.header>

      {/* Rendered outside the header: a transformed parent would break position:fixed */}
      <MobileMenu open={menuOpen} onClose={closeMenu} pathname={pathname} />
      <ResumeFab />
    </>
  );
}