import { Suspense } from 'react';
import { getTranslations } from 'next-intl/server';
import { createServerClient } from '@/lib/supabase/server';
import PlaceGrid from '@/components/places/PlaceGrid';
import PlaceFilters from '@/components/places/PlaceFilters';
import type { Category } from '@/types/place';

const PAGE_SIZE = 24;

type Props = {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ category?: string; region?: string; page?: string }>;
};

export default async function PlacesPage({ params, searchParams }: Props) {
  const { locale } = await params;
  const { category, region, page } = await searchParams;

  const t = await getTranslations('places');
  const tc = await getTranslations('categories');

  const categoryLabels: Record<'all' | Category, string> = {
    all:      tc('all'),
    mountain: tc('mountain'),
    lake:     tc('lake'),
    cave:     tc('cave'),
    city:     tc('city'),
    fishing:  tc('fishing'),
    trail:    tc('trail'),
    beach:    tc('beach'),
    museum:   tc('museum'),
    hiking:   tc('hiking'),
  };

  const currentPage = Math.max(1, parseInt(page ?? '1', 10));
  const from = (currentPage - 1) * PAGE_SIZE;
  const to = from + PAGE_SIZE - 1;

  const supabase = createServerClient();

  // Fetch places with filters
  let query = supabase
    .from('places')
    .select('id, slug, name, name_bg, category, region, image_url')
    .order('name')
    .range(from, to);

  if (category) query = query.eq('category', category);
  if (region)   query = query.eq('region', region);

  const { data: places } = await query;

  // Fetch distinct non-null regions for the dropdown
  const { data: regionRows } = await supabase
    .from('places')
    .select('region')
    .not('region', 'is', null)
    .order('region');

  const regions = [...new Set((regionRows ?? []).map((r) => r.region as string))];

  const displayPlaces = (places ?? []).map((p) => ({
    ...p,
    name: locale === 'bg' && p.name_bg ? p.name_bg : p.name,
    category: p.category as Category,
  }));

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">{t('title')}</h1>

      <div className="mb-8">
        <Suspense>
          <PlaceFilters
            categoryLabels={categoryLabels}
            allRegionsLabel={t('all_regions')}
            regions={regions}
          />
        </Suspense>
      </div>

      <PlaceGrid
        places={displayPlaces}
        categoryLabels={categoryLabels}
        locale={locale}
        emptyMessage={t('no_results')}
      />

      {/* Pagination */}
      {(places ?? []).length === PAGE_SIZE && (
        <div className="mt-12 flex justify-center">
          <a
            href={`?${new URLSearchParams({ ...(category ? { category } : {}), ...(region ? { region } : {}), page: String(currentPage + 1) })}`}
            className="px-6 py-2 rounded-full bg-green-700 text-white text-sm font-medium hover:bg-green-800 transition-colors"
          >
            {t('load_more')}
          </a>
        </div>
      )}
    </div>
  );
}
