import { routing } from "@/i18n/routing";

const SITE_URL = "https://bulgarian-tourism.vercel.app";

/**
 * Generate hreflang alternates for a given path.
 * Used in generateMetadata() to produce <link rel="alternate" hreflang="..."> tags.
 */
export const getAlternates = (locale: string, path: string) => ({
  canonical: `${SITE_URL}/${locale}${path}`,
  languages: Object.fromEntries(
    routing.locales.map((l) => [l, `${SITE_URL}/${l}${path}`])
  ),
});
