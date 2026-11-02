const MONTH_YEAR = new Intl.DateTimeFormat('en-US', { month: 'short', year: 'numeric', timeZone: 'UTC' });

export function formatMonthYear(iso?: string | null): string {
  if (!iso) return '';
  const d = new Date(iso);
  return Number.isNaN(d.getTime()) ? '' : MONTH_YEAR.format(d);
}

export function formatRange(start?: string | null, end?: string | null, current?: boolean): string {
  const s = formatMonthYear(start);
  const e = current || !end ? 'Present' : formatMonthYear(end);
  return s ? `${s} - ${e}` : e;
}

// "https://github.com/sushant-ambekar-10" -> "sushant-ambekar-10"
export function handleFromUrl(url?: string): string {
  if (!url) return '';
  try {
    const u = new URL(url);
    const parts = u.pathname.split('/').filter(Boolean);
    return parts[parts.length - 1] ?? u.hostname;
  } catch {
    return url;
  }
}

export const initials = (name: string) =>
  name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0])
    .join('')
    .toUpperCase();

// Small stable hash so a project always gets the same placeholder gradient
export function hash(s: string): number {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) | 0;
  return Math.abs(h);
}