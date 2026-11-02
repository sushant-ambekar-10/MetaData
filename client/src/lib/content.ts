import { useQuery } from '@tanstack/react-query';
import { api, ApiError } from '@/lib/api';
import { useSlow } from '@/hooks/useSlow';
import fallbackJson from '@/data/fallback.json';
import type { Experience, FallbackData, Profile, Project, Stat } from '@/lib/types';

// Bundled snapshot of the seed data. Used whenever the API is slow or down.
export const fallback = fallbackJson as unknown as FallbackData;

const TIMEOUT_MS = 25_000; // free-tier servers can take ~30s to wake; give up after this and use the snapshot

async function fetchWithTimeout<T>(path: string, outer?: AbortSignal): Promise<T> {
  const ctrl = new AbortController();
  const timer = window.setTimeout(() => ctrl.abort(), TIMEOUT_MS);
  const onAbort = () => ctrl.abort();
  outer?.addEventListener('abort', onAbort, { once: true });
  try {
    return await api<T>(path, { signal: ctrl.signal });
  } catch (err) {
    if ((err as Error).name === 'AbortError' && !outer?.aborted) {
      throw new ApiError(0, 'TIMEOUT', 'The server took too long to respond');
    }
    throw err;
  } finally {
    window.clearTimeout(timer);
    outer?.removeEventListener('abort', onAbort);
  }
}

interface Options<T> {
  key: string;
  path: string;
  fallback: T;
  /** true: render the snapshot immediately and upgrade when the API answers. false: show a loading state first. */
  instant?: boolean;
}

export function useContent<T>({ key, path, fallback: fb, instant = false }: Options<T>) {
  const query = useQuery({
    queryKey: ['content', key],
    queryFn: ({ signal }) => fetchWithTimeout<T>(path, signal),
    retry: false,
  });

  const data: T | undefined = query.data ?? (instant || query.isError ? fb : undefined);
  const loading = data === undefined;
  const slow = useSlow(loading);

  return { data, loading, slow, fromFallback: query.isError, refetch: query.refetch };
}

// ---- Instant hooks (always return data) ----
export function useProfile(): Profile {
  const { data } = useContent<Profile>({ key: 'profile', path: '/profile', fallback: fallback.profile, instant: true });
  return data ?? fallback.profile;
}

export function useStats(): Stat[] {
  const { data } = useContent<Stat[]>({ key: 'stats', path: '/stats', fallback: fallback.stats, instant: true });
  return data ?? fallback.stats;
}

export function useExperience(): Experience[] {
  const { data } = useContent<Experience[]>({
    key: 'experience',
    path: '/experience',
    fallback: fallback.experience,
    instant: true,
  });
  return data ?? fallback.experience;
}

// ---- Projects: one cached request shared by Home, the list and the detail page ----
export function useProjects(instant = false) {
  return useContent<Project[]>({ key: 'projects', path: '/projects', fallback: fallback.projects, instant });
}