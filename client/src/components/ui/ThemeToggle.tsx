import { AnimatePresence, motion } from 'framer-motion';
import { Moon, Sun } from 'lucide-react';
import { useTheme } from '@/app/ThemeProvider';
import { spring } from '@/lib/motion';

export function ThemeToggle() {
  const { theme, toggle } = useTheme();
  const isDark = theme === 'dark';

  return (
    <motion.button
      type="button"
      onClick={toggle}
      whileTap={{ scale: 0.88 }}
      transition={spring.snappy}
      aria-label={isDark ? 'Switch to light theme' : 'Switch to dark theme'}
      className="relative grid h-9 w-9 place-items-center overflow-hidden rounded-full text-fg transition-colors duration-200 hover:bg-surface-2"
    >
      <AnimatePresence mode="wait" initial={false}>
        <motion.span
          key={theme}
          className="grid place-items-center"
          initial={{ rotate: -90, scale: 0, opacity: 0 }}
          animate={{ rotate: 0, scale: 1, opacity: 1 }}
          exit={{ rotate: 90, scale: 0, opacity: 0 }}
          transition={spring.snappy}
        >
          {isDark ? <Moon className="h-[18px] w-[18px]" aria-hidden="true" /> : <Sun className="h-[18px] w-[18px]" aria-hidden="true" />}
        </motion.span>
      </AnimatePresence>
    </motion.button>
  );
}