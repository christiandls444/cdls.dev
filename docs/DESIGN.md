# Design system

**Minimal. Aesthetic. Icon-first. Less text.**

## Palette

Defined once in `src/app/globals.css`. **Dark is the default** for every visitor; light is opt-in
via the sun/moon toggle in the menu (next to the social icons) and is remembered in `localStorage`.

| Token       | Light     | Dark      | Use                                  |
| ----------- | --------- | --------- | ------------------------------------ |
| `bg`        | `#FAFAF7` | `#0A0A0A` | page background (warm white / black) |
| `surface`   | `#FFFFFF` | `#121212` | cards, tiles                         |
| `fg`        | `#0A0A0A` | `#F5F5F0` | primary text                         |
| `muted`     | `#6B6B66` | `#9A9A94` | secondary text, idle icons           |
| `line`      | `#E7E5DF` | `#262624` | borders, dividers                    |
| `gold`      | `#8A6A12` | `#D4AF37` | accent: labels, hover, focus, dots   |
| `gold-soft` | `#F5EDD6` | `#2A2410` | icon backgrounds                     |
| `blue`      | `#1E3A8A` | `#7AA2F7` | links and link affordances (arrows)  |

Gold is an **accent**, never body text. Blue is for **links**. Everything else is black/white/grey.

## Type

- **Geist Light** (`font-light` + tight tracking) for the name, titles, menu links and the About bio.
  The hero name uses `tracking-[-0.045em]`, other large titles `tracking-[-0.04em]`, smaller ones `tracking-tight`.
- The logo is Geist Medium.
- **Geist** (`font-sans`) for UI and short copy
- **Geist Mono** (`font-mono`) for labels, tags and metadata. Uppercase labels use `tracking-[0.2em]`.

## Rules

- One line per summary. If it needs a paragraph, it needs a detail page.
- Every item gets an icon: a brand logo (simple-icons) or a lucide line icon at `strokeWidth={1.5}`.
- Icons are monochrome (`currentColor`). Hover turns them gold (no hover fill/circle). No multicolor brand logos.
- Layout: `max-w-5xl`, `px-6`, sections `py-20 sm:py-28`, cards `rounded-2xl`, tiles `rounded-xl`.
- Motion: only `FadeIn` (fade + 12px rise, once). It respects reduced motion. No bouncing, no parallax.
- Accessibility: visible gold focus ring, `aria-label` on icon-only links, colour contrast AA.
