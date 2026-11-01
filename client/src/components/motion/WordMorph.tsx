import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { spring } from '@/lib/motion';
import { cn } from '@/lib/utils';

interface Props {
  words: string[];
  interval?: number;
  className?: string;
}

// Rotating word that slides in/out. Replaces the old typewriter effect.
export function WordMorph({ words, interval = 2600, className }: Props) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (words.length < 2) return;
    const id = window.setInterval(() => setIndex((i) => (i + 1) % words.length), interval);
    return () => window.clearInterval(id);
  }, [words.length, interval]);

  return (
    <span className={cn('relative inline-flex overflow-hidden align-bottom', className)}>
      <span className="sr-only">{words.join(', ')}</span>
      <AnimatePresence mode="wait" initial={false}>
        <motion.span
          key={words[index]}
          aria-hidden="true"
          className="text-gradient inline-block pb-[0.14em]"
          initial={{ y: '100%', opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: '-100%', opacity: 0 }}
          transition={spring.snappy}
        >
          {words[index]}
        </motion.span>
      </AnimatePresence>
    </span>
  );
}