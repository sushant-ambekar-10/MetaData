import { useState, type ReactNode } from 'react';
import { HelmetProvider } from 'react-helmet-async';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { MotionConfig } from 'framer-motion';
import { ThemeProvider } from './ThemeProvider';
import { ReadyProvider } from './ReadyProvider';
import { SmoothScroll } from './SmoothScroll';

export function Providers({ children }: { children: ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: { staleTime: 5 * 60_000, gcTime: 30 * 60_000, retry: 1, refetchOnWindowFocus: false },
        },
      })
  );

  return (
    <HelmetProvider>
      <QueryClientProvider client={queryClient}>
        {/* reducedMotion="user": transform/layout animations are disabled when the OS asks for it */}
        <MotionConfig reducedMotion="user">
          <ThemeProvider>
            <ReadyProvider>
              <SmoothScroll>{children}</SmoothScroll>
            </ReadyProvider>
          </ThemeProvider>
        </MotionConfig>
      </QueryClientProvider>
    </HelmetProvider>
  );
}