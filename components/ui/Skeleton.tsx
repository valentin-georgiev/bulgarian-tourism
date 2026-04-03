/**
 * Loading skeleton components matching PlaceCard dimensions.
 */

export function SkeletonCard() {
  return (
    <div className="rounded-2xl overflow-hidden border border-gray-100 dark:border-slate-700 bg-white dark:bg-slate-800">
      {/* Image placeholder */}
      <div className="h-44 skeleton-shimmer" />
      {/* Text placeholders */}
      <div className="p-4 space-y-2">
        <div className="h-4 w-3/4 rounded skeleton-shimmer" />
        <div className="h-3 w-1/2 rounded skeleton-shimmer" />
      </div>
    </div>
  );
}

export function SkeletonText({ className = "" }: { className?: string }) {
  return <div className={`h-4 rounded skeleton-shimmer ${className}`} />;
}

export function SkeletonGrid({ count = 8 }: { count?: number }) {
  /* eslint-disable react/no-array-index-key -- static placeholder items have no stable ID */
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {Array.from({ length: count }).map((_, i) => (
        <SkeletonCard key={i} />
      ))}
    </div>
  );
  /* eslint-enable react/no-array-index-key */
}
