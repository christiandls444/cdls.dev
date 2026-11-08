import type { MetadataRoute } from "next";
import { site } from "@/content/site";

/** Only production is indexable. Staging and previews (VERCEL_ENV=preview) block all crawlers. */
const isProduction = process.env.VERCEL_ENV === "production";

export default function robots(): MetadataRoute.Robots {
  if (!isProduction) return { rules: { userAgent: "*", disallow: "/" } };

  return {
    rules: { userAgent: "*", allow: "/" },
    sitemap: `${site.url}/sitemap.xml`,
  };
}
