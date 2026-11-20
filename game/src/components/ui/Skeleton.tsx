/** Placeholder blocks shown while the player's data loads. */
const Skeleton = ({ className = "" }: { className?: string }) => (
  <div
    aria-hidden
    className={`animate-pulse rounded-lg border border-line bg-panel ${className}`}
  />
);

export const PageSkeleton = () => (
  <div role="status" aria-live="polite" className="flex flex-col gap-4">
    <span className="sr-only">Loading...</span>
    <Skeleton className="h-8 w-48" />
    <div className="grid gap-4 lg:grid-cols-2">
      <Skeleton className="h-40" />
      <Skeleton className="h-40" />
    </div>
    <Skeleton className="h-64" />
  </div>
);

export default Skeleton;
