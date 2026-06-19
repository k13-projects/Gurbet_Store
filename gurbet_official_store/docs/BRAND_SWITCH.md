# GURBET 2026 Rebrand — Switch Kit

Prepared assets + the exact switch plan for moving from the current dark/sporty
look to the new **cream · burgundy · gold** elegant identity (from
`assets/Gurbet brand identity.png`). Nothing in the live site has been changed
yet — flip it by following the checklist below.

## Decisions locked
- **Theme:** full light rebrand (cream background, burgundy + gold accents).
- **Type:** serif via Google Fonts CDN — **Playfair Display** (wordmark/headings),
  Inter retained for body/UI.

## Color tokens (old → new)
| Token | Old | New | Use |
|------|-----|-----|-----|
| `--bg` | `#09090b` | `#f2ede6` (cream) | page background |
| `--panel` | `#111114` | `#ffffff` / `#faf6ef` | cards, surfaces |
| `--ink` (new) | — | `#15110d` | primary text |
| `--burgundy` (was `--red`) | `#b9001c` | `#7a1815` | primary brand / buttons |
| `--burgundy-dk` (was `--red-2`) | `#710714` | `#5e120f` | gradients, hovers |
| `--gold` | `#d8ad68` | `#b8923f` (solid) / `#d9b86a` (light) | accents, rules |
| `--cream` (text-on-dark) | `#f8f2ea` | repurpose as `--surface` | — |
| `--muted` | `#aaa19a` | `#6b635b` | muted text on cream |
| `--line` | `rgba(248,242,234,.14)` | `rgba(21,17,13,.12)` | hairlines on cream |

Note: the current site is dark-on-light-accents; the new one inverts to
**light-on-dark-accents**, so most `rgba(255,255,255,…)` overlays become
`rgba(21,17,13,…)`, and the body `radial-gradient` should be re-tinted to warm
cream + faint burgundy/gold glows.

## Font wiring (add to `<head>` of all 4 pages)
```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@500;600;700;800&display=swap" rel="stylesheet">
```
Then in `styles.css`: `--serif: 'Playfair Display', Didot, 'Bodoni 72', Georgia, serif;`
Apply `--serif` to `h1, h2, .brand strong, .detail-copy h1` and the hero wordmark.

## Assets created (in `assets/`)
| File | Replaces / new | Notes |
|------|----------------|-------|
| `logo-mark-2026.svg` | `logo-mark.svg` | crescent + sparkle monogram, gold ring, vector |
| `logo-gurbet-2026.svg` | `logo-gurbet.svg` | horizontal lockup, **ink-on-light** (header/light bg) |
| `logo-gurbet-reversed.svg` | new | cream-on-burgundy, for dark/burgundy surfaces |
| `apple-touch-icon.png` (180) | new | iOS home-screen icon |
| `icon-192.png`, `icon-512.png` | new | PWA / manifest icons |
| `favicon-32.png`, `favicon-16.png`, `favicon.ico` | new | browser tabs |
| `og-image.png` (1200×630) | branded `og:image` | replaces the product-photo share image |
| `_gen_brand.py` | tooling | re-run to regenerate all rasters |

The SVG wordmarks use a Playfair/Didot serif stack — they render correctly when
the page has the Google Font loaded. **Recommended:** render the header wordmark
as live HTML text styled with `--serif` (crisper, themable) and use
`logo-mark-2026.svg` only for the monogram; keep the SVG lockups for handoff/email.

## Switch checklist (do when the user says "switch")
1. **`styles.css`** — replace `:root` tokens per table above; re-tint `body`
   background to cream; flip overlay/`--line` colors from light→dark; add
   `--serif` and apply to headings + `.brand strong`; restyle `.btn.primary`,
   `.ticker`, `.tag`, `.chip.active`, `.filter.active` to burgundy/gold/cream.
2. **All 4 HTML pages** — add the Google Fonts `<link>`s; swap
   `logo-mark.svg` → `logo-mark-2026.svg`; update `<meta name="theme-color">`
   `#09090b` → `#7a1815` (or cream `#f2ede6`); point favicon links at the new
   PNG/ICO set + `apple-touch-icon`.
3. **`index.html`** — swap hero `logo-gurbet.svg` → `logo-gurbet-2026.svg`
   (or live HTML wordmark); update `og:image` → `assets/og-image.png`.
4. **`site.webmanifest`** — `background_color` → `#f2ede6`,
   `theme_color` → `#7a1815`; replace `icons` array with the 192/512 PNGs.
5. **Keep** the old `logo-gurbet.svg` / `logo-mark.svg` until visual QA passes,
   then remove.
6. **QA:** `python3 -m http.server 8080` from `gurbet_official_store/`; check all
   4 pages + cart drawer + mobile breakpoints; confirm contrast on cream.
