import { useMemo, type ReactNode } from 'react';
import { motion } from 'framer-motion';
import { Download, Printer } from 'lucide-react';
import { Seo } from '@/lib/seo/Seo';
import {
  useAchievements,
  useCertifications,
  useExperience,
  useProfile,
  useProjects,
  useQualifications,
  useSkills,
} from '@/lib/content';
import { formatRange } from '@/lib/format';
import { spring } from '@/lib/motion';
import { SITE } from '@/lib/site';
import { SKILL_CATEGORIES } from '@/lib/types';
import { Container } from '@/components/ui/Container';
import { Button } from '@/components/ui/Button';

const RESUME_PROJECTS = 6; // keeps the printed resume close to one page
const displayUrl = (url: string) => url.replace(/^https?:\/\/(www\.)?/i, '').replace(/\/$/, '');

function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section>
      <h2 className="mb-3 border-b border-line-strong pb-1.5 font-mono text-xs font-medium uppercase tracking-[0.18em] text-muted print:mb-1.5 print:text-fg">
        {title}
      </h2>
      {children}
    </section>
  );
}

// Everything here comes from the same hooks as the rest of the site: no duplicated content.
// No scroll-reveal animations inside the sheet, so nothing prints invisible.
export default function Resume() {
  const profile = useProfile();
  const quals = useQualifications();
  const experience = useExperience();
  const skills = useSkills();
  const certs = useCertifications();
  const achievements = useAchievements();
  const { data: projectData } = useProjects(true);

  const { shown, more } = useMemo(() => {
    const all = [...(projectData ?? [])].sort((a, b) => Number(b.featured) - Number(a.featured) || a.order - b.order);
    return { shown: all.slice(0, RESUME_PROJECTS), more: Math.max(0, all.length - RESUME_PROJECTS) };
  }, [projectData]);

  const emails = profile.emails ?? [];
  const l = profile.links ?? {};
  const contact: Array<{ label: string; href: string; text: string }> = [
    ...emails.map((e) => ({ label: 'Email', href: `mailto:${e}`, text: e })),
    ...(l.linkedin ? [{ label: 'LinkedIn', href: l.linkedin, text: displayUrl(l.linkedin) }] : []),
    ...(l.github ? [{ label: 'GitHub', href: l.github, text: displayUrl(l.github) }] : []),
  ];

  const skillGroups = SKILL_CATEGORIES.map((c) => ({ category: c, items: skills.filter((s) => s.category === c) })).filter(
    (g) => g.items.length > 0
  );

  return (
    <>
      <Seo title="Resume" description="Resume of Sushant Ambekar: education, experience, projects, skills, certifications and achievements." />

      <Container className="pb-24 pt-32 print:max-w-none print:p-0">
        {/* Toolbar (not printed) */}
        <div className="mx-auto mb-6 flex max-w-4xl flex-wrap items-center justify-between gap-4 print:hidden">
          <div>
            <p className="label-mono">Resume</p>
            <p className="mt-1 text-sm text-muted">This page always matches the rest of the site.</p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Button href={profile.resumeUrl ?? '/resume.pdf'} download="Sushant-Ambekar-Resume.pdf">
              <Download className="h-4 w-4" aria-hidden="true" />
              Download PDF
            </Button>
            <Button variant="secondary" onClick={() => window.print()}>
              <Printer className="h-4 w-4" aria-hidden="true" />
              Print or save as PDF
            </Button>
          </div>
        </div>

        <motion.article
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={spring.soft}
          className="bento mx-auto max-w-4xl space-y-8 p-6 sm:p-10 print:max-w-none print:space-y-4 print:rounded-none print:border-0 print:bg-transparent print:p-0 print:text-[10pt]"
        >
          <header>
            <h1 className="font-heading text-3xl font-bold sm:text-4xl print:text-2xl">{profile.fullName}</h1>
            {profile.tagline && <p className="mt-1 text-muted">{profile.tagline}</p>}
            <ul className="mt-4 flex flex-wrap gap-x-5 gap-y-1.5 text-sm print:mt-2">
              {contact.map((c) => (
                <li key={c.href}>
                  <a href={c.href} {...(c.href.startsWith('http') ? { target: '_blank', rel: 'noopener noreferrer' } : {})} className="break-all underline-offset-4 hover:underline">
                    {c.text}
                  </a>
                </li>
              ))}
            </ul>
            {profile.bio && <p className="mt-4 max-w-3xl text-sm text-muted print:mt-2 print:text-fg">{profile.bio}</p>}
          </header>

          {quals.length > 0 && (
            <Section title="Qualifications">
              <div className="space-y-4 print:space-y-2">
                {quals.map((q) => (
                  <div key={q.id} className="break-inside-avoid">
                    <div className="flex flex-wrap items-baseline justify-between gap-x-4">
                      <h3 className="font-heading text-base font-semibold">{q.level}</h3>
                      <p className="font-mono text-xs text-muted">{[q.score, q.year].filter(Boolean).join(' · ')}</p>
                    </div>
                    <p className="text-sm text-muted">{q.institution}</p>
                    {q.semesters && q.semesters.length > 0 && (
                      <p className="mt-1 text-xs text-muted">
                        SGPA:{' '}
                        {[...q.semesters]
                          .sort((a, b) => a.sem - b.sem)
                          .map((s) => `Sem ${s.sem} ${s.sgpa.toFixed(2)}`)
                          .join(' · ')}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </Section>
          )}

          {experience.length > 0 && (
            <Section title="Work experience">
              <div className="space-y-5 print:space-y-2.5">
                {experience.map((e) => (
                  <div key={e.id} className="break-inside-avoid">
                    <div className="flex flex-wrap items-baseline justify-between gap-x-4">
                      <h3 className="font-heading text-base font-semibold">
                        {e.role}
                        <span className="font-normal text-muted"> · {e.org}</span>
                      </h3>
                      <p className="font-mono text-xs text-muted">{formatRange(e.start, e.end, e.current)}</p>
                    </div>
                    {e.description && <p className="mt-1 text-sm text-muted">{e.description}</p>}
                    {e.highlights.length > 0 && (
                      <ul className="mt-1.5 list-disc space-y-1 pl-5 text-sm">
                        {e.highlights.map((h) => (
                          <li key={h}>{h}</li>
                        ))}
                      </ul>
                    )}
                  </div>
                ))}
              </div>
            </Section>
          )}

          {shown.length > 0 && (
            <Section title="Projects">
              <div className="space-y-4 print:space-y-2">
                {shown.map((p) => (
                  <div key={p.id} className="break-inside-avoid">
                    <div className="flex flex-wrap items-baseline justify-between gap-x-4">
                      <h3 className="font-heading text-base font-semibold">{p.name}</h3>
                      {p.duration && <p className="font-mono text-xs text-muted">{p.duration}</p>}
                    </div>
                    <p className="text-sm text-muted print:text-fg">{p.description}</p>
                    <p className="mt-1 text-xs text-muted">
                      {p.skills.join(' · ')}
                      {p.github && (
                        <>
                          {' — '}
                          <a href={p.github} target="_blank" rel="noopener noreferrer" className="break-all underline-offset-4 hover:underline">
                            {displayUrl(p.github)}
                          </a>
                        </>
                      )}
                    </p>
                  </div>
                ))}
                {more > 0 && (
                  <p className="text-sm text-muted">
                    + {more} more projects at {displayUrl(SITE.url)}/projects
                  </p>
                )}
              </div>
            </Section>
          )}

          <div className="grid gap-8 md:grid-cols-2 print:grid-cols-2 print:gap-4">
            {skillGroups.length > 0 && (
              <Section title="Skills">
                <ul className="space-y-1.5 text-sm">
                  {skillGroups.map((g) => (
                    <li key={g.category}>
                      <span className="font-medium">{g.category}:</span>{' '}
                      <span className="text-muted print:text-fg">{g.items.map((s) => s.name).join(', ')}</span>
                    </li>
                  ))}
                </ul>
              </Section>
            )}

            {certs.length > 0 && (
              <Section title="Certifications">
                <ul className="space-y-1.5 text-sm">
                  {certs.map((c) => (
                    <li key={c.id}>
                      {c.title}
                      {c.issuer && <span className="text-muted print:text-fg"> — {c.issuer}</span>}
                    </li>
                  ))}
                </ul>
              </Section>
            )}
          </div>

          {achievements.length > 0 && (
            <Section title="Achievements">
              <ul className="list-disc space-y-1.5 pl-5 text-sm">
                {achievements.map((a) => (
                  <li key={a.id}>{a.text}</li>
                ))}
              </ul>
            </Section>
          )}
        </motion.article>
      </Container>
    </>
  );
}