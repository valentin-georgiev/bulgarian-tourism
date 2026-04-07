import { getTranslations } from "next-intl/server";
import { createServerClient } from "@/lib/supabase/server";
import { parseWkbPoint } from "@/lib/parseWkb";
import { ALL_CATEGORIES } from "@/constants/categories";
import { getAlternates } from "@/lib/seo";
import type { Metadata } from "next";
import type { Category } from "@/types/place";
import type { MapPlace } from "@/types/map";
import MapClient from "./MapClient";

type Props = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "map" });
  return { title: t("title"), alternates: getAlternates(locale, "/map") };
}

export default async function MapPage({ params }: Props) {
  const { locale } = await params;

  const t = await getTranslations("map");
  const tc = await getTranslations("categories");
  const tp = await getTranslations("places");

  const categoryLabels = Object.fromEntries(ALL_CATEGORIES.map((c) => [c, tc(c)])) as Record<
    Category,
    string
  >;

  const supabase = createServerClient();

  /* Try RPC first (requires migration 007), fall back to raw select + WKB parse */
  let places: MapPlace[] = [];

  const { data: rpcData, error: rpcError } = await supabase.rpc("get_map_places");

  if (!rpcError && rpcData) {
    places = (rpcData as Record<string, unknown>[]).map((row) => ({
      id: row.id as string,
      name: locale === "bg" && row.name_bg ? (row.name_bg as string) : (row.name as string),
      slug: row.slug as string,
      category: row.category as Category,
      image_url: row.image_url as string | null,
      region:
        locale === "bg" && row.region_bg
          ? (row.region_bg as string)
          : (row.region as string | null),
      description:
        locale === "bg" && row.description_bg
          ? (row.description_bg as string)
          : (row.description as string | null),
      elevation_m: row.elevation_m as number | null,
      lat: row.lat as number,
      lng: row.lng as number,
    }));
  } else {
    /* fallback: fetch raw rows and parse WKB */
    const { data: rawData } = await supabase
      .from("places")
      .select(
        "id, name, name_bg, slug, category, image_url, region, region_bg, description, description_bg, elevation_m, location"
      )
      .not("location", "is", null);

    if (rawData) {
      places = rawData
        .map((row) => {
          const coords = parseWkbPoint(row.location as string);
          if (!coords) return null;
          return {
            id: row.id as string,
            name: locale === "bg" && row.name_bg ? (row.name_bg as string) : (row.name as string),
            slug: row.slug as string,
            category: row.category as Category,
            image_url: row.image_url as string | null,
            region:
              locale === "bg" && row.region_bg
                ? (row.region_bg as string)
                : (row.region as string | null),
            description:
              locale === "bg" && row.description_bg
                ? (row.description_bg as string)
                : (row.description as string | null),
            elevation_m: row.elevation_m as number | null,
            lat: coords.lat,
            lng: coords.lng,
          };
        })
        .filter((p): p is MapPlace => p !== null);
    }
  }

  return (
    <div className="relative w-full" style={{ height: "calc(100vh - 64px)" }}>
      <MapClient
        places={places}
        locale={locale}
        categoryLabels={categoryLabels}
        allLabel={tc("all")}
        viewDetailsLabel={t("view_details")}
        closeLabel={t("close")}
        elevationLabel={tp("elevation")}
        metersLabel={tp("meters")}
      />
    </div>
  );
}
