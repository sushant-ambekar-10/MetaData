import { useRef } from 'react';
import { motion, useReducedMotion, useScroll, useSpring } from 'framer-motion';
import { Seo } from '@/lib/seo/Seo';
import { useReady } from '@/app/ReadyProvider';
import { useExperience } from '@/lib/content';
import { formatRange } from '@/lib/format';
import { spring, springValues } from '@/lib/motion';
import { Container } from '@/components/ui/Container';
import { Button } from '@/components/ui/Button';
import { TiltCard } from '@/components/ui/TiltCard';
import { Reveal } from '@/components/motion/Reveal';
import { SplitText } from '@/components/motion/SplitText';

const TYPE_LABEL = { internship: 'Internship', work: 'Work', leadership: 'Leadership' } as const;

export default function Experience() {
  const { ready } = useReady();
  const reduce = useReducedMotion();
  const items = useExperience();

  // The glowing line fills as the timeline scrolls through the viewport
  const listRef = useRef<HTMLOListElement>(null);
  const { scrollYProgress } = useScroll({ target: listRef, offset: ['start 75%', 'end 60%'] });
  const fill = useSpring(scrollYProgress, springValues.progress);

  return (
    <>
      <Seo
        title="Experience"
        description="Internships and leadership experience: web development at My Job Grow and Kalavati Technologies, and Training & Placement Coordinator at YCCE."
      />

      <Container className="pb-10 pt-36">
        <Reveal active={ready}>
          <p className="label-mono">Experience</p>
        </Reveal>
        <SplitText as="h1" text="Where I've worked" active={ready} delay={0.1} className="mt-4 font-heading text-display-xl font-bold" />
        <Reveal active={ready} delay={0.35}>
          <p className="mt-6 max-w-2xl text-lg text-muted">
            Internships, industrial training and campus leadership, newest first.
          </p>
        </Reveal>
      </Container>

      <Container className="pb-24">
        <ol ref={listRef} className="relative mx-auto mt-8 max-w-4xl space-y-12 pl-10 sm:pl-14">
          <span aria-hidden="true" className="absolute bottom-2 left-[11px] top-2 w-px bg-line-strong" />
          <motion.span
            aria-hidden="true"
            className="absolute bottom-2 left-[11px] top-2 w-px origin-top bg-aurora"
            style={{ scaleY: reduce ? 1 : fill }}
          />

          {items.map((item, i) => (
            <li key={item.id} className="relative">
              <motion.span
                aria-hidden="true"
                className="absolute -left-10 top-1 grid h-6 w-6 place-items-center rounded-full border border-line-strong bg-bg sm:-left-14"
                initial={{ scale: 0 }}
                whileInView={{ scale: 1 }}
                viewport={{ once: true, amount: 1 }}
                transition={spring.bouncy}
              >
                <span className="h-2.5 w-2.5 rounded-full bg-aurora" />
              </motion.span>

              <Reveal delay={0.05}>
                <p className="label-mono mb-3">{formatRange(item.start, item.end, item.current)}</p>
                <TiltCard className="bento">
                  <article className="p-6 sm:p-8">
                    <div className="flex flex-wrap items-center gap-2">
                      {item.type && (
                        <span className="rounded-pill border border-line-strong px-3 py-1 font-mono text-[11px] text-muted">
                          {TYPE_LABEL[item.type]}
                        </span>
                      )}
                      {item.current && (
                        <span className="rounded-pill bg-a1/15 px-3 py-1 font-mono text-[11px] text-fg ring-1 ring-a1/40">
                          Current
                        </span>
                      )}
                    </div>

                    <h2 className="mt-4 font-heading text-display-sm font-semibold">{item.role}</h2>
                    <p className="mt-1 text-a1-text">{item.org}</p>
                    {item.description && <p className="mt-4 max-w-2xl text-muted">{item.description}</p>}

                    {item.highlights.length > 0 && (
                      <ul className="mt-5 space-y-3">
                        {item.highlights.map((h) => (
                          <li key={h} className="flex items-start gap-3 text-sm">
                            <span aria-hidden="true" className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-aurora" />
                            <span>{h}</span>
                          </li>
                        ))}
                      </ul>
                    )}
                  </article>
                </TiltCard>
              </Reveal>
              {/* index kept for stable ordering of reveal delays if you extend this */}
              <span className="hidden">{i}</span>
            </li>
          ))}
        </ol>

        <Reveal className="mx-auto mt-16 flex max-w-4xl flex-wrap gap-3">
          <Button to="/resume" size="lg" magnetic>
            View resume
          </Button>
          <Button to="/social" size="lg" variant="secondary">
            Get in touch
          </Button>
        </Reveal>
      </Container>
    </>
  );
}