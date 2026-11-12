import type { MDXComponents } from "mdx/types";

/**
 * Global styles for MDX blog posts. Uses the same tokens as the rest of the site.
 * Required by @next/mdx in the App Router.
 */
const components: MDXComponents = {
  h2: (props) => (
    <h2 className="mt-14 mb-4 text-3xl font-light tracking-tight text-fg" {...props} />
  ),
  h3: (props) => (
    <h3 className="mt-10 mb-3 text-2xl font-light tracking-tight text-fg" {...props} />
  ),
  p: (props) => <p className="my-5 leading-8 text-fg/85" {...props} />,
  a: (props) => (
    <a
      className="text-blue underline decoration-line underline-offset-4 hover:decoration-blue"
      {...props}
    />
  ),
  ul: (props) => <ul className="my-5 list-disc space-y-2 pl-6 text-fg/85" {...props} />,
  ol: (props) => <ol className="my-5 list-decimal space-y-2 pl-6 text-fg/85" {...props} />,
  blockquote: (props) => (
    <blockquote
      className="my-8 border-l-2 border-gold pl-5 text-xl font-light tracking-tight text-fg"
      {...props}
    />
  ),
  code: (props) => (
    <code className="rounded bg-surface px-1.5 py-0.5 font-mono text-[0.9em] text-fg" {...props} />
  ),
  pre: (props) => (
    <pre
      className="my-6 overflow-x-auto rounded-xl border border-line bg-surface p-5 font-mono text-sm leading-6"
      {...props}
    />
  ),
  hr: () => <hr className="my-12 border-line" />,
};

export function useMDXComponents(): MDXComponents {
  return components;
}
