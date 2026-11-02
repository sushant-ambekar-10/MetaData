import { useState, type ReactNode } from 'react';
import { motion } from 'framer-motion';
import { ChevronDown, Search, X } from 'lucide-react';
import { spring } from '@/lib/motion';
import { cn } from '@/lib/utils';

export type SortKey = 'newest' | 'oldest';

const SKILL_LIMIT = 10;

interface ChipProps {
  active: boolean;
  onClick: () => void;
  layoutId?: string;
  children: ReactNode;
}

// Active chip is inverted (bg-fg / text-bg), which keeps AA contrast in both themes
function Chip({ active, onClick, layoutId, children }: ChipProps) {
  return (
    <button
      type="button"
      aria-pressed={active}
      onClick={onClick}
      className={cn(
        'relative rounded-pill border px-4 py-2 text-sm font-medium transition-colors duration-200',
        active ? 'border-fg text-bg' : 'border-line-strong text-muted hover:text-fg',
        active && !layoutId && 'bg-fg'
      )}
    >
      {active && layoutId && (
        <motion.span layoutId={layoutId} className="absolute inset-0 rounded-pill bg-fg" transition={spring.snappy} />
      )}
      <span className="relative">{children}</span>
    </button>
  );
}

interface Props {
  query: string;
  onQuery: (v: string) => void;
  categories: string[];
  category: string;
  onCategory: (v: string) => void;
  skills: string[];
  selectedSkills: string[];
  onToggleSkill: (skill: string) => void;
  sort: SortKey;
  onSort: (v: SortKey) => void;
  resultCount: number;
  total: number;
  hasFilters: boolean;
  onClear: () => void;
}

export function ProjectFilters({
  query,
  onQuery,
  categories,
  category,
  onCategory,
  skills,
  selectedSkills,
  onToggleSkill,
  sort,
  onSort,
  resultCount,
  total,
  hasFilters,
  onClear,
}: Props) {
  const [expanded, setExpanded] = useState(false);
  const visibleSkills = expanded ? skills : skills.filter((s, i) => i < SKILL_LIMIT || selectedSkills.includes(s));

  return (
    <div className="space-y-5">
      <div className="flex flex-col gap-3 sm:flex-row">
        <label className="relative block flex-1">
          <span className="sr-only">Search projects</span>
          <Search
            className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted"
            aria-hidden="true"
          />
          <input
            type="search"
            value={query}
            onChange={(e) => onQuery(e.target.value)}
            placeholder="Search by name, tech or description"
            className="h-12 w-full rounded-pill border border-line-strong bg-surface pl-11 pr-11 text-sm text-fg placeholder:text-muted"
          />
          {query && (
            <button
              type="button"
              onClick={() => onQuery('')}
              aria-label="Clear search"
              className="absolute right-2 top-1/2 grid h-8 w-8 -translate-y-1/2 place-items-center rounded-full text-muted hover:bg-surface-2 hover:text-fg"
            >
              <X className="h-4 w-4" aria-hidden="true" />
            </button>
          )}
        </label>

        <label className="relative block">
          <span className="sr-only">Sort projects</span>
          <select
            value={sort}
            onChange={(e) => onSort(e.target.value as SortKey)}
            className="h-12 w-full appearance-none rounded-pill border border-line-strong bg-surface pl-5 pr-11 text-sm text-fg sm:w-auto"
          >
            <option value="newest">Newest first</option>
            <option value="oldest">Oldest first</option>
          </select>
          <ChevronDown
            className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted"
            aria-hidden="true"
          />
        </label>
      </div>

      <div role="group" aria-label="Filter by category" className="flex flex-wrap gap-2">
        {categories.map((c) => (
          <Chip key={c} active={category === c} onClick={() => onCategory(c)} layoutId="category-active">
            {c}
          </Chip>
        ))}
      </div>

      {skills.length > 0 && (
        <div>
          <p className="label-mono mb-3">Technology</p>
          <div role="group" aria-label="Filter by technology" className="flex flex-wrap gap-2">
            {visibleSkills.map((s) => (
              <Chip key={s} active={selectedSkills.includes(s)} onClick={() => onToggleSkill(s)}>
                {s}
              </Chip>
            ))}
            {skills.length > SKILL_LIMIT && (
              <button
                type="button"
                onClick={() => setExpanded((e) => !e)}
                aria-expanded={expanded}
                className="rounded-pill px-3 py-2 text-sm font-medium text-a1-text underline-offset-4 hover:underline"
              >
                {expanded ? 'Show fewer' : `Show all (${skills.length})`}
              </button>
            )}
          </div>
        </div>
      )}

      <div className="flex flex-wrap items-center justify-between gap-3">
        <p role="status" aria-live="polite" className="label-mono">
          Showing {resultCount} of {total} projects
        </p>
        {hasFilters && (
          <button
            type="button"
            onClick={onClear}
            className="rounded-pill px-3 py-2 text-sm font-medium text-a1-text underline-offset-4 hover:underline"
          >
            Clear all filters
          </button>
        )}
      </div>
    </div>
  );
}