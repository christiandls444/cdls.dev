import type { MetadataRoute } from "next";
import { sortedPosts } from "@/content/posts";
import { site } from "@/content/site";

/** Add new routes here when pages are added. Blog posts are included automatically. */
export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: site.url, changeFrequency: "monthly", priority: 1 },
    { url: `${site.url}/blog`, changeFrequency: "weekly", priority: 0.7 },
    ...sortedPosts.map((post) => ({
      url: `${site.url}/blog/${post.slug}`,
      lastModified: post.date,
      changeFrequency: "yearly" as const,
      priority: 0.6,
    })),
  ];
}
