import type { Config } from 'tailwindcss';

// Every colour comes from a CSS variable in src/styles/tokens.css.
// To re-theme the site, edit tokens.css only (and this file for type scale / radii).
const rgb = (name: string) => `rgb(var(${name}) / <alpha-value>)`;

export default {
  darkMode: ['selector', '[data-theme="dark"]'],
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    screens: {
      xs: '480px',
      sm: '640px',
      md: '768px',
      lg: '1024px',
      xl: '1280px',
      '2xl': '1536px',
      '3xl': '1920px',
    },
    extend: {
      colors: {
        bg: rgb('--bg'),
        surface: rgb('--surface'),
        'surface-2': rgb('--surface-2'),
        fg: rgb('--fg'),
        muted: rgb('--muted'),
        a1: rgb('--a1'),
        a2: rgb('--a2'),
        a3: rgb('--a3'),
        'a1-text': rgb('--a1-text'),
        'a2-text': rgb('--a2-text'),
        'on-accent': rgb('--on-accent'),
        line: 'var(--border)',
        'line-strong': 'var(--border-strong)',
      },
      borderColor: { DEFAULT: 'var(--border)' },
      fontFamily: {
        sans: ['var(--font-body)'],
        body: ['var(--font-body)'],
        heading: ['var(--font-heading)'],
        mono: ['var(--font-mono)'],
      },
      fontSize: {
        'display-xl': ['clamp(3rem, 9.5vw, 8.5rem)', { lineHeight: '0.95', letterSpacing: '-0.045em' }],
        'display-lg': ['clamp(2.5rem, 6vw, 5rem)', { lineHeight: '1', letterSpacing: '-0.04em' }],
        'display-md': ['clamp(1.75rem, 3.6vw, 3rem)', { lineHeight: '1.08', letterSpacing: '-0.03em' }],
        'display-sm': ['clamp(1.25rem, 2vw, 1.75rem)', { lineHeight: '1.2', letterSpacing: '-0.02em' }],
      },
      borderRadius: { card: '1.5rem', bento: '1.75rem', pill: '9999px' },
      backgroundImage: {
        aurora: 'linear-gradient(120deg, rgb(var(--a1)), rgb(var(--a2)))',
      },
      boxShadow: {
        glow: '0 0 0 1px var(--border-strong), 0 0 48px -12px rgb(var(--a1) / 0.55)',
      },
    },
  },
  plugins: [],
} satisfies Config;