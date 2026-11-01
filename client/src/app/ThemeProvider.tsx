import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';

export type Theme = 'light' | 'dark';

const STORAGE_KEY = 'theme';
// Mirrors --bg in styles/tokens.css (colours the browser UI on mobile)
const THEME_COLOR: Record<Theme, string> = { dark: '#070A13', light: '#F6F4EE' };

interface ThemeContextValue {
  theme: Theme;
  setTheme: (t: Theme) => void;
  toggle: () => void;
}

const ThemeContext = createContext<ThemeContextValue | null>(null);

const readStored = (): Theme | null => {
  try {
    const v = localStorage.getItem(STORAGE_KEY);
    return v === 'light' || v === 'dark' ? v : null;
  } catch {
    return null;
  }
};

export function ThemeProvider({ children }: { children: ReactNode }) {
  // index.html already set data-theme before first paint; start from it.
  const [theme, setThemeState] = useState<Theme>(() =>
    document.documentElement.dataset.theme === 'light' ? 'light' : 'dark'
  );
  const [explicit, setExplicit] = useState(() => readStored() !== null);

  useEffect(() => {
    const root = document.documentElement;
    root.dataset.theme = theme;
    root.style.colorScheme = theme;
    document.querySelector('meta[name="theme-color"]')?.setAttribute('content', THEME_COLOR[theme]);
  }, [theme]);

  // Until the visitor picks a theme, follow the OS setting live
  useEffect(() => {
    if (explicit) return;
    const mq = window.matchMedia('(prefers-color-scheme: light)');
    const onChange = (e: MediaQueryListEvent) => setThemeState(e.matches ? 'light' : 'dark');
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, [explicit]);

  const setTheme = useCallback((t: Theme) => {
    setThemeState(t);
    setExplicit(true);
    try {
      localStorage.setItem(STORAGE_KEY, t);
    } catch {
      /* private mode: choice just won't persist */
    }
  }, []);

  const toggle = useCallback(() => setTheme(theme === 'dark' ? 'light' : 'dark'), [setTheme, theme]);

  const value = useMemo(() => ({ theme, setTheme, toggle }), [theme, setTheme, toggle]);
  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useTheme must be used inside <ThemeProvider>');
  return ctx;
}