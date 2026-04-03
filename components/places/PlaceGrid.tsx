import PlaceCard from "./PlaceCard";
import type { Category } from "@/types/place";

type PlaceItem = {
  id: string;
  slug: string;
  name: string;
  category: Category;
  region: string | null;
  image_url: string | null;
};

type Props = {
  places: PlaceItem[];
  categoryLabels: Record<Category, string>;
  locale: string;
  emptyMessage: string;
};

export default function PlaceGrid({ places, categoryLabels, locale, emptyMessage }: Props) {
  if (places.length === 0) {
    return <p className="text-center text-gray-500 py-16">{emptyMessage}</p>;
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {places.map((place) => (
        <PlaceCard
          key={place.id}
          slug={place.slug}
          name={place.name}
          category={place.category}
          categoryLabel={categoryLabels[place.category]}
          region={place.region}
          image_url={place.image_url}
          locale={locale}
        />
      ))}
    </div>
  );
}
