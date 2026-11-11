"use client";

import { Menu, X } from "lucide-react";
import { useEffect, useRef } from "react";
import { Logo } from "@/components/ui/logo";

/**
 * ☰ button + full-screen menu, built on the native <dialog> element:
 * the browser handles Escape, focus trapping, inert background and returning
 * focus to the button. Links are server-rendered and passed in as children.
 * A click on any link inside closes the menu.
 */
export function MenuDialog({ children }: { children: React.ReactNode }) {
  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    const onClick = (e: MouseEvent) => {
      if ((e.target as Element).closest("a")) dialog.close();
    };
    dialog.addEventListener("click", onClick);
    return () => dialog.removeEventListener("click", onClick);
  }, []);

  return (
    <>
      <IconButton label="Open menu" onClick={() => dialogRef.current?.showModal()}>
        <Menu className="size-5" strokeWidth={1.5} aria-hidden />
      </IconButton>

      <dialog
        ref={dialogRef}
        aria-label="Menu"
        className="menu-dialog m-0 h-dvh max-h-none w-full max-w-none border-0 bg-bg p-0 text-fg backdrop:bg-transparent"
      >
        <div className="mx-auto flex h-16 w-full max-w-5xl items-center justify-between px-6">
          <Logo />
          <IconButton label="Close menu" onClick={() => dialogRef.current?.close()}>
            <X className="size-5" strokeWidth={1.5} aria-hidden />
          </IconButton>
        </div>
        <div className="mx-auto w-full max-w-5xl px-6 pt-16">{children}</div>
      </dialog>
    </>
  );
}

function IconButton({
  label,
  onClick,
  children,
}: {
  label: string;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      onClick={onClick}
      className="-mr-2 grid size-10 place-items-center rounded-full text-fg transition-colors hover:bg-gold-soft hover:text-gold"
    >
      {children}
    </button>
  );
}
