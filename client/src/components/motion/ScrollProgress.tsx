import { motion, useScroll, useSpring } from 'framer-motion';
import { springValues } from '@/lib/motion';

export function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, springValues.progress);

  return (
    <motion.div
      aria-hidden="true"
      className="fixed inset-x-0 top-0 z-[70] h-[3px] origin-left bg-aurora print:hidden"
      style={{ scaleX }}
    />
  );
}