import type { Post } from "@/types/content";

/**
 * Blog post registry, newest first.
 *
 * To publish a post:
 *   1. Write src/content/posts/<slug>.mdx (body only, start with an intro paragraph).
 *   2. Add an entry here:
 *      {
 *        slug: "<slug>",
 *        title: "Post title",
 *        date: "2026-11-20",
 *        summary: "One line about the post.",
 *        load: () => import("./<slug>.mdx"),
 *      },
 * The list, the post page, the sitemap and the tests pick it up automatically.
 */
export const posts: Post[] = [];

export const sortedPosts = [...posts].sort((a, b) => b.date.localeCompare(a.date));

export const getPost = (slug: string) => posts.find((p) => p.slug === slug);
