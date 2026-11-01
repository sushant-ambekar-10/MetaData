import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from 'react';

// "ready" = the preloader is done (or was skipped / already seen this session).
// Hero animations wait for it so they play as the wipe reveals the page.
const KEY = 'preloader-seen';

const shouldSkip = () => {
  try {
    if (sessionStorage.getItem(KEY) === '1') return true;
  } catch {
    /* ignore */
  }
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
};

interface ReadyValue {
  ready: boolean;
  finish: () => void;
}

const ReadyContext = createContext<ReadyValue>({ ready: true, finish: () => {} });

export function ReadyProvider({ children }: { children: ReactNode }) {
  const [ready, setReady] = useState(shouldSkip);

  const finish = useCallback(() => {
    try {
      sessionStorage.setItem(KEY, '1');
    } catch {
      /* ignore */
    }
    setReady(true);
  }, []);

  const value = useMemo(() => ({ ready, finish }), [ready, finish]);
  return <ReadyContext.Provider value={value}>{children}</ReadyContext.Provider>;
}

export const useReady = () => useContext(ReadyContext);