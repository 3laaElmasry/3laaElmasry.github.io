import { t } from '../i18n/index.js';
import { icon } from '../utils/icons.js';
import { services } from '../data/services.js';

export function Services(lang) {
  return `
    <section id="services" class="services">
      <div class="container">
        <div class="section-head reveal">
          <span class="section-head__eyebrow mono">${t('services.eyebrow')}</span>
          <h2 class="section-head__title">${t('services.title')}</h2>
          <p class="section-head__subtitle">${t('services.subtitle')}</p>
        </div>
        <div class="services__grid">
          ${services
            .map(
              (service, index) => `
            <article class="service-card reveal" data-reveal-delay="${index * 80}">
              <div class="service-card__icon" aria-hidden="true">${icon(service.icon)}</div>
              <h3 class="service-card__title">${t(`services.items.${service.id}.title`)}</h3>
              <p class="service-card__description">${t(`services.items.${service.id}.description`)}</p>
            </article>
          `
            )
            .join('')}
        </div>
      </div>
    </section>
  `;
}
