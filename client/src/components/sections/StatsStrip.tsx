import { Container } from '@/components/ui/Container';
import { TiltCard } from '@/components/ui/TiltCard';
import { Counter } from '@/components/motion/Counter';
import { Stagger, StaggerItem } from '@/components/motion/Reveal';
import { useStats } from '@/lib/content';
import type { Stat } from '@/lib/types';
import { cn } from '@/lib/utils';

function StatCard({ stat }: { stat: Stat }) {
  const body = (
    <>
      <p className="text-gradient font-heading text-display-md font-bold">
        <Counter value={stat.value} suffix={stat.suffix} decimals={stat.decimals} />
      </p>
      <p className="mt-2 text-sm text-muted">{stat.label}</p>
    </>
  );

  return (
    <TiltCard className="bento h-full" max={5}>
      {stat.url ? (
        <a href={stat.url} target="_blank" rel="noopener noreferrer" className="block h-full p-5 sm:p-6">
          {body}
          <span className="sr-only"> (opens in a new tab)</span>
        </a>
      ) : (
        <div className="h-full p-5 sm:p-6">{body}</div>
      )}
    </TiltCard>
  );
}

export function StatsStrip() {
  const stats = useStats();

  return (
    <section aria-label="Highlights" className="py-12">
      <Container>
        <Stagger className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-5">
          {stats.map((s, i) => (
            <StaggerItem
              key={s.id}
              className={cn(i === stats.length - 1 && stats.length % 2 === 1 && 'col-span-2 lg:col-span-1')}
            >
              <StatCard stat={s} />
            </StaggerItem>
          ))}
        </Stagger>
      </Container>
    </section>
  );
}