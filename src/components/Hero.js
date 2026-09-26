import { t } from '../i18n/index.js';
import { getWhatsAppUrl } from '../utils/whatsapp.js';
import { icon } from '../utils/icons.js';
import { qsa } from '../utils/dom.js';
import { revealProjectInChat } from './Work.js';

import hero800 from '../assets/images/hero/hero-800.webp';
import hero1200 from '../assets/images/hero/hero-1200.webp';
import hero1200Jpg from '../assets/images/hero/hero-1200.jpg';

const QUICK_CHIPS = [
  { projectId: 'rull', key: 'quickChips.rull' },
  { projectId: 'fakhmestaa', key: 'quickChips.orders' },
  { projectId: 'naila', key: 'quickChips.speed' },
];

export function Hero(lang) {
  return `
    <section class="hero" id="top">
      <div class="container hero__grid">
        <div class="hero__portrait-wrap reveal">
          <div class="hero__glow" aria-hidden="true"></div>
          <picture>
            <source type="image/webp" srcset="${hero800} 800w, ${hero1200} 1200w" sizes="(min-width: 900px) 420px, 70vw" />
            <img
              src="${hero1200Jpg}"
              alt="${t('hero.heroAlt')}"
              width="1200"
              height="1500"
              fetchpriority="high"
              class="hero__portrait"
            />
          </picture>
          <div class="hero__badge hero__badge--brands">${t('hero.badgeBrands')}</div>
          <div class="hero__badge hero__badge--satisfaction">${t('hero.badgeSatisfaction')}</div>
        </div>
        <div class="hero__content">
          <div class="availability-pill reveal" data-reveal-delay="80">
            <span class="availability-pill__dot" aria-hidden="true"></span>
            ${t('hero.availability')}
          </div>
          <h1 class="hero__headline reveal" data-reveal-delay="140">${t('hero.headline')}</h1>
          <p class="hero__sub reveal" data-reveal-delay="200">${t('hero.sub')}</p>
          <div class="hero__ctas reveal" data-reveal-delay="260">
            <a class="btn btn--primary" href="${getWhatsAppUrl(lang)}" target="_blank" rel="noopener">
              ${t('hero.ctaPrimary')}
            </a>
            <a class="btn btn--secondary" href="#work">
              ${t('hero.ctaSecondary')} ${icon('arrowRight')}
            </a>
          </div>
          <div class="chip-row hero__chips reveal" data-reveal-delay="320">
            ${QUICK_CHIPS.map(
              (chip) =>
                `<button type="button" class="chip chip--quick" data-scroll-project="${chip.projectId}">${t(chip.key)}</button>`
            ).join('')}
          </div>
        </div>
      </div>
    </section>
  `;
}

export function initHero() {
  qsa('[data-scroll-project]').forEach((btn) => {
    btn.addEventListener('click', () => revealProjectInChat(btn.dataset.scrollProject));
  });
}
