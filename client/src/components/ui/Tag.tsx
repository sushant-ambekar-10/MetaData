import type { ReactNode } from 'react';
import { cn } from '@/lib/utils';

export function Tag({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-pill border border-line px-3 py-1 font-mono text-[11px] text-muted',
        className
      )}
    >
      {children}
    </span>
  );
}