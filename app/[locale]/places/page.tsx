import { Suspense } from "react";
import { getTranslations } from "next-intl/server";
import { createServerClient } from "@/lib/supabase/server";
import { getDistinctRegions } from "@/lib/supabase/queries";
import { ALL_CATEGORIES, VALID_CATEGORIES, PAGE_SIZE } from "@/constants/categories";
import PlaceGrid from "@/components/places/PlaceGrid";
import PlaceFilters from "@/components/places/PlaceFilters";
import Pagination from "@/components/ui/Pagination";
import { getAlternates } from "@/lib/seo";
import type { Metadata } from "next";
import type { Category } from "@/types/place";

type Props = {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ category?: string; region?: string; page?: string }>;
};

export const generateMetadata = async ({ params }: Props): Promise<Metadata> => {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "places" });
  return {
    title: t("title"),
    description:
      locale === "bg"
        ? "Разгледайте планини, езера, пещери, населени места и още в цяла България."
        : "Browse mountains, lakes, caves, settlements, and more across Bulgaria.",
    alternates: getAlternates(locale, "/places"),
  };
};

const PlacesPage = async ({ params, searchParams }: Props) => {
  const { locale } = await params;
  const { category, region, page } = await searchParams;

  const t = await getTranslations("places");
  const tc = await getTranslations("categories");

  const categoryLabels = {
    all: tc("all"),
    ...Object.fromEntries(ALL_CATEGORIES.map((category) => [category, tc(category)])),
  } as Record<"all" | Category, string>;

  const currentPage = Math.max(1, parseInt(page ?? "1", 10));
  const from = (currentPage - 1) * PAGE_SIZE;
  const to = from + PAGE_SIZE - 1;

  const supabase = createServerClient();

  // Build places query with filters
  let placesQuery = supabase
    .from("places")
    .select("id, slug, name, name_bg, category, region, region_bg, image_url", { count: "exact" })
    .order("name")
    .range(from, to);

  const categories = category ? category.split(",").filter((c) => VALID_CATEGORIES.has(c)) : [];
  if (categories.length) placesQuery = placesQuery.in("category", categories);
  if (region) placesQuery = placesQuery.eq("region", region);

  // Fetch places and cached regions in parallel
  const [{ data: places, count }, regions] = await Promise.all([placesQuery, getDistinctRegions()]);
  const totalPages = Math.ceil((count ?? 0) / PAGE_SIZE);

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
            searchRegionLabel={t("search_region")}
            regions={regions}
            locale={locale}
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
      {totalPages > 1 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          baseParams={{
            ...(category ? { category } : {}),
            ...(region ? { region } : {}),
          }}
          labels={{
            previous: t("pagination_previous"),
            next: t("pagination_next"),
            page: t("pagination_page"),
          }}
        />
      )}
    </div>
  );
};

export default PlacesPage;
