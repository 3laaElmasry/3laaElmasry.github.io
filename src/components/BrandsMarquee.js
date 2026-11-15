import { t } from '../i18n/index.js';
import { getProjects } from '../content/store.js';

function trackItems() {
  return getProjects()
    .map((project) => project.name)
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
