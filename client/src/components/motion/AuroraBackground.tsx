import { motion, useReducedMotion, useScroll, useTransform } from 'framer-motion';

// Three gradient "moods" stacked; scroll position cross-fades between them (opacity only,
// so it stays on the compositor). This is the modern replacement for "darker as you scroll".
const strength = 'var(--aurora-strength)';
const LAYERS = [
  // violet-led (top of page)
  `radial-gradient(60% 50% at 15% 0%, rgb(var(--a1) / ${strength}), transparent 70%), radial-gradient(45% 40% at 90% 20%, rgb(var(--a2) / calc(${strength} * 0.7)), transparent 70%)`,
  // cyan-led (middle)
  `radial-gradient(55% 50% at 85% 10%, rgb(var(--a2) / ${strength}), transparent 70%), radial-gradient(50% 45% at 10% 60%, rgb(var(--a1) / calc(${strength} * 0.8)), transparent 70%)`,
  // warm glow (bottom)
  `radial-gradient(60% 50% at 50% 100%, rgb(var(--a3) / calc(${strength} * 0.6)), transparent 70%), radial-gradient(50% 45% at 10% 30%, rgb(var(--a1) / calc(${strength} * 0.8)), transparent 70%)`,
];

export function AuroraBackground() {
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll();
  const o1 = useTransform(scrollYProgress, [0, 0.35, 0.6], [1, 0.4, 0]);
  const o2 = useTransform(scrollYProgress, [0.1, 0.4, 0.7, 1], [0, 1, 0.8, 0.1]);
  const o3 = useTransform(scrollYProgress, [0.5, 1], [0, 1]);
  const opacities = [o1, o2, o3];

  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 -z-10 overflow-hidden print:hidden">
      <motion.div
        className="absolute inset-[-10%]"
        animate={reduce ? undefined : { x: ['0%', '2%', '-2%', '0%'], y: ['0%', '-2%', '2%', '0%'] }}
        transition={{ duration: 30, repeat: Infinity, ease: 'easeInOut' }}
      >
        {LAYERS.map((background, i) => (
          <motion.div
            key={i}
            className="absolute inset-0"
            style={{ backgroundImage: background, opacity: reduce ? (i === 0 ? 1 : 0) : opacities[i] }}
          />
        ))}
      </motion.div>
    </div>
  );
}