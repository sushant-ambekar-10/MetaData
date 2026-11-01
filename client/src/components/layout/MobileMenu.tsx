import { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { Mail, X } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { ease, spring, staggerParent } from '@/lib/motion';
import { NAV, SITE } from '@/lib/site';
import { cn, isActivePath } from '@/lib/utils';

interface Props {
  open: boolean;
  onClose: () => void;
  pathname: string;
}

const CENTER = 'at 92% 4%';

export function MobileMenu({ open, onClose, pathname }: Props) {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);

  // Escape closes; Tab is trapped inside the dialog
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
        return;
      }
      if (e.key !== 'Tab' || !ref.current) return;
      const focusable = ref.current.querySelectorAll<HTMLElement>('a[href],button:not([disabled])');
      if (!focusable.length) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  const motionProps = reduce
    ? {
        initial: { opacity: 0 },
        animate: { opacity: 1, transition: { duration: 0.2 } },
        exit: { opacity: 0, transition: { duration: 0.15 } },
      }
    : {
        initial: { clipPath: `circle(0% ${CENTER})` },
        animate: { clipPath: `circle(150% ${CENTER})`, transition: { duration: 0.8, ease: ease.out } },
        exit: { clipPath: `circle(0% ${CENTER})`, transition: { duration: 0.5, ease: ease.inOut } },
      };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          ref={ref}
          id="mobile-menu"
          role="dialog"
          aria-modal="true"
          aria-label="Site menu"
          className="fixed inset-0 z-[60] flex flex-col bg-bg/95 px-6 pb-8 pt-4 backdrop-blur-2xl lg:hidden"
          {...motionProps}
        >
          <div className="flex items-center justify-between">
            <p className="label-mono">Menu</p>
            <button
              type="button"
              onClick={onClose}
              autoFocus
              aria-label="Close menu"
              className="grid h-10 w-10 place-items-center rounded-full border border-line-strong text-fg"
            >
              <X className="h-5 w-5" aria-hidden="true" />
            </button>
          </div>

          <motion.ul
            className="flex flex-1 flex-col justify-center gap-1"
            variants={staggerParent(0.07, 0.25)}
            initial="hidden"
            animate="show"
          >
            {NAV.map((item) => {
              const active = isActivePath(pathname, item.to);
              return (
                <li key={item.to} className="overflow-hidden py-1">
                  <motion.div variants={{ hidden: { y: '110%' }, show: { y: 0, transition: spring.soft } }}>
                    <Link
                      to={item.to}
                      aria-current={active ? 'page' : undefined}
                      onClick={() => {
                        if (active) onClose();
                      }}
                      className={cn(
                        'flex items-baseline gap-3 font-heading text-display-md font-semibold',
                        active ? 'text-gradient' : 'text-fg'
                      )}
                    >
                      {item.label}
                      {item.hint && <span className="label-mono">{item.hint}</span>}
                    </Link>
                  </motion.div>
                </li>
              );
            })}
          </motion.ul>

          <div className="flex flex-col gap-4">
            <Button to="/resume" size="lg" className="w-full" onClick={() => undefined}>
              Resume
            </Button>
            <a
              href={`mailto:${SITE.email}`}
              className="flex items-center justify-center gap-2 text-sm text-muted hover:text-fg"
            >
              <Mail className="h-4 w-4" aria-hidden="true" />
              {SITE.email}
            </a>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}