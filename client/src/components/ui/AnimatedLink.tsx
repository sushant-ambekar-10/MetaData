import { useState, type ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { spring } from '@/lib/motion';
import { cn, isExternal } from '@/lib/utils';

interface Props {
  to?: string;
  href?: string;
  children: ReactNode;
  className?: string;
}

// Text link with a spring-animated underline (hover and keyboard focus)
export function AnimatedLink({ to, href, children, className }: Props) {
  const [on, setOn] = useState(false);
  const handlers = {
    onPointerEnter: () => setOn(true),
    onPointerLeave: () => setOn(false),
    onFocus: () => setOn(true),
    onBlur: () => setOn(false),
  };
  const classes = cn('relative inline-block', className);

  const content = (
    <>
      {children}
      <motion.span
        aria-hidden="true"
        className="absolute -bottom-0.5 left-0 h-px w-full origin-left bg-current"
        initial={false}
        animate={{ scaleX: on ? 1 : 0 }}
        transition={spring.snappy}
      />
    </>
  );

  if (to) {
    return (
      <Link to={to} className={classes} {...handlers}>
        {content}
      </Link>
    );
  }

  const external = href ? isExternal(href) : false;
  return (
    <a
      href={href}
      className={classes}
      {...handlers}
      {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
    >
      {content}
      {external && <span className="sr-only"> (opens in a new tab)</span>}
    </a>
  );
}