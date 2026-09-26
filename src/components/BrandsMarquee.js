import { t } from '../i18n/index.js';
import { brandNames } from '../data/stats.js';

function trackItems() {
  return brandNames
    .map((name) => `<span class="marquee__item">${name}</span>`)
    .join('');
}

export function BrandsMarquee(lang) {
  return `
    <section class="marquee" aria-label="${t('marquee.label')}">
      <div class="marquee__viewport">
        <div class="marquee__track">
          ${trackItems()}
          ${trackItems()}
        </div>
      </div>
    </section>
  `;
}
