import { Fragment } from 'react';
import { motion, type Variants } from 'framer-motion';
import { spring } from '@/lib/motion';

interface Props {
  text: string;
  as?: 'h1' | 'h2' | 'h3' | 'p' | 'span';
  className?: string;
  delay?: number;
  stagger?: number;
  /** Controlled mode. Omit to animate when scrolled into view. */
  active?: boolean;
}

// Per-word masked reveal. Screen readers get the plain text; the animated copy is aria-hidden.
export function SplitText({ text, as: Tag = 'h2', className, delay = 0.3, stagger = 0.07, active }: Props) {
  const parent: Variants = {
    hidden: {},
    show: { transition: { staggerChildren: stagger, delayChildren: delay } },
  };
  const word: Variants = {
    hidden: { y: '115%', opacity: 0 },
    show: { y: 0, opacity: 1, transition: spring.soft },
  };
  const trigger =
    active === undefined
      ? { whileInView: 'show', viewport: { once: true, amount: 0.6 } }
      : { animate: active ? 'show' : 'hidden' };

  const words = text.split(' ');

  return (
    <Tag className={className}>
      <span className="sr-only">{text}</span>
      <motion.span aria-hidden="true" className="block" variants={parent} initial="hidden" {...trigger}>
        {words.map((w, i) => (
          <Fragment key={`${w}-${i}`}>
            <span className="inline-block overflow-hidden py-[0.1em] align-bottom -my-[0.1em]">
              <motion.span className="inline-block" variants={word}>
                {w}
              </motion.span>
            </span>
            {i < words.length - 1 ? ' ' : null}
          </Fragment>
        ))}
      </motion.span>
    </Tag>
  );
}