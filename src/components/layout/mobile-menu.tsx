"use client";

import { Menu, X } from "lucide-react";
import { useEffect, useId, useRef, useState } from "react";

/**
 * Hamburger toggle for small screens. Only owns open/close state; the links are
 * server-rendered and passed in as children (icons can't cross the server/client
 * boundary as props). Closes on Escape, on a link click, or on a click outside.
 */
export function MobileMenu({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  const panelId = useId();
  const panelRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;

    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return;
      setOpen(false);
      buttonRef.current?.focus();
    };
    const onClick = (e: MouseEvent) => {
      const target = e.target as Element;
      if (buttonRef.current?.contains(target)) return;
      const insidePanel = panelRef.current?.contains(target);
      if (!insidePanel || target.closest("a")) setOpen(false);
    };

    document.addEventListener("keydown", onKey);
    document.addEventListener("click", onClick);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("click", onClick);
    };
  }, [open]);

  const Glyph = open ? X : Menu;

  return (
    <div className="sm:hidden">
      <button
        ref={buttonRef}
        type="button"
        aria-expanded={open}
        aria-controls={panelId}
        aria-label={open ? "Close menu" : "Open menu"}
        onClick={() => setOpen((v) => !v)}
        className="grid size-10 place-items-center rounded-full text-fg transition-colors hover:bg-gold-soft hover:text-gold"
      >
        <Glyph className="size-5" strokeWidth={1.5} aria-hidden />
      </button>

      <div
        ref={panelRef}
        id={panelId}
        hidden={!open}
        className="absolute inset-x-0 top-full border-b border-line bg-bg px-6 pt-4 pb-6 shadow-sm"
      >
        {children}
      </div>
    </div>
  );
}
