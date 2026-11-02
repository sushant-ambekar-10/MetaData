import { useEffect, useState } from 'react';

// Becomes true if `active` stays true for longer than `ms` (used for the "server is waking up" notice).
export function useSlow(active: boolean, ms = 4000) {
  const [slow, setSlow] = useState(false);

  useEffect(() => {
    if (!active) {
      setSlow(false);
      return;
    }
    const t = window.setTimeout(() => setSlow(true), ms);
    return () => window.clearTimeout(t);
  }, [active, ms]);

  return slow;
}