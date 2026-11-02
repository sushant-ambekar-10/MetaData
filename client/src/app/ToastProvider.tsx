import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { AlertCircle, CheckCircle2, Info, X } from 'lucide-react';
import { spring } from '@/lib/motion';

export type ToastKind = 'success' | 'error' | 'info';

export interface ToastInput {
  kind?: ToastKind;
  title: string;
  description?: string;
  duration?: number; // ms
}

interface ToastItem {
  id: number;
  kind: ToastKind;
  title: string;
  description?: string;
  duration: number;
}

const ToastContext = createContext<{ toast: (input: ToastInput) => void } | null>(null);

const ICONS = { success: CheckCircle2, error: AlertCircle, info: Info } as const;
const TONES: Record<ToastKind, string> = { success: 'text-a2-text', error: 'text-a3', info: 'text-a1-text' };

function ToastCard({ toast, onDismiss }: { toast: ToastItem; onDismiss: (id: number) => void }) {
  const Icon = ICONS[toast.kind];

  useEffect(() => {
    const t = window.setTimeout(() => onDismiss(toast.id), toast.duration);
    return () => window.clearTimeout(t);
  }, [toast.id, toast.duration, onDismiss]);

  return (
    <motion.div
      layout
      role={toast.kind === 'error' ? 'alert' : 'status'}
      initial={{ opacity: 0, y: 24, scale: 0.96 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, scale: 0.96, transition: { duration: 0.15 } }}
      transition={spring.snappy}
      className="glass pointer-events-auto flex w-full max-w-sm items-start gap-3 rounded-2xl p-4"
    >
      <Icon className={`mt-0.5 h-5 w-5 shrink-0 ${TONES[toast.kind]}`} aria-hidden="true" />
      <div className="min-w-0 flex-1">
        <p className="text-sm font-medium">{toast.title}</p>
        {toast.description && <p className="mt-0.5 break-words text-sm text-muted">{toast.description}</p>}
      </div>
      <button
        type="button"
        onClick={() => onDismiss(toast.id)}
        aria-label="Dismiss notification"
        className="grid h-7 w-7 shrink-0 place-items-center rounded-full text-muted transition-colors duration-200 hover:bg-surface-2 hover:text-fg"
      >
        <X className="h-4 w-4" aria-hidden="true" />
      </button>
    </motion.div>
  );
}

export function ToastProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<ToastItem[]>([]);
  const nextId = useRef(0);

  const dismiss = useCallback((id: number) => setItems((list) => list.filter((t) => t.id !== id)), []);

  const toast = useCallback((input: ToastInput) => {
    const kind = input.kind ?? 'info';
    const item: ToastItem = {
      id: ++nextId.current,
      kind,
      title: input.title,
      description: input.description,
      duration: input.duration ?? (kind === 'error' ? 7000 : 4500),
    };
    setItems((list) => [...list.slice(-3), item]); // keep at most 4 on screen
  }, []);

  const value = useMemo(() => ({ toast }), [toast]);

  return (
    <ToastContext.Provider value={value}>
      {children}
      {/* Always-mounted live region so screen readers announce new toasts. Bottom-20 on mobile clears the Resume button. */}
      <div
        aria-live="polite"
        className="pointer-events-none fixed inset-x-0 bottom-20 z-[120] flex flex-col items-center gap-2 px-4 lg:bottom-6 lg:items-start lg:px-6 print:hidden"
      >
        <AnimatePresence initial={false}>
          {items.map((t) => (
            <ToastCard key={t.id} toast={t} onDismiss={dismiss} />
          ))}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast must be used inside <ToastProvider>');
  return ctx;
}