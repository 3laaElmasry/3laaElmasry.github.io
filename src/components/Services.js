import { t } from '../i18n/index.js';
import { icon } from '../utils/icons.js';
import { services } from '../data/services.js';
import { qs, qsa } from '../utils/dom.js';
import { getThemeImage } from '../utils/images.js';

export function Services(lang) {
  return `
    <section id="services" class="services">
      <div class="container">
        <div class="services__head reveal">
          <div class="section-head services__section-head">
            <span class="section-head__eyebrow mono">${t('services.eyebrow')}</span>
            <h2 class="section-head__title">${t('services.title')}</h2>
            <p class="section-head__subtitle">${t('services.subtitle')}</p>
          </div>
          <div class="services__nav">
            <button type="button" class="services__nav-btn" data-services-prev aria-label="${t('services.prev')}">
              ${icon('arrowRight')}
            </button>
            <button type="button" class="services__nav-btn" data-services-next aria-label="${t('services.next')}">
              ${icon('arrowRight')}
            </button>
          </div>
        </div>
        <div class="services__carousel" data-services-track tabindex="0" role="region" aria-label="${t('services.title')}">
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
  const track = qs('[data-services-track]');
  const prevBtn = qs('[data-services-prev]');
  const nextBtn = qs('[data-services-next]');
  if (!track) return;

  function cardStep() {
    const card = track.querySelector('.service-card');
    if (!card) return track.clientWidth;
    const style = getComputedStyle(track);
    const gap = parseFloat(style.columnGap || style.gap || '0');
    return card.getBoundingClientRect().width + gap;
  }

  const isRtl = document.documentElement.dir === 'rtl';
  const dir = isRtl ? -1 : 1;

  prevBtn?.addEventListener('click', () => {
    track.scrollBy({ left: -dir * cardStep(), behavior: 'smooth' });
  });
  nextBtn?.addEventListener('click', () => {
    track.scrollBy({ left: dir * cardStep(), behavior: 'smooth' });
  });

  qsa('.service-card', track).forEach((card) => card.setAttribute('tabindex', '0'));
}
