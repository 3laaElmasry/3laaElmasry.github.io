# Decisions log

Autonomous decisions made while building the portfolio, per CLAUDE.md section 0.

## Phase 0 — Setup

- Scaffolded the Vite + vanilla JS project manually (rather than `npm create vite@latest`) because the working directory already contains `CLAUDE.md`, `.claude/`, and `assets/`, and the exact folder structure is specified in section 8.
- `git init` run locally; git identity set to Alaa Elmasry / 3laaelmasry2005a@gmail.com for commit authorship.
- `vite.config.js` defaults to `base: '/'`; the deployer updates this in Phase 6 once the target repo (user site vs. `portfolio`) is known.
- **Blocker found early:** the GitHub CLI (`gh`) is not installed on this machine (not just unauthenticated). Phases 0–5 will proceed fully offline; Phase 6 (push/deploy) cannot run until `gh` is installed and authenticated. This is reported in the final summary with exact steps for the owner.

## Phase 3/5 — Grid overflow fix

- Found a horizontal-scroll bug via a self-review pass before handing off to QA: CSS Grid `fr` tracks default to a min-content floor, so multi-column grids with image content (`.featured-project__media`, `.hero__grid`, `.work__grid`) overflowed their container on narrow viewports (e.g. mobile body was 459px wide inside a 390px viewport). Fixed by switching those tracks to `minmax(0, Nfr)` and stacking the featured project's desktop/mobile screenshots into a single column below 560px (they sit side by side from 560px up, per the "side by side" spec, but two screenshots side-by-side at 360-390px would be too small to read). Also applied `minmax(0, 1fr)` defensively to the shared `.grid-2`/`.grid-4` utility classes in `layout.css`. Verified zero horizontal overflow at 360/390/768/1024/1440px in both EN and AR with a Playwright sweep.
