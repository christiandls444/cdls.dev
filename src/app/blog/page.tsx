import { ArrowUpRight } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { FadeIn } from "@/components/ui/fade-in";
import { sortedPosts } from "@/content/posts";
import { formatDate } from "@/lib/format";

export const metadata: Metadata = {
  title: "Blog",
  description: "Notes on building LLM systems.",
  alternates: { canonical: "/blog" },
};

export default function BlogPage() {
  return (
    <section className="mx-auto min-h-[70dvh] w-full max-w-5xl px-6 pt-24 pb-28 sm:pt-32">
      <FadeIn>
        <h1 className="text-6xl font-light tracking-[-0.04em] sm:text-7xl">Blog</h1>
      </FadeIn>

      {sortedPosts.length === 0 ? (
        <FadeIn delay={0.1}>
          <p className="mt-8 font-mono text-sm text-muted">
            First posts coming soon<span className="text-gold">.</span>
          </p>
        </FadeIn>
      ) : (
        <FadeIn delay={0.1}>
          <ul className="mt-16 divide-y divide-line border-y border-line">
            {sortedPosts.map((post) => (
              <li key={post.slug}>
                <Link
                  href={`/blog/${post.slug}`}
                  className="group flex flex-col gap-2 py-6 sm:flex-row sm:items-baseline sm:gap-8"
                >
                  <time dateTime={post.date} className="w-28 shrink-0 font-mono text-xs text-muted">
                    {formatDate(post.date)}
                  </time>
                  <div className="flex-1">
                    <p className="text-2xl font-light tracking-tight text-fg transition-colors group-hover:text-gold">
                      {post.title}
                    </p>
                    <p className="mt-1 text-sm text-muted">{post.summary}</p>
                  </div>
                  <ArrowUpRight
                    className="hidden size-5 text-muted transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-blue sm:block"
                    strokeWidth={1.5}
                    aria-hidden
                  />
                </Link>
              </li>
            ))}
          </ul>
        </FadeIn>
      )}
    </section>
  );
}
