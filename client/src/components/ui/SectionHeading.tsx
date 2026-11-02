import type { ReactNode } from 'react';
import { Reveal } from '@/components/motion/Reveal';
import { SplitText } from '@/components/motion/SplitText';
import { cn } from '@/lib/utils';

interface Props {
  eyebrow: string;
  title: string;
  description?: string;
  action?: ReactNode;
  className?: string;
}

export function SectionHeading({ eyebrow, title, description, action, className }: Props) {
  return (
    <div className={cn('flex flex-wrap items-end justify-between gap-6', className)}>
      <div className="max-w-2xl">
        <Reveal>
          <p className="label-mono">{eyebrow}</p>
        </Reveal>
        <SplitText as="h2" text={title} delay={0.05} className="mt-3 font-heading text-display-lg font-bold" />
        {description && (
          <Reveal delay={0.15}>
            <p className="mt-4 text-muted">{description}</p>
          </Reveal>
        )}
      </div>
      {action && <Reveal delay={0.2}>{action}</Reveal>}
    </div>
  );
}