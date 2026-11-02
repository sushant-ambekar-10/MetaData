import { Award, ExternalLink, Star } from 'lucide-react';
import { useCertifications } from '@/lib/content';
import { cn } from '@/lib/utils';

export function CertificationsPanel() {
  const certs = useCertifications();
  if (!certs.length) return <p className="text-muted">Certifications will appear here soon.</p>;

  return (
    <ul className="grid gap-3 sm:grid-cols-2">
      {certs.map((c) => (
        <li
          key={c.id}
          className={cn(
            'flex flex-col rounded-2xl border p-5',
            c.featured ? 'border-a1/50 bg-a1/10' : 'border-line bg-surface/60'
          )}
        >
          <div className="flex items-start justify-between gap-3">
            <span className="grid h-10 w-10 place-items-center rounded-xl border border-line-strong bg-surface-2 text-a2-text">
              <Award className="h-5 w-5" aria-hidden="true" />
            </span>
            {c.featured && (
              <span className="inline-flex items-center gap-1 font-mono text-[11px] text-fg">
                <Star className="h-3 w-3 fill-current text-a1-text" aria-hidden="true" />
                Featured
              </span>
            )}
          </div>

          <h3 className="mt-4 font-heading text-base font-semibold">{c.title}</h3>
          {c.issuer && <p className="mt-1 text-sm text-muted">{c.issuer}</p>}
          {c.date && <p className="mt-1 font-mono text-xs text-muted">{c.date}</p>}

          {c.url && (
            <a
              href={c.url}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-4 inline-flex items-center gap-1.5 self-start text-sm font-medium text-a1-text underline-offset-4 hover:underline"
            >
              View credential
              <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
              <span className="sr-only"> for {c.title} (opens in a new tab)</span>
            </a>
          )}
        </li>
      ))}
    </ul>
  );
}