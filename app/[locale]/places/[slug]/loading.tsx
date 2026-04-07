import { SkeletonText } from "@/components/ui/Skeleton";

export default function PlaceDetailLoading() {
  return (
    <article>
      {/* Hero skeleton */}
      <div className="relative h-64 sm:h-80 lg:h-96 skeleton-shimmer" />

      {/* Content skeleton */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Back link */}
        <SkeletonText className="h-4 w-32 mb-8" />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* Main content */}
          <div className="lg:col-span-2 space-y-4">
            <SkeletonText className="h-6 w-3/4" />
            <SkeletonText className="h-4 w-full" />
            <SkeletonText className="h-4 w-full" />
            <SkeletonText className="h-4 w-2/3" />
          </div>

          {/* Sidebar */}
          <div className="space-y-4">
            <div className="h-48 rounded-xl skeleton-shimmer" />
            <SkeletonText className="h-4 w-1/2" />
            <SkeletonText className="h-4 w-2/3" />
          </div>
        </div>
      </div>
    </article>
  );
}
