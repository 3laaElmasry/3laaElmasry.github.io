# Decisions log

Autonomous decisions made while building the portfolio, per CLAUDE.md section 0.

## Phase 0 — Setup

- Scaffolded the Vite + vanilla JS project manually (rather than `npm create vite@latest`) because the working directory already contains `CLAUDE.md`, `.claude/`, and `assets/`, and the exact folder structure is specified in section 8.
- `git init` run locally; git identity set to Alaa Elmasry / 3laaelmasry2005a@gmail.com for commit authorship.
- `vite.config.js` defaults to `base: '/'`; the deployer updates this in Phase 6 once the target repo (user site vs. `portfolio`) is known.
- **Blocker found early:** the GitHub CLI (`gh`) is not installed on this machine (not just unauthenticated). Phases 0–5 will proceed fully offline; Phase 6 (push/deploy) cannot run until `gh` is installed and authenticated. This is reported in the final summary with exact steps for the owner.
