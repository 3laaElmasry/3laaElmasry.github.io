import { t } from '../i18n/index.js';
import { icon } from '../utils/icons.js';
import { services } from '../data/services.js';
import { getThemeImage } from '../utils/images.js';
import { initCarousel } from '../utils/carousel.js';
import { CarouselNav } from './CarouselNav.js';

export function Services(lang) {
  return `
    <section id="services" class="services">
      <div class="container">
        <div class="carousel-head reveal">
          <div class="section-head services__section-head">
            <span class="section-head__eyebrow mono">${t('services.eyebrow')}</span>
            <h2 class="section-head__title">${t('services.title')}</h2>
            <p class="section-head__subtitle">${t('services.subtitle')}</p>
          </div>
          ${CarouselNav('services-track', t('services.prev'), t('services.next'))}
        </div>
        <div class="carousel-track services__carousel" id="services-track" tabindex="0" role="region" aria-label="${t('services.title')}">
          ${services
            .map(
              (service) => `
            <article class="service-card">
              <div class="service-card__media">
                <img src="${getThemeImage(service.themeImage)}" alt="${t('services.themeImageAlt')}" loading="lazy" class="service-card__theme-img" />
              </div>
              <div class="service-card__body">
                <div class="service-card__icon" aria-hidden="true">${icon(service.icon)}</div>
                <h3 class="service-card__title">${t(`services.items.${service.id}.title`)}</h3>
                <p class="service-card__description">${t(`services.items.${service.id}.description`)}</p>
              </div>
            </article>
          `
            )
            .join('')}
        </div>
      </div>
    </section>
  `;
}

export function initServices() {
  initCarousel('services-track');
}
