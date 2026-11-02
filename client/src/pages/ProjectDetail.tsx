import { useMemo } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ArrowLeft, ArrowRight, ExternalLink, Github } from 'lucide-react';
import { Seo } from '@/lib/seo/Seo';
import { useReady } from '@/app/ReadyProvider';
import { useProjects } from '@/lib/content';
import { SITE } from '@/lib/site';
import type { Project } from '@/lib/types';
import { cn } from '@/lib/utils';
import { Container } from '@/components/ui/Container';
import { Button } from '@/components/ui/Button';
import { Skeleton } from '@/components/ui/Skeleton';
import { Tag } from '@/components/ui/Tag';
import { TiltCard } from '@/components/ui/TiltCard';
import { OfflineNotice, ServerWaking } from '@/components/ui/ServerWaking';
import { Reveal } from '@/components/motion/Reveal';
import { SplitText } from '@/components/motion/SplitText';
import { Gallery } from '@/components/projects/Gallery';
import { ProjectThumb } from '@/components/projects/ProjectThumb';

function Adjacent({ project, dir }: { project: Project; dir: 'prev' | 'next' }) {
  return (
    <TiltCard className="bento h-full">
      <Link
        to={`/projects/${project.slug}`}
        className={cn('group flex h-full flex-col gap-2 p-6', dir === 'next' && 'sm:items-end sm:text-right')}
      >
        <span className="label-mono flex items-center gap-2">
          {dir === 'prev' && <ArrowLeft className="h-3.5 w-3.5" aria-hidden="true" />}
          {dir === 'prev' ? 'Previous project' : 'Next project'}
          {dir === 'next' && <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />}
        </span>
        <span className="font-heading text-display-sm">{project.name}</span>
      </Link>
    </TiltCard>
  );
}

export default function ProjectDetail() {
  const { slug } = useParams();
  const { ready } = useReady();
  const { data, loading, slow, fromFallback, refetch } = useProjects(false);

  const list = useMemo(() => [...(data ?? [])].sort((a, b) => a.order - b.order), [data]);
  const idx = list.findIndex((p) => p.slug === slug);
  const project = idx >= 0 ? list[idx] : undefined;

  if (loading) {
    return (
      <Container role="status" aria-label="Loading project" className="pb-24 pt-36">
        {slow && <ServerWaking />}
        <Skeleton className="mt-8 h-14 w-2/3 !rounded-xl" />
        <Skeleton className="mt-6 h-6 w-1/2 !rounded-lg" />
        <Skeleton className="mt-10 aspect-[16/8] w-full" />
      </Container>
    );
  }

  if (!project) {
    return (
      <>
        <Seo title="Project not found" noindex />
        <Container className="flex min-h-[70svh] flex-col justify-center pb-16 pt-40">
          <p className="label-mono">Error 404</p>
          <h1 className="mt-4 max-w-3xl font-heading text-display-lg font-bold">That project doesn't exist.</h1>
          <p className="mt-6 max-w-lg text-muted">It may have been renamed or hidden. Browse all projects instead.</p>
          <div className="mt-10">
            <Button to="/projects">All projects</Button>
          </div>
        </Container>
      </>
    );
  }

  const { name, description, longDescription, problem, solution, duration, category, skills, github, liveUrl, images } =
    project;
  const status = project.endDate ? 'Completed' : project.startDate ? 'Ongoing' : '';
  const prev = list.length > 1 ? list[(idx - 1 + list.length) % list.length] : undefined;
  const next = list.length > 1 ? list[(idx + 1) % list.length] : undefined;

  return (
    <>
      <Seo
        title={name}
        description={description}
        type="article"
        jsonLd={{
          '@context': 'https://schema.org',
          '@type': 'SoftwareSourceCode',
          name,
          description,
          codeRepository: github || undefined,
          programmingLanguage: skills,
          author: { '@type': 'Person', name: SITE.fullName },
        }}
      />

      <Container className="pb-24 pt-32">
        <Link
          to="/projects"
          className="inline-flex items-center gap-2 rounded-pill py-2 text-sm text-muted transition-colors duration-200 hover:text-fg"
        >
          <ArrowLeft className="h-4 w-4" aria-hidden="true" />
          All projects
        </Link>

        {fromFallback && (
          <div className="mt-4">
            <OfflineNotice what="projects" onRetry={() => void refetch()} />
          </div>
        )}

        <header className="mt-8 grid gap-10 lg:grid-cols-[1.1fr_1fr] lg:items-end">
          <div>
            <Reveal active={ready}>
              <p className="label-mono">
                {category}
                {duration && ` · ${duration}`}
              </p>
            </Reveal>
            <SplitText
              as="h1"
              text={name}
              active={ready}
              delay={0.1}
              className="mt-4 font-heading text-display-lg font-bold"
            />
            <Reveal active={ready} delay={0.4}>
              <p className="mt-6 max-w-xl text-lg text-muted">{description}</p>
            </Reveal>
            {(github || liveUrl) && (
              <Reveal active={ready} delay={0.5} className="mt-8 flex flex-wrap gap-3">
                {github && (
                  <Button href={github} variant="secondary" size="lg">
                    <Github className="h-4 w-4" aria-hidden="true" />
                    View source
                  </Button>
                )}
                {liveUrl && (
                  <Button href={liveUrl} size="lg" magnetic>
                    <ExternalLink className="h-4 w-4" aria-hidden="true" />
                    Live demo
                  </Button>
                )}
              </Reveal>
            )}
          </div>

          <Reveal active={ready} delay={0.3}>
            <div className="bento aspect-[16/10] overflow-hidden">
              <ProjectThumb project={project} priority />
            </div>
          </Reveal>
        </header>

        <section aria-label="Overview" className="mt-20 grid gap-4 lg:grid-cols-3">
          <Reveal className="lg:col-span-2">
            <div className="bento h-full p-6 sm:p-8">
              <h2 className="label-mono">Overview</h2>
              <p className="mt-4 whitespace-pre-line text-lg leading-relaxed">{longDescription || description}</p>
            </div>
          </Reveal>

          <Reveal delay={0.08}>
            <div className="bento h-full p-6 sm:p-8">
              <h2 className="label-mono">Details</h2>
              <dl className="mt-4 space-y-4 text-sm">
                <div>
                  <dt className="text-muted">Category</dt>
                  <dd className="mt-1 font-medium">{category}</dd>
                </div>
                {duration && (
                  <div>
                    <dt className="text-muted">Duration</dt>
                    <dd className="mt-1 font-medium">{duration}</dd>
                  </div>
                )}
                {status && (
                  <div>
                    <dt className="text-muted">Status</dt>
                    <dd className="mt-1 font-medium">{status}</dd>
                  </div>
                )}
              </dl>
            </div>
          </Reveal>
        </section>

        {(problem || solution) && (
          <section aria-label="Problem and solution" className="mt-4 grid gap-4 md:grid-cols-2">
            {problem && (
              <Reveal>
                <div className="bento h-full p-6 sm:p-8">
                  <h2 className="label-mono">The problem</h2>
                  <p className="mt-4 leading-relaxed text-muted">{problem}</p>
                </div>
              </Reveal>
            )}
            {solution && (
              <Reveal delay={0.08}>
                <div className="bento h-full p-6 sm:p-8">
                  <h2 className="label-mono">The solution</h2>
                  <p className="mt-4 leading-relaxed text-muted">{solution}</p>
                </div>
              </Reveal>
            )}
          </section>
        )}

        {skills.length > 0 && (
          <section aria-label="Tech stack" className="mt-16">
            <Reveal>
              <h2 className="label-mono">Tech stack</h2>
              <ul className="mt-4 flex flex-wrap gap-2">
                {skills.map((s) => (
                  <li key={s}>
                    <Tag className="px-4 py-1.5 text-xs text-fg">{s}</Tag>
                  </li>
                ))}
              </ul>
            </Reveal>
          </section>
        )}

        {images.length > 0 && (
          <section aria-label="Screenshots" className="mt-16">
            <Reveal>
              <h2 className="label-mono mb-4">Screenshots</h2>
            </Reveal>
            <Gallery images={images} name={name} />
          </section>
        )}

        {(prev || next) && (
          <nav aria-label="More projects" className="mt-24 grid gap-4 sm:grid-cols-2">
            {prev && <Adjacent project={prev} dir="prev" />}
            {next && <Adjacent project={next} dir="next" />}
          </nav>
        )}
      </Container>
    </>
  );
}