import { t } from '../i18n/index.js';
import { stats } from '../data/stats.js';
import { CarouselNav } from './CarouselNav.js';
import { initCarousel } from '../utils/carousel.js';

export function StatsStrip(lang) {
  return `
    <section class="stats" aria-label="${t('stats.sectionLabel')}">
      <div class="container">
        <div class="carousel-head stats__head reveal">
          <span class="visually-hidden">${t('stats.sectionLabel')}</span>
          ${CarouselNav('stats-track', t('stats.prev'), t('stats.next'))}
        </div>
        <div class="carousel-track stats__grid" id="stats-track" tabindex="0" role="region" aria-label="${t('stats.sectionLabel')}">
          ${stats
            .map(
              (stat) => `
            <div class="stats__item">
              <div class="stats__value" data-counter="${stat.value}" data-suffix="${stat.suffix}">0</div>
              <p class="stats__label">${t(stat.labelKey)}</p>
            </div>
          `
            )
            .join('')}
        </div>
      </div>
    </section>
  `;
}

export function initStatsStrip() {
  initCarousel('stats-track');
}
