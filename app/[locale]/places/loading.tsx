import { SkeletonGrid, SkeletonText } from "@/components/ui/Skeleton";

export default function PlacesLoading() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Title skeleton */}
      <SkeletonText className="h-8 w-48 mb-8" />

      {/* Filter bar skeleton */}
      <div className="flex flex-wrap gap-2 mb-8">
        {["filter-1", "filter-2", "filter-3", "filter-4", "filter-5", "filter-6"].map((id) => (
          <div key={id} className="h-9 w-20 rounded-full skeleton-shimmer" />
        ))}
      </div>

      {/* Grid skeleton */}
      <SkeletonGrid count={8} />
    </div>
  );
}
