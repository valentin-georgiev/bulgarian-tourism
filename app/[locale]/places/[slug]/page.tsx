import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { getTranslations } from "next-intl/server";
import { ArrowLeft, MapPin, MountainSnow, Compass } from "lucide-react";
import { createServerClient } from "@/lib/supabase/server";
import { routing } from "@/i18n/routing";
import { ALL_CATEGORIES } from "@/constants/categories";
import Badge from "@/components/ui/Badge";
import NearbyPlaces from "@/components/places/NearbyPlaces";
import type { Metadata } from "next";
import type { Category, NearbyPlace } from "@/types/place";

/* ---------- types ---------- */

type Props = {
  params: Promise<{ locale: string; slug: string }>;
};

/* ---------- static generation ---------- */

export async function generateStaticParams() {
  const supabase = createServerClient();
  const { data } = await supabase.from("places").select("slug");

  if (!data) return [];

  // Only return the slug segment — the parent layout handles locale
  return data.map((row) => ({ slug: row.slug }));
}

/* ---------- metadata ---------- */

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, slug } = await params;
  const supabase = createServerClient();

  const { data: place } = await supabase
    .from("places")
    .select("name, name_bg, description, description_bg, image_url, category")
    .eq("slug", slug)
    .single();

  if (!place) return { title: "Not Found" };

  const name = locale === "bg" && place.name_bg ? place.name_bg : place.name;
  const description =
    locale === "bg" && place.description_bg ? place.description_bg : place.description;

  return {
    title: name,
    description: description?.slice(0, 160) ?? undefined,
    openGraph: place.image_url ? { images: [place.image_url] } : undefined,
  };
}

/* ---------- helpers ---------- */

const parseLocation = (location: string): { lat: number; lng: number } | null => {
  // Supabase returns geography as GeoJSON: {"type":"Point","coordinates":[lng,lat]}
  try {
    const geo = JSON.parse(location);
    if (geo?.type === "Point" && Array.isArray(geo.coordinates)) {
      return { lat: geo.coordinates[1], lng: geo.coordinates[0] };
    }
  } catch {
    // Try WKT format: POINT(lng lat)
    const match = location.match(/POINT\(([^ ]+) ([^ ]+)\)/);
    if (match) {
      return { lat: parseFloat(match[2]), lng: parseFloat(match[1]) };
    }
  }
  return null;
};

/* ---------- page ---------- */

export default async function PlaceDetailPage({ params }: Props) {
  const { locale, slug } = await params;

  if (!routing.locales.includes(locale as "en" | "bg")) {
    notFound();
  }

  const t = await getTranslations("places");
  const tc = await getTranslations("categories");

  const categoryLabels = Object.fromEntries(ALL_CATEGORIES.map((c) => [c, tc(c)])) as Record<
    Category,
    string
  >;

  const supabase = createServerClient();

  /* --- fetch place --- */
  const { data: row } = await supabase
    .from("places")
    .select(
      "id, osm_id, name, name_bg, slug, category, region, region_bg, description, description_bg, image_url, location, elevation_m"
    )
    .eq("slug", slug)
    .single();

  if (!row) notFound();

  const coords = parseLocation(row.location as string);
  const category = row.category as Category;
  const name = locale === "bg" && row.name_bg ? row.name_bg : row.name;
  const description = locale === "bg" && row.description_bg ? row.description_bg : row.description;
  const region = locale === "bg" && row.region_bg ? row.region_bg : row.region;

  /* --- fetch nearby places --- */
  const { data: nearbyRows } = await supabase.rpc("nearby_places", {
    place_id: row.id,
    radius_m: 50000,
    max_results: 4,
  });

  const nearby: (NearbyPlace & {
    name_bg?: string | null;
    region_bg?: string | null;
  })[] = (nearbyRows ?? []).map(
    (n: {
      id: string;
      name: string;
      name_bg: string | null;
      slug: string;
      category: string;
      image_url: string | null;
      region: string | null;
      region_bg: string | null;
      distance_m: number;
    }) => ({
      ...n,
      category: n.category as Category,
    })
  );

  /* --- OpenStreetMap static map tile URL (zoom 13) --- */
  const osmUrl = coords
    ? `https://www.openstreetmap.org/?mlat=${coords.lat}&mlon=${coords.lng}#map=13/${coords.lat}/${coords.lng}`
    : null;

  const staticMapUrl = coords
    ? `https://staticmap.openstreetmap.de/staticmap.php?center=${coords.lat},${coords.lng}&zoom=12&size=600x300&maptype=mapnik&markers=${coords.lat},${coords.lng},red-pushpin`
    : null;

  return (
    <article>
      {/* ---- Hero ---- */}
      <section className="relative h-64 sm:h-80 lg:h-96 bg-gradient-to-br from-green-800 via-green-700 to-emerald-600">
        {row.image_url ? (
          <Image
            src={row.image_url}
            alt={name}
            fill
            priority
            className="object-cover"
            sizes="100vw"
          />
        ) : null}
        {/* dark overlay for text readability */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />

        <div className="absolute inset-0 flex flex-col justify-end max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-8">
          <div className="flex items-center gap-3 mb-3">
            <Badge category={category} label={categoryLabels[category]} />
            {region && (
              <span className="flex items-center gap-1 text-sm text-white/80">
                <MapPin className="w-3.5 h-3.5" />
                {region}
              </span>
            )}
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white tracking-tight">
            {name}
          </h1>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">
        {/* ---- Back link ---- */}
        <Link
          href={`/${locale}/places`}
          className="inline-flex items-center gap-1.5 text-sm font-medium text-green-700 dark:text-green-400 hover:text-green-800 dark:hover:text-green-300 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          {t("back_to_places")}
        </Link>

        {/* ---- Info bar ---- */}
        <div className="flex flex-wrap gap-6 text-sm text-gray-600 dark:text-slate-400">
          {row.elevation_m != null && (
            <span className="flex items-center gap-1.5">
              <MountainSnow className="w-4 h-4 text-gray-400 dark:text-slate-500" />
              {t("elevation")}: {row.elevation_m.toLocaleString()} {t("meters")}
            </span>
          )}
          {coords && (
            <span className="flex items-center gap-1.5">
              <Compass className="w-4 h-4 text-gray-400 dark:text-slate-500" />
              {t("coordinates")}: {coords.lat.toFixed(5)}, {coords.lng.toFixed(5)}
            </span>
          )}
          {osmUrl && (
            <a
              href={osmUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 text-green-700 dark:text-green-400 hover:text-green-800 dark:hover:text-green-300 transition-colors"
            >
              <MapPin className="w-4 h-4" />
              {t("view_on_osm")}
            </a>
          )}
        </div>

        {/* ---- Description + Map grid ---- */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* Description */}
          <div className="lg:col-span-2">
            {description ? (
              <p className="text-gray-700 dark:text-slate-300 leading-relaxed whitespace-pre-line">
                {description}
              </p>
            ) : (
              <p className="text-gray-400 dark:text-slate-500 italic">{t("no_description")}</p>
            )}
          </div>

          {/* Mini map */}
          {staticMapUrl && osmUrl && (
            <div className="lg:col-span-1">
              <a
                href={osmUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="block rounded-xl overflow-hidden border border-gray-200 dark:border-slate-700 shadow-sm hover:shadow-md transition-shadow"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={staticMapUrl}
                  alt={`${name} — ${t("view_on_map")}`}
                  className="w-full h-auto"
                  loading="lazy"
                />
                <span className="block px-3 py-2 text-xs text-center text-gray-500 dark:text-slate-400 dark:bg-slate-800">
                  {t("view_on_osm")} →
                </span>
              </a>
            </div>
          )}
        </div>

        {/* ---- Nearby places ---- */}
        <NearbyPlaces
          places={nearby}
          categoryLabels={categoryLabels}
          locale={locale}
          heading={t("nearby")}
          emptyMessage={t("nearby_empty")}
          distanceLabel={(distance) => t("km_away", { distance })}
        />
      </div>
    </article>
  );
}
