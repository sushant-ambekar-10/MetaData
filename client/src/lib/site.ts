// Static site config. Content (projects, skills...) comes from the API.
// TODO (Phase 3): social links and emails will be read from /api/profile instead.
const rawUrl = import.meta.env.VITE_SITE_URL ?? 'http://localhost:5173';

export const SITE = {
  name: 'Sushant Ambekar',
  fullName: 'Sushant Sanjay Ambekar',
  title: 'Sushant Ambekar | Portfolio',
  tagline: 'To digitize the mind',
  description:
    'Portfolio of Sushant Ambekar, a full-stack, Android and DevOps developer and CSE student at YCCE Nagpur.',
  url: rawUrl.replace(/\/$/, ''),
  ogImage: '/og-image.png', // TODO (Phase 6): add a 1200x630 image at client/public/og-image.png
  email: 'sushantsambekar@gmail.com',
  roles: ['GenAI Full-Stack Developer', 'MERN Developer', 'Problem Solver'] as string[],
  social: {
    linkedin: 'https://www.linkedin.com/in/sushant-ambekar-066b06316/',
    github: 'https://github.com/sushant-ambekar-10',
    instagram: 'https://www.instagram.com/sushant_ambekar_10/',
  },
};

export interface NavItem {
  label: string;
  to: string;
  hint?: string;
}

export const NAV: NavItem[] = [
  { label: 'Home', to: '/' },
  { label: 'Projects', to: '/projects' },
  { label: 'About', to: '/metadata', hint: 'Me-taData' },
  { label: 'Experience', to: '/experience' },
  { label: 'Contact', to: '/social' },
];