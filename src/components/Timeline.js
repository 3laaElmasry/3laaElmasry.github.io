import { t } from '../i18n/index.js';

export function Timeline() {
  const items = t('about.timeline.items');
  return `
    <div class="timeline reveal">
      <h3 class="timeline__title">${t('about.timeline.title')}</h3>
      <ol class="timeline__list">
        ${items
          .map(
            (item, index) => `
              <li class="timeline__item">
                <span class="timeline__marker" aria-hidden="true">${index + 1}</span>
                <div class="timeline__content">
                  <span class="timeline__year mono">${item.year}</span>
                  <p class="timeline__text">${item.text}</p>
                </div>
              </li>
            `
          )
          .join('')}
      </ol>
    </div>
  `;
}
