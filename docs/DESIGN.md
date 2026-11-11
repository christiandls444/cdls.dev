# Design system

**Minimal. Aesthetic. Icon-first. Less text.**

## Palette

Defined once in `src/app/globals.css`. Light and dark follow the OS setting.

| Token       | Light     | Dark      | Use                                  |
| ----------- | --------- | --------- | ------------------------------------ |
| `bg`        | `#FAFAF7` | `#0A0A0A` | page background (warm white / black) |
| `surface`   | `#FFFFFF` | `#121212` | cards, tiles                         |
| `fg`        | `#0A0A0A` | `#F5F5F0` | primary text                         |
| `muted`     | `#6B6B66` | `#9A9A94` | secondary text, idle icons           |
| `line`      | `#E7E5DF` | `#262624` | borders, dividers                    |
| `gold`      | `#8A6A12` | `#D4AF37` | accent: labels, hover, focus, dots   |
| `gold-soft` | `#F5EDD6` | `#2A2410` | icon backgrounds, hover fills        |
| `blue`      | `#1E3A8A` | `#7AA2F7` | links and link affordances (arrows)  |

Gold is an **accent**, never body text. Blue is for **links**. Everything else is black/white/grey.

## Type

- **Instrument Serif** (`font-serif`) for the name, section titles and card titles
- **Geist** (`font-sans`) for UI and short copy
- **Geist Mono** (`font-mono`) for labels, tags and metadata. Uppercase labels use `tracking-[0.2em]`.

## Rules

- One line per summary. If it needs a paragraph, it needs a detail page.
- Every item gets an icon: a brand logo (simple-icons) or a lucide line icon at `strokeWidth={1.5}`.
- Icons are monochrome (`currentColor`). Hover turns them gold. No multicolor brand logos.
- Layout: `max-w-5xl`, `px-6`, sections `py-20 sm:py-28`, cards `rounded-2xl`, tiles `rounded-xl`.
- Motion: only `FadeIn` (fade + 12px rise, once). It respects reduced motion. No bouncing, no parallax.
- Accessibility: visible gold focus ring, `aria-label` on icon-only links, colour contrast AA.
