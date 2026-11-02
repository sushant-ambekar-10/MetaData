import { ArrowUpRight, Copy, Facebook, Github, Instagram, Linkedin, Mail, type LucideIcon } from 'lucide-react';
import { Seo } from '@/lib/seo/Seo';
import { useReady } from '@/app/ReadyProvider';
import { useToast } from '@/app/ToastProvider';
import { useProfile } from '@/lib/content';
import { handleFromUrl } from '@/lib/format';
import { Container } from '@/components/ui/Container';
import { TiltCard } from '@/components/ui/TiltCard';
import { Reveal } from '@/components/motion/Reveal';
import { SplitText } from '@/components/motion/SplitText';
import { ContactForm } from '@/components/sections/ContactForm';

interface SocialCard {
  label: string;
  href: string;
  handle: string;
  Icon: LucideIcon;
}

const emailLabel = (email: string, i: number) =>
  i === 0 ? 'Personal email' : /ycce\.in$/i.test(email) ? 'College email' : 'Email';

export default function Social() {
  const { ready } = useReady();
  const { toast } = useToast();
  const profile = useProfile();
  const emails = profile.emails ?? [];
  const l = profile.links ?? {};

  const socials: SocialCard[] = [];
  if (l.linkedin) socials.push({ label: 'LinkedIn', href: l.linkedin, handle: handleFromUrl(l.linkedin), Icon: Linkedin });
  if (l.github) socials.push({ label: 'GitHub', href: l.github, handle: handleFromUrl(l.github), Icon: Github });
  if (l.instagram) socials.push({ label: 'Instagram', href: l.instagram, handle: handleFromUrl(l.instagram), Icon: Instagram });
  if (l.facebook) socials.push({ label: 'Facebook', href: l.facebook, handle: handleFromUrl(l.facebook), Icon: Facebook }); // only if enabled in admin

  const copy = async (email: string) => {
    try {
      await navigator.clipboard.writeText(email);
      toast({ kind: 'success', title: 'Email copied', description: email });
    } catch {
      toast({ kind: 'error', title: "Couldn't copy", description: 'Please select the address and copy it manually.' });
    }
  };

  return (
    <>
      <Seo
        title="Contact"
        description="Get in touch with Sushant Ambekar by email, LinkedIn, GitHub or Instagram, or use the contact form."
      />

      <Container className="pb-10 pt-36">
        <Reveal active={ready}>
          <p className="label-mono">Contact</p>
        </Reveal>
        <SplitText as="h1" text="Let's talk" active={ready} delay={0.1} className="mt-4 font-heading text-display-xl font-bold" />
        <Reveal active={ready} delay={0.35}>
          <p className="mt-6 max-w-2xl text-lg text-muted">
            Open to internships, collaborations and good conversations. Pick a channel or send a message.
          </p>
        </Reveal>
      </Container>

      <Container className="pb-24">
        <div className="grid gap-10 lg:grid-cols-[1fr_1.1fr] lg:items-start">
          <div className="grid gap-4 sm:grid-cols-2">
            {emails.map((email, i) => (
              <Reveal key={email} delay={i * 0.06} className="h-full">
                <TiltCard className="bento h-full">
                  <div className="flex h-full min-h-48 flex-col p-6">
                    <span className="grid h-11 w-11 place-items-center rounded-2xl border border-line-strong bg-surface-2 text-a2-text">
                      <Mail className="h-5 w-5" aria-hidden="true" />
                    </span>
                    <h2 className="mt-6 font-heading text-display-sm">
                      {/* Stretched link: whole card opens the mail app; Copy sits above it */}
                      <a href={`mailto:${email}`} className="after:absolute after:inset-0">
                        {emailLabel(email, i)}
                        <span className="sr-only">: {email}</span>
                      </a>
                    </h2>
                    <p className="mt-2 break-all font-mono text-xs text-muted">{email}</p>
                    <button
                      type="button"
                      onClick={() => void copy(email)}
                      className="relative z-10 mt-auto inline-flex items-center gap-2 self-start rounded-pill border border-line-strong px-3.5 py-2 text-xs font-medium transition-colors duration-200 hover:bg-surface-2"
                    >
                      <Copy className="h-3.5 w-3.5" aria-hidden="true" />
                      Copy address
                      <span className="sr-only">: {email}</span>
                    </button>
                  </div>
                </TiltCard>
              </Reveal>
            ))}

            {socials.map(({ label, href, handle, Icon }, i) => (
              <Reveal key={label} delay={(emails.length + i) * 0.06} className="h-full">
                <TiltCard className="bento h-full">
                  <a
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group flex h-full min-h-48 flex-col p-6"
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
                    <span className="sr-only"> (opens in a new tab)</span>
                  </a>
                </TiltCard>
              </Reveal>
            ))}
          </div>

          <Reveal delay={0.1}>
            <section aria-labelledby="contact-form-title" className="bento p-6 sm:p-8">
              <h2 id="contact-form-title" className="font-heading text-display-sm font-semibold">
                Send a message
              </h2>
              <p className="mb-6 mt-2 text-sm text-muted">It lands straight in my inbox.</p>
              <ContactForm />
            </section>
          </Reveal>
        </div>
      </Container>
    </>
  );
}