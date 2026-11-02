import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Star } from 'lucide-react';
import { useSkills } from '@/lib/content';
import { spring } from '@/lib/motion';
import { SKILL_CATEGORIES, type Skill, type SkillCategory } from '@/lib/types';
import { cn } from '@/lib/utils';

type Filter = 'All' | SkillCategory;

// `featured` is a data flag (set in the admin panel), not a hard-coded index
function SkillChip({ skill }: { skill: Skill }) {
  const level = skill.level && skill.level > 0 ? skill.level : 0;
  return (
    <span
      className={cn(
        'inline-flex items-center gap-2 rounded-pill border px-4 py-2 text-sm',
        skill.featured ? 'border-a1/60 bg-a1/15 font-medium text-fg' : 'border-line-strong text-muted'
      )}
    >
      {skill.featured && (
        <>
          <Star className="h-3.5 w-3.5 fill-current text-a1-text" aria-hidden="true" />
          <span className="sr-only">Featured: </span>
        </>
      )}
      {skill.name}
      {level > 0 && (
        <span className="flex items-center gap-1.5" title={`${level}%`}>
          <span aria-hidden="true" className="h-1 w-10 overflow-hidden rounded-full bg-line-strong">
            <span className="block h-full rounded-full bg-aurora" style={{ width: `${level}%` }} />
          </span>
          <span className="sr-only">, proficiency {level} percent</span>
        </span>
      )}
    </span>
  );
}

export function SkillsPanel() {
  const skills = useSkills();
  const [filter, setFilter] = useState<Filter>('All');

  const groups = SKILL_CATEGORIES.map((category) => ({
    category,
    items: skills.filter((s) => s.category === category),
  })).filter((g) => g.items.length > 0);

  const visible = filter === 'All' ? groups : groups.filter((g) => g.category === filter);
  const options: Array<{ id: Filter; count: number }> = [
    { id: 'All', count: skills.length },
    ...groups.map((g) => ({ id: g.category as Filter, count: g.items.length })),
  ];

  return (
    <div>
      <div role="group" aria-label="Filter skills by category" className="flex flex-wrap gap-2">
        {options.map(({ id, count }) => {
          const active = filter === id;
          return (
            <button
              key={id}
              type="button"
              aria-pressed={active}
              onClick={() => setFilter(id)}
              className={cn(
                'relative rounded-pill border px-4 py-2 text-sm font-medium transition-colors duration-200',
                active ? 'border-fg text-bg' : 'border-line-strong text-muted hover:text-fg'
              )}
            >
              {active && (
                <motion.span
                  layoutId="skill-category-active"
                  className="absolute inset-0 rounded-pill bg-fg"
                  transition={spring.snappy}
                />
              )}
              <span className="relative">
                {id} <span className="font-mono text-xs opacity-70">{count}</span>
              </span>
            </button>
          );
        })}
      </div>

      <div className="relative mt-8 space-y-8">
        <AnimatePresence mode="popLayout" initial={false}>
          {visible.map((g) => (
            <motion.section
              key={g.category}
              layout
              aria-label={g.category}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.97 }}
              transition={spring.soft}
            >
              <h3 className="label-mono">{g.category}</h3>
              <ul className="mt-3 flex flex-wrap gap-2">
                {g.items.map((s) => (
                  <li key={s.id}>
                    <SkillChip skill={s} />
                  </li>
                ))}
              </ul>
            </motion.section>
          ))}
        </AnimatePresence>
      </div>

      <p className="mt-8 flex items-center gap-2 text-sm text-muted">
        <Star className="h-3.5 w-3.5 fill-current text-a1-text" aria-hidden="true" />
        Starred skills are my strongest and most-used.
      </p>
    </div>
  );
}