import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { IntroLoader } from "@/components/intro/intro-loader";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { themeScript } from "@/components/theme/theme-script";
import { InlineScript } from "@/components/ui/inline-script";
import { site } from "@/content/site";
import { THEME_KEY, THEME_META_ATTR } from "@/lib/theme";
import "./globals.css";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: { default: `${site.name} · ${site.role}`, template: `%s · ${site.shortName}` },
  description: site.tagline,
  authors: [{ name: site.name, url: site.url }],
  openGraph: {
    type: "website",
    url: site.url,
    siteName: site.name,
    title: `${site.name} · ${site.role}`,
    description: site.tagline,
  },
  twitter: { card: "summary_large_image" },
};

/** Browser bar color for the dark default (works without JS). Light adds its own meta. */
export const viewport: Viewport = { themeColor: "#0a0a0a" };

/** Applies a saved light-mode choice before first paint (components/theme/theme-script.ts). */
const theme = `(${themeScript.toString()})(${JSON.stringify(THEME_KEY)}, ${JSON.stringify(THEME_META_ATTR)})`;

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    // suppressHydrationWarning: the theme script may set data-theme before React loads.
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <head>
        <InlineScript html={theme} />
        {/* Without JavaScript, scroll fades never run: show their content instead. */}
        <noscript>
          <style>{`[data-fade]{opacity:1!important;transform:none!important}`}</style>
        </noscript>
      </head>
      <body className="flex min-h-full flex-col font-sans">
        <IntroLoader />
        {/* Sibling of #intro on purpose: .page-rise waits for the intro exit via CSS (~). */}
        <div className="page-rise flex flex-1 flex-col">
          <SiteHeader />
          <main className="flex-1">{children}</main>
          <SiteFooter />
        </div>
      </body>
    </html>
  );
}
