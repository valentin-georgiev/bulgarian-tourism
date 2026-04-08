import type { PlaceGridProps } from "@/types/components";
import PlaceCard from "./PlaceCard";

const PlaceGrid = ({ places, categoryLabels, locale, emptyMessage }: PlaceGridProps) => {
  if (places.length === 0) {
    return <p className="text-center text-gray-500 dark:text-slate-400 py-16">{emptyMessage}</p>;
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {places.map((place, i) => (
        <div
          key={place.id}
          className={`animate-fade-in ${i < 12 ? `stagger-${i + 1}` : "stagger-12"}`}
        >
          <PlaceCard
            slug={place.slug}
            name={place.name}
            category={place.category}
            categoryLabel={categoryLabels[place.category]}
            region={locale === "bg" && place.region_bg ? place.region_bg : place.region}
            image_url={place.image_url}
            locale={locale}
          />
        </div>
      ))}
    </div>
  );
};

export default PlaceGrid;
