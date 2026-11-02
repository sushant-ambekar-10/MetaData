import { useCallback, type ComponentType } from 'react';
import { useSearchParams } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { Seo } from '@/lib/seo/Seo';
import { useReady } from '@/app/ReadyProvider';
import { spring } from '@/lib/motion';
import { Container } from '@/components/ui/Container';
import { Reveal } from '@/components/motion/Reveal';
import { SplitText } from '@/components/motion/SplitText';
import { OrbitNav } from '@/components/metadata/OrbitNav';
import { TABS, isTabId, type TabId } from '@/components/metadata/tabs';
import { PersonalPanel } from '@/components/metadata/PersonalPanel';
import { QualificationsPanel } from '@/components/metadata/QualificationsPanel';
import { SkillsPanel } from '@/components/metadata/SkillsPanel';
import { CertificationsPanel } from '@/components/metadata/CertificationsPanel';
import { AchievementsPanel } from '@/components/metadata/AchievementsPanel';

const PANELS: Record<TabId, ComponentType> = {
  personal: PersonalPanel,
  qualifications: QualificationsPanel,
  skills: SkillsPanel,
  certifications: CertificationsPanel,
  achievements: AchievementsPanel,
};

export default function Metadata() {
  const { ready } = useReady();
  const [params, setParams] = useSearchParams();

  // The active tab lives in the URL, so the Home teaser cards can deep-link (?tab=skills)
  const raw = params.get('tab');
  const tab: TabId = isTabId(raw) ? raw : 'personal';
  const current = TABS.find((t) => t.id === tab) ?? TABS[0];
  const Panel = PANELS[tab];

  const select = useCallback(
    (id: TabId) => {
      setParams(
        (prev) => {
          const next = new URLSearchParams(prev);
          next.set('tab', id);
          return next;
        },
        { replace: true }
      );
    },
    [setParams]
  );

  return (
    <>
      <Seo
        title="Me-taData"
        description="Interactive explorer of Sushant Ambekar's personal details, qualifications, skills, certifications and achievements."
      />

      <Container className="pb-10 pt-36">
        <Reveal active={ready}>
          <p className="label-mono">About me</p>
        </Reveal>
        <SplitText as="h1" text="Me-taData" active={ready} delay={0.1} className="mt-4 font-heading text-display-xl font-bold" />
        <Reveal active={ready} delay={0.35}>
          <p className="mt-6 max-w-2xl text-lg text-muted">
            Five categories of data about me. Hover, tap or use the arrow keys and Enter to explore.
          </p>
        </Reveal>
      </Container>

      <Container className="pb-24">
        <div className="grid gap-12 lg:grid-cols-[minmax(0,28rem)_minmax(0,1fr)] lg:items-start">
          <div className="lg:sticky lg:top-28">
            <OrbitNav active={tab} onSelect={select} />
          </div>

          <div
            id="metadata-panel"
            role="tabpanel"
            aria-labelledby={`tab-${tab}`}
            className="glass rounded-bento p-6 sm:p-8 lg:min-h-[28rem]"
          >
            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={tab}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12, transition: { duration: 0.12 } }}
                transition={spring.soft}
              >
                <div className="mb-8 flex items-center gap-4">
                  <span className="grid h-12 w-12 place-items-center rounded-2xl border border-line-strong bg-surface-2 text-a2-text">
                    <current.Icon className="h-6 w-6" aria-hidden="true" />
                  </span>
                  <div>
                    <h2 className="font-heading text-display-sm font-semibold">{current.title}</h2>
                    <p className="text-sm text-muted">{current.blurb}</p>
                  </div>
                </div>
                <Panel />
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </Container>
    </>
  );
}