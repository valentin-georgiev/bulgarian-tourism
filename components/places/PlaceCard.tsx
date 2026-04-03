import Link from 'next/link';
import Image from 'next/image';
import { MapPin } from 'lucide-react';
import Badge from '@/components/ui/Badge';
import type { Category } from '@/types/place';

type Props = {
  slug: string;
  name: string;
  category: Category;
  categoryLabel: string;
  region: string | null;
  image_url: string | null;
  locale: string;
};

export default function PlaceCard({ slug, name, category, categoryLabel, region, image_url, locale }: Props) {
  return (
    <Link
      href={`/${locale}/places/${slug}`}
      className="group flex flex-col rounded-2xl overflow-hidden bg-white border border-gray-100 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all"
    >
      {/* Image */}
      <div className="relative h-44 bg-gray-100">
        {image_url ? (
          <Image
            src={image_url}
            alt={name}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-300 text-4xl select-none">
            🇧🇬
          </div>
        )}
        <div className="absolute top-3 left-3">
          <Badge category={category} label={categoryLabel} />
        </div>
      </div>

      {/* Content */}
      <div className="p-4 flex flex-col gap-1">
        <h3 className="font-semibold text-gray-900 truncate">{name}</h3>
        {region && (
          <p className="flex items-center gap-1 text-xs text-gray-500">
            <MapPin className="w-3 h-3" />
            {region}
          </p>
        )}
      </div>
    </Link>
  );
}
