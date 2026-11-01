import { Seo } from '@/lib/seo/Seo';
import { Container } from '@/components/ui/Container';
import { Button } from '@/components/ui/Button';
import { Reveal } from '@/components/motion/Reveal';
import { SplitText } from '@/components/motion/SplitText';

export default function NotFound() {
  return (
    <>
      <Seo title="Page not found" noindex />
      <Container className="flex min-h-[75svh] flex-col justify-center pb-16 pt-40">
        <p className="label-mono">Error 404</p>
        <SplitText
          as="h1"
          text="This page drifted off the map."
          className="mt-4 max-w-4xl font-heading text-display-lg font-bold"
        />
        <Reveal delay={0.35}>
          <p className="mt-6 max-w-lg text-muted">
            The link may be broken or the page may have moved. Head back home and try again.
          </p>
        </Reveal>
        <Reveal delay={0.45} className="mt-10 flex flex-wrap gap-3">
          <Button to="/" magnetic>
            Go home
          </Button>
          <Button to="/projects" variant="secondary">
            See projects
          </Button>
        </Reveal>
      </Container>
    </>
  );
}