import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

// Shimmer sweep uses only transform. Under reduced motion it stays a static block.
export function Skeleton({ className }: { className?: string }) {
  return (
    <div aria-hidden="true" className={cn('relative overflow-hidden rounded-card bg-surface-2', className)}>
      <motion.div
        className="absolute inset-0 bg-gradient-to-r from-transparent via-fg/10 to-transparent"
        initial={{ x: '-100%' }}
        animate={{ x: '100%' }}
        transition={{ repeat: Infinity, duration: 1.4, ease: 'linear' }}
      />
    </div>
  );
}