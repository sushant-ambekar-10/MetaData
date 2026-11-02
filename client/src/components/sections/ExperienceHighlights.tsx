import { ArrowRight } from 'lucide-react';
import { Container } from '@/components/ui/Container';
import { Button } from '@/components/ui/Button';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { Reveal } from '@/components/motion/Reveal';
import { useExperience } from '@/lib/content';
import { formatRange } from '@/lib/format';

export function ExperienceHighlights() {
  const items = useExperience().slice(0, 3);
  if (!items.length) return null;

  return (
    <section className="py-24">
      <Container>
        <SectionHeading
          eyebrow="Experience"
          title="Where I've worked"
          action={
            <Button to="/experience" variant="secondary">
              Full timeline
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Button>
          }
        />

        <ol className="relative ml-3 mt-12 border-l border-line-strong">
          {items.map((item, i) => (
            <li key={item.id} className="relative pb-10 pl-8 last:pb-0 sm:pl-10">
              <span
                aria-hidden="true"
                className="absolute -left-[7px] top-1.5 h-3.5 w-3.5 rounded-full bg-aurora ring-4 ring-bg"
              />
              <Reveal delay={i * 0.05}>
                <p className="label-mono">{formatRange(item.start, item.end, item.current)}</p>
                <h3 className="mt-2 font-heading text-display-sm">{item.role}</h3>
                <p className="mt-1 text-a1-text">{item.org}</p>
                {item.description && <p className="mt-3 max-w-2xl text-muted">{item.description}</p>}
              </Reveal>
            </li>
          ))}
        </ol>
      </Container>
    </section>
  );
}