import { Fragment } from "react";

/** Per-word stagger of the name write-out after the intro, and per letter (ms). */
const WORD_STAGGER = 40;
const LETTER_STAGGER = 28;

/**
 * The hero name on two lines, split per letter for the intro morph (see
 * components/intro/intro-script.ts). aria-label keeps it one name for screen
 * readers, which may spell out split letters.
 */
export function HeroName({ lines, className }: { lines: [string, string]; className?: string }) {
  return (
    <h1 aria-label={lines.join(" ")} className={className}>
      <span className="block">
        <NameWords text={lines[0]} start={0} />
      </span>{" "}
      <span className="block">
        <NameWords text={lines[1]} start={lines[0].split(" ").length} />
      </span>
    </h1>
  );
}

/**
 * First letter of each word = where a loader letter lands (`data-morph-target`);
 * the rest write out once all have landed (`.hero-name__letter`). A "." is where
 * the loader's gold dot lands. Inline spans keep kerning; nowrap keeps words whole.
 */
function NameWords({ text, start }: { text: string; start: number }) {
  return text.split(" ").map((word, w) => (
    <Fragment key={w}>
      {w > 0 && " "}
      <span className="whitespace-nowrap">
        {[...word].map((ch, i) => (
          <Letter
            key={i}
            ch={ch}
            first={i === 0}
            delay={(start + w) * WORD_STAGGER + i * LETTER_STAGGER}
          />
        ))}
      </span>
    </Fragment>
  ));
}

function Letter({ ch, first, delay }: { ch: string; first: boolean; delay: number }) {
  if (first) return <span data-morph-target="letter">{ch}</span>;
  // The period is gold, like the logo's dot (and the loader dot lands on it).
  if (ch === ".")
    return (
      <span data-morph-target="dot" className="text-gold">
        {ch}
      </span>
    );
  return (
    <span
      className="hero-name__letter"
      style={{ "--letter-delay": `${delay}ms` } as React.CSSProperties}
    >
      {ch}
    </span>
  );
}
