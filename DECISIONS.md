# Decisions log

Autonomous decisions made while building the portfolio, per CLAUDE.md section 0.

## Phase 0 — Setup

- Scaffolded the Vite + vanilla JS project manually (rather than `npm create vite@latest`) because the working directory already contains `CLAUDE.md`, `.claude/`, and `assets/`, and the exact folder structure is specified in section 8.
- `git init` run locally; git identity set to Alaa Elmasry / 3laaelmasry2005a@gmail.com for commit authorship.
- `vite.config.js` defaults to `base: '/'`; the deployer updates this in Phase 6 once the target repo (user site vs. `portfolio`) is known.
- **Blocker found early:** the GitHub CLI (`gh`) is not installed on this machine (not just unauthenticated). Phases 0–5 will proceed fully offline; Phase 6 (push/deploy) cannot run until `gh` is installed and authenticated. This is reported in the final summary with exact steps for the owner.

## Phase 3/5 — Grid overflow fix

- Found a horizontal-scroll bug via a self-review pass before handing off to QA: CSS Grid `fr` tracks default to a min-content floor, so multi-column grids with image content (`.featured-project__media`, `.hero__grid`, `.work__grid`) overflowed their container on narrow viewports (e.g. mobile body was 459px wide inside a 390px viewport). Fixed by switching those tracks to `minmax(0, Nfr)` and stacking the featured project's desktop/mobile screenshots into a single column below 560px (they sit side by side from 560px up, per the "side by side" spec, but two screenshots side-by-side at 360-390px would be too small to read). Also applied `minmax(0, 1fr)` defensively to the shared `.grid-2`/`.grid-4` utility classes in `layout.css`. Verified zero horizontal overflow at 360/390/768/1024/1440px in both EN and AR with a Playwright sweep.

## Phase 5 — QA audit fixes

The `qa-auditor` subagent found one Blocker and several High/Medium/Low issues. All were fixed by the Chief directly (small, precise changes to files already owned by the Chief):

- **Blocker — mobile nav unusable below 900px:** `#mobile-menu` was a DOM child of `<header class="navbar">`, and `.navbar`'s `backdrop-filter` created a new containing block for its `position: fixed` descendants (same rule as `transform`), so the full-screen menu rendered squashed into the navbar's own ~72px height instead of covering the viewport. Fixed by making `#mobile-menu` a sibling of `<header>` instead of a child (`src/components/Navbar.js`).
- **High — mobile menu had no focus trap and Escape stopped working once focus left the menu:** added the same trap-focus pattern already used in `ProjectModal.js`, and moved the Escape listener from the menu element to `document`.
- **Medium — `--ink-3` (`#7A7A85`) failed WCAG AA (4.5:1) on card surfaces** (as low as 4.00:1 on `--bg-elev`): lightened to `#8A8A93` (4.96:1 on the worst-case surface), verified with a contrast-ratio script.
- **Medium — project screenshots had no explicit width/height:** added representative `width`/`height` attributes in `BrowserFrame.js` (CSS `aspect-ratio` still governs final rendered size).
- **Low — OG/Twitter image URLs were root-relative:** made absolute (`https://3laaelmasry.github.io/og-image.jpg`) in `index.html`. Note for deploy: if the deployer ends up using the `portfolio` repo (`/portfolio/` base) instead of the `<user>.github.io` user site, this URL and the canonical tag need updating to match.
- **Low — StatsStrip's section `aria-label` reused the "Brands" stat label for the whole section:** added a dedicated `stats.sectionLabel` i18n key ("Key stats" / "أهم الأرقام").
- **Low — Rull's `mobileSecondary` product-page screenshot was captured but never rendered:** wired it into `ProjectModal.js`'s media grid alongside the other three shots.
- Verified after fixes: full build passes, mobile menu now fills 390×844 with a working Tab-focus trap and Escape-to-close, and the full 360/390/768/1024/1440 × EN/AR overflow sweep is still clean.
- Re-audit (second `qa-auditor` pass) confirmed all 7 fixes live and found no regressions. **Verdict: GO for Phase 6.**

## Phase 6 — Deploy: blocked on missing `gh` CLI

- `gh` is not installed on this machine (confirmed twice, before and after Phase 5). This blocks repo creation, push, and Pages enablement, all of which the `deployer` subagent needs `gh` for.
- What was still done without `gh`, using the public GitHub API (no auth needed for public data): confirmed the GitHub account `3laaElmasry` exists, and that neither `3laaElmasry.github.io` nor a `portfolio` repo exist yet under it. Per CLAUDE.md's rule ("`<user>.github.io` if it doesn't exist → base '/'"), the target is the **user site**, `3laaElmasry.github.io`. `vite.config.js` already defaults to `base: '/'`, which matches.
- Added `.github/workflows/deploy.yml` (Node 20, `npm ci` → `npm run build` → `actions/configure-pages` → `actions/upload-pages-artifact` → `actions/deploy-pages`, triggered on push to `main`), so the only remaining steps are: install/authenticate `gh`, create the repo, and push.
- **What the owner needs to do:** install the GitHub CLI and run `gh auth login`, then either re-run this session (the `deployer` subagent can take it from there) or run manually from `D:\Portfolio`:
  ```
  gh repo create 3laaElmasry.github.io --public --source=. --remote=origin --push
  gh api -X POST repos/3laaElmasry/3laaElmasry.github.io/pages -f build_type=workflow
  gh run watch
  ```
  The live URL will be `https://3laaelmasry.github.io/`.

## Post-launch restyle (owner request, 2026-09-26)

The owner (Alaa) asked for three changes after seeing the live site:

1. **Hero photo first.** Swapped the DOM order of the portrait and the text content in `Hero.js` so the photo is the first thing rendered — this puts it at the top of the stack on mobile, and (since CSS Grid places track 1 at the inline-start side, which is the *right* in RTL) it now sits on the right in Arabic and the left in English. Flipped the grid's column-width ratio (`0.9fr`/`1.1fr`) to match, so the text column keeps the same visual weight it had before, just mirrored.
2. **Project order.** Owner wanted: Al Mosaad → Alrajhi → Rull Clothes → Naila → Fakhmestaa. This conflicts with the original CLAUDE.md spec, which made Rull Clothes the "featured" full-width card specifically because it has the flashiest number (×5 sales). Asked the owner directly whether the new first project (Al Mosaad, which has no hard metric, only a qualitative "Official EMTOP importer" highlight) should inherit the featured treatment, or whether all 5 should become equal-sized grid cards. **Owner chose: Al Mosaad keeps the featured full-width card.** Moved `featured: true` to Al Mosaad in `projects.js`, reordered the array, and updated `FeaturedProject.js` to render a `highlight`-only fallback (large mono text instead of a big accent number) for projects without a hard metric — mirroring the pattern `ProjectCard.js` already used for Al Mosaad/Alrajhi in the regular grid.
3. **Services as a carousel.** Converted `Services.js` from a static grid to a horizontally scrollable, `scroll-snap` carousel with prev/next buttons, to shorten the page. Verified the prev/next buttons scroll in the correct logical direction in both LTR and RTL (Chromium reports negative `scrollLeft` deltas for "forward" in RTL, which the component accounts for). With only 4 service cards and ~3 visible at once on desktop, the total scrollable range is small by design — one "next" click reveals the remaining card.

All three changes verified with a full 360/390/768/1024/1440 × EN/AR horizontal-overflow sweep (clean) after implementation.

## Second post-launch restyle (owner request, 2026-09-26)

1. **Hero mobile spacing.** Owner felt the photo-then-text stack on mobile had too much gap and sat too low. Reduced `.hero`'s top padding on mobile (`--space-9` → `--space-6`, restored to `--space-9` at ≥900px) and the `.hero__grid` gap on mobile (`--space-8` → `--space-4`), so the portrait sits higher and the headline follows immediately under it.

2. **Work section → chat interface.** The owner wanted the project showcase to work like a real chat: the "bot" (Alaa) sends the first project as a card + story, the visitor clicks "Next project" to see another, and a persistent "Contact me" (WhatsApp) button is always visible. Confirmed via direct questions: real chat bubbles with an avatar (not a re-skinned grid), strictly sequential "Next project" navigation (plus always-visible View Site / Contact Me buttons — the owner's own wording), and this **fully replaces** the old featured-card + grid layout (no old view kept alongside).
   - Rewrote `Work.js` as a chat shell (header with avatar/status, a scrollable message log, a docked action bar) driven by a small state machine (`nextIndex`, `closed`) in the same file.
   - New `ChatMessage.js` holds pure render functions for the four bubble types (greeting, user echo, typing indicator, project card, project story, closing).
   - Each "Next project" click appends a user bubble echoing the click, shows a brief typing indicator (skipped under `prefers-reduced-motion`), then reveals the next project's two bot bubbles (card, then story + tags + "View site" link). After all 5 projects, the Next button hides and a closing bot message appears with just the Contact Me button.
   - The hero's quick-jump chips ("×5 Rull Clothes" etc.) previously scrolled to and highlighted a static project card; since that DOM no longer exists, `Hero.js` now calls an exported `revealProjectInChat(id)` from `Work.js` directly (not a `window` custom event — a global listener would have been re-registered on every language toggle and stacked, since `window` persists across the app's full `innerHTML` re-renders while everything else gets discarded and rebuilt). It fast-forwards the chat (no delay) to the requested project if not yet shown, then scrolls it into view and applies a temporary highlight ring.
   - Deleted `FeaturedProject.js`, `ProjectCard.js`, `ProjectModal.js` and their CSS (`project-card.css`, `modal.css`) since the chat fully replaces what they did; removed their imports from `app.js` and `main.css`. Repointed `browser-frame.css`'s hover-scroll rule from `.project-card:hover` to `.chat__bubble--card:hover`.
   - Verified: no console/page errors, the closing state correctly hides "Next project", the hero-chip jump correctly fast-forwards and highlights the target project, and the full 360/390/768/1024/1440 × EN/AR overflow sweep stayed clean (including RTL, where the chat's flex layout mirrors correctly with no extra logical-property overrides needed since flex `row` already follows `dir`).

3. **Services images.** Owner asked to stop using any Shopify logo in the Services cards and use real Shopify theme screenshots instead. `asset-worker` captured real desktop screenshots of 4 distinct free Shopify Theme Store demos (Dawn, Craft, Sense, Origin — via each theme's underlying `theme-<slug>-demo.myshopify.com` demo store, so no Theme Store chrome/logo in the shots). The Chief then cropped each from a full-page ~2500px shot down to the top 900px (the hero/nav area only, since these only ever render as small card thumbnails) and re-encoded at quality 78, shrinking each from 130-310KB to 43-70KB.
   - Added `getThemeImage()` to `utils/images.js` (a second `import.meta.glob` over `assets/images/themes/`, mirroring the existing project-image loader) and a `themeImage` field per entry in `data/services.js`.
   - Deliberately did **not** reuse the `BrowserFrame` browser-chrome-plus-domain treatment for these — that chrome is specifically established elsewhere on the site as "here's a real store I built for a client," and reusing it for generic theme demos risked implying false client work. Instead each service card gets a plain top image with a bottom mask-fade blending into the card, no fake domain bar.

## Chat interface reverted; more carousels added (owner request, 2026-09-26)

The owner tried the chat interface live and didn't like it: "بصراحه الشات بوت مش حلو خالص" (honestly the chatbot isn't nice at all). Reverted the Work section back to the card-based layout (featured card + 2×2 grid + story modal) from before the chat experiment, and separately shortened the page further by converting two more grids into carousels, since the owner explicitly asked for "any section that can be a carousel" to reduce the portfolio's length — specifically calling out the engineering/dev-projects and skills sections.

- **Work section revert:** restored `FeaturedProject.js`, `ProjectCard.js`, `ProjectModal.js`, `project-card.css`, `modal.css`, and the card version of `Work.js`/`work.css` from commit `89cce49` (the state right before the chat rewrite). Restored `Hero.js`'s quick-jump chips to their original scroll-to-and-highlight-a-card behavior. Deleted `ChatMessage.js`. Restored the `work.*`/`modal.*` i18n keys and removed the now-unused `work.chat.*` keys. Kept the mobile hero spacing fix from the chat commit (unrelated to the chat complaint, still wanted).
- **New shared carousel infrastructure:** rather than copy Services' carousel JS a third time, extracted `utils/carousel.js` (`initCarousel(trackId)` — generic scroll-snap prev/next wiring, RTL-aware) and `components/CarouselNav.js` (the prev/next button markup), plus a shared `styles/components/carousel.css` (`.carousel-track`, `.carousel-nav`, `.carousel-head`). Refactored `Services.js` to use these instead of its bespoke implementation.
- **Skills and Dev Projects are now carousels** inside the Engineering section, using the same shared infrastructure: `SkillsGroups.js` now returns just the group markup (the carousel track wrapper moved into `Engineering.js`), and `dev-project-grid`/`skills-groups` became `.carousel-track` children with percentage-based item widths (matching the peek-of-the-next-item pattern already established by Services) instead of CSS grids.
- Verified: card system fully functional again (story modal opens/closes, Escape works, hero quick-chip jump-and-highlight works), both new carousels scroll correctly, and the full 360/390/768/1024/1440 × EN/AR overflow sweep stayed clean.
