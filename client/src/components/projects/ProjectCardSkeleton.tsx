import { Skeleton } from '@/components/ui/Skeleton';

export function ProjectCardSkeleton() {
  return (
    <div className="bento overflow-hidden" aria-hidden="true">
      <Skeleton className="aspect-[16/10] !rounded-none" />
      <div className="space-y-3 p-6">
        <Skeleton className="h-3 w-24 !rounded-pill" />
        <Skeleton className="h-6 w-3/4 !rounded-xl" />
        <Skeleton className="h-4 w-full !rounded-lg" />
        <Skeleton className="h-4 w-5/6 !rounded-lg" />
        <div className="flex gap-2 pt-3">
          <Skeleton className="h-6 w-16 !rounded-pill" />
          <Skeleton className="h-6 w-20 !rounded-pill" />
          <Skeleton className="h-6 w-14 !rounded-pill" />
        </div>
      </div>
    </div>
  );
}