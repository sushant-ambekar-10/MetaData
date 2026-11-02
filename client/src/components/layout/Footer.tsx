import { ArrowUp, Facebook, Github, Instagram, Linkedin, Mail, type LucideIcon } from 'lucide-react';
import { Container } from '@/components/ui/Container';
import { AnimatedLink } from '@/components/ui/AnimatedLink';
import { Reveal } from '@/components/motion/Reveal';
import { useScrollToTop } from '@/app/SmoothScroll';
import { useProfile } from '@/lib/content';
import { NAV, SITE } from '@/lib/site';

interface Social {
  label: string;
  href: string;
  Icon: LucideIcon;
}

export function Footer() {
  const scrollToTop = useScrollToTop();
  const profile = useProfile();
  const year = new Date().getFullYear();

  const email = profile.emails?.[0] ?? SITE.email;
  const links = profile.links ?? {};

  // Facebook only appears if the admin has enabled it (the API strips it otherwise)
  const socials: Social[] = [];
  if (links.linkedin) socials.push({ label: 'LinkedIn', href: links.linkedin, Icon: Linkedin });
  if (links.github) socials.push({ label: 'GitHub', href: links.github, Icon: Github });
  if (links.instagram) socials.push({ label: 'Instagram', href: links.instagram, Icon: Instagram });
  if (links.facebook) socials.push({ label: 'Facebook', href: links.facebook, Icon: Facebook });

  return (
    <footer className="relative mt-24 border-t border-line print:hidden">
      <Container className="py-16">
        <Reveal>
          <p className="label-mono">Have an idea? Let's talk</p>
          <a
            href={`mailto:${email}`}
            className="text-gradient mt-3 inline-block break-all font-heading text-display-md font-semibold"
          >
            {email}
          </a>
        </Reveal>

        <div className="mt-14 grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          <nav aria-label="Footer">
            <p className="label-mono mb-4">Explore</p>
            <ul className="space-y-2.5 text-sm">
              {NAV.map((item) => (
                <li key={item.to}>
                  <AnimatedLink to={item.to}>{item.label}</AnimatedLink>
                </li>
              ))}
              <li>
                <AnimatedLink to="/resume">Resume</AnimatedLink>
              </li>
            </ul>
          </nav>

          <div>
            <p className="label-mono mb-4">Connect</p>
            <ul className="flex flex-wrap items-center gap-3">
              {socials.map(({ label, href, Icon }) => (
                <li key={label}>
                  <a
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`${label} (opens in a new tab)`}
                    className="grid h-11 w-11 place-items-center rounded-full border border-line-strong text-fg transition-colors duration-200 hover:bg-surface-2"
                  >
                    <Icon className="h-5 w-5" aria-hidden="true" />
                  </a>
                </li>
              ))}
              <li>
                <a
                  href={`mailto:${email}`}
                  aria-label="Send an email"
                  className="grid h-11 w-11 place-items-center rounded-full border border-line-strong text-fg transition-colors duration-200 hover:bg-surface-2"
                >
                  <Mail className="h-5 w-5" aria-hidden="true" />
                </a>
              </li>
            </ul>
          </div>

          <div className="sm:col-span-2 lg:col-span-2 lg:text-right">
            <button
              type="button"
              onClick={() => scrollToTop()}
              className="inline-flex items-center gap-2 rounded-pill border border-line-strong px-5 py-3 text-sm font-medium transition-colors duration-200 hover:bg-surface-2"
            >
              <ArrowUp className="h-4 w-4" aria-hidden="true" />
              Back to top
            </button>
          </div>
        </div>

        <p
          aria-hidden="true"
          className="text-gradient mt-16 select-none font-heading text-[clamp(3rem,14vw,14rem)] font-bold leading-[0.9] tracking-tighter"
        >
          Sushant
          <br />
          Ambekar
        </p>

        <p className="mt-10 text-sm text-muted">
          © {year} {SITE.fullName}. {profile.tagline ?? SITE.tagline}.
        </p>
      </Container>
    </footer>
  );
}