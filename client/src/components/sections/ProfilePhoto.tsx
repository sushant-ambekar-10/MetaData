import { useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { initials } from '@/lib/format';

// Portrait inside a slowly rotating gradient frame.
// Put your photo at client/public/profile.webp (about 640x800). Until then an initials badge is shown.
export function ProfilePhoto({ name }: { name: string }) {
  const [failed, setFailed] = useState(false);
  const reduce = useReducedMotion();

  return (
    <div className="relative mx-auto aspect-[4/5] w-56 sm:w-64 lg:w-full lg:max-w-sm">
      <div aria-hidden="true" className="absolute -inset-[3px] overflow-hidden rounded-[2.1rem] shadow-glow">
        <motion.div
          className="absolute"
          style={{
            left: '-40%',
            top: '-22%',
            width: '180%',
            aspectRatio: '1 / 1',
            background:
              'conic-gradient(from 0deg, rgb(var(--a1)), rgb(var(--a2)), rgb(var(--a3)), rgb(var(--a1)))',
          }}
          animate={reduce ? undefined : { rotate: 360 }}
          transition={{ duration: 16, repeat: Infinity, ease: 'linear' }}
        />
      </div>

      <div className="absolute inset-0 overflow-hidden rounded-[2rem] bg-surface-2">
        {failed ? (
          <div
            role="img"
            aria-label={`Portrait placeholder for ${name}`}
            className="grid h-full w-full place-items-center bg-gradient-to-br from-a1/30 to-a2/20"
          >
            <span className="text-gradient font-heading text-7xl font-bold">{initials(name)}</span>
          </div>
        ) : (
          <img
            src="/profile.webp"
            alt={`Portrait of ${name}`}
            width={640}
            height={800}
            decoding="async"
            onError={() => setFailed(true)}
            className="h-full w-full object-cover"
          />
        )}
      </div>
    </div>
  );
}