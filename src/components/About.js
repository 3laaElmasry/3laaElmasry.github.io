import { t } from '../i18n/index.js';
import { Timeline } from './Timeline.js';

import portraitWebp from '../assets/images/hero/hero-800.webp';
import portraitJpg from '../assets/images/hero/hero-1200.jpg';

export function About() {
  return `
    <section id="about" class="about">
      <div class="container about__grid">
        <div class="about__main">
          <div class="section-head reveal">
            <span class="section-head__eyebrow mono">${t('about.eyebrow')}</span>
            <h2 class="section-head__title">${t('about.title')}</h2>
          </div>

          ${Timeline()}

          <div class="about__block reveal">
            <h3 class="about__block-title">${t('about.differentiatorTitle')}</h3>
            <p class="about__block-text">${t('about.differentiator')}</p>
          </div>

          <div class="about__meta reveal">
            <div class="about__meta-item">
              <h4 class="about__meta-title mono">${t('about.marketsTitle')}</h4>
              <p>${t('about.markets')}</p>
            </div>
            <div class="about__meta-item">
              <h4 class="about__meta-title mono">${t('about.educationTitle')}</h4>
              <p>${t('about.education')}</p>
            </div>
          </div>
        </div>

        <div class="about__portrait-wrap reveal">
          <picture>
            <source type="image/webp" srcset="${portraitWebp}" />
            <img
              src="${portraitJpg}"
              alt="${t('hero.heroAlt')}"
              width="400"
              height="400"
              loading="lazy"
              class="about__portrait"
            />
          </picture>
        </div>
      </div>
    </section>
  `;
}
