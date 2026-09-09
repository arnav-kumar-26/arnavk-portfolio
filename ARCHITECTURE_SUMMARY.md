# Portfolio Website — Architecture Summary

Generated from source inspection on 2026-09-07; refreshed 2026-09-09 after the full `TASK.md` round (all 36 tasks executed and committed), the AGENTS.md/architecture.md amendments (Vercel, Geist/PT Mono, measured heading tokens), a visual audit of `audit/*.png` (reference `ref-*` vs current `new*` screenshots), and the post-round follow-up fixes (grid rework, card/tag/footer/skills/nav refinements).

## 1. Stack & Runtime Model

- **Astro 5 (static-only, SSG):** `astro.config.mjs` sets `output: 'static'` with no adapter. Integrations: `@astrojs/tailwind`, `@astrojs/sitemap`, `@astrojs/mdx`. No SSR/ISR, no server runtime.
- **Styling:** Tailwind CSS 3 (JIT-purged) + one hand-written `src/styles/global.css`. No UI framework, no CSS-in-JS, no client state library.
- **Content:** Astro Content Collections (`src/content.config.ts`, Zod validation) for blog; typed TS modules in `src/data/` for everything else.
- **Images:** `astro:assets` (`Image`/`Picture`) mandatory for local assets. No raw `<img src="/...">` for `src/assets/`.
- **JS model:** Zero JS by default. Interactivity = scoped `<script>` inside `.astro` files + two shared scripts in `src/scripts/`. No React/Vue/Svelte/Solid.
- **Hosting:** Vercel static (`vercel.json` header rules only; no adapter). AGENTS.md was amended to match — the old Cloudflare/`wrangler.toml` references are dead.
- **Deps (`package.json`):** runtime deps are `astro`, `@fontsource/geist-sans`, `@fontsource/pt-mono`; dev deps are `@astrojs/check`, `@astrojs/mdx`, `@astrojs/sitemap`, `@astrojs/tailwind`, `tailwindcss`, `typescript`.

## 2. Directory Map (actual)

```
astro.config.mjs          # static output, site URL, tailwind+sitemap+mdx
tailwind.config.ts        # design tokens (colors, fonts, type scale, radius, motion)
tsconfig.json             # strict TS, @/* -> src/* alias
vercel.json               # Cache-Control headers (immutable /_astro + /fonts, no-cache HTML)
.env / .env.example       # PUBLIC_GITHUB_USERNAME, PUBLIC_FORMSPREE_ID (all public-safe)
GENERATE-DESIGN.md        # consolidated style breakdown + style file/architecture map
TASK.md                   # third-round build loop — all 36 tasks COMPLETE (reference only now)
audit/                    # ref-*-*.png (reference site) vs new*-*.png (this build, pre-round screenshots)
public/                   # favicon.svg, robots.txt, fonts/ (geist-*.woff2, pt-mono-400.woff2)
src/
  content.config.ts       # blog collection Zod schema
  content/blog/           # example-post.md (+ .mdx supported via @astrojs/mdx)
  data/                   # nav.ts, social.ts, experience.ts, projects.ts, skills.ts
  types/index.ts          # NavLink, SocialLink, ExperienceEntry, Project, SkillCategory, GitHubRepoStats
  lib/                    # github.ts (fetchRepoStats), seo.ts (buildMeta), date handling inline elsewhere
  scripts/                # entrance.ts (IntersectionObserver), sticky-nav.ts (scroll toggle)
  styles/global.css       # @tailwind directives, :root motion/layout vars, @font-face, reusable behavior classes
  layouts/                # BaseLayout.astro, BlogPostLayout.astro
  components/
    seo/SEO.astro
    nav/SiteNav.astro, NavLink.astro
    ui/Button.astro, Eyebrow.astro, Divider.astro, HairlineGrid.astro
    sections/Hero, About, Experience, ExperienceRow, Projects, ProjectCard, GitHubStats, Skills, SkillPill, Contact
    footer/SiteFooter.astro
  pages/
    index.astro           # Hero > About > Experience > Projects > Skills > Contact
    writing/index.astro   # blog index (getCollection, filter drafts, sort desc)
    writing/[...slug].astro # per-post route via getStaticPaths
    (no 404.astro present — spec mentions one; absent as of 2026-09-09)
  assets/                 # hero-portrait.svg, mira-coach-cover.png, fleet-tracker-cover.png
```

## 3. Routing & Rendering

| Route | File | Data source | Output |
|---|---|---|---|
| `/` | `src/pages/index.astro` | `src/data/*` imports + `social.ts` for JSON-LD | Static HTML composing 6 sections + `Person` JSON-LD |
| `/writing` | `src/pages/writing/index.astro` | `getCollection('blog')`, filters `draft: true`, sorts `publishDate` desc | Static list |
| `/writing/:slug` | `src/pages/writing/[...slug].astro` | `getStaticPaths()` from non-draft posts, `post.render()` | Static HTML via `BlogPostLayout` + `BlogPosting` JSON-LD |
| SEO/sitemap | `@astrojs/sitemap` + `public/robots.txt` | Auto-generated `sitemap-index.xml` at build | Edge-cached static files |

All pages go through `BaseLayout.astro`, which owns `<html>/<head>/<body>`, imports `global.css`, mounts `HairlineGrid` + `SiteNav` + `SiteFooter`, injects `<SEO>`, preloads above-fold fonts, adds skip-link, bundles `entrance.ts`, and hosts the site-wide cursor dot + `document` mousemove listener.

## 4. Layouts & Component Hierarchy

```
BaseLayout.astro (static shell + site-wide cursor script)
├── SEO.astro (static, props: title/description/canonical/ogImage/noindex)
├── HairlineGrid.astro (static decorative background, position: absolute pattern, 10% strength — first child INSIDE <main> so it shares main's stacking context and shows through)
├── SiteNav.astro (INTERACTIVE — sticky-nav.ts toggles .is-scrolled)
│   └── NavLink.astro × N (static, .link-underline CSS hover; Home / Work / Writing only — Contact removed entirely)
├── <main id="main-content" relative z-10 bg-background px-[gutter-width]> (full-width; max-w-7xl container dropped, opaque cover)
├── SiteFooter.astro (static — rotated name-mark is pure CSS; normal flow, no overlap)
├── .site-cursor dot + document mousemove listener (fine-pointer only, reduced-motion inert)
└── entrance.ts (global IntersectionObserver for .reveal)

index.astro (static composition)
├── Hero.astro (interactive — .reveal-hero blur+slide; Button × 2; top-left heading with © superscript; [Intro] eyebrow; top-anchored capped portrait)
├── About.astro (interactive — full-width text-hero heading above label/content grid; body in text-primary)
├── Experience.astro (interactive — staggered .reveal-group)
│   └── ExperienceRow.astro × N (static 3-COLUMN grid: date/location | title | bullets; dates wrap naturally)
├── Projects.astro (interactive — staggered cards, mb-16 heading gap)
│   └── ProjectCard.astro × N (interactive — open unbordered card, CSS lift + <iframe h-80> + GitHubStats; tags are /-separated mono labels)
│       └── GitHubStats.astro (INTERACTIVE — sole data-fetching component; stars display retired from card)
├── Skills.astro (interactive, text-body labels; 3-col grid ≥md, single column below)
│   └── SkillPill.astro × N (static tags, rounded-button 5px, px-5 py-3 text-body)
└── Contact.astro (conditionally interactive — script only when Formspree ID set; full-bleed breakout, py-40)

BlogPostLayout.astro extends BaseLayout: adds BlogPosting JSON-LD + article header.
```

**Boundary legend:** static = build-time HTML, zero JS. Interactive = `.astro` + co-located `<script>`. Only three scripts ship: `entrance.ts` (global), `sticky-nav.ts` (nav only), `GitHubStats` fetch + optional Contact form handler. (Cursor + reveal are CSS/play-state driven, no animation libraries.)

## 5. Data Flow (4 paths)

1. **Static typed data (build-time):** `src/data/*.ts` → imported by sections at build → baked HTML. Interfaces in `src/types/index.ts` (`NavLink`, `SocialLink`, `ExperienceEntry`, `Project`, `SkillCategory`). No fetch, no loading state.
2. **Long-form content (build-time, validated):** `src/content/blog/*.md|mdx` → Zod schema in `content.config.ts` (title, description ≤160 chars, publishDate, updatedDate?, tags[], draft=false, coverImage?) → `getCollection('blog')`. Malformed frontmatter fails the build.
3. **Live GitHub stats (client-only exception):** `src/lib/github.ts` `fetchRepoStats(name, owner = PUBLIC_GITHUB_USERNAME)` → parallel `GET /repos/{owner}/{name}` + `/commits?per_page=1` → `{ stars, lastCommitISO, fetchedAt }` with 30-min `sessionStorage` cache (`gh-stats:owner/name`). `GitHubStats.astro` renders skeleton server-side, fetches post-hydration, patches DOM in place; on `null` (network fail, non-2xx, rate-limit 60 req/hr, missing owner) reveals hidden "— see GitHub" link. Never moved to `getStaticPaths`/frontmatter — must stay live. Stars display retired from `ProjectCard` per reference design; contract + component retained.
4. **Contact (build-time branch):** `PUBLIC_FORMSPREE_ID` set → `<form POST https://formspree.io/f/{id}>` + inline `fetch` handler with `aria-live` status; unset → `mailto:` link. Branch resolves at build; no backend code in repo.

## 6. Key Contracts

- **`Project` (`types/index.ts` + `data/projects.ts`):** `{ id, title, summary, description, demoUrl?, githubRepo?: { owner?, name }, tags[], coverImage, status: shipped|in-progress|case-study }`. Current entries: `mira-coach` (in-progress, no demoUrl, owner falls back to env), `fleet-tracker` (shipped, has demoUrl). `ProjectCard` maps `coverImage` filename → static import (`coverMap`) for `astro:assets`; `<iframe>` only when `demoUrl` present (has `title`, `loading="lazy"`, restrictive `sandbox`, `h-80`).
- **`SEO` (`lib/seo.ts` + `components/seo/SEO.astro`):** `buildMeta()` truncates description to 160 chars, defaults `ogImage` to `/og-default.png`. `SEO.astro` emits title/meta/canonical/OG/Twitter; no page hand-writes `<head>` tags. Homepage adds `Person` JSON-LD (`sameAs` from `social.ts`); posts add `BlogPosting` JSON-LD (headline, dates, author).
- **Env (`import.meta.env`):** `PUBLIC_GITHUB_USERNAME` (fallback repo owner), `PUBLIC_FORMSPREE_ID` (contact branch). Both optional; missing values degrade to static fallbacks, never throw.

## 7. Design System

**Source:** `tailwind.config.ts` is the token authority; `global.css` `:root` owns motion/layout vars. Components use utilities only — raw hex / raw `ms` / raw easing in a component is a bug (the former `.project-card` bare-`ease-out` violation was fixed to `var(--ease-signature)`; none remain known).

- **Colors (live):** `background.DEFAULT #e6e6e6`, `background.nav #e6e6e6`, `background.dark #0f0f0f`; `text.primary #1e1e1f`, `text.secondary #29292b` (Experience bullets), `text.muted #7f7f80` (metadata only), `text.inverse #f2f2f2`, `text.inverse-muted #a9a9aa`; `accent.DEFAULT #1e1e1f` (button fill — black-on-cream is the only interactive color), `accent.hover #545455`, `accent.warm #C97C4B` / `warm-light #E3A26B` (photographic extensions only); `border.hairline #bfbfbf`, `hairline-inverse rgba(255,255,255,0.12)`.
- **Type (live):** `display: Geist`, `mono: PT Mono`, `namemark: Geist` (self-hosted via `@fontsource`; the old Archivo/Plex-Mono/Archivo-Black plan and the NType 82 / Coolvetica track are retired — never pull from unofficial mirrors). Fluid sizes: `hero clamp(3rem, 12vw+0.5rem, 11.2rem)` (~179px tier: Hero name + Introduction), `h2 clamp(2rem, 4vw+0.875rem, 4.5rem)` (~72px tier: Experience/Selected Works/Skills), `h3` max `2.25rem`, `body 1.125rem/1.6` (also buttons, pills, footer links), `label 0.6875rem/0.08em`, plus `h4–h6` and `nav` clamps. (The old `architecture.md` §4.2 values — `h3 1.75rem`, `body 0.9375rem`, `section 9rem` — are stale; live config wins.)
- **Shape/shadow:** `borderRadius` `none: 0`, `pill: 9999px`, plus `button: 5px` (reference `.button` treatment). `boxShadow.none`. Depth = `.project-card` offset-stack (solid `bg-accent` `layer-back` plate at 8px behind `layer-front`), never shadows.
- **Layout vars (`global.css`, live):** `--section-rhythm: 10rem`, `--gutter-width: 2rem`, `--grid-columns: 6`, `--label-col-width: 8rem`, `--content-col-max: 65ch`. Narrow-label / wide-content split must consume these, never local widths. Grid strength 10% (`color-mix`). `body` carries `overflow-x: clip` (supports the Contact full-bleed breakout; `clip` preserves no-scroll-container behavior).
- **Motion vars:** `--ease-signature: cubic-bezier(0.16,1,0.3,1)`, `--dur-fast: 300ms`, `--dur-base: 350ms`, `--dur-entrance: 600ms`, `--stagger: 150ms`. All component transitions reference these. `prefers-reduced-motion` handled once globally (durations → 0.01ms); no per-component overrides. Footer name-mark rotation must stay `rotate(180deg)` in normal flex flow (`justify-end`), never absolute positioning (clips above viewport).
- **Section-specific treatments (post-round + follow-up fixes):** Hero heading top-left (`justify-start`, no `tracking-tightest`) with © superscript (`text-h4` muted, raised) and `[Intro]` eyebrow; portrait top-anchored (`top-16/md:top-20`) height-capped (`h-[calc(100dvh-12rem)]`, `max-w-[36vw]`); Introduction heading full-width above grid; Experience 3-col rows (`8rem 1fr 1fr`, `gap-8`, dates wrap); Projects heading `mb-16`, cards open (no border/padding) with `gap-x-3` slash-separated tags; Skills in `md:grid-cols-3` with `rounded-button` pills; Contact full-bleed breakout + `py-40`; footer `pt-40 pb-8`, wordmark row `justify-between` (home `text-h5` link left, rotated mark right) pulled `-mt-40` flush-top at `clamp(8rem, 22vw, 14rem)`, corner-anchored `text-body` coords/copyright row, `text-body` social/contact rows; nav brand link without `tracking-tightest`, Contact entry removed (Home / Work / Writing only).

**Reusable behavior classes (all in `global.css`):** `.link-underline` (scaleX reveal with origin flip, incl. `:focus-visible`), `.arrow-swap` (diagonal arrow slide on hover/focus of parent link/button), `.reveal` / `.reveal-hero` + `.reveal-group` stagger + `.no-reveal` opt-out (CTAs/arrows excluded), `.project-card` lift (`translateY(-6px)` + front-layer offset widen, incl. `:focus-within`), `.site-nav.is-scrolled` (transparent → opaque `bg-nav` + hairline border; blur/shadow deliberately rejected), `.site-cursor` (fixed dot, fine-pointer only, reduced-motion inert).

## 8. Assets, Fonts, Performance

- **Images:** `ProjectCard` uses `<Image width=800 height=450 loading="lazy">` (prevents CLS, lazy below fold). Hero portrait is the LCP exception: `loading="eager"` + `fetchpriority="high"`. Decorative hairline grid is a CSS pattern, not DOM nodes.
- **Fonts:** Self-hosted `woff2` in `public/fonts/` via `@font-face` (`font-display: swap`): Geist 400/500/600/700/900 + PT Mono 400, sourced from `@fontsource` `files/` output. `BaseLayout` preloads only above-fold weights (Geist 500/600 + PT Mono 400); heavier Geist weights load un-preloaded.
- **JS budget:** zero JS on non-interactive pages; otherwise two sub-KB scripts + cursor/reveal handlers, no framework runtime.
- **CSS:** single Tailwind JIT stylesheet, purged at build (Vite emits it under a rotating `dist/_astro/` chunk name — currently the `_slug_` chunk — plus one inlined `<style>` for scoped component CSS).
- **Caching (`vercel.json`):** `/_astro/*` + `/fonts/*` → `public, max-age=31536000, immutable`; HTML documents → short/no-cache.

## 9. Accessibility & SEO

- Landmarks: `<nav>` (primary + social), `<main id="main-content">`, `<section aria-labelledby>`, `<footer>`; skip-link; `:focus-visible` outline; `::selection` inversion; every hover interaction has a `:focus-visible` equivalent; form labels associated + `aria-live` status; iframes titled.
- SEO: single `<SEO.astro>` path, canonical per page, OG/Twitter cards, `Person` + `BlogPosting` JSON-LD from already-validated data, `sitemap-index.xml` via plugin, `public/robots.txt` pointing at it.

## 10. Invariants (do not violate without ADR)

1. Stay `output: 'static'`, no adapter, no SSR/hybrid.
2. No framework island, no global store (use `CustomEvent` on `document` if cross-component signal ever needed).
3. GitHub fetch stays client-side in `GitHubStats.astro` via `lib/github.ts`; graceful static fallback required.
4. All meta through `<SEO.astro>`; all images through `astro:assets`; only token colors/radii/motion values.
5. Ship Geist / PT Mono via `@fontsource`; never pull NType 82 / Coolvetica from unofficial mirrors.

## 11. Visual Audit — reference (`audit/ref-*`) vs current (`audit/new*`), 2026-09-09

> Screenshots predate the TASK.md round (nav pill still visible, centered hero, 2-col Experience, gray card plate), so they verify structure/direction, not final pixels. A fresh capture is still needed to confirm the round's spacing/scale judgments visually.

- **Hero:** ref uses an image wordmark + photo portrait + top-right CONTACT pill; ours uses live `Arnav` text at the `hero` token + SVG placeholder portrait, pill removed per brief, heading moved top-left. Matches in layout grammar (huge left wordmark, right portrait, hairline grid, `/`-separated mono nav).
- **Introduction:** ref = giant left-edge heading + `ABOUT` label / wide body column + pill CTAs. Ours matches structurally (full-width `text-hero` heading above the label/content grid); body now `text-primary`.
- **Experience/Services:** ref "My Services" is 3-col (`[01]` / Title / description) with hairline row dividers — the direct model for our 3-col rebuild (date / title / bullets). Match.
- **Projects:** DIVERGENCE — ref is a single-column staggered stack of overlapping full-bleed images with mono `CLIENT … YEAR` captions; ours is a 2-col card grid with bordered cards, tags, and demo iframes. The 2-col grid was confirmed working per the brief and kept deliberately; flag before "fixing" toward the ref.
- **Connect:** ref = full-bleed dune photograph with top scrim, display heading left, copy + text CTA right. Ours now matches the full-bleed structure but ships the interim warm-gradient placeholder (no photo asset) and keeps the `h2` tier (the `hero` tier cannot fit its grid column). Photo swap is the remaining gap.
- **Footer:** ref = `KATERINA` wordmark left, social/contact stacked right, coords bottom-left, legal bottom-right. Ours deliberately flips this per the Birka/Coolvetica direction: oversized rotated `arnav.` top-right, contact rows left, corner-anchored coords/copyright bottom row. `ref-upside-down.png` confirms the rotated-chunky-wordmark source treatment.
- **Skills:** ref has no direct counterpart in the audit set; ours (labeled pill clusters, now `text-body`) follows the page's label+tag grammar.

## 12. Notable Drift / Open Items

- `TASK.md` (all 36 tasks) is complete and committed — it is now reference-only; the live loop is closed with `GOAL COMPLETE`.
- `architecture.md`/`design.md`/`implementation.md` are spec docs with known-stale patches (§4.2 old token values, Cloudflare mentions, NType/Coolvetica tracks); this file and `GENERATE-DESIGN.md` describe the code as it exists.
- No `404.astro` present (spec mentions one).
- Stale "Cloudflare Pages" strings remain in `About.astro` copy and `experience.ts` bullets (Vercel is the actual target).
- Hero intro paragraph and `ProjectCard` summary/description still render `text-text-muted` at `text-body` size (primary copy; no round task authorized the change).
- `main` lost its `max-w-7xl` container (now full-width minus gutters, to serve the in-flow grid) — every section spans full viewport width; restore per-section caps if contained measure is wanted back.
- Screenshots in `audit/` predate the round — recapture after deploy to close the visual-verification loop.
