import type { ReactNode } from 'react';
import { Facebook, Github, Instagram, Linkedin, Mail, type LucideIcon } from 'lucide-react';
import { useProfile, useQualifications } from '@/lib/content';
import { handleFromUrl } from '@/lib/format';
import { cn } from '@/lib/utils';

const DOB = new Intl.DateTimeFormat('en-GB', { dateStyle: 'long', timeZone: 'UTC' });

function Field({ label, children, wide }: { label: string; children: ReactNode; wide?: boolean }) {
  return (
    <div className={cn(wide && 'sm:col-span-2')}>
      <dt className="label-mono">{label}</dt>
      <dd className="mt-2">{children}</dd>
    </div>
  );
}

export function PersonalPanel() {
  const profile = useProfile();
  const latest = useQualifications()[0];
  const emails = profile.emails ?? [];
  const l = profile.links ?? {};

  const links: Array<{ label: string; href: string; Icon: LucideIcon }> = [];
  if (l.linkedin) links.push({ label: 'LinkedIn', href: l.linkedin, Icon: Linkedin });
  if (l.github) links.push({ label: 'GitHub', href: l.github, Icon: Github });
  if (l.instagram) links.push({ label: 'Instagram', href: l.instagram, Icon: Instagram });
  if (l.facebook) links.push({ label: 'Facebook', href: l.facebook, Icon: Facebook }); // only present if enabled in admin

  // The API only sends `dob` when the admin has switched it on
  const dob = profile.dob ? new Date(profile.dob) : null;
  const dobValid = dob && !Number.isNaN(dob.getTime());

  return (
    <dl className="grid gap-6 sm:grid-cols-2">
      <Field label="Full name">
        <span className="font-heading text-xl">{profile.fullName}</span>
      </Field>

      {profile.tagline && <Field label="Tagline">{profile.tagline}</Field>}

      {latest && (
        <Field label="Latest qualification">
          {latest.level}
          <span className="block text-sm text-muted">
            {latest.institution}
            {latest.year ? `, ${latest.year}` : ''}
          </span>
        </Field>
      )}

      {dobValid && <Field label="Date of birth">{DOB.format(dob)}</Field>}

      {(profile.bio || profile.githubBio) && (
        <Field label="About" wide>
          {profile.bio && <p className="text-muted">{profile.bio}</p>}
          {profile.githubBio && <p className="mt-2 text-muted">{profile.githubBio}</p>}
        </Field>
      )}

      {emails.length > 0 && (
        <Field label="Email" wide>
          <ul className="space-y-2">
            {emails.map((email) => (
              <li key={email}>
                <a
                  href={`mailto:${email}`}
                  className="inline-flex items-center gap-2 break-all underline-offset-4 hover:underline"
                >
                  <Mail className="h-4 w-4 shrink-0 text-a2-text" aria-hidden="true" />
                  {email}
                </a>
              </li>
            ))}
          </ul>
        </Field>
      )}

      {links.length > 0 && (
        <Field label="Find me online" wide>
          <ul className="flex flex-wrap gap-2">
            {links.map(({ label, href, Icon }) => (
              <li key={label}>
                <a
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-pill border border-line-strong px-4 py-2 text-sm transition-colors duration-200 hover:bg-surface-2"
                >
                  <Icon className="h-4 w-4" aria-hidden="true" />
                  {label}
                  <span className="sr-only">
                    , {handleFromUrl(href)} (opens in a new tab)
                  </span>
                </a>
              </li>
            ))}
          </ul>
        </Field>
      )}
    </dl>
  );
}