import { Seo } from '@/lib/seo/Seo';
import { personSchema } from '@/lib/seo/jsonld';
import { Hero } from '@/components/sections/Hero';
import { StatsStrip } from '@/components/sections/StatsStrip';
import { SkillsMarquee } from '@/components/sections/SkillsMarquee';
import { FeaturedProjects } from '@/components/sections/FeaturedProjects';
import { MetadataTeaser } from '@/components/sections/MetadataTeaser';
import { ExperienceHighlights } from '@/components/sections/ExperienceHighlights';
import { ConnectSection } from '@/components/sections/ConnectSection';

export default function Home() {
  return (
    <>
      <Seo jsonLd={personSchema()} />
      <Hero />
      <StatsStrip />
      <SkillsMarquee />
      <FeaturedProjects />
      <MetadataTeaser />
      <ExperienceHighlights />
      <ConnectSection />
    </>
  );
}