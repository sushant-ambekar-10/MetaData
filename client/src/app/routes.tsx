import { Suspense, lazy, type ReactNode } from 'react';
import { Route, Routes, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { PageTransition } from '@/components/motion/PageTransition';
import { Container } from '@/components/ui/Container';
import { Skeleton } from '@/components/ui/Skeleton';

const Home = lazy(() => import('@/pages/Home'));
const Projects = lazy(() => import('@/pages/Projects'));
const ProjectDetail = lazy(() => import('@/pages/ProjectDetail'));
const Metadata = lazy(() => import('@/pages/Metadata'));
const Experience = lazy(() => import('@/pages/Experience'));
const Social = lazy(() => import('@/pages/Social'));
const Resume = lazy(() => import('@/pages/Resume'));
const Placeholder = lazy(() => import('@/pages/Placeholder'));
const NotFound = lazy(() => import('@/pages/NotFound'));

function PageFallback() {
  return (
    <Container role="status" aria-label="Loading page" className="pt-40">
      <Skeleton className="h-14 w-2/3" />
      <Skeleton className="mt-6 h-6 w-1/2" />
      <Skeleton className="mt-10 h-64 w-full" />
    </Container>
  );
}

function Page({ children }: { children: ReactNode }) {
  return (
    <PageTransition>
      <Suspense fallback={<PageFallback />}>{children}</Suspense>
    </PageTransition>
  );
}

// Phase 5 replaces the Admin placeholder with the real CMS.
export function AnimatedRoutes() {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait" initial={false}>
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<Page><Home /></Page>} />
        <Route path="/projects" element={<Page><Projects /></Page>} />
        <Route path="/projects/:slug" element={<Page><ProjectDetail /></Page>} />
        <Route path="/metadata" element={<Page><Metadata /></Page>} />
        <Route path="/experience" element={<Page><Experience /></Page>} />
        <Route path="/social" element={<Page><Social /></Page>} />
        <Route path="/resume" element={<Page><Resume /></Page>} />
        <Route
          path="/admin/*"
          element={<Page><Placeholder title="Admin" phase={5} description="Secure CMS with login, CRUD and image uploads." /></Page>}
        />
        <Route path="*" element={<Page><NotFound /></Page>} />
      </Routes>
    </AnimatePresence>
  );
}