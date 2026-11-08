import type { MetadataRoute } from "next";
import { site } from "@/content/site";

/** Add new routes here when pages are added. */
export default function sitemap(): MetadataRoute.Sitemap {
  return [{ url: site.url, changeFrequency: "monthly", priority: 1 }];
}
