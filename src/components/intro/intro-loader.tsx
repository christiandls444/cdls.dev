import { INTRO_KEY } from "@/lib/intro";
import { InlineScript } from "./inline-script";

/**
 * CDLS intro: letters rise in, the gold dot lights up, then the screen lifts away.
 * Once per browser session. Hidden by default; the inline script right after it
 * turns it on before first paint only for a new session, so refreshes never flash.
 * Private mode / blocked storage → no intro. Purely visual (aria-hidden).
 */
const script = `(function(){try{if(sessionStorage.getItem("${INTRO_KEY}"))return;sessionStorage.setItem("${INTRO_KEY}","1");document.getElementById("intro").setAttribute("data-show","")}catch(e){}})()`;

export function IntroLoader() {
  return (
    <>
      <div id="intro" className="intro-loader" aria-hidden suppressHydrationWarning>
        <p className="intro-loader__mark text-5xl font-medium tracking-tight sm:text-7xl">
          {["C", "D", "L", "S"].map((letter) => (
            <span key={letter} className="intro-loader__letter">
              {letter}
            </span>
          ))}
          <span className="intro-loader__dot text-gold">.</span>
        </p>
      </div>
      <InlineScript html={script} />
    </>
  );
}
