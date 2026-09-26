import { t } from '../i18n/index.js';
import { processSteps } from '../data/process.js';

export function Process(lang) {
  return `
    <section id="process" class="process">
      <div class="container">
        <div class="section-head reveal">
          <span class="section-head__eyebrow mono">${t('process.eyebrow')}</span>
          <h2 class="section-head__title">${t('process.title')}</h2>
          <p class="section-head__subtitle">${t('process.subtitle')}</p>
        </div>
        <div class="process__grid">
          ${processSteps
            .map(
              (step, index) => `
            <div class="process-step reveal" data-reveal-delay="${index * 80}">
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
