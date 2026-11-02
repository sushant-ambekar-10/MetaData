import { motion } from 'framer-motion';
import { Tag } from '@/components/ui/Tag';
import { useQualifications } from '@/lib/content';
import { spring } from '@/lib/motion';
import { cn } from '@/lib/utils';
import { SgpaChart } from './SgpaChart';

export function QualificationsPanel() {
  const quals = useQualifications();
  // Data is stored newest-first; the stepper reads oldest -> newest (SSC -> Diploma -> B.Tech)
  const steps = [...quals].reverse();

  if (!steps.length) return <p className="text-muted">Qualifications will appear here soon.</p>;

  return (
    <ol aria-label="Education timeline, oldest first" className="relative">
      {steps.map((q, i) => {
        const last = i === steps.length - 1;
        return (
          <li key={q.id} className="relative pb-10 pl-14 last:pb-0">
            {!last && (
              <motion.span
                aria-hidden="true"
                className="absolute bottom-0 left-[15px] top-9 w-px origin-top bg-line-strong"
                initial={{ scaleY: 0 }}
                whileInView={{ scaleY: 1 }}
                viewport={{ once: true }}
                transition={{ ...spring.gentle, delay: 0.1 + i * 0.15 }}
              />
            )}
            <span
              aria-hidden="true"
              className={cn(
                'absolute left-0 top-0 grid h-8 w-8 place-items-center rounded-full border bg-surface-2 font-mono text-xs',
                last ? 'border-a2-text text-fg shadow-glow' : 'border-line-strong text-muted'
              )}
            >
              {i + 1}
            </span>

            <h3 className="font-heading text-lg font-semibold">{q.level}</h3>
            <p className="mt-1 text-sm text-muted">{q.institution}</p>

            {(q.score || q.year) && (
              <div className="mt-3 flex flex-wrap gap-2">
                {q.score && <Tag className="text-fg">{q.score}</Tag>}
                {q.year && <Tag>{q.year}</Tag>}
              </div>
            )}

            {q.semesters && q.semesters.length > 0 && <SgpaChart semesters={q.semesters} label={q.level} />}
          </li>
        );
      })}
    </ol>
  );
}