import { Suspense, lazy, type ReactNode } from 'react';
import { Route, Routes, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { PageTransition } from '@/components/motion/PageTransition';
import { Container } from '@/components/ui/Container';
import { Skeleton } from '@/components/ui/Skeleton';

const Home = lazy(() => import('@/pages/Home'));
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

// Later phases replace each <Placeholder> with the real page component.
export function AnimatedRoutes() {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait" initial={false}>
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<Page><Home /></Page>} />
        <Route
          path="/projects"
          element={<Page><Placeholder title="Projects" phase={3} description="Searchable, filterable project cards from the API." /></Page>}
        />
        <Route
          path="/projects/:slug"
          element={<Page><Placeholder title="Project" phase={3} description="Project detail page with gallery and next/previous." /></Page>}
        />
        <Route
          path="/metadata"
          element={<Page><Placeholder title="Me-taData" phase={4} description="The interactive orbit explorer for personal details, skills and more." /></Page>}
        />
        <Route
          path="/experience"
          element={<Page><Placeholder title="Experience" phase={4} description="Vertical animated timeline of internships and leadership." /></Page>}
        />
        <Route
          path="/social"
          element={<Page><Placeholder title="Contact" phase={4} description="Social cards and the working contact form." /></Page>}
        />
        <Route
          path="/resume"
          element={<Page><Placeholder title="Resume" phase={4} description="Responsive web resume with print stylesheet and PDF download." /></Page>}
        />
        <Route
          path="/admin/*"
          element={<Page><Placeholder title="Admin" phase={5} description="Secure CMS with login, CRUD and image uploads." /></Page>}
        />
        <Route path="*" element={<Page><NotFound /></Page>} />
      </Routes>
    </AnimatePresence>
  );
}