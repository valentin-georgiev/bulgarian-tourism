import { createServerClient } from "@/lib/supabase/server";
import { routing } from "@/i18n/routing";
import type { MetadataRoute } from "next";

const SITE_URL = process.env.DOMAIN_URL;

const sitemap = async (): Promise<MetadataRoute.Sitemap> => {
  const supabase = createServerClient();
  const { data: places } = await supabase.from("places").select("slug");

  const slugs = (places ?? []).map((p) => p.slug as string);
  const locales = routing.locales;

  const alternatesForLocales = (path: string) => ({
    languages: Object.fromEntries(
      locales.map((locale) => [locale, `${SITE_URL}/${locale}${path}`])
    ),
  });

  /* ─── Static pages ─── */
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: `${SITE_URL}/en`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1.0,
      alternates: alternatesForLocales(""),
    },
    {
      url: `${SITE_URL}/en/places`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.9,
      alternates: alternatesForLocales("/places"),
    },
    {
      url: `${SITE_URL}/en/map`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.8,
      alternates: alternatesForLocales("/map"),
    },
  ];

  /* ─── Place detail pages (both locales via alternates) ─── */
  const placePages: MetadataRoute.Sitemap = slugs.map((slug) => ({
    url: `${SITE_URL}/en/places/${slug}`,
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: 0.7,
    alternates: alternatesForLocales(`/places/${slug}`),
  }));

  return [...staticPages, ...placePages];
};

export default sitemap;
