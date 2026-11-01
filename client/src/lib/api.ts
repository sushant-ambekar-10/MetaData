// Tiny fetch wrapper for the Phase 1 API.
// - Sends cookies (admin session).
// - Adds the X-Requested-With header the server requires on every write.
// - Unwraps { success, data } and throws ApiError with the server's error code.

const BASE = (import.meta.env.VITE_API_URL ?? '/api').replace(/\/$/, '');

export class ApiError extends Error {
  status: number;
  code: string;
  details?: unknown;

  constructor(status: number, code: string, message: string, details?: unknown) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.code = code;
    this.details = details;
  }
}

interface Envelope {
  success?: boolean;
  data?: unknown;
  error?: { code?: string; message?: string; details?: unknown };
}

interface Options {
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE';
  body?: unknown;
  signal?: AbortSignal;
}

export async function api<T = unknown>(path: string, { method = 'GET', body, signal }: Options = {}): Promise<T> {
  const headers: Record<string, string> = { Accept: 'application/json' };
  if (method !== 'GET') headers['X-Requested-With'] = 'portfolio'; // avoids a needless CORS preflight on reads
  if (body !== undefined) headers['Content-Type'] = 'application/json';

  let res: Response;
  try {
    res = await fetch(`${BASE}${path}`, {
      method,
      headers,
      credentials: 'include',
      signal,
      body: body !== undefined ? JSON.stringify(body) : undefined,
    });
  } catch (err) {
    if ((err as Error).name === 'AbortError') throw err;
    throw new ApiError(0, 'NETWORK_ERROR', 'Cannot reach the server');
  }

  let json: Envelope | null = null;
  try {
    json = (await res.json()) as Envelope;
  } catch {
    /* empty or non-JSON body */
  }

  if (!res.ok || json?.success === false) {
    throw new ApiError(
      res.status,
      json?.error?.code ?? 'HTTP_ERROR',
      json?.error?.message ?? `Request failed (${res.status})`,
      json?.error?.details
    );
  }
  return json?.data as T;
}