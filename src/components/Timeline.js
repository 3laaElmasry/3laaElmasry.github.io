import { t } from '../i18n/index.js';

export function Timeline() {
  const items = t('about.timeline.items');
  return items
    .map(
      (item, index) => `
        <div class="timeline-card">
          <span class="timeline-card__marker mono" aria-hidden="true">${index + 1}</span>
          <span class="timeline-card__year mono">${item.year}</span>
          <p class="timeline-card__text">${item.text}</p>
        </div>
      `
    )
    .join('');
}
