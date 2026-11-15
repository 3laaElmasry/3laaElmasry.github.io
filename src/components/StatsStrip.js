import { t } from '../i18n/index.js';
import { icon } from '../utils/icons.js';
import { stats } from '../data/stats.js';

// One compact band of four numbers, directly under the hero.
export function StatsStrip() {
  return `
    <section class="stats" aria-label="${t('stats.sectionLabel')}">
      <div class="container">
        <div class="stats__band reveal">
          ${stats
            .map(
              (stat) => `
            <div class="stats__item">
              <span class="stats__icon" aria-hidden="true">${icon(stat.icon)}</span>
              <div>
                <div class="stats__value" data-counter="${stat.value}" data-suffix="${stat.suffix}">0</div>
                <p class="stats__label">${t(stat.labelKey)}</p>
              </div>
            </div>`
            )
            .join('')}
        </div>
      </div>
    </section>
  `;
}
