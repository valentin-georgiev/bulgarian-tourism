import type { MetadataRoute } from "next";

const SITE_URL = "https://bulgarian-tourism.vercel.app";

const robots = (): MetadataRoute.Robots => ({
  rules: [
    {
      userAgent: "*",
      allow: "/",
      disallow: "/api/",
    },
  ],
  sitemap: `${SITE_URL}/sitemap.xml`,
});

export default robots;
