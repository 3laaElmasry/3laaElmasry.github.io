import { t } from '../i18n/index.js';
import { weja } from '../data/experience.js';

export function ExperienceCard() {
  const bullets = t(weja.bulletsKey);
  return `
    <div class="experience-card reveal">
      <div class="experience-card__head">
        <h3 class="experience-card__title">${t(weja.titleKey)}</h3>
        <p class="experience-card__company">
          <span>${weja.company}</span>
          <span class="experience-card__period mono">${t(weja.periodKey)}</span>
        </p>
      </div>
      <p class="experience-card__summary">${t(weja.summaryKey)}</p>
      <ul class="experience-card__bullets">
        ${bullets.map((bullet) => `<li>${bullet}</li>`).join('')}
      </ul>
    </div>
  `;
}
