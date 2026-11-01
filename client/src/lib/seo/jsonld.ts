import { SITE } from '@/lib/site';

export const personSchema = () => ({
  '@context': 'https://schema.org',
  '@type': 'Person',
  name: SITE.fullName,
  alternateName: SITE.name,
  url: SITE.url,
  email: `mailto:${SITE.email}`,
  jobTitle: 'Full-Stack and Android Developer',
  description: SITE.description,
  alumniOf: {
    '@type': 'CollegeOrUniversity',
    name: 'Yeshwantrao Chavan College of Engineering, Nagpur',
  },
  sameAs: Object.values(SITE.social),
});

// Escape "<" so a value can never close the <script> tag
export const safeJson = (data: unknown) => JSON.stringify(data).replace(/</g, '\\u003c');