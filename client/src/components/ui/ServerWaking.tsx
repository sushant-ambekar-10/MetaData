import { motion } from 'framer-motion';
import { Loader2, WifiOff } from 'lucide-react';
import { spring } from '@/lib/motion';

// Shown when the API has not answered after 4 seconds
export function ServerWaking() {
  return (
    <motion.div
      role="status"
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={spring.soft}
      className="bento flex items-start gap-4 p-5"
    >
      <motion.span
        aria-hidden="true"
        className="mt-0.5 inline-flex"
        animate={{ rotate: 360 }}
        transition={{ repeat: Infinity, duration: 1.2, ease: 'linear' }}
      >
        <Loader2 className="h-5 w-5 text-a2-text" />
      </motion.span>
      <div>
        <p className="font-medium">The server is waking up</p>
        <p className="mt-1 text-sm text-muted">
          The free-tier server sleeps when idle and can take up to a minute to start. If it doesn't answer soon,
          I'll show a saved copy instead.
        </p>
      </div>
    </motion.div>
  );
}

// Shown when the API failed and the bundled snapshot is displayed
export function OfflineNotice({ onRetry, what = 'content' }: { onRetry?: () => void; what?: string }) {
  return (
    <div role="status" className="bento flex flex-wrap items-center justify-between gap-4 p-4 text-sm">
      <p className="flex items-center gap-3 text-muted">
        <WifiOff className="h-4 w-4 shrink-0 text-a3" aria-hidden="true" />
        Couldn't reach the server, so you're viewing a saved copy of my {what}.
      </p>
      {onRetry && (
        <button
          type="button"
          onClick={onRetry}
          className="rounded-pill border border-line-strong px-4 py-2 font-medium transition-colors duration-200 hover:bg-surface-2"
        >
          Try again
        </button>
      )}
    </div>
  );
}