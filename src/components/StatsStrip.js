import { t } from '../i18n/index.js';
import { stats } from '../data/stats.js';

export function StatsStrip(lang) {
  return `
    <section class="stats" aria-label="${t('stats.sectionLabel')}">
      <div class="container stats__grid">
        ${stats
          .map(
            (stat, index) => `
          <div class="stats__item reveal" data-reveal-delay="${index * 80}">
            <div class="stats__value" data-counter="${stat.value}" data-suffix="${stat.suffix}">0</div>
            <p class="stats__label">${t(stat.labelKey)}</p>
          </div>
        `
          )
          .join('')}
      </div>
    </section>
  `;
}

export function initStatsStrip() {
  // Counter animation is handled globally by initCounters() in src/app.js.
}
