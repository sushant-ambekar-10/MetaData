import { ArrowRight, Star } from 'lucide-react';
import { useReducedMotion } from 'framer-motion';
import { Container } from '@/components/ui/Container';
import { Button } from '@/components/ui/Button';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { Marquee } from '@/components/motion/Marquee';
import { useSkills } from '@/lib/content';
import type { Skill } from '@/lib/types';
import { cn } from '@/lib/utils';

function Pill({ skill, hidden }: { skill: Skill; hidden: boolean }) {
  return (
    <span
      aria-hidden={hidden || undefined}
      className={cn(
        'inline-flex shrink-0 items-center gap-2 whitespace-nowrap rounded-pill border px-5 py-2.5 font-heading text-sm font-medium',
        skill.featured ? 'border-a1/60 bg-a1/10 text-fg' : 'border-line-strong bg-surface text-muted'
      )}
    >
      {skill.featured && <Star className="h-3.5 w-3.5 fill-current text-a1-text" aria-hidden="true" />}
      {skill.name}
    </span>
  );
}

export function SkillsMarquee() {
  const skills = useSkills();
  const reduce = useReducedMotion();
  if (!skills.length) return null;

  // Two rows moving in opposite directions
  const mid = Math.ceil(skills.length / 2);
  const rows = [skills.slice(0, mid), skills.slice(mid)].filter((r) => r.length > 0);

  // Repeat each row so one "half" is wider than a 4K screen. Only the first copy is exposed to screen readers.
  const copies = reduce ? 1 : 4;
  const renderRow = (row: Skill[]) =>
    Array.from({ length: copies }, (_, c) =>
      row.map((s) => <Pill key={`${c}-${s.id}`} skill={s} hidden={c > 0} />)
    );

  return (
    <section aria-label="Technologies" className="py-16">
      <Container>
        <SectionHeading
          eyebrow="Toolbox"
          title="Technologies I work with"
          action={
            <Button to="/metadata?tab=skills" variant="secondary">
              Explore skills
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Button>
          }
        />
      </Container>

      <div className="mt-10 space-y-3">
        {rows.map((row, i) => (
          <Marquee key={i} reverse={i % 2 === 1} duration={55 + i * 10}>
            {renderRow(row)}
          </Marquee>
        ))}
      </div>
    </section>
  );
}