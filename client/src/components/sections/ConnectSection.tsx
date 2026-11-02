import { ArrowUpRight, Facebook, Github, Instagram, Linkedin, Mail, type LucideIcon } from 'lucide-react';
import { Container } from '@/components/ui/Container';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { TiltCard } from '@/components/ui/TiltCard';
import { Reveal } from '@/components/motion/Reveal';
import { useProfile } from '@/lib/content';
import { handleFromUrl } from '@/lib/format';
import { isExternal } from '@/lib/utils';

interface Card {
  label: string;
  href: string;
  handle: string;
  Icon: LucideIcon;
}

export function ConnectSection() {
  const profile = useProfile();
  const links = profile.links ?? {};
  const email = profile.emails?.[0];

  const cards: Card[] = [];
  if (links.linkedin) cards.push({ label: 'LinkedIn', href: links.linkedin, handle: handleFromUrl(links.linkedin), Icon: Linkedin });
  if (links.github) cards.push({ label: 'GitHub', href: links.github, handle: handleFromUrl(links.github), Icon: Github });
  if (links.instagram) cards.push({ label: 'Instagram', href: links.instagram, handle: handleFromUrl(links.instagram), Icon: Instagram });
  if (links.facebook) cards.push({ label: 'Facebook', href: links.facebook, handle: handleFromUrl(links.facebook), Icon: Facebook });
  if (email) cards.push({ label: 'Email', href: `mailto:${email}`, handle: email, Icon: Mail });

  return (
    <section className="py-24">
      <Container>
        <SectionHeading
          eyebrow="Connect"
          title="Let's build something"
          description="Open to internships, collaborations and good conversations."
        />

        <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {cards.map(({ label, href, handle, Icon }, i) => {
            const external = isExternal(href);
            return (
              <Reveal key={label} delay={i * 0.06} className="h-full">
                <TiltCard className="bento h-full">
                  <a
                    href={href}
                    className="group flex h-full min-h-44 flex-col p-6"
                    {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                  >
                    <span className="flex items-center justify-between">
                      <span className="grid h-11 w-11 place-items-center rounded-2xl border border-line-strong bg-surface-2 text-a2-text">
                        <Icon className="h-5 w-5" aria-hidden="true" />
                      </span>
                      <ArrowUpRight
                        className="h-5 w-5 text-muted transition-transform duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                        aria-hidden="true"
                      />
                    </span>
                    <span className="mt-6 font-heading text-display-sm">{label}</span>
                    <span className="mt-2 break-all font-mono text-xs text-muted">{handle}</span>
                    {external && <span className="sr-only"> (opens in a new tab)</span>}
                  </a>
                </TiltCard>
              </Reveal>
            );
          })}
        </div>
      </Container>
    </section>
  );
}