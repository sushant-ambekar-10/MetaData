import { useEffect, useRef } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';
import { useScrollLock } from '@/hooks/useScrollLock';
import { spring } from '@/lib/motion';

interface Props {
  images: string[];
  index: number | null; // null = closed
  onClose: () => void;
  onChange: (index: number) => void;
  label: string; // e.g. the project name, used in alt text
}

export function Lightbox({ images, index, onClose, onChange, label }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const count = images.length;

  useScrollLock(index !== null);

  // Esc closes, arrows navigate, Tab is trapped inside the dialog
  useEffect(() => {
    if (index === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      } else if (e.key === 'ArrowRight' && count > 1) {
        onChange((index + 1) % count);
      } else if (e.key === 'ArrowLeft' && count > 1) {
        onChange((index - 1 + count) % count);
      } else if (e.key === 'Tab' && ref.current) {
        const focusable = ref.current.querySelectorAll<HTMLElement>('button:not([disabled])');
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
      }
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [index, count, onClose, onChange]);

  const arrow =
    'absolute top-1/2 z-10 grid h-12 w-12 -translate-y-1/2 place-items-center rounded-full border border-line-strong bg-surface/80 text-fg transition-colors duration-200 hover:bg-surface-2';

  return (
    <AnimatePresence>
      {index !== null && (
        <motion.div
          ref={ref}
          role="dialog"
          aria-modal="true"
          aria-label={`${label} screenshots`}
          className="fixed inset-0 z-[105] flex flex-col bg-bg/90 backdrop-blur-xl"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          onClick={onClose}
        >
          <div className="flex items-center justify-between p-4 sm:p-6">
            <p className="label-mono" aria-live="polite">
              {index + 1} / {count}
            </p>
            <button
              type="button"
              autoFocus
              onClick={(e) => {
                e.stopPropagation();
                onClose();
              }}
              aria-label="Close gallery"
              className="grid h-11 w-11 place-items-center rounded-full border border-line-strong text-fg transition-colors duration-200 hover:bg-surface-2"
            >
              <X className="h-5 w-5" aria-hidden="true" />
            </button>
          </div>

          <div className="relative flex flex-1 items-center justify-center px-4 pb-8 sm:px-20">
            {count > 1 && (
              <>
                <button
                  type="button"
                  aria-label="Previous screenshot"
                  className={`${arrow} left-3 sm:left-6`}
                  onClick={(e) => {
                    e.stopPropagation();
                    onChange((index - 1 + count) % count);
                  }}
                >
                  <ChevronLeft className="h-5 w-5" aria-hidden="true" />
                </button>
                <button
                  type="button"
                  aria-label="Next screenshot"
                  className={`${arrow} right-3 sm:right-6`}
                  onClick={(e) => {
                    e.stopPropagation();
                    onChange((index + 1) % count);
                  }}
                >
                  <ChevronRight className="h-5 w-5" aria-hidden="true" />
                </button>
              </>
            )}

            <AnimatePresence mode="wait" initial={false}>
              <motion.img
                key={index}
                src={images[index]}
                alt={`${label} screenshot ${index + 1} of ${count}`}
                className="max-h-[78vh] max-w-full rounded-2xl border border-line-strong object-contain"
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.98 }}
                transition={spring.snappy}
                onClick={(e) => e.stopPropagation()}
              />
            </AnimatePresence>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}