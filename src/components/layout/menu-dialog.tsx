"use client";

import { useEffect, useRef } from "react";
import { Logo } from "@/components/ui/logo";
import { CIRCLE_EASE, CIRCLE_MS, circleFrom, MENU, reducedMotion, ROW_HIDDEN } from "@/lib/motion";
import { cn } from "@/lib/utils";

const OPEN_ID = "menu-open";
/** The menu's own CSS opening animations (globals.css), frozen when it closes. */
const OPENING = new Set(["menu-item-in", "menu-icon-to-x"]);

/**
 * The circle is centered on the × (the dialog's fixed top bar), not on the header's ☰:
 * the header scrolls away, the × never moves, and at the top of the page they line up.
 */
function openMenu(dialog: HTMLDialogElement, closeButton: HTMLElement) {
  dialog.showModal();
  // showModal focuses the first link (the logo) and Safari rings it. Focus the menu
  // itself instead (tabIndex -1, no outline); Tab still moves through the links.
  dialog.focus();
  if (!reducedMotion())
    dialog.animate(
      { clipPath: circleFrom(closeButton) },
      { id: OPEN_ID, duration: CIRCLE_MS, easing: CIRCLE_EASE },
    );
}

/** Radius in px of a `circle(Rpx at …)` clip-path value. */
const radiusOf = (clip: string) => Number(/circle\(([\d.]+)px/.exec(clip)?.[1] ?? 0);

/**
 * Works from any moment, fully open or still opening: freeze the opening where it got
 * to, drop the visible rows (last first) from wherever they are, then shrink the circle
 * from its current size into the button while × turns back into ☰. Nothing that is
 * still hidden ever shows up, and there is no dead time.
 */
function closeMenu(dialog: HTMLDialogElement, closeButton: HTMLElement) {
  if (!dialog.open || "closing" in dialog.dataset) return;
  if (reducedMotion()) return dialog.close();
  dialog.dataset.closing = "";

  // Freeze the opening (rows still waiting stay hidden) and take the circle's size now.
  // Only the menu's own animations: anything else inside (e.g. the sun/moon) runs on.
  dialog
    .getAnimations({ subtree: true })
    .forEach((a) => a instanceof CSSAnimation && OPENING.has(a.animationName) && a.pause());
  const [small, full] = circleFrom(closeButton);
  const now = getComputedStyle(dialog).clipPath;
  const from = now.startsWith("circle(") ? now : full;
  dialog.getAnimations().forEach((a) => a.id === OPEN_ID && a.cancel());

  const visible = [...dialog.querySelectorAll<HTMLElement>(".menu-stagger")]
    .filter((row) => Number(getComputedStyle(row).opacity) > 0.01)
    .reverse();
  visible.forEach((row, k) => {
    const { opacity, filter, transform } = getComputedStyle(row);
    row.animate(
      [
        { opacity, filter, transform },
        { ...ROW_HIDDEN, visibility: "hidden" },
      ],
      {
        duration: MENU.rowOutMs,
        delay: k * MENU.rowOutStaggerMs,
        easing: MENU.rowOutEase,
        fill: "forwards",
      },
    );
  });
  const delay = visible.length ? (visible.length - 1) * MENU.rowOutStaggerMs + MENU.rowOutMs : 0;

  // A circle that only got partway shrinks back in proportionally less time.
  const span = radiusOf(full) - radiusOf(small);
  const share = span > 0 ? (radiusOf(from) - radiusOf(small)) / span : 1;
  const shrinkMs = Math.max(MENU.iconMs / 2, CIRCLE_MS * Math.min(1, share));

  // × back to ☰ within the shrink, so it has fully turned back before the dialog closes.
  // The svg turns back by its current angle (a 180° matrix is ambiguous to interpolate).
  const icon = closeButton.querySelector("svg");
  const iconTiming = {
    duration: Math.min(MENU.iconMs, shrinkMs),
    delay,
    easing: MENU.iconEase,
    fill: "forwards",
  } as const;
  if (icon) {
    const m = new DOMMatrixReadOnly(getComputedStyle(icon).transform);
    const angle = (Math.atan2(m.b, m.a) * 180) / Math.PI;
    icon.animate({ transform: [`rotate(${angle}deg)`, "rotate(0deg)"] }, iconTiming);
    for (const line of icon.querySelectorAll("line")) {
      const { transform, opacity } = getComputedStyle(line);
      line.animate(
        [
          { transform, opacity },
          { transform: "none", opacity: 1 },
        ],
        iconTiming,
      );
    }
  }

  dialog
    .animate(
      { clipPath: [from, small] },
      { duration: shrinkMs, delay, easing: CIRCLE_EASE, fill: "forwards" },
    )
    .finished.catch(() => {})
    .finally(() => dialog.close());
}

/**
 * ☰ button + full-screen menu, built on the native <dialog> element:
 * the browser handles focus trapping, inert background and returning focus to the
 * button. The menu grows out of the ☰ as a circle while the icon turns into ×, then
 * the rows rise in one by one; closing (× or Escape) runs it backwards. A click on a
 * link closes it at once so the page can scroll to the section. Links are
 * server-rendered children.
 */
export function MenuDialog({ children }: { children: React.ReactNode }) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);

  const open = () => openMenu(dialogRef.current!, closeRef.current!);
  const close = () => closeMenu(dialogRef.current!, closeRef.current!);

  useEffect(() => {
    const dialog = dialogRef.current;
    const button = closeRef.current;
    if (!dialog || !button) return;
    const onClick = (e: MouseEvent) => {
      const link = (e.target as Element).closest("a");
      if (!link) return;
      // A new tab leaves this page as it is: close with the full animation. Any other
      // link closes at once so the page can scroll or navigate.
      if (link.target === "_blank") closeMenu(dialog, button);
      else dialog.close();
    };
    // Escape: play the closing circle instead of vanishing. (A browser may refuse
    // to cancel the default; then the menu just closes, which is fine.)
    const onCancel = (e: Event) => {
      e.preventDefault();
      closeMenu(dialog, button);
    };
    // However it closed, reset for the next open (display: none restarts the CSS ones).
    const onClose = () => {
      delete dialog.dataset.closing;
      dialog.getAnimations({ subtree: true }).forEach((a) => a.cancel());
    };
    dialog.addEventListener("click", onClick);
    dialog.addEventListener("cancel", onCancel);
    dialog.addEventListener("close", onClose);
    return () => {
      dialog.removeEventListener("click", onClick);
      dialog.removeEventListener("cancel", onCancel);
      dialog.removeEventListener("close", onClose);
    };
  }, []);

  return (
    <>
      <IconButton label="Open menu" onClick={open}>
        <MenuIcon />
      </IconButton>

      <dialog
        ref={dialogRef}
        aria-label="Menu"
        tabIndex={-1}
        // Opening timings and row pose for the CSS, from the single source in lib/motion.ts.
        style={
          {
            "--icon-delay": `${MENU.iconDelayMs}ms`,
            "--icon-ms": `${MENU.iconMs}ms`,
            "--icon-ease": MENU.iconEase,
            "--row-in-delay": `${MENU.rowInDelayMs}ms`,
            "--row-in-stagger": `${MENU.rowInStaggerMs}ms`,
            "--row-in-ms": `${MENU.rowInMs}ms`,
            "--row-rise": `${MENU.rowRisePx}px`,
            "--row-blur": `${MENU.rowBlurPx}px`,
          } as React.CSSProperties
        }
        className="menu-dialog m-0 h-dvh max-h-none w-full max-w-none border-0 bg-bg p-0 text-fg outline-none backdrop:bg-transparent"
      >
        {/* Same bar as the header, so the × sits exactly where the ☰ was. */}
        <div className="mx-auto flex h-16 w-full max-w-5xl items-center justify-between px-6">
          <Logo />
          <IconButton ref={closeRef} label="Close menu" onClick={close}>
            <MenuIcon morph />
          </IconButton>
        </div>
        <div className="mx-auto w-full max-w-5xl px-6 pt-16">{children}</div>
      </dialog>
    </>
  );
}

/**
 * Three bars. With `morph` (the close button), CSS turns them into × with a half turn
 * when the menu opens and back into ☰ while it closes (globals.css, .menu-icon).
 */
function MenuIcon({ morph = false }: { morph?: boolean }) {
  return (
    <svg
      viewBox="0 0 24 24"
      width={20}
      height={20}
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      strokeLinecap="round"
      className={cn("menu-icon size-5", morph && "menu-icon--morph")}
      aria-hidden
    >
      <line className="menu-icon__top" x1="4" x2="20" y1="6" y2="6" />
      <line className="menu-icon__mid" x1="4" x2="20" y1="12" y2="12" />
      <line className="menu-icon__bottom" x1="4" x2="20" y1="18" y2="18" />
    </svg>
  );
}

function IconButton({
  ref,
  label,
  onClick,
  children,
}: {
  ref?: React.Ref<HTMLButtonElement>;
  label: string;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      ref={ref}
      type="button"
      aria-label={label}
      onClick={onClick}
      className="-mr-2 grid size-10 cursor-pointer place-items-center rounded-full text-fg transition-colors hover:text-gold"
    >
      {children}
    </button>
  );
}
