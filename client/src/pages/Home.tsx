import { Seo } from '@/lib/seo/Seo';
import { personSchema } from '@/lib/seo/jsonld';
import { SITE } from '@/lib/site';
import { useReady } from '@/app/ReadyProvider';
import { Container } from '@/components/ui/Container';
import { Button } from '@/components/ui/Button';
import { Reveal, Stagger, StaggerItem } from '@/components/motion/Reveal';
import { SplitText } from '@/components/motion/SplitText';
import { WordMorph } from '@/components/motion/WordMorph';
import { FollowBlob } from '@/components/motion/FollowBlob';

// TEMPORARY: hero + a "foundation preview" so every Phase 2 building block can be tested.
// Phase 3 replaces this page with the real Home.

const SWATCHES = [
  { name: 'bg', cls: 'bg-bg' },
  { name: 'surface', cls: 'bg-surface' },
  { name: 'surface-2', cls: 'bg-surface-2' },
  { name: 'accent 1', cls: 'bg-a1' },
  { name: 'accent 2', cls: 'bg-a2' },
  { name: 'accent 3', cls: 'bg-a3' },
];

const CARDS = [
  { title: 'Spring physics', text: 'Every motion uses springs from lib/motion, so the feel stays consistent.' },
  { title: 'Aurora scroll', text: 'The background glow shifts mood as you scroll down the page.' },
  { title: 'Theme system', text: 'System preference, saved choice, and no flash on first paint.' },
  { title: 'Smooth scroll', text: 'Lenis smooth scrolling, with native scrolling for reduced motion.' },
  { title: 'Page curtain', text: 'Route changes wipe through a shared curtain, then scroll resets.' },
  { title: 'Accessible', text: 'Skip link, focus management, keyboard menu and visible focus rings.' },
];

export default function Home() {
  const { ready } = useReady();

  return (
    <>
      <Seo jsonLd={personSchema()} />

      <section className="relative isolate overflow-hidden">
        <FollowBlob />
        <Container className="relative flex min-h-svh flex-col justify-center pb-24 pt-36">
          <Reveal active={ready} delay={0.05}>
            <p className="label-mono">Hello, I'm</p>
          </Reveal>

          <SplitText
            as="h1"
            text={SITE.name}
            active={ready}
            delay={0.12}
            className="mt-4 font-heading text-display-xl font-bold"
          />

          <Reveal active={ready} delay={0.55} className="mt-6">
            <p className="font-heading text-display-md font-semibold">
              <WordMorph words={SITE.roles} />
            </p>
          </Reveal>

          <Reveal active={ready} delay={0.7} className="mt-5">
            <p className="max-w-xl text-lg text-muted">{SITE.tagline}</p>
          </Reveal>

          <Reveal active={ready} delay={0.85} className="mt-10 flex flex-wrap items-center gap-3">
            <Button to="/projects" size="lg" magnetic>
              View Projects
            </Button>
            {/* TODO (Phase 4): point at the real resume page / PDF */}
            <Button to="/resume" size="lg" variant="secondary">
              Download Resume
            </Button>
            <Button to="/social" size="lg" variant="ghost">
              Contact
            </Button>
          </Reveal>
        </Container>
      </section>

      <section className="py-24">
        <Container>
          <Reveal>
            <p className="label-mono">Phase 2 · Foundation preview</p>
            <h2 className="mt-3 font-heading text-display-lg">Design tokens in both themes</h2>
            <p className="mt-4 max-w-2xl text-muted">
              Toggle the theme in the navbar. Every colour below comes from <code className="font-mono text-sm">tokens.css</code>.
              Phase 3 replaces this page with the real Home.
            </p>
          </Reveal>

          <Stagger className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
            {SWATCHES.map((s) => (
              <StaggerItem key={s.name}>
                <div className="bento p-3">
                  <div className={`h-20 rounded-2xl border border-line ${s.cls}`} />
                  <p className="label-mono mt-3">{s.name}</p>
                </div>
              </StaggerItem>
            ))}
          </Stagger>

          <Reveal className="mt-16 flex flex-wrap items-center gap-3">
            <Button>Primary</Button>
            <Button variant="secondary">Secondary</Button>
            <Button variant="ghost">Ghost</Button>
            <Button href="https://github.com/sushant-ambekar-10" variant="secondary">
              External link
            </Button>
          </Reveal>

          <Stagger className="mt-16 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {CARDS.map((c) => (
              <StaggerItem key={c.title}>
                <article className="bento h-full p-6">
                  <h3 className="font-heading text-display-sm">{c.title}</h3>
                  <p className="mt-3 text-muted">{c.text}</p>
                </article>
              </StaggerItem>
            ))}
          </Stagger>
        </Container>
      </section>

      <section className="py-24">
        <Container>
          <Reveal>
            <h2 className="font-heading text-display-lg">
              Keep <span className="text-gradient">scrolling</span>
            </h2>
            <p className="mt-4 max-w-xl text-muted">
              Watch the top progress bar, the background glow, and the navbar hiding on scroll down and returning on scroll up.
            </p>
          </Reveal>
          <div className="h-[60vh]" />
        </Container>
      </section>
    </>
  );
}