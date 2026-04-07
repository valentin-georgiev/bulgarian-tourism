import { Suspense } from "react";
import { getTranslations } from "next-intl/server";
import { createServerClient } from "@/lib/supabase/server";
import { getDistinctRegions } from "@/lib/supabase/queries";
import { ALL_CATEGORIES, PAGE_SIZE } from "@/constants/categories";
import PlaceGrid from "@/components/places/PlaceGrid";
import PlaceFilters from "@/components/places/PlaceFilters";
import { getAlternates } from "@/lib/seo";
import type { Metadata } from "next";
import type { Category } from "@/types/place";

type Props = {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ category?: string; region?: string; page?: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "places" });
  return {
    title: t("title"),
    description:
      locale === "bg"
        ? "Разгледайте планини, езера, пещери, градове и още в цяла България."
        : "Browse mountains, lakes, caves, cities, and more across Bulgaria.",
    alternates: getAlternates(locale, "/places"),
  };
}

export default async function PlacesPage({ params, searchParams }: Props) {
  const { locale } = await params;
  const { category, region, page } = await searchParams;

  const t = await getTranslations("places");
  const tc = await getTranslations("categories");

  const categoryLabels = {
    all: tc("all"),
    ...Object.fromEntries(ALL_CATEGORIES.map((c) => [c, tc(c)])),
  } as Record<"all" | Category, string>;

  const currentPage = Math.max(1, parseInt(page ?? "1", 10));
  const from = (currentPage - 1) * PAGE_SIZE;
  const to = from + PAGE_SIZE - 1;

  const supabase = createServerClient();

  // Build places query with filters
  let placesQuery = supabase
    .from("places")
    .select("id, slug, name, name_bg, category, region, image_url")
    .order("name")
    .range(from, to);

  if (category) placesQuery = placesQuery.eq("category", category);
  if (region) placesQuery = placesQuery.eq("region", region);

  // Fetch places and cached regions in parallel
  const [{ data: places }, regions] = await Promise.all([placesQuery, getDistinctRegions()]);

  const displayPlaces = (places ?? []).map((p) => ({
    ...p,
    name: locale === "bg" && p.name_bg ? p.name_bg : p.name,
    category: p.category as Category,
  }));

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-slate-100 mb-8">{t("title")}</h1>

      <div className="mb-8">
        <Suspense>
          <PlaceFilters
            categoryLabels={categoryLabels}
            allRegionsLabel={t("all_regions")}
            regions={regions}
          />
        </Suspense>
      </div>

      <PlaceGrid
        places={displayPlaces}
        categoryLabels={categoryLabels}
        locale={locale}
        emptyMessage={t("no_results")}
      />

      {/* Pagination */}
      {(places ?? []).length === PAGE_SIZE && (
        <div className="mt-12 flex justify-center">
          <a
            href={`?${new URLSearchParams({ ...(category ? { category } : {}), ...(region ? { region } : {}), page: String(currentPage + 1) })}`}
            className="px-6 py-2 rounded-full bg-green-700 text-white text-sm font-medium hover:bg-green-800 dark:bg-green-600 dark:hover:bg-green-700 transition-colors"
          >
            {t("load_more")}
          </a>
        </div>
      )}
    </div>
  );
}
