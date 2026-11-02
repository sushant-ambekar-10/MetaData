import { motion } from 'framer-motion';
import { spring } from '@/lib/motion';
import type { Semester } from '@/lib/types';

interface Props {
  semesters: Semester[];
  label: string; // e.g. the qualification name, for the accessible description
}

const GRID = [0, 50, 100]; // % of the 0-10 scale

// Bars grow with scaleY (transform only). The whole chart is described to screen readers in one sentence.
export function SgpaChart({ semesters, label }: Props) {
  const data = [...semesters].sort((a, b) => a.sem - b.sem);
  if (!data.length) return null;

  const summary = data.map((s) => `semester ${s.sem}: ${s.sgpa.toFixed(2)}`).join(', ');

  return (
    <figure className="mt-5">
      <figcaption className="label-mono">SGPA by semester</figcaption>

      <div role="img" aria-label={`${label} SGPA out of 10. ${summary}`} className="mt-8">
        <div className="relative h-40">
          {GRID.map((p) => (
            <div
              key={p}
              aria-hidden="true"
              className="absolute inset-x-0 border-t border-dashed border-line"
              style={{ bottom: `${p}%` }}
            >
              <span className="absolute -top-2.5 left-0 font-mono text-[10px] text-muted">{p / 10}</span>
            </div>
          ))}

          <div className="absolute inset-0 flex items-end justify-around gap-3 px-8">
            {data.map((s, i) => (
              <div key={s.sem} className="flex h-full flex-1 flex-col items-center justify-end">
                <motion.span
                  className="mb-1 font-mono text-xs"
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.3 + i * 0.1 }}
                >
                  {s.sgpa.toFixed(2)}
                </motion.span>
                <motion.div
                  className="w-full max-w-16 origin-bottom rounded-t-2xl bg-aurora"
                  style={{ height: `${(s.sgpa / 10) * 100}%` }}
                  initial={{ scaleY: 0 }}
                  whileInView={{ scaleY: 1 }}
                  viewport={{ once: true, amount: 0.8 }}
                  transition={{ ...spring.soft, delay: i * 0.1 }}
                />
              </div>
            ))}
          </div>
        </div>

        <div aria-hidden="true" className="mt-2 flex justify-around gap-3 px-8">
          {data.map((s) => (
            <span key={s.sem} className="flex-1 text-center font-mono text-xs text-muted">
              Sem {s.sem}
            </span>
          ))}
        </div>
      </div>
    </figure>
  );
}