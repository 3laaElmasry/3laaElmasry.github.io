# CLAUDE.md — Alaa Elmasry · Shopify Developer Portfolio

You are building a personal portfolio website for **Alaa Elmasry**, a Shopify developer and conversion (CRO) specialist. Read this whole file before writing any code. It is the single source of truth for content, design, structure, and workflow.

---

## 0. Operating mode: work autonomously, end to end

- The owner has pre-approved this whole task. **Do not stop to ask for confirmation** between phases. Make sensible decisions, note them in `DECISIONS.md`, and keep going.
- Only stop if something is truly blocking (e.g. `gh` is not authenticated and you cannot push). In that case, finish everything else first, then explain exactly what the owner must do.
- Follow the phases in section 9 in order. Commit after every phase.
- When you finish, push to GitHub, deploy to GitHub Pages, and report the live URL.

---

## 1. Skills to use (installed globally)

Use these skills at the stages below. Load each one before the work it covers.

| Skill | When to use it |
|---|---|
| `frontend-design` | Phase 2–3. Overall visual direction, layout, motion, making it look distinctive and not "template-like". |
| `ui-design` | Phase 3. Components: project cards, browser mockups, buttons, stats, nav, spacing, and the type scale. |
| `copywriting` | Phase 4. Write and polish all EN + AR copy (hero, project stories, services, CTAs). |
| `personal-brand-video` | Phase 4. **Only as a source of Alaa's voice, story, and positioning.** Do not write video scripts. Use its "Who he is" and "Voice" sections to keep the copy consistent with his personal brand. |
| `web-design-guidelines` | Phase 5. Audit the finished site (accessibility, UX, performance, responsiveness) and fix every issue it finds. |

---

## 1b. Team setup: you are the Chief Agent

You (the main session) are the **Chief Agent**. You own the vision, the design decisions, and the quality bar. You delegate routine, well-specified work to the subagents in `.claude/agents/` so the work runs on cheaper models and your own context stays clean.

### The team

| Subagent | Model | Owns |
|---|---|---|
| `asset-worker` | sonnet | Phase 1: the hero crop script, project screenshots, and image optimization. Returns the file paths and a short visual check. |
| `component-builder` | sonnet | Phase 3: the **simple** sections (StatsStrip, BrandsMarquee, Services, Process, Engineering pieces, Timeline, About, Contact, Footer, WhatsAppFab) and their CSS files, following the tokens and patterns you already built. |
| `copy-writer` | sonnet | Phase 4: fills `src/i18n/en.js`, `src/i18n/ar.js`, and the copy fields in `src/data/*.js` using the `copywriting` + `personal-brand-video` skills. |
| `qa-auditor` | sonnet | Phase 5: runs the build, takes Playwright screenshots (EN/AR, desktop/mobile), and runs the `web-design-guidelines` audit. It **reports** issues and does not fix them. |
| `deployer` | haiku | Phase 6: the git remote, the GitHub repo, the Pages workflow, the push, and watching the run. Returns the live URL or the exact error. |

### What the Chief does itself (don't delegate these)

- Phase 0 setup and Phase 2 (design system: tokens, base, layout, i18n core, and the first reference component) using `frontend-design` + `ui-design`. Everything else copies from this, so it must be right.
- The **signature pieces**: Navbar, Hero, Work, FeaturedProject, ProjectCard, BrowserFrame, ProjectModal.
- Reviewing every subagent's output, fixing what QA reports, and making the final decisions.

### Delegation rules (to save tokens without losing quality)

- **Give a complete brief.** Subagents start with a blank context. Each delegation includes the exact files to create or edit, the relevant CLAUDE.md sections by number (tell them to read only those), the files to use as a pattern (e.g. "match `src/components/Hero.js` and `src/styles/components/hero.css`"), and the done criteria.
- **Batch.** Send one `component-builder` call with a group of related sections, not one call per tiny file. Don't spawn a subagent for something you can do in one or two edits yourself.
- **Parallelize independent work.** For example, run `asset-worker` while you build the design system. Launch parallel subagents in the same message.
- **Keep returns short.** Subagents return a short summary (files changed, issues, anything unsure), not full file contents.
- **Review cheaply.** Check results with `npm run build`, targeted reads, and screenshots. Don't re-read every file.
- **Escalate.** If a subagent's output is below the bar twice on the same task, do it yourself.

---

## 2. Owner profile (source of truth: never invent beyond this)

- **Name:** EN **Alaa Elmasry**, AR **علاء المصري**. Use only this name everywhere on the site. His CV says "Alaa Saeed"; do **not** use that name.
- **Role:** Shopify Developer & Conversion (CRO) Specialist, with a back-end engineering (.NET / C#) background. He builds custom Liquid, Online Store 2.0 theme sections, and conversion-focused stores.
- **Markets:** Egypt, Saudi Arabia, UAE / Gulf, US.
- **Story:** He started programming at 18, with a software engineering base (OOP, DSA, .NET backend). He studies BIS at Benha University (graduating 2027). Companies rejected him because he's a student, so he went freelance, found Shopify, and was working with 20+ brands in under 5 months.
- **Differentiator:** He has engineering depth, so he builds custom, fast solutions instead of stacking apps. He also understands the customer journey, so the stores he builds are designed to convert.
- **Proof numbers (use exactly these):**
  - `20+` brands built
  - `20K+` followers
  - `5x` sales (Rull Clothes)
  - `1000+` orders in under 3 months (Fakhmestaa)
  - `99%` client satisfaction
  - `< 3 days`: full store delivery (Naila)
  - `300+` algorithmic problems solved (LeetCode, Codewars, Codeforces)
- **Voice:** Direct, honest, and focused on results. No hype, no guru clichés. The Arabic copy is simple, friendly Egyptian colloquial with short sentences. The English copy is confident and concise.

### Contact & socials

| Channel | Value |
|---|---|
| WhatsApp / Phone | `+20 108 085 0238` → `https://wa.me/201080850238` |
| Email | `3laaelmasry2005a@gmail.com` |
| Instagram | https://www.instagram.com/3laa_elmasry0 |
| TikTok | https://www.tiktok.com/@elmasryshopify |
| Facebook | https://www.facebook.com/laalmsry.427007 |
| LinkedIn | https://www.linkedin.com/in/alaaelmasry |
| GitHub | https://github.com/3laaElmasry |

WhatsApp CTA links must include a prefilled message:
- AR: `أهلاً علاء، شفت البورتفوليو بتاعك وعايز أتكلم معاك عن مشروع Shopify`
- EN: `Hi Alaa, I saw your portfolio and I'd like to talk about a Shopify project`

(URL-encode the text with `encodeURIComponent`.)

### Engineering background (from his CV)

This is Alaa's **differentiator**: he is a real software engineer who builds Shopify stores, not only a theme installer. Use it to support the Shopify work. It must not compete with the Shopify projects. It goes in `src/data/experience.js`, `src/data/skills.js`, and `src/data/devProjects.js`.

#### Experience

**Back-End Developer (Full-Time), Weja Company** · Mar 2024 – Dec 2024. This was e-commerce platform work.
- Improved related-product matching logic: **+25% relevance** and **−15% search errors**.
- Fixed critical bugs in product display and search accuracy: **−30% error reports**.
- Built a proof-of-concept **fake-review detection** system to protect review integrity and customer trust.
- Worked in Agile sprints with cross-functional teams and delivered features ahead of schedule.

AR summary: اشتغل Back-End Developer في شركة Weja على منصة e-commerce. حسّن ترشيح المنتجات المرتبطة بنسبة ٢٥٪، وقلّل أخطاء البحث ١٥٪ وبلاغات الأخطاء ٣٠٪، وبنى نظام لكشف الريفيوهات المزيفة.

#### Problem solving

**300+** algorithmic problems solved across **LeetCode, Codewars, and Codeforces** (DSA, C++ / C#). Mention it as proof of engineering depth. Example angle: "The same thinking that solves 300+ algorithm problems is what makes your store fast and clean." Don't invent rankings, ratings, or badges.

#### Skills (group them like this)

| Group | Skills |
|---|---|
| Shopify | Liquid, Online Store 2.0 sections & blocks, custom theme development, CRO, sales funnels, store setup & launch |
| Front-end | HTML, CSS, JavaScript, responsive/mobile-first UI |
| Back-end | C#, ASP.NET Core (Web API & MVC), Entity Framework Core, REST APIs, JWT auth, role-based authorization |
| Databases | SQL Server, query optimization, stored procedures, indexing |
| Engineering | OOP, SOLID, Clean / N-Tier Architecture, Dependency Injection, Repository & Unit of Work, DSA, C++, unit testing (xUnit / NUnit) |
| Tools | Git, GitHub, Postman, Swagger, Visual Studio |

Show the skills as grouped chips. **No percentage bars or proficiency dots** (they look made up).

#### Dev projects (secondary, smaller cards; no screenshots needed)

| Project | Stack / what it does | Links |
|---|---|---|
| **Bulky Book**: full-stack bookstore | ASP.NET Core MVC, N-Tier, Repository/Unit of Work, role-based access, Facebook login, order-management dashboard | [GitHub](https://github.com/3laaElmasry/Bulky) · [Live](https://bulkybookstore.runasp.net) |
| **Learnava**: course platform | ASP.NET Core MVC, EF Core, Razor Pages, auth, AJAX DataTables, responsive UI | [GitHub](https://github.com/3laaElmasry/Learnava) · [Live](https://learnavaacademy.runasp.net) |
| **Clinic Manager**: REST API | ASP.NET Core, 3-Tier, JWT, role-based authorization, patients/doctors/appointments, Swagger | [GitHub](https://github.com/3laaElmasry/ClinicManager) |
| **Threads**: microblogging API | ASP.NET Core, Clean Architecture, JWT, posts/comments/users, Swagger | [GitHub](https://github.com/3laaElmasry/Threads) |

Put Bulky Book first because it's e-commerce, which is the most relevant to Shopify clients.

#### Education

B.Sc. Business Information Systems, **Benha University** (expected 2027). AR: بكالوريوس نظم معلومات إدارية، جامعة بنها (متوقع ٢٠٢٧).

#### Journey timeline (for the About section)

1. **Age 18**: started programming (C++, DSA, then C# / .NET).
2. **2024**: Back-End Developer at Weja (e-commerce).
3. **Companies rejected him for being a student**, so he went freelance and found Shopify.
4. **< 5 months**: 20+ brands across Egypt, Saudi Arabia & the Gulf, with 99% satisfaction.
5. **Now**: building conversion-focused Shopify stores while finishing his degree (2027).

---

## 3. Projects: the heart of the portfolio

**The whole site exists to sell these projects.** Each project is a mini case study: Brand → Challenge → What I built → Result. The result/metric is always the most prominent element on the card.

**Rules**

- Never invent numbers, testimonials, or client quotes. Projects without a hard metric get a *qualitative highlight* instead (given below).
- Show a **real screenshot** of each live site (see phase 1) inside a browser-frame mockup.
- Every card links to the live site (`target="_blank" rel="noopener"`).

### Display order and layout

1. **Rull Clothes**: *featured*. It gets a full-width, large card with desktop and mobile screenshots side by side.
2. **Fakhmestaa**
3. **Naila**
4. **Al Mosaad (EMTOP)**
5. **Alrajhi Industry**

Projects 2–5 go in a 2×2 grid on desktop and 1 column on mobile.

### Project data

Put this in `src/data/projects.js` as structured data with `en` and `ar` fields. The copywriting skill may polish the wording, but it must not change facts.

---

#### 1. Rull Clothes (featured)
- **URL:** https://www.rullclothes.com/products/premium-essential-tee-38 (screenshot the homepage `https://www.rullclothes.com` + this product page)
- **Category:** Egyptian clothing brand · Fashion
- **Metric:** `5x` sales / `×5` المبيعات
- **Services tags:** Redesign · Sales Funnel · CRO · Trust System
- **Challenge (EN):** The brand had traffic, but visitors weren't turning into buyers, and the old store didn't build enough trust to compete.
- **What I built (EN):** A full redesign and a complete customer funnel built around trust: a clear product page with a size guide, related-product upsells, visible shipping and 14-day return policies, a free-shipping threshold, and a direct WhatsApp line.
- **Result (EN):** The brand stayed competitive and **grew sales 5x**, turning far more visits into paying customers.
- **AR:** براند ملابس مصري. بعد ريديزاين كامل للموقع وبناء سيستم وفانل كاملة للعميل بتخليه يثق في البراند، حوّلنا أكبر عدد من الزيارات لعملاء. البراند قدر يكمل في السوق و**ضاعف مبيعاته ٥ أضعاف**.

#### 2. Fakhmestaa
- **URL:** https://fakhmestaa.com/
- **Category:** Egyptian footwear brand · Sneakers & accessories
- **Metric:** `1000+` orders in `< 3 months` / `+١٠٠٠ أوردر في أقل من ٣ شهور`
- **Services tags:** Store Build · Sales Funnel · Mass-market targeting
- **Challenge (EN):** Reaching a broad, mass-market Egyptian audience that buys with confidence only when the experience feels familiar and simple.
- **What I built (EN):** A full funnel written and designed to speak the language of the mass-market customer: clear offers and discounts, WhatsApp order confirmation, local payment (InstaPay), and fast-delivery messaging.
- **Result (EN):** **1000+ orders in under 3 months.**
- **AR:** براند أحذية مصري شعبي. بنينا فانل كاملة بتخاطب الفئة الشعبية بلغتها. في أقل من ٣ شهور البراند وصل لأكتر من **١٠٠٠ أوردر**.

#### 3. Naila
- **URL:** https://naila-eg.com
- **Category:** Egyptian womenswear brand · Fashion
- **Metric:** `< 3 days` full store / `أقل من ٣ أيام`
- **Services tags:** Full Store Build · Fast Launch
- **Challenge (EN):** The owner wanted to launch immediately, with no time for a long build cycle.
- **What I built (EN):** A complete, elegant store with collections, best sellers, video product showcases, and seasonal campaign sections, delivered from zero to live.
- **Result (EN):** **Fully live in under 3 days.**
- **AR:** براند ملابس حريمي مصري. الموقع اتبنى بالكامل في **أقل من ٣ أيام** علشان المالك كان عايز يبدأ بسرعة.

#### 4. Al Mosaad × EMTOP
- **URL:** https://almosad-emtop.com/
- **Category:** Power tools · Sole official importer of EMTOP in Egypt
- **Highlight (no hard metric):** `Official EMTOP importer` / `المستورد الرسمي الوحيد لـ EMTOP`
- **Services tags:** Large Catalog · Arabic RTL Store · B2B/B2C
- **What I built (EN):** An Arabic-first store for the sole official importer of the global EMTOP brand. It has a large multi-category catalog (cordless, electric, air tools, hand tools, measuring, safety), warranty and cash-on-delivery trust signals, and easy browsing for professionals.
- **AR:** شركة المسعد، المستورد الوحيد والرسمي لماركة EMTOP العالمية للصناعات الكهربائية. متجر عربي بكتالوج كبير متقسم بشكل يسهّل على المحترفين يوصلوا للي محتاجينه.

#### 5. Alrajhi Industry
- **URL:** https://alrajhiindustry.com
- **Category:** Doors & décor · Saudi Arabia 🇸🇦
- **Highlight (no hard metric):** `Saudi market · Al Rajhi group` / `السوق السعودي · مجموعة الراجحي`
- **Services tags:** KSA Store · Arabic RTL · Tabby/Tamara · Quote requests
- **What I built (EN):** A store for one of the Al Rajhi group companies, specialized in luxury doors, windows, and décor. It includes Tabby/Tamara installments, price-quote requests, and a premium Arabic experience for Saudi customers.
- **AR:** أحد أفرع سلسلة شركات الراجحي بالسعودية، متخصص في الديكورات والأبواب الفاخرة. متجر عربي بتجربة فخمة للعميل السعودي، مع تقسيط تابي وتمارا وطلب عروض أسعار.
- ⚠️ **Do NOT mention Al Rajhi Bank anywhere.** Say only "one of the Al Rajhi group of companies".

### Project card anatomy (inspired by the reference, improved)

```
┌───────────────────────────────────────────┐
│  [browser mockup: ● ● ●  rullclothes.com ]│  ← real screenshot inside, slow scroll on hover
│  [          screenshot                   ]│
├───────────────────────────────────────────┤
│  FASHION · EGYPT               (mono, dim)│
│  Rull Clothes                     (title) │
│  ×5  Sales                 (huge, accent) │
│  One-line story…                          │
│  [Redesign] [Funnel] [CRO]        (chips) │
│  Visit live store ↗        View story →   │
└───────────────────────────────────────────┘
```

- **Hover:** the card lifts 4px, the border turns accent, and the screenshot inside the browser frame slowly scrolls down (a tall full-page screenshot with `object-position` animated on hover). This is the signature interaction.
- **"View story →"** opens an accessible modal/drawer. It shows the full Challenge / What I built / Result, the desktop and mobile screenshots, the tags, and the live link. It closes on Esc, on a click outside, and with a close button, and it traps focus.

---

## 4. Site structure (sections in order)

1. **Navbar** (sticky, blurred dark glass). Logo "Alaa." · links: Work · Services · Engineering · About · Contact · language toggle `ع / EN` · WhatsApp button. Mobile: hamburger with a full-screen menu.
2. **Hero**
   - Left: availability pill with a pulsing green dot: "Available for new projects" / "متاح لمشاريع جديدة"
   - Headline:
     - EN: **"I build Shopify stores that sell."**
     - AR: **"ببني متاجر Shopify بتبيع… مش بس شكلها حلو."**
   - Sub (EN): "Custom-coded, conversion-focused stores for brands across Egypt, Saudi Arabia & the Gulf."
   - Sub (AR): "متاجر مبرمجة مخصوص ومبنية على الكونفرجن، لبراندات في مصر والسعودية والخليج."
   - CTAs: primary "Start your project on WhatsApp" / "ابدأ مشروعك على واتساب", secondary "See my work" / "شوف شغلي" (scrolls to #work).
   - Quick-jump chips under the CTAs (idea from the reference's quick replies): `×5 Rull Clothes` · `1000+ orders` · `Built in 3 days`. Each one scrolls to that project and highlights it.
   - Right: the hero portrait (section 5) with a soft accent glow behind it and 2 floating mini "stat badges" (e.g. `20+ Brands`, `99% Satisfaction`).
3. **Stats strip**: 4 counters that animate once when visible: `20+` Brands · `20K+` Followers · `5x` Sales growth · `1000+` Orders.
4. **Brands marquee**: an infinite, slow scrolling row of the 5 brand names in stylized text (no fake logos). It pauses on hover and is disabled with `prefers-reduced-motion`.
5. **Selected Work (`#work`)**: section 3. Title: "Selected Work" / "شغل مختار". Subtitle: "Real brands. Real numbers." / "براندات حقيقية. أرقام حقيقية."
6. **Services (`#services`)**: 4 cards:
   - Custom Shopify Store Build / بناء متجر Shopify من الصفر
   - Redesign & Rebrand / ريديزاين للمتجر
   - Sales Funnel & CRO / فانل وتحسين التحويل
   - Custom Liquid Sections (no app bloat) / سكشنز Liquid مخصوصة من غير تطبيقات تقيلة
7. **Process (`#process`)**: 4 numbered steps on a connected line: Understand the brand → Design → Build → Launch & Optimize.
8. **Engineering Edge (`#engineering`)**. Title: "Engineer first. Shopify developer second." / "مهندس برمجيات قبل ما أكون مطوّر Shopify." Sub: "Why my stores are faster and cleaner than app-stacked templates." / "ليه متاجري أسرع وأنضف من التمبلتس المليانة تطبيقات." Contents, in this order:
   - **Proof row** of 3 mini stats: `300+` problems solved (LeetCode · Codewars · Codeforces) · `+25%` product-match relevance at Weja · `−30%` error reports at Weja.
   - **Experience card**: Weja Company with the 4 bullets.
   - **Skills**: grouped chips (see "Skills" in section 2).
   - **Dev projects**: 4 compact code-style cards (dark card, mono font, a small `</>` or terminal header). Each card has the name, a one-line description, stack chips, and GitHub ↗ / Live ↗ links. These must look clearly *secondary* to the Shopify project cards.
9. **About (`#about`)**: the journey timeline (section 2), the engineering-depth differentiator, the markets served, and education. Include a smaller second crop of the portrait, or reuse the hero image.
10. **Final CTA + Contact (`#contact`)**: big line: "Your store should be selling more. Let's fix that." / "متجرك المفروض يبيع أكتر. يلا نصلّح ده." Contact cards for WhatsApp (#25D366 icon), Email, and Phone, plus a social icons row (Instagram, TikTok, Facebook, LinkedIn, GitHub).
11. **Footer**: © year, "Alaa Elmasry / علاء المصري", socials, "Built by Alaa".
12. **Floating WhatsApp button** (bottom corner; it mirrors in RTL).

---

## 5. Hero image: find it and crop it

- Search the project for the image: `find . -iname "hero.jpg" -not -path "*/node_modules/*"`. It lives in a folder named `assets`.
- **Never modify the original.** Write processed files to `src/assets/images/hero/`.
- **Crop to the upper half of the body only** (head, shoulders, chest, roughly down to the waist). Remove the legs and lower body.
- Use `sharp` in `scripts/crop-hero.mjs`:
  1. Read the metadata (width and height).
  2. Crop from the top. Start with `height * 0.55`, and adjust so the head is not cut and there is a little headroom.
  3. Export `hero-800.webp`, `hero-1200.webp`, and a `hero-1200.jpg` fallback.
- **Verify visually:** open the cropped output with your image-reading tool and look at it. If the face or top of the head is cut, or the crop includes legs, change the ratio and re-run. Repeat until it's a clean waist-up portrait.
- Style it in the page: rounded corners or an arch shape, a subtle accent glow behind it, and a soft gradient fade at the bottom so it blends into the dark background.
- Use `<picture>` with WebP and a JPG fallback, explicit `width`/`height`, `alt="Alaa Elmasry"`, and `fetchpriority="high"`.

---

## 6. Design system

### Direction: Dark Premium

Moody, confident, and tech-forward. Lots of breathing room and big type. The accent color is used sparingly, mostly on numbers and CTAs.

### Tokens (`src/styles/tokens.css`)

```css
:root {
  --bg: #0A0A0B;
  --bg-2: #111114;
  --bg-card: #16161A;
  --bg-elev: #1C1C22;
  --ink: #F5F5F7;
  --ink-2: #B8B8C0;
  --ink-3: #7A7A85;
  --line: rgba(255,255,255,0.08);
  --line-strong: rgba(255,255,255,0.16);
  --accent: #C6F432;          /* lime: numbers, primary CTA, highlights */
  --accent-ink: #0A0A0B;      /* text on accent */
  --accent-glow: rgba(198,244,50,0.18);
  --whatsapp: #25D366;
  --radius-lg: 24px; --radius: 16px; --radius-sm: 10px; --radius-pill: 999px;
  --font-display: "Space Grotesk", "IBM Plex Sans Arabic", sans-serif;
  --font-body: "Inter", "IBM Plex Sans Arabic", sans-serif;
  --font-ar: "IBM Plex Sans Arabic", sans-serif;
  --font-mono: "JetBrains Mono", monospace;
  --ease: cubic-bezier(.2,.8,.2,1);
  --container: 1200px;
}
```

- **Fonts:** load them from Google Fonts with `display=swap` and preconnect. When `html[lang="ar"]`, switch the display and body fonts to IBM Plex Sans Arabic.
- **Type scale:** use a fluid scale with `clamp()`. Hero h1 ≈ `clamp(2.6rem, 6vw, 5.2rem)` with tight letter-spacing in EN (no negative letter-spacing in AR).
- **Ideas taken from the reference** (amrmahmoud-shopify.github.io), adapted rather than copied:
  - near-black layered backgrounds
  - hairline borders
  - mono uppercase meta labels
  - browser-chrome mockups with ● ● ● dots and the domain
  - pill quick-chips
  - a pulsing availability dot
  - WhatsApp-first CTAs
  - a bilingual toggle

  Do **not** clone its chat interface. Our site is a scroll-based case-study portfolio.
- **Background texture:** a subtle grain/noise overlay plus 1–2 large blurred accent orbs drifting slowly.
- **Motion:**
  - fade-up reveals on scroll (IntersectionObserver, 500–700ms, stagger 80ms)
  - counter animation
  - card hover lift
  - the screenshot scroll-on-hover
  - the marquee

  Wrap all of it in a `prefers-reduced-motion` check.

---

## 7. Bilingual (EN / AR) & RTL

- All UI strings go in `src/i18n/en.js` and `src/i18n/ar.js`. Project copy goes in `src/data/projects.js` (with `en`/`ar` per field). **No hard-coded text inside components.**
- The toggle sets `<html lang="ar" dir="rtl">` or `<html lang="en" dir="ltr">`, re-renders the text, and saves the choice in `localStorage` (wrapped in try/catch).
- Default language: `navigator.language` starting with `ar` → Arabic. Otherwise use English.
- **Use CSS logical properties everywhere** (`margin-inline-start`, `padding-inline`, `inset-inline-end`, `text-align: start`) so RTL works without a separate stylesheet. Directional icons (arrows) flip in RTL.
- Numbers: keep Western digits (5x, 1000+) in both languages for impact and consistency.

---

## 8. Tech stack & code organization

**Stack:** Vite + Vanilla JS (ES modules) + plain CSS. No frameworks. Allowed dev deps: `vite`, `sharp`, `playwright` (screenshots only).

### ⚠️ Code organization rules (strict)

- **Never put everything in one file.** One component per file and one concern per file.
- JS files stay under ~150 lines. If one grows beyond that, split it.
- Data (projects, stats, services, socials) is separated from markup.
- CSS is split by layer and by component. No giant `style.css`. No inline styles in JS except dynamic values set through CSS custom properties.
- Components are functions that return an HTML string or element and receive data plus the current language.

### Folder structure

```
/
├── CLAUDE.md
├── .claude/
│   ├── settings.json            # permissions (provided, don't edit)
│   └── agents/                  # subagent definitions (provided, don't edit)
├── DECISIONS.md                 # log of autonomous decisions
├── README.md
├── index.html                   # shell + meta/SEO only; content is rendered by components
├── package.json
├── vite.config.js               # set `base` correctly for GitHub Pages
├── .gitignore
├── .github/workflows/deploy.yml # GitHub Pages deploy via Actions
├── assets/hero.jpg              # ORIGINAL (do not modify)
├── scripts/
│   ├── crop-hero.mjs
│   └── screenshot-projects.mjs
├── public/
│   ├── favicon.svg
│   ├── og-image.jpg             # 1200×630, name + title + portrait
│   └── robots.txt
└── src/
    ├── main.js                  # bootstraps: i18n → render sections → init effects
    ├── app.js                   # composes sections in order
    ├── data/
    │   ├── site.js              # name, title, contact, WhatsApp messages
    │   ├── projects.js
    │   ├── stats.js
    │   ├── services.js
    │   ├── process.js
    │   ├── experience.js        # Weja + journey timeline + education
    │   ├── skills.js
    │   ├── devProjects.js
    │   └── socials.js
    ├── i18n/
    │   ├── index.js             # getLang, setLang, t()
    │   ├── en.js
    │   └── ar.js
    ├── components/
    │   ├── Navbar.js
    │   ├── Hero.js
    │   ├── StatsStrip.js
    │   ├── BrandsMarquee.js
    │   ├── Work.js
    │   ├── ProjectCard.js
    │   ├── FeaturedProject.js
    │   ├── ProjectModal.js
    │   ├── BrowserFrame.js
    │   ├── Services.js
    │   ├── Process.js
    │   ├── Engineering.js       # composes the pieces below
    │   ├── ExperienceCard.js
    │   ├── SkillsGroups.js
    │   ├── DevProjectCard.js
    │   ├── Timeline.js
    │   ├── About.js
    │   ├── Contact.js
    │   ├── Footer.js
    │   └── WhatsAppFab.js
    ├── utils/
    │   ├── dom.js
    │   ├── reveal.js            # IntersectionObserver reveals
    │   ├── counter.js
    │   ├── whatsapp.js          # builds wa.me links per language
    │   └── icons.js             # inline SVG icons (socials, arrows, WhatsApp)
    ├── styles/
    │   ├── main.css             # @imports only
    │   ├── tokens.css
    │   ├── reset.css
    │   ├── base.css             # typography, body, grain, links
    │   ├── layout.css           # container, section spacing, grids
    │   ├── utilities.css
    │   ├── animations.css
    │   └── components/
    │       ├── navbar.css  hero.css  stats.css  marquee.css
    │       ├── work.css  project-card.css  browser-frame.css  modal.css
    │       ├── services.css  process.css  engineering.css  dev-project-card.css
    │       ├── timeline.css  about.css  contact.css
    │       └── footer.css  buttons.css  chips.css  whatsapp-fab.css
    └── assets/
        └── images/
            ├── hero/            # cropped outputs
            └── projects/        # screenshots (desktop + mobile per brand)
```

---

## 9. Workflow phases

Commit after each phase with a clear message.

### Phase 0: Setup (Chief)

- `git init` (if needed), `npm create vite@latest` (vanilla) or scaffold manually to match the structure above, then `npm i -D sharp playwright`.
- Create `DECISIONS.md`.

### Phase 1: Assets (→ `asset-worker`, in parallel with Phase 2)

- Hero crop (section 5). Verify it visually.
- `scripts/screenshot-projects.mjs`: use Playwright (Chromium) to capture every project URL:
  - **desktop** at 1440×900, full page, capped to ~3000px tall (for the scroll-on-hover effect)
  - **mobile** at 390×844, viewport only
- Wait for network idle plus ~2s, and try to dismiss popups or cookie banners. Save as WebP (quality ~80) through `sharp`.
- If a site fails to load or is blocked, retry once. If it still fails, fall back to a styled placeholder mockup (brand name + category on a gradient) and log it in `DECISIONS.md`.
- Look at every screenshot yourself. If one shows a popup covering the page, redo it.

### Phase 2: Scaffold & design system (Chief)

- Load `frontend-design` and `ui-design`.
- Build tokens, reset, base, layout, and the i18n system.

### Phase 3: Components (Chief builds the signature pieces, then `component-builder` builds the simple sections in 1–2 batched calls)

- Build every section in order, with the projects section and modal first-class.
- Load `ui-design` for card and mockup details.

### Phase 4: Copy (→ `copy-writer`, Chief reviews the hero and project copy)

- Load `copywriting` + `personal-brand-video` (voice only).
- Polish all EN and AR strings. Keep the facts from sections 2–3 unchanged. The AR copy must read as natural Egyptian, not a translation.

### Phase 5: QA (→ `qa-auditor` reports, Chief fixes or delegates the fixes, then one re-audit)

Load `web-design-guidelines` and audit + fix:
- Responsive at 360, 390, 768, 1024, 1440. No horizontal scroll.
- Both languages: RTL layout mirrored correctly and nothing overflowing.
- Accessibility:
  - semantic landmarks and a single h1
  - alt text
  - visible focus states
  - keyboard-operable modal and menu
  - contrast AA
  - `aria-label` on icon links
- Performance:
  - WebP images
  - lazy-load below the fold
  - explicit image sizes
  - fonts with swap
  - no unused JS
  - target Lighthouse ≥ 90 on all four categories
- SEO:
  - title "Alaa Elmasry — Shopify Developer & CRO Specialist"
  - meta description
  - Open Graph + Twitter card with `og-image.jpg`
  - JSON-LD `Person` (name "Alaa Elmasry", alternateName "علاء المصري", jobTitle, sameAs socials incl. GitHub, email, alumniOf Benha University)
  - canonical
- `npm run build` must succeed with zero errors. Run `npx vite preview` and take Playwright screenshots of the full page in EN and AR (desktop + mobile), then review them yourself and fix anything off.

### Phase 6: Push & deploy (→ `deployer`)

1. `gh auth status`. If not logged in, stop here and tell the owner to run `gh auth login`.
2. `USER=$(gh api user -q .login)`. The expected account is `3laaElmasry`, so the site would be `https://3laaelmasry.github.io`.
3. Repo: if `$USER.github.io` doesn't exist, create it as a public user-site repo (`vite base: '/'`). If it already exists and is used for something else, create `portfolio` instead (`base: '/portfolio/'`). Record the choice in `DECISIONS.md`.
4. Add `.github/workflows/deploy.yml` using the official actions (`actions/checkout`, `actions/setup-node` with Node 20, `npm ci`, `npm run build`, `actions/configure-pages`, `actions/upload-pages-artifact` with `dist`, `actions/deploy-pages`). Trigger on push to `main`.
5. `gh repo create … --public --source=. --remote=origin --push` (or `git push -u origin main`).
6. Enable Pages with Actions as the source: `gh api -X POST repos/$USER/<repo>/pages -f build_type=workflow` (ignore the error if it's already enabled).
7. Watch the run: `gh run watch`. If it fails, read the logs, fix, and push again.
8. Verify that the live URL loads.

### Phase 7: Final report (Chief)

Reply with:
- the live URL
- the repo URL
- what was built
- anything that fell back to placeholders
- a short list of next-step suggestions

---

## 10. Hard rules (checklist)

- [ ] No invented metrics, testimonials, client quotes, or logos.
- [ ] No mention of Al Rajhi **Bank**.
- [ ] The name is always "Alaa Elmasry" / "علاء المصري" (never "Alaa Saeed").
- [ ] Dev projects and engineering content stay visually secondary to the Shopify projects.
- [ ] No skill percentage bars or proficiency meters.
- [ ] No testimonials section (owner's decision).
- [ ] The original `assets/hero.jpg` is untouched. The hero shows the upper body only.
- [ ] Code is split into files and folders as in section 8. No monolithic files.
- [ ] Every string is available in both EN and AR. RTL is correct.
- [ ] Every WhatsApp link has the prefilled message.
- [ ] Every project links to its live site.
- [ ] `prefers-reduced-motion` is respected.
- [ ] The build passes, the site is deployed, and the live URL is verified.
