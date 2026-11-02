import { BadgeCheck, Code2, GraduationCap, Trophy, User } from 'lucide-react';

// `id` values are the ?tab= query values used by the Home teaser cards
export const TABS = [
  { id: 'personal', label: 'Personal', title: 'Personal details', blurb: 'Who I am and how to reach me.', Icon: User },
  { id: 'qualifications', label: 'Qualifications', title: 'Qualifications', blurb: 'My education, oldest to newest.', Icon: GraduationCap },
  { id: 'skills', label: 'Skills', title: 'Skills', blurb: 'Starred skills are the ones I use most.', Icon: Code2 },
  { id: 'certifications', label: 'Certifications', title: 'Certifications', blurb: 'Internships and verified courses.', Icon: BadgeCheck },
  { id: 'achievements', label: 'Achievements', title: 'Achievements', blurb: 'Ranks, finals and milestones.', Icon: Trophy },
] as const;

export type TabId = (typeof TABS)[number]['id'];

export const isTabId = (value: string | null): value is TabId => TABS.some((t) => t.id === value);