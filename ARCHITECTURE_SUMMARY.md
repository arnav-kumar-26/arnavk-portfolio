# Portfolio Website — Architecture Summary

Generated from source inspection on 2026-09-07. Covers stack, routing, layouts, components, data flow, design tokens, motion, SEO, assets, and deployment.

## 1. Stack & Runtime Model

- **Astro 5 (static-only, SSG):** `astro.config.mjs` sets `output: 'static'` with no adapter. Integrations: `@astrojs/tailwind`, `@astrojs/sitemap`, `@astrojs/mdx`. No SSR/ISR, no server runtime.
- **Styling:** Tailwind CSS 3 (JIT-purged) + one hand-written `src/styles/global.css`. No UI framework, no CSS-in-JS, no client state library.
- **Content:** Astro Content Collections (`src/content.config.ts`, Zod validation) for blog; typed TS modules in `src/data/` for everything else.
- **Images:** `astro:assets` (`Image`/`Picture`) mandatory for local assets. No raw `<img src="/...">` for `src/assets/`.
- **JS model:** Zero JS by default. Interactivity = scoped `<script>` inside `.astro` files + two shared scripts in `src/scripts/`. No React/Vue/Svelte/Solid.
- **Hosting:** Vercel static (`vercel.json` header rules only). AGENTS.md still names Cloudflare Pages — `vercel.json` + `implementation.md` Phase 8 confirm Vercel is the actual target; AGENTS.md is stale on this point.
- **Deps (`package.json`):** runtime dep is only `astro`; dev deps are `@astrojs/mdx`, `@astrojs/sitemap`, `@astrojs/tailwind`, `tailwindcss`, `typescript`.

## 2. Directory Map (actual)

```
astro.config.mjs          # static output, site URL, tailwind+sitemap+mdx
tailwind.config.ts        # design tokens (colors, fonts, type scale, radius, motion)
tsconfig.json             # strict TS, @/* -> src/* alias
vercel.json               # Cache-Control headers (immutable /_astro + /fonts, no-cache HTML)
.env.example              # PUBLIC_GITHUB_USERNAME, PUBLIC_FORMSPREE_ID (all public-safe)
public/                   # favicon.svg, robots.txt, fonts/ (served verbatim)
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
    (404.astro per spec; verify presence before relying on it)
  assets/                 # hero-portrait.svg, mira-coach-cover.png, fleet-tracker-cover.png
```

## 3. Routing & Rendering

| Route | File | Data source | Output |
|---|---|---|---|
| `/` | `src/pages/index.astro` | `src/data/*` imports + `social.ts` for JSON-LD | Static HTML composing 6 sections + `Person` JSON-LD |
| `/writing` | `src/pages/writing/index.astro` | `getCollection('blog')`, filters `draft: true`, sorts `publishDate` desc | Static list |
| `/writing/:slug` | `src/pages/writing/[...slug].astro` | `getStaticPaths()` from non-draft posts, `post.render()` | Static HTML via `BlogPostLayout` + `BlogPosting` JSON-LD |
| SEO/sitemap | `@astrojs/sitemap` + `public/robots.txt` | Auto-generated `sitemap-index.xml` at build | Edge-cached static files |

All pages go through `BaseLayout.astro`, which owns `<html>/<head>/<body>`, imports `global.css`, mounts `HairlineGrid` + `SiteNav` + `SiteFooter`, injects `<SEO>`, preloads above-fold fonts, adds skip-link, and bundles `entrance.ts`.

## 4. Layouts & Component Hierarchy

```
BaseLayout.astro (static shell)
├── SEO.astro (static, props: title/description/canonical/ogImage/noindex)
├── HairlineGrid.astro (static decorative background, position: fixed pattern)
├── SiteNav.astro (INTERACTIVE — sticky-nav.ts toggles .is-scrolled)
│   └── NavLink.astro × N (static, .link-underline CSS hover)
├── <slot /> (page content)
├── SiteFooter.astro (static — rotated name-mark is pure CSS)
└── entrance.ts (global IntersectionObserver for .reveal)

index.astro (static composition)
├── Hero.astro (interactive — .reveal-hero blur+slide; Button × 2; portrait eager/high-priority)
├── About.astro (interactive — fade-slide-up on scroll)
├── Experience.astro (interactive — staggered .reveal-group)
│   └── ExperienceRow.astro × N (static label/content split)
├── Projects.astro (interactive — staggered cards)
│   └── ProjectCard.astro × N (interactive — CSS lift + <iframe> + GitHubStats)
│       └── GitHubStats.astro (INTERACTIVE — sole data-fetching component)
├── Skills.astro (interactive)
│   └── SkillPill.astro × N (static tags)
└── Contact.astro (conditionally interactive — script only when Formspree ID set)

BlogPostLayout.astro extends BaseLayout: adds BlogPosting JSON-LD + article header.
```

**Boundary legend:** static = build-time HTML, zero JS. Interactive = `.astro` + co-located `<script>`. Only three scripts ship: `entrance.ts` (global), `sticky-nav.ts` (nav only), `GitHubStats` fetch + optional Contact form handler.

## 5. Data Flow (4 paths)

1. **Static typed data (build-time):** `src/data/*.ts` → imported by sections at build → baked HTML. Interfaces in `src/types/index.ts` (`NavLink`, `SocialLink`, `ExperienceEntry`, `Project`, `SkillCategory`). No fetch, no loading state.
2. **Long-form content (build-time, validated):** `src/content/blog/*.md|mdx` → Zod schema in `content.config.ts` (title, description ≤160 chars, publishDate, updatedDate?, tags[], draft=false, coverImage?) → `getCollection('blog')`. Malformed frontmatter fails the build.
3. **Live GitHub stats (client-only exception):** `src/lib/github.ts` `fetchRepoStats(name, owner = PUBLIC_GITHUB_USERNAME)` → parallel `GET /repos/{owner}/{name}` + `/commits?per_page=1` → `{ stars, lastCommitISO, fetchedAt }` with 30-min `sessionStorage` cache (`gh-stats:owner/name`). `GitHubStats.astro` renders skeleton (`—` placeholders) server-side, fetches post-hydration, patches DOM in place; on `null` (network fail, non-2xx, rate-limit 60 req/hr, missing owner) reveals hidden "— see GitHub" link. Never moved to `getStaticPaths`/frontmatter — must stay live.
4. **Contact (build-time branch):** `PUBLIC_FORMSPREE_ID` set → `<form POST https://formspree.io/f/{id}>` + inline `fetch` handler with `aria-live` status; unset → `mailto:` `Button`. Branch resolves at build; no backend code in repo.

## 6. Key Contracts

- **`Project` (`types/index.ts` + `data/projects.ts`):** `{ id, title, summary, description, demoUrl?, githubRepo?: { owner?, name }, tags[], coverImage, status: shipped|in-progress|case-study }`. Current entries: `mira-coach` (in-progress, no demoUrl, owner falls back to env), `fleet-tracker` (shipped, has `demoUrl: https://example.com/fleet-demo`). `ProjectCard` maps `coverImage` filename → static import (`coverMap`) for `astro:assets`; `<iframe>` only when `demoUrl` present (has `title`, `loading="lazy"`, restrictive `sandbox`).
- **`SEO` (`lib/seo.ts` + `components/seo/SEO.astro`):** `buildMeta()` truncates description to 160 chars, defaults `ogImage` to `/og-default.png`. `SEO.astro` emits title/meta/canonical/OG/Twitter; no page hand-writes `<head>` tags. Homepage adds `Person` JSON-LD (`sameAs` from `social.ts`); posts add `BlogPosting` JSON-LD (headline, dates, author).
- **Env (`import.meta.env`):** `PUBLIC_GITHUB_USERNAME` (fallback repo owner), `PUBLIC_FORMSPREE_ID` (contact branch). Both optional; missing values degrade to static fallbacks, never throw.

## 7. Design System

**Source:** `tailwind.config.ts` is the token authority; `global.css` `:root` owns motion/layout vars. Components use utilities only — raw hex / raw `ms` / raw easing in a component is a bug.

- **Colors:** `background.DEFAULT #EAE8E2`, `background.nav #EAE8E2`, `background.dark #0A0A09`; `text.primary #111110`, `text.muted #83817B`, `text.inverse #F5F4EF`, `text.inverse-muted #9B9790`; `accent.DEFAULT #111110` (button fill — black-on-cream is the only interactive color), `accent.warm #C97C4B` / `warm-light #E3A26B` (photographic extensions only); `border.hairline #D3D1C9`, `hairline-inverse rgba(255,255,255,0.12)`.
- **Type:** `display: Archivo`, `mono: IBM Plex Mono`, `namemark: Archivo Black` (licensed NType 82 / Coolvetica intentionally deferred — do not pull from unofficial mirrors). Fluid sizes: `hero clamp(3rem, 6vw+1.5rem, 8.75rem)`, `h2 clamp(2.25rem, 4vw+1rem, 4.5rem)`, `h3 clamp(1.375rem, 1vw+1.125rem, 1.75rem)`, `body 0.9375rem/1.6`, `label 0.6875rem/0.08em`. (TASK.md proposes Geist/PT Mono + scale changes — not yet applied; `architecture.md` §4.2 is current truth.)
- **Shape/shadow:** `borderRadius` only `none: 0` and `pill: 9999px`; `boxShadow.none`. Depth = `.project-card` offset-stack (`layer-back` translated 8px behind `layer-front`), never shadows.
- **Layout vars (`global.css`):** `--section-rhythm: 9rem`, `--gutter-width: 2rem`, `--grid-columns: 6`, `--label-col-width: 8rem`, `--content-col-max: 32ch`. Narrow-label / wide-content split must consume these, never local widths.
- **Motion vars:** `--ease-signature: cubic-bezier(0.16,1,0.3,1)`, `--dur-fast: 300ms`, `--dur-base: 350ms`, `--dur-entrance: 600ms`, `--stagger: 150ms`. All component transitions reference these. `prefers-reduced-motion` handled once globally (durations → 0.01ms); no per-component overrides. Footer name-mark rotation must stay `rotate(180deg)` in normal flex flow (`justify-end`), never absolute positioning (clips above viewport).

**Reusable behavior classes (all in `global.css`):** `.link-underline` (scaleX reveal with origin flip, incl. `:focus-visible`), `.arrow-swap` (diagonal arrow slide on hover/focus of parent link/button), `.reveal` / `.reveal-hero` + `.reveal-group` stagger + `.no-reveal` opt-out (CTAs/arrows excluded), `.project-card` lift (`translateY(-6px)` + front-layer offset widen, incl. `:focus-within`), `.site-nav.is-scrolled` (transparent → opaque `bg-nav` + hairline border; blur/shadow deliberately rejected).

## 8. Assets, Fonts, Performance

- **Images:** `ProjectCard` uses `<Image width=800 height=450 loading="lazy">` (prevents CLS, lazy below fold). Hero portrait is the LCP exception: `loading="eager"` + `fetchpriority="high"`. Decorative hairline grid is a CSS pattern, not DOM nodes.
- **Fonts:** Self-hosted `woff2` in `public/fonts/` via `@font-face` (`font-display: swap`). `BaseLayout` preloads only above-fold weights (Archivo variable + Plex Mono 400/500); Archivo Black (footer) loads un-preloaded (below fold).
- **JS budget:** zero JS on non-interactive pages; otherwise two sub-KB scripts, no framework runtime.
- **CSS:** single Tailwind JIT stylesheet, purged at build.
- **Caching (`vercel.json`):** `/_astro/*` + `/fonts/*` → `public, max-age=31536000, immutable`; `/` + `/writing/*` → `public, max-age=0, must-revalidate`.

## 9. Accessibility & SEO

- Landmarks: `<nav>` (primary + social), `<main id="main-content">`, `<section aria-labelledby>`, `<footer>`; skip-link; `:focus-visible` outline; `::selection` inversion; every hover interaction has a `:focus-visible` equivalent; form labels associated + `aria-live` status; iframes titled.
- SEO: single `<SEO.astro>` path, canonical per page, OG/Twitter cards, `Person` + `BlogPosting` JSON-LD from already-validated data, `sitemap-index.xml` via plugin, `public/robots.txt` pointing at it.

## 10. Invariants (do not violate without ADR)

1. Stay `output: 'static'`, no adapter, no SSR/hybrid.
2. No framework island, no global store (use `CustomEvent` on `document` if cross-component signal ever needed).
3. GitHub fetch stays client-side in `GitHubStats.astro` via `lib/github.ts`; graceful static fallback required.
4. All meta through `<SEO.astro>`; all images through `astro:assets`; only token colors/radii/motion values.
5. Licensed fonts only from legitimate sources; ship Archivo/Plex Mono/Archivo Black fallbacks until then.

## 11. Notable Drift / Open Items

- `AGENTS.md` says Cloudflare Pages + `public/_headers`/`wrangler.toml`; repo actually ships `vercel.json` and no Cloudflare files — Vercel won (see `implementation.md` Phase 8). AGENTS.md needs a one-line update.
- `TASK.md` (Geist/PT Mono restyle, palette consolidation, button radius, spacing bumps) is pending and conflicts with current tokens — treat this summary as as-built, TASK.md as proposed.
- `architecture.md`/`design.md`/`implementation.md` are spec docs; this file describes the code as it exists.
