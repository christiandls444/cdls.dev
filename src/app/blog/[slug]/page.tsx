import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { getPost, posts } from "@/content/posts";
import { formatDate } from "@/lib/format";

/**
 * Cache Components requires at least one param. With no posts yet, a placeholder
 * slug is prerendered and resolves to 404 (see getPost → notFound below).
 */
export function generateStaticParams() {
  return posts.length > 0 ? posts.map(({ slug }) => ({ slug })) : [{ slug: "__placeholder__" }];
}

export async function generateMetadata({ params }: PageProps<"/blog/[slug]">): Promise<Metadata> {
  const post = getPost((await params).slug);
  if (!post) return {};
  return {
    title: post.title,
    description: post.summary,
    alternates: { canonical: `/blog/${post.slug}` },
    openGraph: {
      type: "article",
      title: post.title,
      description: post.summary,
      publishedTime: post.date,
    },
  };
}

export default async function PostPage({ params }: PageProps<"/blog/[slug]">) {
  const post = getPost((await params).slug);
  if (!post) notFound();
  const { default: Body } = await post.load();

  return (
    <article className="mx-auto w-full max-w-2xl px-6 pt-20 pb-28 sm:pt-28">
      <Link
        href="/blog"
        className="group inline-flex items-center gap-2 font-mono text-xs text-muted hover:text-fg"
      >
        <ArrowLeft
          className="size-3.5 transition-transform group-hover:-translate-x-0.5"
          aria-hidden
        />
        Blog
      </Link>
      <time dateTime={post.date} className="mt-12 block font-mono text-xs text-muted">
        {formatDate(post.date)}
      </time>
      <h1 className="mt-3 text-5xl leading-tight font-light tracking-[-0.04em] sm:text-6xl">
        {post.title}
      </h1>
      <div className="mt-10">
        <Body />
      </div>
    </article>
  );
}
