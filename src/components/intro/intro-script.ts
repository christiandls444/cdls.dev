/**
 * Runs inline while the HTML is parsed (serialized with toString, so it must be
 * self-contained: no imports, no outside variables). It decides whether this is a
 * new session and, once the loader's letters have landed, picks the exit:
 *
 * - morph: one by one, each loader letter flies onto the matching initial of the
 *   hero name (C → Christian, M → M., … then the gold dot onto the period). When all
 *   have landed (`data-landed`), CSS writes out the rest of the name. Needs the hero
 *   name on screen.
 * - curtain: any other page, a hero scrolled out of view, or anything unexpected.
 *   A failsafe timer forces it if the loader never reports back, so the page can
 *   never stay hidden.
 *
 * Reduced motion: only `data-show` is set; globals.css fades the loader instead.
 * Selectors and attributes here match intro-loader.tsx, hero-name.tsx and globals.css.
 */
export function introScript(key: string) {
  const intro = document.getElementById("intro");
  try {
    if (!intro || sessionStorage.getItem(key)) return;
    sessionStorage.setItem(key, "1");
  } catch {
    return;
  }
  intro.setAttribute("data-show", "");
  if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;

  const FLIGHT_MS = 750;
  /** Gap between letters taking off: one after another, with a little overlap. */
  const STAGGER_MS = 250;
  /** Loader (3 cycles ≈ 6s) + flights ≈ 8s; past this, something went wrong. */
  const FAILSAFE_MS = 11000;

  /** Loader letter → hero letter, by kind and order; null if they don't line up. */
  function pairs() {
    const out: [HTMLElement, HTMLElement][] = [];
    for (const kind of ["letter", "dot"]) {
      const from = intro!.querySelectorAll<HTMLElement>(`[data-morph-source="${kind}"]`);
      const to = document.querySelectorAll<HTMLElement>(`[data-morph-target="${kind}"]`);
      if (from.length !== to.length) return null;
      from.forEach((el, i) => out.push([el, to[i]]));
    }
    const inView = out.every(([, to]) => {
      const r = to.getBoundingClientRect();
      return r.width > 0 && r.top >= 0 && r.bottom <= window.innerHeight;
    });
    return out.length && inView ? out : null;
  }

  /**
   * Move + scale a loader letter onto its target, matching weight and color.
   * The loader letter is an inline-block (line box) and the target an inline span
   * (font content box), so line up their content boxes: same font, so the content
   * height per px of font-size is the same. The width is pinned so the lighter
   * weight can't narrow the letter and shift its centered neighbours mid-flight.
   * The letter is floating ("thinking" wave): snapshot where the float has it right
   * now, stop the float on this letter, and start the flight from that snapshot.
   * Stopping it matters: Safari lets a running CSS animation win over a finished
   * fill-forwards flight, which snapped the letter back to the loader.
   */
  function fly(from: HTMLElement, to: HTMLElement) {
    const a = from.getBoundingClientRect();
    const b = to.getBoundingClientRect();
    // getComputedStyle is live: copy the values before the float is switched off.
    const fs = getComputedStyle(from);
    const start = {
      transform: fs.transform,
      opacity: fs.opacity,
      fontWeight: fs.fontWeight,
      color: fs.color,
      fontSize: parseFloat(fs.fontSize),
    };
    const ts = getComputedStyle(to);
    const floatY = start.transform === "none" ? 0 : new DOMMatrixReadOnly(start.transform).m42;
    const scale = parseFloat(ts.fontSize) / start.fontSize;
    const contentTop = (a.height - b.height / scale) / 2;
    const origin = `0 ${contentTop}px`;
    const width = `${a.width}px`;
    const dy = b.top - (a.top - floatY + contentTop);
    from.style.animation = "none";
    return from.animate(
      [
        {
          transformOrigin: origin,
          width,
          transform: start.transform,
          opacity: start.opacity,
          fontWeight: start.fontWeight,
          color: start.color,
        },
        {
          transformOrigin: origin,
          width,
          opacity: 1,
          transform: `translate(${b.left - a.left}px, ${dy}px) scale(${scale})`,
          fontWeight: ts.fontWeight,
          color: ts.color,
        },
      ],
      { duration: FLIGHT_MS, easing: "cubic-bezier(0.76, 0, 0.24, 1)", fill: "forwards" },
    );
  }

  /** Take-offs one after another; each letter keeps floating until its turn. */
  function flyLater(from: HTMLElement, to: HTMLElement, i: number) {
    return new Promise<unknown>((done) => {
      setTimeout(() => {
        try {
          fly(from, to).finished.then(done, done);
        } catch {
          done(null);
        }
      }, i * STAGGER_MS);
    });
  }

  let exited = false;
  const curtain = () => intro.setAttribute("data-curtain", "");

  function exit() {
    if (exited) return;
    exited = true;
    try {
      const list = pairs();
      if (!list) return curtain();
      intro!.setAttribute("data-morph", "");
      const land = () => intro!.setAttribute("data-landed", "");
      Promise.all(list.map(([from, to], i) => flyLater(from, to, i))).then(land, land);
    } catch {
      curtain();
    }
  }

  // Armed only once the tab is visible: a tab opened in the background doesn't run
  // the loader's animations yet, and must still get the full intro when opened.
  let failsafe: ReturnType<typeof setTimeout> | undefined;
  const arm = () => {
    failsafe = setTimeout(() => {
      if (!exited) {
        exited = true;
        curtain();
      }
    }, FAILSAFE_MS);
  };
  if (document.visibilityState === "visible") arm();
  else document.addEventListener("visibilitychange", arm, { once: true });

  const letters = intro.querySelectorAll(".intro-loader__letter");
  letters[letters.length - 1]?.addEventListener(
    "animationend",
    () => {
      clearTimeout(failsafe);
      // Measure with the real font (fallback metrics would land the letters off).
      const fonts = document.fonts ? document.fonts.ready : Promise.resolve();
      fonts.then(exit, exit);
    },
    { once: true },
  );
}
