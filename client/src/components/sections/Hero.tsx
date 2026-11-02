import { useRef } from 'react';
import { motion, useReducedMotion, useScroll, useTransform } from 'framer-motion';
import { useReady } from '@/app/ReadyProvider';
import { useProfile } from '@/lib/content';
import { SITE } from '@/lib/site';
import { Container } from '@/components/ui/Container';
import { Button } from '@/components/ui/Button';
import { Reveal } from '@/components/motion/Reveal';
import { SplitText } from '@/components/motion/SplitText';
import { WordMorph } from '@/components/motion/WordMorph';
import { FollowBlob } from '@/components/motion/FollowBlob';
import { ProfilePhoto } from './ProfilePhoto';

export function Hero() {
  const profile = useProfile();
  const { ready } = useReady();
  const reduce = useReducedMotion();
  const ref = useRef<HTMLElement>(null);

  // Parallax: text drifts up and the photo drifts down as you scroll past the hero
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] });
  const yText = useTransform(scrollYProgress, [0, 1], [0, reduce ? 0 : -70]);
  const yPhoto = useTransform(scrollYProgress, [0, 1], [0, reduce ? 0 : 90]);
  const fade = useTransform(scrollYProgress, [0, 0.8], [1, reduce ? 1 : 0.2]);

  const roles = profile.roles?.length ? profile.roles : SITE.roles;

  return (
    <section ref={ref} className="relative isolate overflow-hidden">
      <FollowBlob />

      <Container className="relative grid min-h-svh items-center gap-12 pb-20 pt-36 lg:grid-cols-[1.35fr_1fr]">
        <motion.div style={{ y: yText, opacity: fade }}>
          <Reveal active={ready} delay={0.05}>
            <p className="label-mono">Hello, I'm</p>
          </Reveal>

          <SplitText
            as="h1"
            text={SITE.name}
            active={ready}
            delay={0.12}
            className="mt-4 font-heading text-display-xl font-bold lg:text-[clamp(3.5rem,6.4vw,7rem)]"
          />

          <Reveal active={ready} delay={0.55} className="mt-6">
            <p className="font-heading text-display-md font-semibold">
              <WordMorph words={roles} />
            </p>
          </Reveal>

          <Reveal active={ready} delay={0.7} className="mt-6">
            {profile.tagline && <p className="font-heading text-xl">{profile.tagline}</p>}
            {profile.bio && <p className="mt-3 max-w-xl text-muted">{profile.bio}</p>}
          </Reveal>

          <Reveal active={ready} delay={0.85} className="mt-10 flex flex-wrap items-center gap-3">
            <Button to="/projects" size="lg" magnetic>
              View Projects
            </Button>
            <Button
              href={profile.resumeUrl ?? '/resume.pdf'}
              download="Sushant-Ambekar-Resume.pdf"
              size="lg"
              variant="secondary"
            >
              Download Resume
            </Button>
            <Button to="/social" size="lg" variant="ghost">
              Contact
            </Button>
          </Reveal>
        </motion.div>

        <motion.div style={{ y: yPhoto }}>
          <Reveal active={ready} delay={0.4}>
            <ProfilePhoto name={profile.fullName} />
          </Reveal>
        </motion.div>
      </Container>
    </section>
  );
}