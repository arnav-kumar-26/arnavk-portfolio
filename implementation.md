# Implementation Plan

> ## STATUS: COMPLETE — REFERENCE ONLY (2026-09-08)
> This plan has been fully executed. Do not run tasks from it again.
> The live build loop is now governed by **`TASK.md`** (third implementation pass).
>
> ### Decisions recorded here at close-out (supersede any conflicting text below)
> 1. **Deploy = Vercel** (site already deployed there). All Cloudflare references in
>    earlier spec text (`wrangler.toml`, `public/_headers`) are dead — Phase 8's
>    `vercel.json` + no-adapter static output is the correct record.
> 2. **Fonts = Geist / PT Mono** via `@fontsource` (per `AGENTS.md` Stack). The
>    Archivo / IBM Plex Mono / Archivo Black fallback plan is retired.
> 3. **Execution protocol = `TASK.md` rules** (per-step `npm run check`, stage only
>    touched files, pause on `⚠️ NEEDS INFO` / `⚠️ CONFIRM`). The `opencode-goal`
>    rules quoted immediately below are superseded and kept only as history.
> 4. **Heading tokens = `TASK.md` Task 2 measured values**: `hero` max `11.2rem`
>    (≈179px tier: Hero name + Introduction heading), `h2` max `4.5rem` (≈72px tier:
>    Experience / Selected Works / Skills). These win over the earlier §4.2 values.

> ### OPENCODE-GOAL EXECUTION RULES (SUPERSEDED — kept as history, see STATUS above)
> You are executing tasks under the automated `opencode-goal` plugin.
>
> 1. **ONE TASK PER TURN:** Focus strictly on completing **ONLY ONE** task section (e.g., Task 1.1) per execution turn. Do not attempt an entire Phase at once.
> 2. **DYNAMIC SEARCH FIRST:** Search the repository to locate the exact source file for the targeted component/logic before editing.
> 3. **AUTOMATED VERIFICATION & COMMIT:** Immediately upon writing code for a task:
>    - Run validation checks (e.g., `npx tsc --noEmit`) to verify type safety. If errors occur, fix them before proceeding.
>    - Stage and commit the change using git: `git add . && git commit -m "feat: complete Phase X [Task Y.Z]"`
> 4. **EXIT & WAIT:** Stop and exit your execution turn immediately after completing a single task and committing. Do NOT proceed to the next sequential task. Wait for `opencode-goal` to prompt you with a fresh call.
> 5. **GOAL COMPLETION:** Once every task across all phases in this document has been executed in subsequent turns, explicitly output: `"GOAL COMPLETE"` to signal the plugin to close the loop.
---
## Phase 1: Foundation & Project Initialization
### Task 1.1: Project Setup and Build Tooling
1. Confirm AGENTS.md (created in Task 0.1) is present at the project root; do not recreate or overwrite it.
2. Scaffold the Astro project into the existing repository (do not re-run `git init`), installing `@astrojs/tailwind`, `@astrojs/sitemap`, and `@astrojs/mdx` (required for `.mdx` blog posts per `architecture.md` §1.2) and registering all three in `astro.config.mjs`'s `integrations` array with `output: 'static'`.
3. Configure absolute imports, TypeScript rules (`tsconfig.json`), and basic build lint scripts.
---
### Task 1.2: Design System Integration
1. Read `design.md`. Map all layout variables, fluid spacing rules, and color tokens into the framework configuration file. For the `hero`/`h2`/`h3` font sizes specifically, use the `clamp()`-based values in `architecture.md` §4.2 rather than `design.md`'s fixed desktop-only rem values — the fixed sizes overflow badly on mobile viewports, and §4.2 is the corrected source of truth for that token.
2. Trigger the `ui_ux_pro_max` skill to construct accessible global CSS variables and global theme layouts.
---
## Phase 2: Core Architecture & Global Components
### Task 2.1: Shared UI Primitives
1. Read `architecture.md` §2 (Production File Directory Structure) and scaffold the `src/components/ui/` primitives: `Button.astro` (pill CTA with trailing-arrow slot), `Eyebrow.astro` (bracketed monospace label), `Divider.astro` (hairline rule), and `HairlineGrid.astro` (single decorative background grid instance).
2. Trigger `ui_ux_pro_max` to implement the arrow-swap hover interaction (`.arrow-swap`) on `Button.astro` and the underline-reveal interaction (`.link-underline`) as a reusable CSS class in `src/styles/global.css`, both driven exclusively by the motion tokens (`--ease-signature`, `--dur-base`) defined in `design.md` — no hard-coded easing or duration values. Build both as standalone, reusable classes now: `NavLink.astro` in Task 2.2 will consume `.link-underline` directly rather than redefining it.
3. Verify `Button.astro`, `Eyebrow.astro`, and `Divider.astro` render correctly with zero client-side JavaScript (static-only, per architecture boundary rules).
---
### Task 2.2: Navigation & Base Layout
1. Construct `BaseLayout.astro`, `SiteNav.astro`, `NavLink.astro`, and `SiteFooter.astro`. Mount `HairlineGrid.astro` (built in Task 2.1) inside `BaseLayout.astro`, and apply the `.link-underline` utility (built in Task 2.1) to `NavLink.astro`'s hover/focus state.
2. When building `SiteFooter.astro`'s rotated name-mark, use `transform: rotate(180deg)` on an element kept in normal document flow (flex `justify-end`) — never `position: absolute` + `transform-origin`, per the AGENTS.md hard boundary (`architecture.md` §6, rule 6): the latter clips the text above the viewport.
3. Utilize `ui_ux_pro_max` to ensure zero layout-shift (CLS) on hydration and setup fluid container constraints.
---
### Task 2.3: SEO & Meta Infrastructure
1. Search the repository for the `BaseLayout.astro` shell created in Task 2.2, then build `src/components/seo/SEO.astro` and the `src/lib/seo.ts` helper per the contract in `architecture.md` §1.4 — title, description, canonical URL, Open Graph, and Twitter Card tags driven entirely by page props.
2. Wire `<SEO.astro>` into `BaseLayout.astro` so no individual page hand-writes its own `<head>` meta block.
3. Implement the JSON-LD `Person` schema on the homepage per `architecture.md` §1.4, sourcing `sameAs` values from `src/data/social.ts`.
---
## Phase 3: Data Layer & Type Contracts
### Task 3.1: Core TypeScript Interfaces
1. Search for the `src/types/` directory scaffolded in Task 1.1; create `src/types/index.ts` and implement every interface exactly as specified in `architecture.md` §5.1 (`NavLink`, `SocialLink`, `ExperienceEntry`, `Project`, `SkillCategory`, `GitHubRepoStats`).
2. Run `npx tsc --noEmit` to confirm the interfaces compile cleanly with strict mode before any data module imports them.
---
### Task 3.2: Static Data Modules
1. Populate `src/data/nav.ts`, `src/data/social.ts`, `src/data/experience.ts`, `src/data/skills.ts`, and `src/data/projects.ts`, typing every export against the interfaces from Task 3.1.
2. In `src/data/projects.ts`, include the worked project entries from `architecture.md` §5.1 (the resume-builder case study and fleet-tracker entry) with accurate `tags`, `githubRepo`, and `coverImage` fields.
---
### Task 3.3: Content Collections Schema
1. Search for the Astro content config location and create `src/content.config.ts`, implementing the Zod schema for the `blog` collection exactly as defined in `architecture.md` §5.2.
2. Scaffold `src/content/blog/example-post.md` with valid frontmatter matching the schema, and confirm `astro build` fails loudly on an intentionally malformed test field before removing the test file.
---
## Phase 4: Landing Page Section Assembly
### Task 4.1: Hero Section
1. Search for `src/components/sections/` and build `Hero.astro`, consuming name/tagline copy and rendering the resume-download and contact CTA buttons via the `Button.astro` primitive from Task 2.1.
2. Trigger `ui_ux_pro_max` to apply the hero-only blur+slide-in entrance treatment (`.reveal-hero` / `fadeSlideUpBlur`) from `design.md`, and mark the hero portrait image `loading="eager"` / `fetchpriority="high"` per the LCP guidance in `architecture.md` §1.3.
---
### Task 4.2: About Section
1. Build `About.astro`, sourcing bio and "current focus" copy, and lay out the narrow label-column + wide content-column split using the `--label-col-width` / `--content-col-max` custom properties (never component-local widths, per `architecture.md` §4.3).
2. Trigger `ui_ux_pro_max` to confirm responsive scaling of the two-column split down to a stacked single column on narrow viewports without introducing layout shift.
---
### Task 4.3: Experience Section
1. Build `Experience.astro` and `ExperienceRow.astro`, iterating `src/data/experience.ts` in reverse-chronological order and rendering each internship's `impactBullets` as a semantic list.
2. Trigger `ui_ux_pro_max` to verify keyboard focus order flows logically through the three experience rows and that hairline dividers (`Divider.astro`) separate entries per the style guide.
---
### Task 4.4: Projects Section & Case Study Cards
1. Search for the `Project` interface consumers and build `Projects.astro` plus `ProjectCard.astro`, rendering `coverImage` through `astro:assets`, the embedded demo `<iframe>` (only when `demoUrl` is present), and the tag list.
2. Trigger `ui_ux_pro_max` to implement the card-lift hover interaction (`translateY(-6px)` + widened photo-stack offset, no box-shadow) exactly as specified in `architecture.md` §6, and confirm the `<iframe>` has an accessible `title` attribute.
---
### Task 4.5: Live GitHub Stats Integration
1. Search for `src/lib/` and implement `github.ts`'s `fetchRepoStats(name, owner?)` exactly per the contract in `architecture.md` §5.3, including the `PUBLIC_GITHUB_USERNAME` fallback for an omitted `owner`, the `sessionStorage` cache, and a graceful `null` return on failure or a missing owner.
2. Build `GitHubStats.astro` as the sole component containing a data-fetching `<script>`: render the static skeleton server-side, call `fetchRepoStats()` client-side after load, and swap to a static "— see GitHub" fallback link on `null`. Never move this fetch to build time.
3. Run `npx tsc --noEmit` and manually verify (via network throttling/offline toggle) that the fallback renders correctly when the fetch fails.
---
### Task 4.6: Skills Section
1. Build `Skills.astro` and `SkillPill.astro`, grouping `src/data/skills.ts` entries by `category` (Languages, Frameworks, Tools) into three visually distinct pill clusters.
2. Trigger `ui_ux_pro_max` to confirm pill wrapping behaves correctly at narrow viewport widths and that each pill meets minimum touch-target size on mobile.
---
### Task 4.7: Contact Section
1. Build `Contact.astro`, branching at build time on whether `PUBLIC_FORMSPREE_ID` is set (real `<form>` POST to Formspree) or unset (plain `mailto:` `Button.astro`), per the contract in `architecture.md` §5.4.
2. Trigger `ui_ux_pro_max` to ensure the form (when present) has properly associated `<label>` elements, visible focus states, and inline success/error messaging that is announced to screen readers via `aria-live`.
---
### Task 4.8: Homepage Composition
1. Search for `src/pages/index.astro` and compose it from `Hero`, `About`, `Experience`, `Projects`, `Skills`, and `Contact` in the exact order specified in `architecture.md` §3.2.
2. Run a full `astro build` and confirm the homepage renders with zero console errors and zero unexpected client-side JavaScript beyond the two shared behavior scripts.
---
## Phase 5: Motion, Interaction & Accessibility Layer
### Task 5.1: Scroll-Triggered Entrance Animations
1. Search for `src/scripts/` and implement `entrance.ts`: a single `IntersectionObserver` instance that toggles a `data-revealed` attribute on `.reveal` / `.reveal-group` children as they enter the viewport, staggered via the `--stagger` custom property.
2. Trigger `ui_ux_pro_max` to confirm the `.no-reveal` exclusion is correctly applied to all buttons/CTAs/arrows (per `architecture.md` §6) and that the entire system is inert when `prefers-reduced-motion: reduce` is set.
---
### Task 5.2: Sticky Nav Scroll Behavior
1. Implement `src/scripts/sticky-nav.ts`: a passive `scroll` listener toggling a single `isScrolled` boolean that applies the `.is-scrolled` class swap (transparent → opaque `bg-background-nav` + hairline border) on `SiteNav.astro`.
2. Trigger `ui_ux_pro_max` to verify the nav remains keyboard-navigable and that the background transition uses only `--ease-signature` / `--dur-base`, with no added blur or shadow.
---
### Task 5.3: Motion Consistency Audit
1. Search across `src/components/` and `src/styles/` for any hard-coded transition duration or easing value and replace it with the shared custom properties (`--ease-signature`, `--dur-*`, `--stagger`) from `src/styles/global.css` — the underline-reveal and arrow-swap utilities (Task 2.1) and the card-lift interaction (Task 4.4) should already comply; this task catches drift, not first implementation.
2. Trigger `ui_ux_pro_max` to run a full pass confirming every hover-only interaction across the site (nav links, buttons, project cards) has an equivalent `:focus-visible` state, so keyboard users receive the same feedback as mouse users.
---
### Task 5.4: Full Keyboard & Screen-Reader Accessibility Pass
1. Search across `src/components/` and `src/layouts/` for all interactive elements (nav links, buttons, form fields, iframe embeds) and confirm semantic landmarks (`<nav>`, `<main>`, `<section aria-labelledby>`, `<footer>`) are present per `architecture.md` §1.4.
2. Trigger `ui_ux_pro_max` to run an automated accessibility audit (e.g. `axe-core`) against the built homepage, fixing any contrast, label, or focus-order violations before proceeding.
---
## Phase 6: Blog / Writing Module (Optional Scope)
### Task 6.1: Blog Index Page
1. Search for `src/pages/writing/` and build `index.astro`, querying `getCollection('blog')`, filtering out `draft: true` entries, and sorting by `publishDate` descending.
2. Trigger `ui_ux_pro_max` to lay out the post list using the same narrow-label / wide-content column system established in Task 4.2, keeping visual consistency with the rest of the site.
---
### Task 6.2: Individual Post Route & Layout
1. Build `src/layouts/BlogPostLayout.astro` (extending `BaseLayout.astro`) and `src/pages/writing/[...slug].astro`, rendering MDX content statically and injecting the `BlogPosting` JSON-LD schema from the post's frontmatter per `architecture.md` §1.4.
2. Confirm no interactive MDX embeds are introduced without first flagging them for a follow-up architecture decision, per the boundary noted in `architecture.md` §3.3.
---
## Phase 7: Performance & SEO Hardening
### Task 7.1: Image Pipeline Audit
1. Search the entire `src/` tree for any raw `<img src="...">` referencing a local asset and replace each with `astro:assets`' `<Image />` or `<Picture />`, per the hard boundary in `architecture.md` §6.
2. Trigger `ui_ux_pro_max` to confirm every replaced image has explicit `width`/`height` (or fills its container without shifting layout) and appropriate `loading="lazy"` below the fold.
---
### Task 7.2: Font Loading Optimization
1. Confirm the `@font-face` declarations in `src/styles/global.css` match `architecture.md` §4.3 exactly, and add `<link rel="preload" as="font">` tags in `BaseLayout.astro` for the above-the-fold Archivo and IBM Plex Mono weights only.
2. Verify Archivo Black (footer name-mark) is loaded without a preload hint, since it is below the fold on first paint.
---
### Task 7.3: Sitemap, Robots, and Structured Data
1. Confirm `@astrojs/sitemap` (installed and registered in Task 1.1) is generating `sitemap-index.xml` correctly on build, and add a static `public/robots.txt` pointing to it.
2. Confirm the JSON-LD `Person` (homepage) and `BlogPosting` (per-post) schemas built in Tasks 2.3 and 6.2 validate against Schema.org structured-data requirements.
---
### Task 7.4: Lighthouse & Core Web Vitals Pass
1. Run a production `astro build` + local preview, then execute a Lighthouse audit against the homepage and one project case-study anchor.
2. Trigger `ui_ux_pro_max` to remediate any flagged CLS, LCP, or accessibility regressions before proceeding, re-running the audit until all four Lighthouse categories score in the green range.
---
## Phase 8: Deployment & Launch
### Task 8.1: Vercel Configuration
1. Create `vercel.json` at the project root with a `headers` array: long
   `Cache-Control: public, max-age=31536000, immutable` on the hashed asset path
   Astro's static build emits (`/_astro/(.*)`), and a short/no-cache rule on HTML
   documents. Do not create `wrangler.toml` or `public/_headers` — those are
   Cloudflare Pages-specific and unused on this platform.
2. Confirm `astro.config.mjs` remains set to `output: 'static'` with **no adapter**.
   A pure static site needs no `@astrojs/vercel` adapter — only add one later, via an
   explicit ADR, if you start using a Vercel-specific feature like Image Optimization
   or Web Analytics. Confirm no server-only APIs have been introduced anywhere in the
   codebase.
---
### Task 8.2: CI / Auto-Deploy Verification
1. Import the GitHub repository into a Vercel project (dashboard "Add New Project" or
   `vercel link` via CLI), confirming Vercel's Astro framework preset correctly detects
   the build command (`astro build`) and output directory (`dist`), so every push to
   `main` triggers a production deployment and every pull request gets a preview
   deployment.
2. Trigger a test commit and confirm the Vercel build log completes successfully
   end-to-end with no manual intervention.
---
### Task 8.3: Local Build & Logic Verification
1. Run `astro build`, then serve the output with `astro preview`. Against that local
   server, confirm: `dist/sitemap-index.xml` exists and is well-formed; the homepage's
   rendered HTML contains a `mailto:` anchor (not a `<form>`) for Contact, matching the
   empty `PUBLIC_FORMSPREE_ID`; the GitHubStats skeleton is present in the initial HTML
   alongside its `<script>` tag; and `sticky-nav.ts` / `entrance.ts` appear as bundled
   `<script>` tags on the homepage.
2. `fetchRepoStats()`'s network behavior can't be exercised from static files, so verify
   its logic directly: write a short throwaway script that mocks `fetch` for a success
   response, a non-2xx failure, and a call with no resolvable `owner`, and assert the
   function returns the correct `GitHubRepoStats` shape or `null` in each case per
   `architecture.md` §5.3. Remove the throwaway script once it passes.
3. Trigger `ui_ux_pro_max` for the responsive pass across mobile, tablet, and desktop
   breakpoints against the **local preview server**, not the live URL — it's the exact
   build that ships to Vercel, so there's no need to wait on deployment for this.
---
### Task 8.4: Final Launch Sign-off
1. Confirm every task across Phases 1–8 has a corresponding git commit in the
   repository history, and that `npx tsc --noEmit` passes cleanly on the final `main`
   branch state.
2. Once confirmed, output `"GOAL COMPLETE"` per the execution rules at the top of this
   document.

---

## CLOSE-OUT (2026-09-08)

**`GOAL COMPLETE` — all phases executed.** This document is now reference-only.
For current work, see `TASK.md` (live build loop), `architecture.md` (structural law
as amended), and `AGENTS.md` (engineering rules).