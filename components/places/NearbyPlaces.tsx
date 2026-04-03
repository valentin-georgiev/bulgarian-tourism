import PlaceCard from "@/components/places/PlaceCard";
import type { Category, NearbyPlace } from "@/types/place";

type Props = {
  places: (NearbyPlace & { name_bg?: string | null; region_bg?: string | null })[];
  categoryLabels: Record<Category, string>;
  locale: string;
  heading: string;
  emptyMessage: string;
  distanceLabel: (distance: string) => string;
};

export default function NearbyPlaces({
  places,
  categoryLabels,
  locale,
  heading,
  emptyMessage,
  distanceLabel,
}: Props) {
  if (places.length === 0) {
    return (
      <div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-slate-100 mb-6">{heading}</h2>
        <p className="text-gray-500 dark:text-slate-400">{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-900 dark:text-slate-100 mb-6">{heading}</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {places.map((place) => {
          const km = (place.distance_m / 1000).toFixed(1);
          const displayName = locale === "bg" && place.name_bg ? place.name_bg : place.name;

          return (
            <div key={place.id} className="flex flex-col gap-1">
              <PlaceCard
                slug={place.slug}
                name={displayName}
                category={place.category}
                categoryLabel={categoryLabels[place.category]}
                region={place.region}
                image_url={place.image_url}
                locale={locale}
              />
              <p className="text-xs text-gray-500 dark:text-slate-400 text-center mt-1">
                {distanceLabel(km)}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
