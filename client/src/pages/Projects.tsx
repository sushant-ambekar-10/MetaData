import { useCallback, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { Sparkles } from 'lucide-react';
import { Seo } from '@/lib/seo/Seo';
import { useReady } from '@/app/ReadyProvider';
import { useProfile, useProjects } from '@/lib/content';
import { spring } from '@/lib/motion';
import { Container } from '@/components/ui/Container';
import { Button } from '@/components/ui/Button';
import { Skeleton } from '@/components/ui/Skeleton';
import { OfflineNotice, ServerWaking } from '@/components/ui/ServerWaking';
import { Reveal } from '@/components/motion/Reveal';
import { SplitText } from '@/components/motion/SplitText';
import { ProjectCard } from '@/components/projects/ProjectCard';
import { ProjectCardSkeleton } from '@/components/projects/ProjectCardSkeleton';
import { ProjectFilters, type SortKey } from '@/components/projects/ProjectFilters';

const CATEGORIES = ['All', 'Web', 'Android', 'ML/AI', 'Other'];
const time = (iso?: string | null) => (iso ? Date.parse(iso) : 0);

export default function Projects() {
  const { ready } = useReady();
  const profile = useProfile();
  const { data, loading, slow, fromFallback, refetch } = useProjects(false);

  // Filter state lives in the URL so Back from a project restores the same view
  const [params, setParams] = useSearchParams();
  const q = params.get('q') ?? '';
  const category = params.get('category') ?? 'All';
  const sort: SortKey = params.get('sort') === 'oldest' ? 'oldest' : 'newest';
  const techParam = params.get('tech') ?? '';
  const selected = useMemo(() => techParam.split(',').filter(Boolean), [techParam]);

  const update = useCallback(
    (patch: Record<string, string | null>) => {
      setParams(
        (prev) => {
          const next = new URLSearchParams(prev);
          for (const [k, v] of Object.entries(patch)) {
            if (v) next.set(k, v);
            else next.delete(k);
          }
          return next;
        },
        { replace: true }
      );
    },
    [setParams]
  );

  const projects = data ?? [];

  // Skill chips, most used first
  const skillOptions = useMemo(() => {
    const counts = new Map<string, number>();
    for (const p of projects) for (const s of p.skills) counts.set(s, (counts.get(s) ?? 0) + 1);
    return [...counts.entries()].sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0])).map(([s]) => s);
  }, [projects]);

  const filtered = useMemo(() => {
    const needle = q.trim().toLowerCase();
    return projects
      .filter((p) => category === 'All' || p.category === category)
      .filter((p) => selected.every((s) => p.skills.includes(s)))
      .filter(
        (p) =>
          !needle ||
          [p.name, p.description, p.category, ...p.skills].join(' ').toLowerCase().includes(needle)
      )
      .sort((a, b) => {
        const diff = sort === 'newest' ? time(b.startDate) - time(a.startDate) : time(a.startDate) - time(b.startDate);
        return diff || a.order - b.order;
      });
  }, [projects, q, category, selected, sort]);

  const hasFilters = Boolean(q.trim()) || category !== 'All' || selected.length > 0;
  const clear = () => setParams(new URLSearchParams(), { replace: true });

  const toggleSkill = (skill: string) => {
    const next = selected.includes(skill) ? selected.filter((s) => s !== skill) : [...selected, skill];
    update({ tech: next.length ? next.join(',') : null });
  };

  return (
    <>
      <Seo
        title="Projects"
        description="Web, Android and AI/ML projects by Sushant Ambekar, with source code and live demos."
      />

      <Container className="pb-8 pt-36">
        <Reveal active={ready}>
          <p className="label-mono">Selected work</p>
        </Reveal>
        <SplitText as="h1" text="Projects" active={ready} delay={0.1} className="mt-4 font-heading text-display-xl font-bold" />
        <Reveal active={ready} delay={0.35}>
          <p className="mt-6 max-w-2xl text-lg text-muted">
            Everything I've built, from college experiments to apps with real users. Search, filter by technology, or
            open a project for the full story.
          </p>
        </Reveal>
      </Container>

      <Container className="pb-24">
        <div className="space-y-4">
          {loading && slow && <ServerWaking />}
          {fromFallback && <OfflineNotice what="projects" onRetry={() => void refetch()} />}
        </div>

        {loading ? (
          <div role="status" aria-label="Loading projects" className="mt-8">
            <Skeleton className="h-12 w-full !rounded-pill" />
            <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {Array.from({ length: 6 }, (_, i) => (
                <ProjectCardSkeleton key={i} />
              ))}
            </div>
          </div>
        ) : (
          <>
            <div className="mt-8">
              <ProjectFilters
                query={q}
                onQuery={(v) => update({ q: v || null })}
                categories={CATEGORIES}
                category={category}
                onCategory={(v) => update({ category: v === 'All' ? null : v })}
                skills={skillOptions}
                selectedSkills={selected}
                onToggleSkill={toggleSkill}
                sort={sort}
                onSort={(v) => update({ sort: v === 'newest' ? null : v })}
                resultCount={filtered.length}
                total={projects.length}
                hasFilters={hasFilters}
                onClear={clear}
              />
            </div>

            <ul className="relative mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              <AnimatePresence mode="popLayout">
                {filtered.map((p) => (
                  <motion.li
                    key={p.id}
                    layout
                    className="h-full"
                    initial={{ opacity: 0, scale: 0.94 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.94 }}
                    transition={spring.soft}
                  >
                    <ProjectCard project={p} />
                  </motion.li>
                ))}
              </AnimatePresence>

              {!hasFilters && (
                <motion.li layout className="h-full" transition={spring.soft}>
                  <div className="flex h-full min-h-64 flex-col items-center justify-center rounded-bento border border-dashed border-line-strong p-8 text-center">
                    <Sparkles className="h-6 w-6 text-a2-text" aria-hidden="true" />
                    <h3 className="mt-4 font-heading text-display-sm">More coming soon</h3>
                    <p className="mt-2 max-w-xs text-sm text-muted">
                      New builds land here as I finish them. Follow along on GitHub.
                    </p>
                    {profile.links.github && (
                      <div className="mt-6">
                        <Button href={profile.links.github} variant="secondary" size="sm">
                          Follow on GitHub
                        </Button>
                      </div>
                    )}
                  </div>
                </motion.li>
              )}
            </ul>

            {filtered.length === 0 && (
              <div role="status" className="bento mt-8 p-10 text-center">
                <p className="font-heading text-display-sm">No projects match your filters</p>
                <p className="mt-2 text-muted">Try a different search or remove a filter.</p>
                <div className="mt-6 flex justify-center">
                  <Button onClick={clear} variant="secondary">
                    Clear all filters
                  </Button>
                </div>
              </div>
            )}
          </>
        )}
      </Container>
    </>
  );
}