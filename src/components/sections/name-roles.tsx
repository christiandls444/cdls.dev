"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";

const HOLD_MS = 2000;

function shuffle<T>(items: T[], avoidFirst?: T): T[] {
  const a = [...items];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  if (a.length > 1 && a[0] === avoidFirst) [a[0], a[1]] = [a[1], a[0]];
  return a;
}

/**
 * The hero name stays still. Hover (desktop) or tap (touch) shows a small pill
 * that cycles through shuffled roles every 2s with a slide-up. Desktop: pill sits
 * to the right of the first line. Phones: in the gap under the name.
 * The pill is decorative (aria-hidden); the heading is always the real name.
 */
export function NameRoles({
  lines,
  roles,
  className,
}: {
  lines: [string, string];
  roles: string[];
  className?: string;
}) {
  const [open, setOpen] = useState(false);
  const [role, setRole] = useState<string | null>(null);
  const [pos, setPos] = useState<{ left: number; top: number } | null>(null);
  const wrapRef = useRef<HTMLDivElement>(null);
  const h1Ref = useRef<HTMLHeadingElement>(null);
  const line1Ref = useRef<HTMLSpanElement>(null);
  const pillRef = useRef<HTMLDivElement>(null);
  const queue = useRef<string[]>([]);
  const last = useRef<string | undefined>(undefined);

  // Position the pill: right of line 1 on desktop, below the name on phones.
  useLayoutEffect(() => {
    const place = () => {
      const h1 = h1Ref.current;
      const line1 = line1Ref.current;
      const pill = pillRef.current;
      if (!h1 || !line1 || !pill) return;
      const desktop = window.matchMedia("(min-width: 640px)").matches;
      setPos(
        desktop
          ? {
              left: line1.offsetLeft + line1.offsetWidth + 24,
              top: h1.offsetTop + line1.offsetTop + line1.offsetHeight / 2 - pill.offsetHeight / 2,
            }
          : { left: 0, top: h1.offsetTop + h1.offsetHeight + 4 },
      );
    };
    place();
    window.addEventListener("resize", place);
    return () => window.removeEventListener("resize", place);
  }, []);

  // Hover / tap → open (with the first role picked right away); cycle while open.
  useEffect(() => {
    const el = h1Ref.current;
    if (!el || roles.length === 0) return;
    const nextRole = () => {
      if (queue.current.length === 0) queue.current = shuffle(roles, last.current);
      last.current = queue.current.shift();
      return last.current ?? null;
    };
    const show = () => {
      setRole(nextRole());
      setOpen(true);
    };
    const onEnter = (e: PointerEvent) => e.pointerType === "mouse" && show();
    const onLeave = (e: PointerEvent) => e.pointerType === "mouse" && setOpen(false);
    const onTap = (e: PointerEvent) => {
      if (e.pointerType === "mouse") return;
      if (el.dataset.open === "true") setOpen(false);
      else show();
    };
    el.addEventListener("pointerenter", onEnter);
    el.addEventListener("pointerleave", onLeave);
    el.addEventListener("pointerup", onTap);
    return () => {
      el.removeEventListener("pointerenter", onEnter);
      el.removeEventListener("pointerleave", onLeave);
      el.removeEventListener("pointerup", onTap);
    };
  }, [roles]);

  useEffect(() => {
    if (!open) return;
    const id = setInterval(() => {
      if (queue.current.length === 0) queue.current = shuffle(roles, last.current);
      last.current = queue.current.shift();
      setRole(last.current ?? null);
    }, HOLD_MS);
    return () => clearInterval(id);
  }, [open, roles]);

  return (
    <div ref={wrapRef} className="relative">
      <h1 ref={h1Ref} data-open={open} className={className}>
        <span className="block">
          <span ref={line1Ref} className="inline-block">
            {lines[0]}
          </span>
        </span>{" "}
        <span className="block">{lines[1]}</span>
      </h1>

      <div
        ref={pillRef}
        aria-hidden
        data-open={open}
        style={pos ?? undefined}
        className="role-pill pointer-events-none absolute flex h-8 items-center gap-2 rounded-full border border-line bg-bg/70 px-3 font-mono text-xs text-fg backdrop-blur-md"
      >
        <span className="size-1.5 shrink-0 rounded-full bg-gold" />
        <span className="relative h-4 overflow-hidden">
          {role && (
            <span key={role} className="role-pill__word block leading-4 whitespace-nowrap">
              {role}
            </span>
          )}
        </span>
      </div>
    </div>
  );
}
