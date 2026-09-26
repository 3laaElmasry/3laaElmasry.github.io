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
