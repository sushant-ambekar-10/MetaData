import { ArrowRight } from 'lucide-react';
import { Container } from '@/components/ui/Container';
import { Button } from '@/components/ui/Button';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { Reveal } from '@/components/motion/Reveal';
import { ProjectCard } from '@/components/projects/ProjectCard';
import { useProjects } from '@/lib/content';
import { cn } from '@/lib/utils';

export function FeaturedProjects() {
  const { data } = useProjects(true);
  const featured = (data ?? [])
    .filter((p) => p.featured)
    .sort((a, b) => a.order - b.order)
    .slice(0, 3);

  if (!featured.length) return null;

  return (
    <section className="py-24">
      <Container>
        <SectionHeading
          eyebrow="Selected work"
          title="Featured projects"
          description="A few things I've built recently, from AI for accessibility to community apps."
          action={
            <Button to="/projects" variant="secondary">
              View all projects
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Button>
          }
        />

        <div className="mt-12 grid gap-4 lg:grid-cols-3 lg:grid-rows-2">
          {featured.map((p, i) => (
            <Reveal key={p.id} delay={i * 0.08} className={cn('h-full', i === 0 && 'lg:col-span-2 lg:row-span-2')}>
              <ProjectCard project={p} variant={i === 0 ? 'feature' : 'compact'} />
            </Reveal>
          ))}
        </div>
      </Container>
    </section>
  );
}