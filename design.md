# Visual Style Guide & Design Tokens
### Reverse-engineered from the "Katerina" portfolio screenshot

---

## 1. Global Aesthetic & Theme

**Vibe:** Swiss-editorial / technical-minimalist portfolio. It reads like a print magazine spread crossed with a spec sheet — oversized, confident display type paired with small, dry, monospaced "data" labels (`[INTRO]`, `/25`, `12.92646° N, 77.67812° E`). This is the current Awwwards-style "digital brutalist" trend: hairline grid rules, zero border-radius on content, flat imagery, restrained color.

**Theme:** Predominantly **light** (warm off-white canvas, near-black text) with one **dark, full-bleed inversion** at the closing "Let's Connect" section and footer, which doubles as the emotional/photographic climax of the page (desert dune photography at sunset).

**Keywords:** editorial, restrained, confident typography, monospace-as-decoration, flat/no-shadow, asymmetric grid, warm-neutral palette punctuated by terracotta photography.

---

## 2. Color Palette (estimated hex)

| Token | Hex | Usage |
|---|---|---|
| `bg-primary` | `#EAE8E2` | Main page canvas (warm greige/ivory) |
| `bg-nav` | `#EAE8E2` | Top nav — same as canvas, borderless |
| `bg-dark` | `#0A0A09` | Footer / "Let's Connect" section base |
| `text-primary` | `#111110` | Headlines, nav, primary copy (soft/warm black, never pure `#000`) |
| `text-muted` | `#83817B` | Service descriptions, secondary paragraph copy |
| `text-inverse` | `#F5F4EF` | Text on dark footer |
| `text-inverse-muted` | `#9B9790` | Secondary text on dark footer (social labels) |
| `accent-action` | `#111110` | Buttons/CTAs — black fill, not a hue |
| `accent-warm` | `#C97C4B` | Derived from dune photography; usable for subtle UI accents/links if extending the system |
| `accent-warm-light` | `#E3A26B` | Lighter photographic accent, gradient stop |
| `border-hairline` | `#D3D1C9` | Vertical grid guide lines, list dividers |
| `border-hairline-inverse` | `rgba(255,255,255,0.12)` | Dividers on dark footer |

**Gradients:** No UI-chrome gradients — the only "gradient" is a photographic dark-to-transparent overlay behind the "Let's Connect" heading, fading a black scrim (`rgba(0,0,0,0.85)`) at the top of that section down to transparent (`rgba(0,0,0,0)`) at roughly 40% down, revealing the dune photo beneath. Direction: top → bottom.

**Note on accent color:** this design deliberately has *no* bright hue as an interactive accent — black-on-cream does that job. Warmth is carried entirely by the photography, not by UI elements. Keep this in mind if extending the system: resist the urge to add a colored "primary button" — it would break the aesthetic.

---

## 3. Typography & Text Hierarchy

**Two-family system**, both doing distinct jobs — now specified to your chosen typeface:

1. **Display — `NType 82`**. Used for the wordmark, section titles ("Selected Works," "Introduction," "My Services," "Let's Connect"). This is a custom geometric/technical grotesk originally designed in 2021 for exclusive use by the tech brand Nothing — which actually makes it a stronger fit for this page's "spec sheet" personality than a generic grotesk would be.
2. **Labels & body — `NType 82 Mono`**. The companion monospace cut of the same family. Use it for nav links, bracketed labels (`[INTRO]`, `[01]`), body paragraphs, captions, coordinates, and the footer — replacing the earlier generic `Space Mono` suggestion with the on-brand mono cut, so the display and label type now visibly belong to the same family instead of just pairing two unrelated fonts.

**Licensing note:** NType 82 was built exclusively for Nothing's branding, so there's no public storefront to buy a license from. If you already have legitimate access to the font files, self-host them via `@font-face`; don't pull copies from "free font download" mirrors — those are unauthorized. If you don't have licensed files, fall back to `Archivo` (display) + `IBM Plex Mono` (labels/body) — the closest legally-clean match to the same geometric/technical character.

**Scale (desktop, ~1440px base):**

| Level | Size | Weight | Tracking | Line-height | Notes |
|---|---|---|---|---|---|
| Hero (H1, "Katerina") | ~140px / 8.75rem | 500 | -0.02em | 0.9 | Sentence case, huge |
| H2 (section titles) | ~72px / 4.5rem | 600 | -0.01em | 1.0 | Sentence case |
| H3 (service names) | ~28px / 1.75rem | 500 | 0 | 1.2 | |
| Body (paragraphs) | ~15px / 0.9375rem | 400 | 0 | 1.6 | Monospace, `text-muted` color, narrow column (~30ch) |
| Label / eyebrow / nav | ~11px / 0.6875rem | 500 | +0.08em | 1.0 | Uppercase, monospace, e.g. `[INTRO]`, `HOME / WORKS / ABOUT` |

**Contrast ratio:** roughly **9:1** between hero display type and body copy, and **~5:1** between section headers and body — an intentionally extreme jump that lets the small monospace text read as "fine print" against billboard-scale headlines.

---

## 4. Card & Container Design

- **Border-radius:** `0px` everywhere on content (images, containers, list rows). The *only* rounded elements in the entire UI are pill-shaped buttons (`border-radius: 9999px`).
- **Borders:** Essentially invisible on media. The only visible strokes are 1px hairlines: the faint vertical column-guide rules running the full height of the page, and thin horizontal dividers between list rows (services, project entries).
- **Shadows:** None. This is a flat design — no soft shadows, no glows. Depth is implied instead by **offset image stacking**: each portfolio entry overlaps two photographs with a vertical/horizontal offset (roughly 30–50px), creating a collaged, layered look without any blur or shadow.

---

## 5. Interactive Elements (Buttons & Links)

**Buttons** (`CONTACT ↗`, `VIEW ALL ↗`, `LEARN MORE ↗`):
- Shape: fully rounded pill (`rounded-full`)
- Background: `#111110` (near-black)
- Text: `#F5F4EF` (off-white), uppercase monospace, ~11–12px, wide tracking
- Padding: approx. `10px 20px` (py-2.5 / px-5)
- Icon: trailing arrow (`↗`), baseline-aligned with text
- Hover (inferred, not visible in a static screenshot): likely an invert-to-outline treatment (transparent fill, black text/border) or a subtle arrow-slide — consistent with this template family's usual micro-interaction.

**Nav links:** Plain uppercase monospace text, no underline, no pill background, separated by `/`. Hover behavior would plausibly be a color shift to `text-muted` or a thin underline reveal.

**Decorative dot** in the top-right of the nav — likely a scroll-progress indicator or theme toggle; visually just a small outlined circle with no fill.

---

## 6. Spacing, Layout & Packing

**Density:** Low-to-medium. Generous vertical rhythm between sections (~140–160px of breathing room), but *within* a section the text blocks themselves are set tight and narrow (small monospace type in ~280–320px columns) — this contrast between "huge headline / tiny dense copy" is the core layout trick.

**Grid:** A visible, decorative **hairline vertical grid** (5–6 evenly spaced guide lines) runs the full height of the page in the background, like exposed graph paper — a strong Swiss-editorial signal, even though it's not load-bearing for the actual content grid.

**Alignment:** Left-aligned throughout, asymmetrical rather than centered or strictly symmetric-grid. The recurring pattern is a **narrow label column + wide content column** (e.g., `[INTRO]` sits alone in a slim left gutter while its paragraph sits in a wider column to the right; `[01] Art Direction` follows the same split against its description). Section headlines are always flush-left at the same margin as the page edge, not the grid label column — creating layered left edges at two different x-positions.

**Custom footer treatment (name-mark + rearranged contact):**
In the original, the bottommost black footer runs `KATERINA` wordmark on the left with contact/social stacked on the right. This system flips that: the personal name-mark rotates 180° and pins to the **top-right corner** of the black section, rendered so oversized and tightly kerned that it bleeds toward or past both edges of the section — matching the "Birka" Coolvetica reference you shared, not a moderate headline size. Contact details and social links move to the **left side** to fill the space the wordmark vacated.

```css
.footer-namemark-row {
  display: flex;
  justify-content: flex-end; /* pushes the name to the right edge */
  overflow: hidden; /* lets the wordmark crop cleanly at the edges rather than forcing a horizontal scrollbar */
}

.footer-namemark {
  display: inline-block;
  transform: rotate(180deg); /* rotates in place, around its own center */
  font-family: 'Coolvetica', 'Archivo Black', sans-serif; /* see licensing note below */
  font-size: clamp(4rem, 16vw, 9rem); /* deliberately oversized — should bleed toward or past both edges of the section, not just cross center */
  letter-spacing: -0.02em; /* Coolvetica's tight, interlocking kerning is the point — don't loosen this */
  line-height: 0.9;
  color: #FFFFFF; /* explicit pure white, not the softer text-inverse token, so it reads clearly against the black */
  white-space: nowrap;
}

.footer-contact {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  max-width: 16rem;
}
```

**Reference-matched font: Coolvetica.** Based on the moodboard you shared, the target face is [Coolvetica](https://typodermicfonts.com/coolvetica/) by Typodermic Fonts — a scratch-built 1970s-custom-lettering-style display face, built for exactly this kind of tight, chunky, edge-to-edge wordmark (it deliberately drops the tails on letters like `R` and `a` to allow tighter spacing). It's free for desktop/print use, but **web embedding is licensed separately from Typodermic** — check their license page before self-hosting it via `@font-face` on a live site. `Archivo Black` (Google Fonts, freely embeddable) is the closest legally-clean stand-in if you need something to ship immediately.

**Why not `position: absolute` + `transform-origin: top right`?** It's tempting, but rotating a box 180° around its own top-right corner swings the box's content up and out of the container — the corner itself doesn't move, but everything else in the box does, so the text ends up clipped above the visible frame. Keeping the element in normal flow (pushed right with `flex`) and rotating it around its own center avoids that entirely.

The black footer section still needs `position: relative` if you're layering this over a background image, but the name-mark itself no longer needs absolute positioning.

---

## 7. Tailwind CSS Configuration

```js
// tailwind.config.js
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{html,js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        background: {
          DEFAULT: '#EAE8E2',
          nav: '#EAE8E2',
          dark: '#0A0A09',
        },
        text: {
          primary: '#111110',
          muted: '#83817B',
          inverse: '#F5F4EF',
          'inverse-muted': '#9B9790',
        },
        accent: {
          DEFAULT: '#111110',   // action/button fill — black, not a hue
          warm: '#C97C4B',      // pulled from photography, optional extension
          'warm-light': '#E3A26B',
        },
        border: {
          hairline: '#D3D1C9',
          'hairline-inverse': 'rgba(255,255,255,0.12)',
        },
      },
      fontFamily: {
        // Requires licensed NType 82 font files self-hosted via @font-face.
        // Falls back to Archivo / IBM Plex Mono if you don't have a license.
        display: ['"NType 82"', '"Archivo"', 'ui-sans-serif', 'sans-serif'],
        mono: ['"NType 82 Mono"', '"IBM Plex Mono"', 'ui-monospace', 'monospace'],
      },
      fontSize: {
        hero:  ['8.75rem', { lineHeight: '0.9',  letterSpacing: '-0.02em', fontWeight: '500' }],
        h2:    ['4.5rem',  { lineHeight: '1',    letterSpacing: '-0.01em', fontWeight: '600' }],
        h3:    ['1.75rem', { lineHeight: '1.2',  fontWeight: '500' }],
        body:  ['0.9375rem', { lineHeight: '1.6' }],
        label: ['0.6875rem', { lineHeight: '1', letterSpacing: '0.08em', fontWeight: '500' }],
      },
      borderRadius: {
        none: '0px',
        pill: '9999px',
      },
      spacing: {
        section: '9rem',   // ~144px vertical rhythm between major sections
        gutter: '2rem',
      },
      boxShadow: {
        none: 'none',
      },
      backgroundImage: {
        'footer-scrim': 'linear-gradient(to bottom, rgba(0,0,0,0.85), rgba(0,0,0,0) 40%)',
      },
      letterSpacing: {
        tightest: '-0.02em',
        widest: '0.08em',
      },
    },
  },
  plugins: [],
};
```

**Suggested component defaults built on these tokens:**
- `.btn` → `bg-accent text-text-inverse rounded-pill font-mono text-label uppercase px-5 py-2.5`
- `.eyebrow` → `font-mono text-label uppercase text-text-primary tracking-widest`
- `.divider` → `border-t border-border-hairline`
- `.section` → `py-section`
- `.footer-namemark-row` → `flex justify-end overflow-hidden`
- `.footer-namemark` → `inline-block rotate-180 font-[Coolvetica,'Archivo_Black',sans-serif] tracking-[-0.02em] text-[7rem] leading-[0.9] text-white whitespace-nowrap` (lowercase content, e.g. "arnav k.", sized to bleed toward both edges of the section — not uppercase, not a modest headline size)

---

## 8. Motion & Animation System

Audited against Sections 2 and 4 before writing this: two requested effects (shadow bloom on card hover, backdrop-blur on sticky nav) directly conflicted with this system's flat, zero-shadow, hard-edged identity and were replaced with equivalents built from tokens the system already owns (offset-stacking, hairline borders, opaque fills). See the conversation above for the full per-animation audit. Every animation below shares one signature easing curve instead of five near-matching ones.

```css
:root {
  --ease-signature: cubic-bezier(0.16, 1, 0.3, 1);
  --dur-fast: 300ms;
  --dur-base: 350ms;
  --dur-entrance: 600ms;
  --stagger: 150ms;
}

@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }
}
```

**Underline (nav links, project titles)** — grows left→right on hover-in, shrinks toward the right on hover-out via a transform-origin flip:

```css
.link-underline { position: relative; text-decoration: none; }
.link-underline::after {
  content: '';
  position: absolute;
  left: 0;
  bottom: -2px;
  width: 100%;
  height: 1px; /* hairline weight, matching Section 4's dividers */
  background: currentColor; /* black on light sections, white on the dark footer — no new color */
  transform: scaleX(0);
  transform-origin: right;
  transition: transform var(--dur-base) var(--ease-signature);
}
.link-underline:hover::after {
  transform: scaleX(1);
  transform-origin: left;
}
```

**Entrance (fade + slide up)** — applies to headings and content blocks, staggered by sibling; buttons/CTAs/arrows are explicitly excluded via `.no-reveal`. Blur is reserved for the hero wordmark only, per the audit:

```css
@keyframes fadeSlideUp {
  from { opacity: 0; transform: translateY(20px); }
  to   { opacity: 1; transform: translateY(0); }
}
@keyframes fadeSlideUpBlur { /* hero wordmark only — see audit note above */
  from { opacity: 0; transform: translateY(20px); filter: blur(2px); }
  to   { opacity: 1; transform: translateY(0); filter: blur(0); }
}

.reveal { animation: fadeSlideUp var(--dur-entrance) var(--ease-signature) both; }
.reveal-hero { animation: fadeSlideUpBlur var(--dur-entrance) var(--ease-signature) both; }

.reveal-group > *:nth-child(1) { animation-delay: calc(var(--stagger) * 0); }
.reveal-group > *:nth-child(2) { animation-delay: calc(var(--stagger) * 1); }
.reveal-group > *:nth-child(3) { animation-delay: calc(var(--stagger) * 2); }
.reveal-group > *:nth-child(4) { animation-delay: calc(var(--stagger) * 3); }

.no-reveal { animation: none !important; opacity: 1 !important; transform: none !important; }
```

**Diagonal arrow slide (buttons)** — hover-only, unaffected by the entrance rule:

```css
.arrow-swap { position: relative; display: inline-block; width: 1em; height: 1em; overflow: hidden; }
.arrow-swap .arrow { position: absolute; inset: 0; transition: transform var(--dur-base) var(--ease-signature); }
.arrow-swap .arrow--in { transform: translate(-100%, 100%); }
.arrow-swap:hover .arrow--out { transform: translate(100%, -100%); }
.arrow-swap:hover .arrow--in { transform: translate(0, 0); }
```
HTML: `<span class="arrow-swap"><i class="arrow arrow--out">↗</i><i class="arrow arrow--in">↗</i></span>`

**Project card hover** — lift kept, shadow replaced with the site's own offset-stacking language:

```css
.project-card,
.project-card .layer-front {
  transition: transform var(--dur-fast) ease-out;
}
.project-card:hover { transform: translateY(-6px); }
.project-card:hover .layer-front { transform: translate(6px, -6px); } /* widens the existing photo-stack offset instead of adding a shadow */
```

**Sticky nav** — blur and shadow both removed; solid fill + hairline border instead:

```css
.site-nav {
  position: sticky;
  top: 0;
  background: transparent;
  border-bottom: 1px solid transparent;
  transition: background var(--dur-base) var(--ease-signature), border-color var(--dur-base) var(--ease-signature);
}
.site-nav.is-scrolled {
  background: #EAE8E2; /* bg-nav, fully opaque — no blur needed for legibility */
  border-bottom-color: #D3D1C9; /* border-hairline */
}
```
```js
addEventListener('scroll', () => {
  document.querySelector('.site-nav').classList.toggle('is-scrolled', window.scrollY > 20);
}, { passive: true });
```

**Tailwind equivalents** (add to the `theme.extend` block from Section 7):

```js
transitionTimingFunction: {
  signature: 'cubic-bezier(0.16, 1, 0.3, 1)',
},
transitionDuration: {
  350: '350ms',
},
keyframes: {
  fadeSlideUp: {
    '0%': { opacity: '0', transform: 'translateY(20px)' },
    '100%': { opacity: '1', transform: 'translateY(0)' },
  },
},
animation: {
  'fade-slide-up': 'fadeSlideUp 0.6s cubic-bezier(0.16,1,0.3,1) both',
},
```

- Underline → `relative after:content-[''] after:absolute after:left-0 after:-bottom-0.5 after:w-full after:h-px after:bg-current after:origin-right after:scale-x-0 after:transition-transform after:duration-350 after:ease-signature hover:after:origin-left hover:after:scale-x-100`
- Card lift → `transition-transform duration-300 ease-out hover:-translate-y-1.5` (`-translate-y-1.5` = exactly −6px)
- Sticky nav → `sticky top-0 transition-colors duration-350 ease-signature`, toggling `bg-background-nav border-b border-border-hairline` vs `bg-transparent border-transparent` via the scroll listener above

---

### One honest caveat
Exact hex values and pixel sizes are visual estimates from a single screenshot, not sampled from live CSS — treat them as a strong, ready-to-build starting point rather than pixel-perfect ground truth. If you have access to the live site, an eyedropper/inspector pass on the actual background, text, and hairline colors would sharpen this further.