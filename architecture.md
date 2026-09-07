# Portfolio Site — Architecture & Design Specification Document

**Prepared for:** autonomous execution by OpenCode
**Stack:** Astro (SSG) · Tailwind CSS · Cloudflare Pages · Astro Content Collections (Markdown + MDX via `@astrojs/mdx`) · astro:assets · vanilla JS islands
**Design source:** "Katerina" style guide (Swiss-editorial / technical-minimalist)
**Status:** Architecture phase only — no application code in this document

---

## 1. Architectural Overview & System Design

### 1.1 Core Pattern: Static-First Jamstack via Astro's Islands Architecture

The site is **100% statically generated** (`output: 'static'` in `astro.config.mjs`). There is no server runtime, no SSR, no ISR — Cloudflare Pages simply serves pre-built HTML/CSS/JS from the edge. This is the correct fit because every content source (bio, experience, skills, blog posts) is known at build time; the *only* truly dynamic piece is GitHub star/commit counts, which is handled as a narrow client-side exception rather than a reason to adopt SSR.

**Important terminology correction for this stack:** the brief asks for "Server Components vs Client Components," which is React/Next.js vocabulary. Astro's actual model is different and matters for how OpenCode should build this:

| Concept | Next.js (RSC model) | This project (Astro) |
|---|---|---|
| Default unit | Server Component | `.astro` component — renders to static HTML at build time, ships **zero** JS |
| Opt-in interactivity | `'use client'` + hydration | A `<script>` tag scoped inside an `.astro` file, OR a UI-framework component with a `client:*` directive |
| Framework needed for interactivity? | Yes, always React | **No.** This stack has no React/Vue/Svelte in it. Every interactive behavior specified (underline hover, card lift, sticky-nav swap, entrance animations, GitHub stats fetch) is achievable with plain DOM APIs |

**Ruling for OpenCode:** do not introduce React/Vue/Svelte/Solid "just to get an island." Every interactive piece in this spec is built as a `<script>` block co-located inside its `.astro` component (Astro scopes and bundles these automatically per-page). This keeps the zero-JS-by-default promise intact — pages that don't need the GitHub-stats fetch or scroll listeners ship no JS at all beyond the two shared behavior scripts described in §3.

### 1.2 Data Flow

Three distinct data paths, each with a different trust/freshness model:

1. **Structured local data (Experience, Skills, Projects metadata, Nav links, Social links)**
   `src/data/*.ts` — plain typed TS modules (see §5 for interfaces) → imported directly by `.astro` pages/components at build time → compiled into static HTML. No fetch, no loading state, no client JS.

2. **Long-form content (optional Blog)**
   `src/content/blog/*.md` or `*.mdx` → validated against a Zod schema in `src/content.config.ts` → queried at build time with `getCollection('blog')` → each entry statically rendered through `src/pages/writing/[...slug].astro`. Type-checking happens at build time, so a malformed frontmatter field fails the build, not the browser.

3. **Live, must-stay-fresh data (GitHub repo stats)**
   Cannot be resolved at build time without going stale between deploys, and the brief explicitly calls for a **client-side** fetch. Flow:
   - `.astro` component renders a **static skeleton** (placeholder dashes) for stars/last-commit — this is what search engines and no-JS visitors see.
   - A scoped `<script>` runs `fetchRepoStats(name, owner?)` (see §5.3) against `api.github.com` after the page is interactive — `owner` falls back to `PUBLIC_GITHUB_USERNAME` when the project entry doesn't specify one.
   - On success, the DOM nodes are progressively updated in place.
   - On failure (network error, or the 60 req/hr unauthenticated rate limit being hit), the skeleton is swapped for a static fallback string ("— see GitHub") rather than left blank or thrown as an unhandled error. This is a hard requirement, not a nice-to-have, since the rate limit is shared across every visitor's IP-adjacent NAT and *will* occasionally be hit.

4. **Contact form**
   Either a `mailto:` anchor (zero infrastructure) or a plain HTML `<form action="https://formspree.io/f/{id}" method="POST">`. Formspree hosts the receiving endpoint — there is no backend code in this repository under either option. Client JS is optional here (only needed for inline success/error messaging instead of a full-page redirect).

### 1.3 Performance Strategy

- **JS budget:** zero JS on pages with no GitHub-stats card; two small shared scripts (`entrance.ts` for `IntersectionObserver` reveals, `sticky-nav.ts` for the scroll-based background swap) on every page, each under ~1KB gzipped, no bundler runtime overhead since there's no framework.
- **Images:** every content image goes through `astro:assets` (`<Image />` / `<Picture />`), never a raw `<img src="/public/...">` for anything sourced from `src/assets/`. This gives automatic `width`/`height` (prevents CLS), WebP/AVIF output, and lazy-loading by default. The Hero portrait is the one exception: mark it `loading="eager"` and `fetchpriority="high"` since it's the LCP element.
- **Fonts:** self-host Archivo (display) + IBM Plex Mono (labels/body) as variable `woff2` files, `font-display: swap`, preloaded in `<head>` via `<link rel="preload" as="font">` for the two weights actually used above the fold. Archivo Black (footer name-mark) loads separately and un-preloaded since it's below the fold on first paint.
- **CSS:** single Tailwind-generated stylesheet, JIT-purged of unused classes at build time — no separate CSS-in-JS runtime.
- **Decorative hairline grid** (the 5–6 vertical guide lines from the style guide) is implemented once as a repeating CSS `background-image` (a tiny inline SVG or `linear-gradient` pattern) on a single wrapper element — not as five to six real DOM elements per page.
- **Cloudflare Pages:** static assets are edge-cached globally by default; a `public/_headers` file sets long `Cache-Control: immutable` on hashed asset filenames and short/no-cache on HTML documents.

### 1.4 SEO Strategy

- A single `<SEO.astro>` component wraps `<title>`, meta description, canonical URL, Open Graph, and Twitter Card tags, driven by props passed from each page (title/description/ogImage). No page hand-writes its own `<head>` meta block — everything routes through this one component so tags never drift.
- **JSON-LD:** a `Person` schema on the homepage (name, jobTitle, sameAs → social links) and a `BlogPosting` schema per rendered blog post, generated from the same frontmatter Content Collections already validates — no duplicate hand-maintained data.
- `@astrojs/sitemap` integration generates `sitemap-index.xml` automatically at build time; a static `robots.txt` in `public/` points to it.
- Semantic landmarks throughout (`<nav>`, `<main>`, `<section aria-labelledby="...">`, `<footer>`) — this also directly serves the accessibility of the asymmetric, visually-driven layout described in the style guide.

---

## 2. Production File Directory Structure

```
portfolio/
├── astro.config.mjs                 # output: 'static'; integrations: tailwind, sitemap, mdx
├── tailwind.config.ts               # full token mapping — see §4
├── tsconfig.json                    # strict mode on; path alias "@/*" → "src/*"
├── package.json                     # deps include @astrojs/tailwind, @astrojs/sitemap, @astrojs/mdx (required for .mdx posts — see note below)
├── wrangler.toml                    # Cloudflare Pages project config (optional, if not using dashboard-only setup)
├── .env.example                     # PUBLIC_FORMSPREE_ID, PUBLIC_GITHUB_USERNAME (fallback repo owner for GitHubStats, see §5.3) — no secrets, everything here is public-safe
├── AGENTS.md                        # generated verbatim from §6 at project init — not hand-written separately, and not just documentation embedded in this spec
│
├── public/
│   ├── _headers                     # Cloudflare cache-control rules
│   ├── robots.txt
│   ├── favicon.svg
│   └── fonts/
│       ├── archivo-variable.woff2
│       ├── ibm-plex-mono-variable.woff2
│       └── archivo-black.woff2
│
├── src/
│   ├── content.config.ts            # Content Collections schema (Zod) — blog frontmatter contract, §5.2
│   │
│   ├── content/
│   │   └── blog/
│   │       ├── example-post.md
│   │       └── ...
│   │
│   ├── data/                        # Static typed data — imported at build time, no fetching
│   │   ├── nav.ts                   # NavLink[]
│   │   ├── social.ts                # SocialLink[]
│   │   ├── experience.ts            # ExperienceEntry[]
│   │   ├── projects.ts              # Project[] — includes fleet tracker, resume builder, future entries
│   │   └── skills.ts                # SkillCategory[]
│   │
│   ├── types/
│   │   └── index.ts                 # All shared TS interfaces, §5.1
│   │
│   ├── lib/                         # Pure utility functions, framework-agnostic
│   │   ├── github.ts                # fetchRepoStats() contract + in-memory/sessionStorage cache, §5.3
│   │   ├── date.ts                  # formatDateRange() for experience/blog dates
│   │   └── seo.ts                   # buildMeta() helper feeding <SEO.astro>
│   │
│   ├── styles/
│   │   └── global.css               # @tailwind directives + :root CSS custom properties (motion tokens, §4.3) + @font-face blocks
│   │
│   ├── scripts/                     # Shared client-side behavior, imported via <script> in layouts
│   │   ├── entrance.ts              # IntersectionObserver → .reveal / .reveal-group toggling
│   │   └── sticky-nav.ts            # scroll listener → .is-scrolled toggling on <SiteNav>
│   │
│   ├── layouts/
│   │   ├── BaseLayout.astro         # <html>/<head>/<body> shell, imports global.css, mounts <SiteNav> + <SiteFooter>, injects <SEO>
│   │   └── BlogPostLayout.astro     # extends BaseLayout; adds BlogPosting JSON-LD + article-specific header
│   │
│   ├── components/
│   │   ├── seo/
│   │   │   └── SEO.astro
│   │   ├── nav/
│   │   │   ├── SiteNav.astro
│   │   │   └── NavLink.astro
│   │   ├── ui/                      # Small, reusable, purely presentational pieces
│   │   │   ├── Button.astro         # pill CTA, trailing-arrow slot
│   │   │   ├── Eyebrow.astro        # bracketed monospace label, e.g. [INTRO]
│   │   │   ├── Divider.astro        # 1px hairline rule
│   │   │   └── HairlineGrid.astro   # decorative background grid, single instance in BaseLayout
│   │   ├── sections/                # One component per landing-page section
│   │   │   ├── Hero.astro
│   │   │   ├── About.astro
│   │   │   ├── Experience.astro
│   │   │   ├── ExperienceRow.astro
│   │   │   ├── Projects.astro
│   │   │   ├── ProjectCard.astro
│   │   │   ├── GitHubStats.astro    # the one component with a live-fetch <script>
│   │   │   ├── Skills.astro
│   │   │   ├── SkillPill.astro
│   │   │   └── Contact.astro
│   │   └── footer/
│   │       └── SiteFooter.astro     # dark inversion, rotated name-mark, social links
│   │
│   └── pages/
│       ├── index.astro              # composes Hero, About, Experience, Projects, Skills, Contact
│       ├── writing/
│       │   ├── index.astro          # blog index — lists getCollection('blog')
│       │   └── [...slug].astro      # individual post route, uses BlogPostLayout
│       └── 404.astro
│
└── astro-env.d.ts                   # ambient types for import.meta.env vars
```

**On `AGENTS.md`:** this is not a documentation-only artifact — the content in §6 below must be written out as a literal `AGENTS.md` file at the project root during initialization, not merely referenced from `architecture.md`. Coding agents in this family auto-load a root `AGENTS.md` as persistent context, which is a materially stronger guarantee than expecting every task description to remember to cite "architecture.md §6."

**On MDX:** the Content Collections requirement (§1.2) covers both `.md` and `.mdx` posts, which means `@astrojs/mdx` is a required dependency, not an optional one — it must be installed and registered in `astro.config.mjs`'s `integrations` array during initial project setup, alongside `@astrojs/tailwind` and `@astrojs/sitemap`.

**Grouping rationale (mapping the brief's requested categories onto Astro's actual primitives, since Astro has no "Context/State providers" concept):**

| Brief's category | Where it lives here | Why |
|---|---|---|
| Configuration | root-level `*.config.*`, `tsconfig.json`, `wrangler.toml` | standard Astro/Cloudflare convention |
| Context/State providers | *(intentionally absent — see §3.4)* | no global client state exists in this app; module-scoped `<script>` state per behavior is sufficient |
| Shared UI components | `src/components/ui/` | pure, prop-driven, zero business logic |
| Layouts | `src/layouts/` | the only place `<html>`/`<head>` is written |
| Features/Pages | `src/pages/`, `src/components/sections/` | one section component per landing-page block, one route per URL |
| Hooks | `src/scripts/` (Astro's nearest equivalent — no React hooks exist here) | encapsulated, reusable client behavior |
| Utility functions | `src/lib/` | pure functions, no DOM/browser access except `github.ts`'s fetch |

---

## 3. Complete Component Hierarchy & Boundary Map

**Boundary legend** (replacing RSC/`'use client'` with Astro's real distinction, per §1.1):
- 🟢 **Static** — plain `.astro`, renders once at build time, zero runtime JS
- 🟡 **Interactive** — still a plain `.astro` file, but contains a scoped `<script>` that runs client-side after load

### 3.1 `BaseLayout.astro` (🟢 shell) wraps every page
```
BaseLayout.astro                     🟢
├── SEO.astro                        🟢  (props: title, description, ogImage)
├── HairlineGrid.astro               🟢  (single background instance, position: fixed)
├── SiteNav.astro                    🟡  (sticky-nav.ts scroll listener toggles .is-scrolled)
│   └── NavLink.astro × N            🟢  (CSS-only underline-on-hover via .link-underline; no JS)
├── <slot />                         — page content injected here
└── SiteFooter.astro                 🟢  (rotated name-mark is pure CSS transform, no JS needed)
```

### 3.2 `index.astro` (homepage) composition
```
index.astro                          🟢
├── Hero.astro                       🟡  (entrance.ts hero-only blur+slide-in; CTA buttons are Button.astro)
│   └── Button.astro × 2             🟢  (resume download, contact CTA — arrow-swap hover is pure CSS)
├── About.astro                      🟡  (entrance.ts fade-slide-up on scroll into view)
├── Experience.astro                 🟡  (entrance.ts staggers .reveal-group children)
│   └── ExperienceRow.astro × 3      🟢  (label column + content column split, per style guide §6)
├── Projects.astro                   🟡  (entrance.ts staggers cards)
│   └── ProjectCard.astro × N        🟡  (card-lift hover is CSS; embeds an <iframe> demo + GitHubStats)
│       └── GitHubStats.astro        🟡  (the ONLY component with a data-fetching <script> — calls fetchRepoStats)
├── Skills.astro                     🟡  (entrance.ts fade-slide-up)
│   └── SkillPill.astro × N          🟢  (static tag, grouped by category)
└── Contact.astro                    🟡  (only if using inline Formspree success/error messaging;
                                          🟢 if using a bare mailto: link instead — see §5.4 for the toggle)
```

### 3.3 `writing/` (optional blog)
```
writing/index.astro                  🟢  (getCollection('blog'), sorted by date, list of static cards)
writing/[...slug].astro              🟢  (uses BlogPostLayout; MDX content renders to static HTML —
                                          MDX components used inside posts must themselves be 🟢 unless
                                          a post specifically needs an interactive embed, which is out of
                                          scope for this spec and should be flagged for a follow-up ADR
                                          before OpenCode improvises one)
```

### 3.4 State Management Boundaries

There is **no global state management library** in this stack (no Redux/Zustand/Context — those are React concepts and this is not a React app). State lives at exactly two scopes:

1. **Build-time / static:** everything in `src/data/*.ts` and Content Collections. This "state" is baked into the HTML and never changes without a rebuild.
2. **Module-scoped client state**, one instance per behavior, each fully self-contained in its own `<script>`:
   - `sticky-nav.ts`: a single boolean (`isScrolled`), toggled by a `scroll` listener, applied as a class swap on one element. Lives entirely inside `SiteNav.astro`'s script block.
   - `entrance.ts`: an `IntersectionObserver` instance per page, with no state beyond "has this element already animated" (tracked via a `data-revealed` attribute directly on the DOM node — no JS variable needed).
   - `github.ts`: the GitHub stats fetch result is cached in `sessionStorage` (keyed by `owner/repo`) purely to avoid re-spending rate-limit budget on back/forward navigation within the same session — this is a cache, not shared application state, and each `GitHubStats.astro` instance reads/writes only its own key.

**Rule for OpenCode:** if a future feature seems to need state shared across more than one component instance (e.g., a dark-mode toggle affecting both nav and footer simultaneously), the correct pattern is a tiny custom event dispatched on `document` and listened to by each independent component script — **not** a new state library. Reaching for a framework/store to solve this is an anti-pattern flagged explicitly in §6.

---

## 4. Design System Tokens & Configuration Mapping

### 4.1 Font Substitution Note

The tech stack specifies **freely-licensed fallbacks now** (Archivo, IBM Plex Mono, Archivo Black) rather than the style guide's aspirational NType 82 / Coolvetica, pending license confirmation. The token config below is built so swapping in the licensed fonts later is a **one-line change per family** (just prepend the licensed font name to each array) — no restructuring required.

### 4.2 `tailwind.config.ts`

```ts
import type { Config } from 'tailwindcss';

export default {
  content: ['./src/**/*.{astro,html,md,mdx,ts,tsx}'],
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
          DEFAULT: '#111110',
          warm: '#C97C4B',
          'warm-light': '#E3A26B',
        },
        border: {
          hairline: '#D3D1C9',
          'hairline-inverse': 'rgba(255,255,255,0.12)',
        },
      },
      fontFamily: {
        // Swap in '"NType 82"' / '"NType 82 Mono"' as the first entry once licensed files exist.
        display: ['Archivo', 'ui-sans-serif', 'sans-serif'],
        mono: ['"IBM Plex Mono"', 'ui-monospace', 'monospace'],
        // Footer name-mark only — swap in 'Coolvetica' as first entry pending its license check.
        namemark: ['"Archivo Black"', 'sans-serif'],
      },
      fontSize: {
        // Fluid via clamp(min, preferred, max) — the style guide's desktop sizes (8.75rem /
        // 4.5rem) are the max end only; without this, the hero headline overflows badly
        // below ~768px. Min values chosen to stay legible on a 375px viewport.
        hero: ['clamp(3rem, 6vw + 1.5rem, 8.75rem)', { lineHeight: '0.9', letterSpacing: '-0.02em', fontWeight: '500' }],
        h2: ['clamp(2.25rem, 4vw + 1rem, 4.5rem)', { lineHeight: '1', letterSpacing: '-0.01em', fontWeight: '600' }],
        h3: ['clamp(1.375rem, 1vw + 1.125rem, 1.75rem)', { lineHeight: '1.2', fontWeight: '500' }],
        body: ['0.9375rem', { lineHeight: '1.6' }],
        label: ['0.6875rem', { lineHeight: '1', letterSpacing: '0.08em', fontWeight: '500' }],
      },
      borderRadius: {
        none: '0px',
        pill: '9999px',
      },
      spacing: {
        section: '9rem',
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
    },
  },
  plugins: [],
} satisfies Config;
```

### 4.3 `src/styles/global.css` — Motion & Layout Custom Properties

These stay as raw CSS custom properties (not Tailwind tokens) because they're consumed by hand-written `<style>` blocks for the bespoke animations (underline reveal, arrow swap, card lift) that don't map cleanly to utility classes:

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

:root {
  --ease-signature: cubic-bezier(0.16, 1, 0.3, 1);
  --dur-fast: 300ms;
  --dur-base: 350ms;
  --dur-entrance: 600ms;
  --stagger: 150ms;

  /* Layout grid constants — prevent drift between components */
  --grid-columns: 6;                 /* decorative hairline vertical guides */
  --gutter-width: 2rem;
  --section-rhythm: 9rem;            /* vertical space between major sections */
  --label-col-width: 8rem;           /* narrow eyebrow/label column, per style guide §6 */
  --content-col-max: 32ch;           /* narrow body-copy column width */
}

@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }
}

@font-face {
  font-family: 'Archivo';
  src: url('/fonts/archivo-variable.woff2') format('woff2-variations');
  font-weight: 400 700;
  font-display: swap;
}
@font-face {
  font-family: 'IBM Plex Mono';
  src: url('/fonts/ibm-plex-mono-variable.woff2') format('woff2-variations');
  font-weight: 400 500;
  font-display: swap;
}
@font-face {
  font-family: 'Archivo Black';
  src: url('/fonts/archivo-black.woff2') format('woff2');
  font-weight: 900;
  font-display: swap;
}
```

**Anti-CLS rule:** `--label-col-width` and `--content-col-max` are declared once here and consumed by every section that uses the "narrow label + wide content" split (Intro, Experience rows, Projects) — no component should hard-code its own column widths, since drift between sections is exactly what would break the asymmetric grid's visual rhythm.

---

## 5. Technical API & Data Schema Contracts

### 5.1 Core TypeScript Interfaces (`src/types/index.ts`)

```ts
export interface NavLink {
  label: string;      // e.g. "WORK"
  href: string;        // "#projects" or "/writing"
}

export interface SocialLink {
  platform: 'GitHub' | 'LinkedIn' | 'Email' | 'X';
  href: string;
  label: string;       // accessible label, e.g. "GitHub profile"
}

export interface ExperienceEntry {
  id: string;                // slug, e.g. "acme-internship-2025"
  company: string;
  role: string;
  startDate: string;         // ISO date "2025-06-01"
  endDate: string | 'present';
  location?: string;
  impactBullets: string[];   // pre-written, no markdown — plain strings rendered as <li>
}

export interface Project {
  id: string;                  // slug, used for anchors and OG image lookup
  title: string;
  summary: string;             // 1–2 sentence dek
  description: string;         // longer case-study copy, plain string (or MDX path if it grows)
  demoUrl?: string;            // embedded via <iframe>, omit to hide the demo pane
  githubRepo?: { owner?: string; name: string }; // omit entirely to hide GitHubStats; omit `owner` to fall back to PUBLIC_GITHUB_USERNAME (see §5.3)
  tags: string[];               // e.g. ["TypeScript", "FastAPI", "React Native"]
  coverImage: string;           // path under src/assets/, passed to astro:assets <Image />
  status: 'shipped' | 'in-progress' | 'case-study';
}

export interface SkillCategory {
  category: 'Languages' | 'Frameworks' | 'Tools';
  items: string[];
}

export interface GitHubRepoStats {
  stars: number;
  lastCommitISO: string;       // ISO date string of most recent commit
  fetchedAt: number;           // Date.now(), used for sessionStorage cache invalidation
}
```

**Worked example** (`src/data/projects.ts`), illustrating the shape for the "resume builder" case study named in the brief:

```ts
import type { Project } from '@/types';

export const projects: Project[] = [
  {
    id: 'mira-coach',
    title: 'Mira Coach',
    summary: 'An AI-powered resume builder and career coach.',
    description:
      'A monorepo app pairing a FastAPI + SQLModel backend with an Expo React Native ' +
      'frontend — structured resume editing, PDF export, ATS scoring, job-description ' +
      'comparison, and an AI coaching assistant.',
    githubRepo: { name: 'mira-coach' }, // owner omitted — falls back to PUBLIC_GITHUB_USERNAME
    tags: ['FastAPI', 'SQLite', 'Expo', 'React Native', 'TypeScript'],
    coverImage: 'mira-coach-cover.png',
    status: 'in-progress',
  },
  // fleet-tracker entry, future entries, etc.
];
```

### 5.2 Content Collections Schema (`src/content.config.ts`)

```ts
import { defineCollection, z } from 'astro:content';

const blog = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    description: z.string().max(160),
    publishDate: z.coerce.date(),
    updatedDate: z.coerce.date().optional(),
    tags: z.array(z.string()).default([]),
    draft: z.boolean().default(false),
    coverImage: z.string().optional(),
  }),
});

export const collections = { blog };
```

A malformed post frontmatter fails `astro build`, not runtime — this is the type-checking guarantee the brief asked for.

### 5.3 GitHub Live-Stats Fetch Contract (`src/lib/github.ts`)

```ts
import type { GitHubRepoStats } from '@/types';

const CACHE_TTL_MS = 1000 * 60 * 30; // 30 min — respects the 60 req/hr unauthenticated limit

export async function fetchRepoStats(
  name: string,
  owner: string = import.meta.env.PUBLIC_GITHUB_USERNAME
): Promise<GitHubRepoStats | null> {
  if (!owner) return null; // no explicit owner and no env fallback configured — render static fallback
  const cacheKey = `gh-stats:${owner}/${name}`;
  const cached = sessionStorage.getItem(cacheKey);
  if (cached) {
    const parsed: GitHubRepoStats = JSON.parse(cached);
    if (Date.now() - parsed.fetchedAt < CACHE_TTL_MS) return parsed;
  }

  try {
    const [repoRes, commitsRes] = await Promise.all([
      fetch(`https://api.github.com/repos/${owner}/${name}`),
      fetch(`https://api.github.com/repos/${owner}/${name}/commits?per_page=1`),
    ]);
    if (!repoRes.ok || !commitsRes.ok) return null; // triggers static fallback, never throws to caller

    const repo = await repoRes.json();
    const commits = await commitsRes.json();

    const stats: GitHubRepoStats = {
      stars: repo.stargazers_count,
      lastCommitISO: commits[0]?.commit?.committer?.date ?? repo.pushed_at,
      fetchedAt: Date.now(),
    };
    sessionStorage.setItem(cacheKey, JSON.stringify(stats));
    return stats;
  } catch {
    return null; // network failure — caller renders the static fallback string
  }
}
```

**Contract for the calling component (`GitHubStats.astro`'s `<script>`):** always render the static skeleton server-side first; on `null` — whether from a fetch failure or because no `owner` was supplied and `PUBLIC_GITHUB_USERNAME` is unset — replace with a plain "— see GitHub" link rather than leaving empty nodes or logging a visible error.

### 5.4 Contact Form Contract

Two supported shapes — pick one per environment via `PUBLIC_FORMSPREE_ID`:

```ts
// If PUBLIC_FORMSPREE_ID is set: render a real <form> posting to
// `https://formspree.io/f/${import.meta.env.PUBLIC_FORMSPREE_ID}`.
// If it's unset: render a plain `mailto:` <Button> instead — no conditional
// client JS needed either way, this branch resolves entirely at build time.
```

---

## 6. OpenCode-Ready Architecture Summary (AGENTS.md Blueprint)

```markdown
# AGENTS.md — Portfolio Site Engineering Rules

## Stack (do not deviate without a written ADR)
Astro (static output only — never enable `output: 'server'` or `'hybrid'`), Tailwind CSS,
Cloudflare Pages, Astro Content Collections (`@astrojs/mdx` required for `.mdx` posts),
`@astrojs/sitemap`, astro:assets, vanilla JS. No React/Vue/Svelte/Solid. No client-side
state library. No CSS-in-JS.

## Naming conventions
- Components: PascalCase, `.astro` extension — `ProjectCard.astro`
- Routes/pages: kebab-case matching the URL — `src/pages/writing/index.astro`
- Data/lib/scripts: camelCase filenames — `fetchRepoStats`, `entrance.ts`
- Tailwind tokens: always reference `tailwind.config.ts` names (`text-text-muted`,
  `bg-background-dark`) — never a raw hex value in a class or inline style.

## Hard boundaries
1. Every local image goes through `astro:assets` (`<Image />`/`<Picture />`). A raw `<img
   src="/...">` for an asset under `src/assets/` is a build-blocking review failure.
2. `border-radius` is `0` everywhere except pill buttons (`rounded-pill`, i.e. `9999px`).
   No other radius value may be introduced.
3. No `box-shadow` anywhere. Depth comes only from the offset-stacking pattern already
   defined for `.project-card` — do not add drop shadows to "improve" hover states.
4. No new accent hues. The only interactive color is black-on-cream
   (`accent`/`accent-warm` exist solely for optional photographic-derived extensions,
   not for buttons/links).
5. GitHub stats are fetched **client-side only**, inside `GitHubStats.astro`'s own
   `<script>`, using the contract in `src/lib/github.ts`. Never move this fetch to
   build time (`getStaticPaths` / frontmatter) — it must reflect live data on every
   page load, degrading gracefully to a static string on failure or rate-limit.
6. The footer name-mark is rotated via `transform: rotate(180deg)` on an element kept
   in **normal document flow** (flex `justify-end`), never `position: absolute` +
   `transform-origin` — the latter clips the text above the viewport (see design-doc
   rationale). Do not "fix" this by switching to absolute positioning.
7. All motion durations/easings reference the CSS custom properties in
   `src/styles/global.css` (`--ease-signature`, `--dur-*`, `--stagger`) — never a
   hard-coded `ms` value or a different easing curve inside a component's own
   `<style>` block.
8. Respect `prefers-reduced-motion` globally — already handled once in
   `global.css`; do not add a second, component-local override that ignores it.
9. `--label-col-width` and `--content-col-max` (global.css) are the single source of
   truth for the narrow-label / wide-content split. No component defines its own
   column widths for this pattern.

## Anti-patterns (explicitly rejected during this architecture phase)
- Adding a UI framework "just for one interactive island" — every specified behavior
  is achievable with a scoped `<script>` in an `.astro` file (see §1.1/§3).
- Adding a global state store (Redux/Zustand/Context/nanostores) for cross-component
  communication — use a `CustomEvent` on `document` if that need ever arises (see §3.4).
- Fetching GitHub data at build time for "reliability" — this defeats the "live stats"
  requirement and was explicitly ruled out in §1.2.
- Introducing SSR/hybrid rendering to "simplify" the GitHub-stats fetch — not needed;
  the client-side contract in §5.3 already handles staleness and failure.
- Hand-writing `<head>` meta tags on individual pages instead of going through
  `<SEO.astro>` — causes tag drift across pages.
- Downloading NType 82 or Coolvetica from unofficial "free font" mirrors. Ship with
  the Archivo / IBM Plex Mono / Archivo Black fallbacks (already wired in
  `tailwind.config.ts`) until licensed files are confirmed and provided.

## Definition of done for any new component
- [ ] Zero client JS unless the component's behavior is listed in §3 as 🟡
- [ ] Passes through `astro:assets` for any image
- [ ] Uses only tokens from `tailwind.config.ts` / `global.css` custom properties
- [ ] Respects `prefers-reduced-motion`
- [ ] No new npm dependency added without updating the Stack section above
```

---

### Summary

This is a **static-only, framework-free, token-disciplined** Astro build. The single point of genuine runtime complexity — the live GitHub stats fetch — is isolated to one component with an explicit failure contract, and every other piece of interactivity (nav scroll state, scroll-triggered reveals, hover micro-interactions) is handled with plain CSS and two small shared scripts. The directory structure, component boundaries, and token mapping above should give OpenCode everything it needs to start scaffolding without introducing dependencies or patterns outside this spec.