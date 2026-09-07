# AGENTS.md — Portfolio Site Engineering Rules

## Stack (do not deviate without a written ADR)
Astro (static output only — never enable `output: 'server'` or `'hybrid'`), Tailwind CSS,
Cloudflare Pages, Astro Content Collections (`@astrojs/mdx` required for `.mdx` posts),
`@astrojs/sitemap`, astro:assets, vanilla JS. No React/Vue/Svelte/Solid. No client-side
state library. No CSS-in-JS.

Font deps: `@fontsource/geist-sans` (Geist 400/500/600/700/900 self-hosted from its `files/` output), `@fontsource/pt-mono` (PT Mono 400 self-hosted from its `files/` output).

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
   Exception: button radius `5px` (`rounded-button`), added 2026-09-08, rationale: match reference button treatment (`.button { border-radius: 5px }` in `reference-tokens.css`).
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
