# Arnav — Developer Portfolio

> A fast, static-first developer portfolio. Zero-JS defaults, token-driven design, live GitHub stats as a narrow client exception.

**Live demo:** https://<your-domain>.vercel.app *(placeholder — replace with the production URL once the custom domain lands)*

---

## Overview

A static-first portfolio built with **Astro**, **Tailwind CSS**, and **TypeScript**, deployed on **Vercel**. Every page is pre-rendered to static HTML at build time (`output: 'static'`) and served from the edge — no server runtime, no client framework, no global state. The only runtime data fetch is a small, self-contained GitHub stats integration that degrades gracefully when offline or rate-limited.

The project is built spec-first: `architecture.md`, `design.md`, and `implementation.md` at the repo root govern the stack, the visual system, and the phased build plan.

## Key Features

- **Static-first architecture** — `output: 'static'` across the board; pre-built HTML/CSS/JS served from a global edge CDN. No SSR, no hydration framework.
- **Live GitHub stats** — `GitHubStats.astro` fetches stars / last-commit client-side via `fetchRepoStats()` (`src/lib/github.ts`), with `sessionStorage` caching (30 min TTL, respects the 60 req/hr unauthenticated limit) and a static "— see GitHub" fallback on failure.
- **Lightweight micro-animations** — scroll reveals via a single `IntersectionObserver` (`src/scripts/entrance.ts`), sticky-nav background swap (`src/scripts/sticky-nav.ts`), plus CSS-only underline reveals, arrow swaps, and card lifts. One signature easing (`--ease-signature`), `prefers-reduced-motion` respected globally.
- **Full SEO suite** — single `<SEO.astro>` component (title, description, canonical, Open Graph, Twitter Card) wired into every page; `Person` JSON-LD on the homepage and `BlogPosting` JSON-LD per post; automated `sitemap-index.xml` via `@astrojs/sitemap`.
- **Spec-driven workflow** — `architecture.md` (system design, contracts), `design.md` (Swiss-editorial / technical-minimalist style guide and tokens), `implementation.md` (phased, one-task-per-turn build plan). `AGENTS.md` enforces the hard boundaries (astro:assets images, zero border-radius except pills, no box-shadows, token-only motion).

## Tech Stack

| Layer      | Choice                                                                |
| ---------- | --------------------------------------------------------------------- |
| Framework  | [Astro](https://astro.build/) 5 (static output, content collections)  |
| Language   | TypeScript (strict)                                                   |
| Styling    | Tailwind CSS 3 + hand-written design tokens in `src/styles/global.css`|
| Content    | Astro Content Collections (Markdown + MDX via `@astrojs/mdx`)         |
| SEO        | `@astrojs/sitemap`, hand-rolled `SEO.astro` + JSON-LD                 |
| Images     | `astro:assets` (`<Image />` — WebP/AVIF, CLS-safe dimensions)         |
| Fonts      | Self-hosted variable `woff2` (Archivo, IBM Plex Mono, Archivo Black)  |
| Hosting    | [Vercel](https://vercel.com/) (static, edge-cached; see `vercel.json`)|
| Client JS  | Vanilla DOM APIs only — no UI framework, no state library             |

## Project Structure

```
├── architecture.md          # system design, contracts, AGENTS.md blueprint
├── design.md                # visual style guide + design tokens
├── implementation.md        # phased build plan (one task per turn)
├── vercel.json              # edge cache headers (immutable assets, no-cache HTML)
├── public/
│   ├── fonts/               # self-hosted woff2 (OFL-licensed)
│   ├── favicon.svg
│   └── robots.txt
└── src/
    ├── assets/              # images via astro:assets (hero, project covers)
    ├── components/
    │   ├── ui/              # Button, Eyebrow, Divider, HairlineGrid (zero JS)
    │   ├── nav/             # SiteNav, NavLink
    │   ├── sections/        # Hero, About, Experience, Projects, GitHubStats, Skills, Contact
    │   ├── seo/             # SEO.astro (sole owner of <head> meta tags)
    │   └── footer/          # SiteFooter (rotated name-mark, dark inversion)
    ├── layouts/             # BaseLayout, BlogPostLayout (+ JSON-LD)
    ├── pages/               # index.astro, writing/index.astro, writing/[...slug].astro
    ├── content/blog/        # Markdown/MDX posts (Zod-validated at build time)
    ├── content.config.ts    # blog collection schema
    ├── data/                # typed static data: nav, social, experience, projects, skills
    ├── types/               # shared TS interfaces (NavLink, Project, GitHubRepoStats, …)
    ├── lib/                 # github.ts (fetchRepoStats contract), seo.ts
    ├── scripts/             # entrance.ts, sticky-nav.ts (the only shared client JS)
    └── styles/              # global.css (Tailwind + motion/layout custom properties)
```

## Local Development

Prerequisites: Node.js 18+ and npm.

```bash
npm install          # install dependencies
npm run dev          # start dev server (http://localhost:4321)
npm run build        # production build → dist/
npm run preview      # serve the production build locally
npx tsc --noEmit     # type-check (strict mode, must pass clean)
```

Environment variables (all public-safe, see `.env.example`):

```bash
PUBLIC_GITHUB_USERNAME=your-handle   # fallback owner for GitHubStats; unset → static fallback link
PUBLIC_FORMSPREE_ID=                 # set → real contact form; unset → mailto: button
```

## Deployment

Automated Vercel CI/CD: every push to the production branch (`master`) triggers a production deployment (`astro build` → `dist/`); pull requests get preview deployments. Cache behavior is declared in `vercel.json` — immutable year-long caching for hashed `/_astro/*` assets and `/fonts/*`, `max-age=0, must-revalidate` for HTML documents.
