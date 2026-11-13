"use client";

import { useEffect, useState } from "react";
import { afterIntro } from "@/lib/intro";
import { cn } from "@/lib/utils";

/** Time from a role starting to write in until it starts to fade out. */
const HOLD_MS = 3400;
/** Fade-out: per-letter stagger + one letter's duration (match globals.css). */
const OUT_STAGGER_MS = 30;
const OUT_MS = 480;
/** Trails every role, written in and floating with it ("thinking"). */
const DOTS = "...";
/**
 * Right after the intro exits, the hero still waits ~0.6s before rising in
 * (`.hero-in` delays in globals.css + this line's HeroIn delay in hero.tsx): hold the
 * first role until then so it writes in where it can be seen.
 */
const AFTER_INTRO_MS = 600;
/** Set once the lead role has opened the line in this browser session. */
const LEAD_KEY = "cdls-role-lead";

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

/** True only the first time it's asked in this browser session (blocked storage: never). */
function claimLead(): boolean {
  try {
    if (sessionStorage.getItem(LEAD_KEY)) return false;
    sessionStorage.setItem(LEAD_KEY, "1");
    return true;
  } catch {
    return false;
  }
}

/**
 * Large role line for the hero's open top area. Always on, cycling through the
 * shuffled roles (every role once before any repeats), each followed by "...".
 * The first view in a browser session opens on `lead`; any other load opens on a
 * random role. Each role fades out letter by letter and the next writes in the
 * same way, the motion the name uses after the intro. In between, the letters
 * drift in a slow wave, as if it's thinking. It starts once the intro is out of
 * the way, so the opening role is never spent behind it.
 * Decorative (aria-hidden): the heading carries the name.
 */
export function RoleTicker({
  roles,
  lead,
  className,
}: {
  roles: string[];
  lead?: string;
  className?: string;
}) {
  // Starts empty: the first role is picked on the client (lead or random).
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
      const letters = last.length + DOTS.length;
      timer = setTimeout(writeNext, (letters - 1) * OUT_STAGGER_MS + OUT_MS);
    };

    // The lead is claimed inside the timer, so a cancelled run (React Strict Mode's
    // double effect in dev) never uses it up.
    const start = () => {
      // Lead first, then the other roles shuffled (the lead rejoins from round two).
      if (lead && roles.includes(lead) && claimLead()) {
        const others = roles.filter((r) => r !== lead);
        queue = [lead, ...shuffle(others, "")];
      }
      writeNext();
    };
    const stopWaiting = afterIntro((justExited) => {
      timer = setTimeout(start, justExited ? AFTER_INTRO_MS : 0);
    });
    return () => {
      stopWaiting();
      clearTimeout(timer);
    };
  }, [roles, lead]);

  return (
    <p aria-hidden data-phase={phase} className={cn("role-ticker", className)}>
      {/* Non-breaking space holds the line height until the first role arrives. */}
      {role === ""
        ? "\u00a0"
        : [...role, ...DOTS].map((ch, i) => (
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
