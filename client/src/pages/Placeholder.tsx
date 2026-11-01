import { Seo } from '@/lib/seo/Seo';
import { Container } from '@/components/ui/Container';
import { Button } from '@/components/ui/Button';
import { Reveal } from '@/components/motion/Reveal';
import { SplitText } from '@/components/motion/SplitText';

interface Props {
  title: string;
  phase: number;
  description: string;
}

// Temporary page for routes that are built in later phases
export default function Placeholder({ title, phase, description }: Props) {
  return (
    <>
      <Seo title={title} />
      <Container className="flex min-h-[70svh] flex-col justify-center pb-16 pt-40">
        <p className="label-mono">Coming in Phase {phase}</p>
        <SplitText as="h1" text={title} className="mt-4 font-heading text-display-lg font-bold" />
        <Reveal delay={0.3}>
          <p className="mt-6 max-w-xl text-muted">{description}</p>
        </Reveal>
        <Reveal delay={0.4} className="mt-10">
          <Button to="/" variant="secondary">
            Back home
          </Button>
        </Reveal>
      </Container>
    </>
  );
}