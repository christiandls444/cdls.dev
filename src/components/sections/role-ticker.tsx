"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

/** Time from a role starting to write in until it starts to fade out. */
const HOLD_MS = 3400;
/** Fade-out: per-letter stagger + one letter's duration (match globals.css). */
const OUT_STAGGER_MS = 30;
const OUT_MS = 480;

type Phase = "idle" | "in" | "out";

/** Shuffled copy; never starts with `avoid`, so a role never shows twice in a row. */
function shuffle(items: string[], avoid: string): string[] {
  const a = [...items];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  if (a.length > 1 && a[0] === avoid) [a[0], a[1]] = [a[1], a[0]];
  return a;
}

/**
 * Large role line for the hero's open top area. Always on, cycling through the
 * shuffled roles (random first, then every role once before any repeats). Each
 * role fades out letter by letter and the next writes in the same way, the motion
 * the name uses after the intro. In between, the letters drift in a slow wave, as if it's thinking.
 * Decorative (aria-hidden): the heading carries the name.
 */
export function RoleTicker({ roles, className }: { roles: string[]; className?: string }) {
  // Starts empty: the first role is picked at random on the client, so every load
  // (new session or refresh) opens on a different one.
  const [role, setRole] = useState("");
  const [phase, setPhase] = useState<Phase>("idle");

  useEffect(() => {
    let queue: string[] = [];
    let last = "";
    let timer: ReturnType<typeof setTimeout>;

    const writeNext = () => {
      if (queue.length === 0) queue = shuffle(roles, last);
      last = queue.shift() ?? last;
      setRole(last);
      setPhase("in");
      if (roles.length > 1) timer = setTimeout(fadeOut, HOLD_MS);
    };
    const fadeOut = () => {
      setPhase("out");
      timer = setTimeout(writeNext, (last.length - 1) * OUT_STAGGER_MS + OUT_MS);
    };

    timer = setTimeout(writeNext, 0);
    return () => clearTimeout(timer);
  }, [roles]);

  return (
    <p aria-hidden data-phase={phase} className={cn("role-ticker", className)}>
      {/* Non-breaking space holds the line height until the first role arrives. */}
      {role === ""
        ? "\u00a0"
        : [...role].map((ch, i) => (
            <span
              key={`${role}-${i}`}
              className="role-ticker__letter"
              style={{ "--n": i } as React.CSSProperties}
            >
              <span className="think">{ch}</span>
            </span>
          ))}
    </p>
  );
}
