import { Trophy } from 'lucide-react';
import { useAchievements } from '@/lib/content';

export function AchievementsPanel() {
  const items = useAchievements();
  const featured = items.filter((a) => a.featured);
  const rest = items.filter((a) => !a.featured);

  if (!items.length) return <p className="text-muted">Achievements will appear here soon.</p>;

  return (
    <div className="space-y-8">
      {featured.length > 0 && (
        <div>
          <h3 className="label-mono mb-3">Highlights</h3>
          <ul className="grid gap-3 sm:grid-cols-2">
            {featured.map((a) => (
              <li key={a.id} className="flex items-start gap-3 rounded-2xl border border-a1/50 bg-a1/10 p-4">
                <Trophy className="mt-0.5 h-5 w-5 shrink-0 text-a1-text" aria-hidden="true" />
                <span className="text-sm">{a.text}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {rest.length > 0 && (
        <div>
          <h3 className="label-mono mb-3">More milestones</h3>
          <ul className="space-y-2.5">
            {rest.map((a) => (
              <li key={a.id} className="flex items-start gap-3 text-sm">
                <span aria-hidden="true" className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-aurora" />
                <span className="text-muted">{a.text}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}