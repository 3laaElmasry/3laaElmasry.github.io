# Alaa Elmasry — Shopify Developer & CRO Specialist

Personal portfolio site for Alaa Elmasry: a bilingual (Arabic/English), dark-themed, single-page portfolio showcasing Shopify store builds, conversion-rate-optimization work, and software-engineering background.

**Live:** https://3laaelmasry.github.io/

## Tech stack

- [Vite](https://vitejs.dev/) + vanilla JavaScript (ES modules) — no frontend framework
- Plain CSS with design tokens, no CSS framework
- [sharp](https://sharp.pixelplumbing.com/) for image processing (hero crop, screenshot optimization)
- [Playwright](https://playwright.dev/) for capturing project and theme screenshots
- Deployed to GitHub Pages via GitHub Actions

## Getting started

```bash
npm install
npm run dev        # start the Vite dev server
npm run build      # production build to dist/
npm run preview    # preview the production build locally
```

### Asset scripts

These regenerate the site's images from source material and are not part of the normal dev loop:

```bash
npm run crop-hero            # crops assets/hero.JPG into src/assets/images/hero/
npm run screenshot-projects  # captures desktop/mobile screenshots of each project's live site
npm run screenshot-themes    # captures Shopify Theme Store demo screenshots used on Services cards
```

## Project structure

```
src/
├── main.js / app.js     # bootstraps i18n, composes and renders all sections
├── data/                # content and structured data (projects, stats, skills, socials, ...)
├── i18n/                # en.js / ar.js dictionaries + the t() lookup helper
├── components/          # one file per UI section/piece, each a function of (data, lang) -> HTML string
├── utils/               # shared helpers: DOM, reveal-on-scroll, counters, carousels, icons, WhatsApp links
└── styles/              # design tokens, base styles, and one CSS file per component
```

Every section renders in both English and Arabic (with full RTL support via CSS logical properties) from a single set of components — there is no separate RTL stylesheet or duplicated markup.

Most multi-card sections (Services, Process, the Engineering sub-sections, About's timeline, Contact) are horizontally scrollable carousels built from a shared `utils/carousel.js` + `components/CarouselNav.js` + `styles/components/carousel.css` trio. The Selected Work section is the deliberate exception and stays as static cards with a "view story" modal.

See [`CLAUDE.md`](./CLAUDE.md) for the full content spec, design system, and build history, and [`DECISIONS.md`](./DECISIONS.md) for a chronological log of decisions made while building and iterating on the site.

## Deployment

Pushing to `main` triggers `.github/workflows/deploy.yml`, which builds the site and publishes `dist/` to GitHub Pages via `actions/deploy-pages`.

## Contact

- WhatsApp: [+20 108 085 0238](https://wa.me/201080850238)
- Email: 3laaelmasry2005a@gmail.com
- [GitHub](https://github.com/3laaElmasry) · [LinkedIn](https://www.linkedin.com/in/alaaelmasry) · [Instagram](https://www.instagram.com/3laa_elmasry0)
