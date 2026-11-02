import { Link } from 'react-router-dom';
import { ExternalLink, Github } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Tag } from '@/components/ui/Tag';
import { TiltCard } from '@/components/ui/TiltCard';
import { ProjectThumb } from './ProjectThumb';
import type { Project } from '@/lib/types';
import { cn } from '@/lib/utils';

interface Props {
  project: Project;
  /** feature: large with a tall image. compact: text only. default: image on top. */
  variant?: 'default' | 'feature' | 'compact';
}

export function ProjectCard({ project, variant = 'default' }: Props) {
  const { name, slug, category, duration, description, skills, github, liveUrl } = project;
  const shown = skills.slice(0, variant === 'compact' ? 3 : 4);
  const extra = skills.length - shown.length;

  return (
    <TiltCard className="bento group flex h-full flex-col overflow-hidden">
      {variant !== 'compact' && (
        <div
          className={cn(
            'relative overflow-hidden border-b border-line',
            variant === 'feature' ? 'min-h-56 flex-1' : 'aspect-[16/10]'
          )}
        >
          <div className="absolute inset-0">
            <ProjectThumb project={project} />
          </div>
        </div>
      )}

      <div className={cn('flex flex-col p-6', variant === 'feature' && 'lg:p-8', variant !== 'feature' && 'flex-1')}>
        <div className="flex items-center justify-between gap-3">
          <span className="label-mono">{category}</span>
          {duration && <span className="font-mono text-xs text-muted">{duration}</span>}
        </div>

        <h3 className={cn('mt-3 font-heading', variant === 'feature' ? 'text-display-sm lg:text-display-md' : 'text-xl')}>
          {/* Stretched link: the whole card is clickable, GitHub/Live buttons sit above it (z-10) */}
          <Link to={`/projects/${slug}`} className="after:absolute after:inset-0">
            {name}
          </Link>
        </h3>

        <p className={cn('mt-3 line-clamp-3 text-muted', variant === 'feature' ? 'text-base' : 'text-sm')}>
          {description}
        </p>

        {skills.length > 0 && (
          <ul aria-label="Technologies" className="mt-5 flex flex-wrap gap-2">
            {shown.map((s) => (
              <li key={s}>
                <Tag>{s}</Tag>
              </li>
            ))}
            {extra > 0 && (
              <li>
                <Tag>+{extra}</Tag>
              </li>
            )}
          </ul>
        )}

        {(github || liveUrl) && (
          <div className="relative z-10 mt-auto flex flex-wrap gap-2 pt-6">
            {github && (
              <Button href={github} variant="secondary" size="sm">
                <Github className="h-4 w-4" aria-hidden="true" />
                GitHub
                <span className="sr-only">: {name}</span>
              </Button>
            )}
            {liveUrl && (
              <Button href={liveUrl} size="sm">
                <ExternalLink className="h-4 w-4" aria-hidden="true" />
                Live
                <span className="sr-only">: {name}</span>
              </Button>
            )}
          </div>
        )}
      </div>
    </TiltCard>
  );
}