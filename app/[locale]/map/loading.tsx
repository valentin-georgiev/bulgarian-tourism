const MapLoading = () => (
  <div className="relative w-full h-[calc(100vh-4rem)]">
    <div className="absolute inset-0 skeleton-shimmer flex items-center justify-center">
      <p className="text-gray-400 dark:text-slate-500 text-sm">Loading map...</p>
    </div>
  </div>
);

export default MapLoading;
