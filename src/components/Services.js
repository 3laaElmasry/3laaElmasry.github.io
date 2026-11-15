import { t } from '../i18n/index.js';
import { icon } from '../utils/icons.js';
import { services } from '../data/services.js';
import { processSteps } from '../data/process.js';

// Services and the four-step process share one section: what I build, then how.
export function Services() {
  return `
    <section id="services" class="services">
      <div class="container">
        <div class="section-head reveal">
          <h2 class="section-head__title">${t('services.title')}</h2>
          <p class="section-head__subtitle">${t('services.subtitle')}</p>
        </div>
        <div class="services__grid">
          ${services
            .map(
              (service, index) => `
            <article class="service-card reveal" data-reveal-delay="${index * 60}">
              <span class="service-card__icon" aria-hidden="true">${icon(service.icon)}</span>
              <h3 class="service-card__title">${t(`services.items.${service.id}.title`)}</h3>
              <p class="service-card__description">${t(`services.items.${service.id}.description`)}</p>
            </article>`
            )
            .join('')}
        </div>

        <div class="process reveal" id="process">
          <div class="process__head">
            <h3 class="process__title">${t('process.title')}</h3>
            <p class="process__subtitle">${t('process.subtitle')}</p>
          </div>
          <ol class="process__steps">
            ${processSteps
              .map(
                (step) => `
              <li class="process-step">
                <span class="process-step__icon" aria-hidden="true">${icon(step.icon)}</span>
                <span class="process-step__number" aria-hidden="true">${step.number}</span>
                <h4 class="process-step__title">${t(`process.steps.${step.id}.title`)}</h4>
                <p class="process-step__description">${t(`process.steps.${step.id}.description`)}</p>
              </li>`
              )
              .join('')}
          </ol>
        </div>
      </div>
    </section>
  `;
}
