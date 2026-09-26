import { t } from '../i18n/index.js';
import { processSteps } from '../data/process.js';
import { CarouselNav } from './CarouselNav.js';
import { initCarousel } from '../utils/carousel.js';

export function Process(lang) {
  return `
    <section id="process" class="process">
      <div class="container">
        <div class="carousel-head reveal">
          <div class="section-head process__section-head">
            <span class="section-head__eyebrow mono">${t('process.eyebrow')}</span>
            <h2 class="section-head__title">${t('process.title')}</h2>
            <p class="section-head__subtitle">${t('process.subtitle')}</p>
          </div>
          ${CarouselNav('process-track', t('process.prev'), t('process.next'))}
        </div>
        <div class="carousel-track process__grid" id="process-track" tabindex="0" role="region" aria-label="${t('process.title')}">
          ${processSteps
            .map(
              (step) => `
            <div class="process-step">
              <span class="process-step__number mono">${step.number}</span>
              <h3 class="process-step__title">${t(`process.steps.${step.id}.title`)}</h3>
              <p class="process-step__description">${t(`process.steps.${step.id}.description`)}</p>
            </div>
          `
            )
            .join('')}
        </div>
      </div>
    </section>
  `;
}

export function initProcess() {
  initCarousel('process-track');
}
