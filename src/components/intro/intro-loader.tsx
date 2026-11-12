import { InlineScript } from "@/components/ui/inline-script";
import { site } from "@/content/site";
import { INTRO_KEY } from "@/lib/intro";
import { introScript } from "./intro-script";

/**
 * CMDLS intro: the initials rise in and the gold dot lights up (three cycles), then
 * one by one each letter flies onto its word in the hero name (intro-script.ts).
 * Once per browser session. Hidden by default; the inline script right after it
 * turns it on before first paint only for a new session, so refreshes never flash.
 * Private mode / blocked storage → no intro. Purely visual (aria-hidden).
 */
const script = `(${introScript.toString()})(${JSON.stringify(INTRO_KEY)})`;

export function IntroLoader() {
  return (
    <>
      <div id="intro" className="intro-loader" aria-hidden suppressHydrationWarning>
        <p className="intro-loader__mark text-5xl font-medium tracking-tight sm:text-7xl">
          {/* Outer span: rise/hold/lift cycle. Inner span: the "thinking" float, and
              the element that flies onto the name (data-morph-source). */}
          {[...site.shortName].map((letter, i) => (
            <span
              key={i}
              className="intro-loader__letter"
              style={{ "--n": i } as React.CSSProperties}
            >
              <span className="think" data-morph-source="letter">
                {letter}
              </span>
            </span>
          ))}
          <span
            className="intro-loader__dot text-gold"
            style={{ "--n": site.shortName.length } as React.CSSProperties}
          >
            <span className="think" data-morph-source="dot">
              .
            </span>
          </span>
        </p>
      </div>
      <InlineScript html={script} />
    </>
  );
}
