import { site } from "@/content/site";

export function SiteFooter() {
  return (
    <footer className="border-t border-line">
      <div className="mx-auto flex w-full max-w-5xl items-center justify-between px-6 py-8 font-mono text-xs text-muted">
        <span>{site.name}</span>
        <span className="flex items-center gap-2">
          <span className="size-1.5 rounded-full bg-gold" aria-hidden />
          {site.url.replace("https://", "")}
        </span>
      </div>
    </footer>
  );
}
