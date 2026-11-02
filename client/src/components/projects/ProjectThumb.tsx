import { useState } from 'react';
import { BrainCircuit, Code2, Globe, Smartphone } from 'lucide-react';
import { hash, initials } from '@/lib/format';
import type { Project } from '@/lib/types';
import { cn } from '@/lib/utils';

const ICONS = { Web: Globe, Android: Smartphone, 'ML/AI': BrainCircuit, Other: Code2 } as const;

const GRADIENTS = [
  'linear-gradient(135deg, rgb(var(--a1) / 0.55), rgb(var(--a2) / 0.25))',
  'linear-gradient(135deg, rgb(var(--a2) / 0.45), rgb(var(--a1) / 0.3))',
  'linear-gradient(135deg, rgb(var(--a3) / 0.45), rgb(var(--a1) / 0.35))',
];

interface Props {
  project: Pick<Project, 'name' | 'images' | 'category'>;
  className?: string;
  priority?: boolean;
}

// First screenshot if there is one, otherwise a generated gradient placeholder
export function ProjectThumb({ project, className, priority = false }: Props) {
  const [failed, setFailed] = useState(false);
  const src = project.images[0];

  if (src && !failed) {
    return (
      <img
        src={src}
        alt={`Screenshot of ${project.name}`}
        width={1280}
        height={800}
        loading={priority ? 'eager' : 'lazy'}
        decoding="async"
        onError={() => setFailed(true)}
        className={cn('h-full w-full object-cover', className)}
      />
    );
  }

  const Icon = ICONS[project.category] ?? Code2;
  return (
    <div
      role="img"
      aria-label={`${project.name} (${project.category} project)`}
      className={cn('relative grid h-full w-full place-items-center overflow-hidden', className)}
      style={{ background: GRADIENTS[hash(project.name) % GRADIENTS.length] }}
    >
      <span
        aria-hidden="true"
        className="absolute select-none font-heading text-[clamp(5rem,14vw,9rem)] font-bold text-fg/10"
      >
        {initials(project.name)}
      </span>
      <Icon className="relative h-10 w-10 text-fg/80" aria-hidden="true" />
    </div>
  );
}