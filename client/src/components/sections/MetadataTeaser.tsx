import { Link } from 'react-router-dom';
import { ArrowUpRight, BadgeCheck, Code2, GraduationCap, Trophy, User } from 'lucide-react';
import { Container } from '@/components/ui/Container';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { TiltCard } from '@/components/ui/TiltCard';
import { Reveal } from '@/components/motion/Reveal';
import { cn } from '@/lib/utils';

// `tab` values are read by the /metadata page in Phase 4
const ITEMS = [
  { tab: 'personal', title: 'Personal', text: 'Who I am, where I study and how to reach me.', Icon: User },
  { tab: 'qualifications', title: 'Qualifications', text: 'SSC to Diploma to B.Tech, with semester SGPAs.', Icon: GraduationCap },
  { tab: 'skills', title: 'Skills', text: 'Languages, web, backend, mobile and DevOps.', Icon: Code2 },
  { tab: 'certifications', title: 'Certifications', text: 'Internships, HackerRank, Udemy, Coursera and IBM.', Icon: BadgeCheck },
  { tab: 'achievements', title: 'Achievements', text: 'Ranks, hackathon finals and coding milestones.', Icon: Trophy },
];

export function MetadataTeaser() {
  return (
    <section className="py-24">
      <Container>
        <SectionHeading
          eyebrow="Me-taData"
          title="Explore the data behind me"
          description="Five categories, one interactive explorer. Pick one to jump straight in."
        />

        <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-6">
          {ITEMS.map(({ tab, title, text, Icon }, i) => (
            <Reveal
              key={tab}
              delay={i * 0.06}
              className={cn(
                'h-full',
                i < 2 ? 'lg:col-span-3' : 'lg:col-span-2',
                i === ITEMS.length - 1 && 'sm:max-lg:col-span-2'
              )}
            >
              <TiltCard className="bento h-full">
                <Link to={`/metadata?tab=${tab}`} className="group flex h-full min-h-44 flex-col p-6">
                  <span className="grid h-11 w-11 place-items-center rounded-2xl border border-line-strong bg-surface-2 text-a2-text">
                    <Icon className="h-5 w-5" aria-hidden="true" />
                  </span>
                  <h3 className="mt-6 font-heading text-display-sm">{title}</h3>
                  <p className="mt-2 text-sm text-muted">{text}</p>
                  <span className="mt-auto flex items-center gap-2 pt-6 text-sm font-medium">
                    Explore
                    <ArrowUpRight
                      className="h-4 w-4 transition-transform duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                      aria-hidden="true"
                    />
                  </span>
                </Link>
              </TiltCard>
            </Reveal>
          ))}
        </div>
      </Container>
    </section>
  );
}