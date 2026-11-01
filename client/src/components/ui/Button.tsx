import type { ButtonHTMLAttributes, ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Magnetic } from '@/components/motion/Magnetic';
import { spring } from '@/lib/motion';
import { cn, isExternal } from '@/lib/utils';

type Variant = 'primary' | 'secondary' | 'ghost';
type Size = 'sm' | 'md' | 'lg';

export interface ButtonProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'className'> {
  variant?: Variant;
  size?: Size;
  className?: string; // applied to the outer wrapper (layout, visibility)
  to?: string; // internal route -> <Link>
  href?: string; // external URL, mailto:, or file -> <a>
  download?: boolean | string;
  magnetic?: boolean;
  children?: ReactNode;
}

const base =
  'inline-flex w-full select-none items-center justify-center gap-2 whitespace-nowrap rounded-pill font-medium transition-colors duration-200';

const variants: Record<Variant, string> = {
  primary: 'bg-a3 text-on-accent hover:brightness-110',
  secondary: 'border border-line-strong bg-surface/70 text-fg hover:bg-surface-2',
  ghost: 'text-fg hover:bg-surface-2',
};

const sizes: Record<Size, string> = {
  sm: 'h-9 px-4 text-sm',
  md: 'h-11 px-6 text-sm',
  lg: 'h-14 px-8 text-base',
};

export function Button({
  variant = 'primary',
  size = 'md',
  className,
  to,
  href,
  download,
  magnetic = false,
  children,
  ...rest
}: ButtonProps) {
  const classes = cn(base, variants[variant], sizes[size]);
  let el: ReactNode;

  if (to) {
    el = (
      <Link to={to} className={classes}>
        {children}
      </Link>
    );
  } else if (href) {
    const external = isExternal(href);
    el = (
      <a
        href={href}
        className={classes}
        download={download}
        {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
      >
        {children}
        {external && <span className="sr-only"> (opens in a new tab)</span>}
      </a>
    );
  } else {
    el = (
      <button type="button" className={classes} {...rest}>
        {children}
      </button>
    );
  }

  const node = (
    <motion.span className={cn('inline-flex', className)} whileTap={{ scale: 0.95 }} transition={spring.snappy}>
      {el}
    </motion.span>
  );

  return magnetic ? <Magnetic>{node}</Magnetic> : node;
}