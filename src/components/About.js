import { t } from '../i18n/index.js';
import { Timeline } from './Timeline.js';
import { CarouselNav } from './CarouselNav.js';
import { initCarousel } from '../utils/carousel.js';

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

          <div class="carousel-head timeline__head reveal">
            <h3 class="timeline__title">${t('about.timeline.title')}</h3>
            ${CarouselNav('timeline-track', t('about.timeline.prev'), t('about.timeline.next'))}
          </div>
          <div class="carousel-track timeline" id="timeline-track" tabindex="0" role="region" aria-label="${t('about.timeline.title')}">
            ${Timeline()}
          </div>

          <div class="about__block reveal">
            <h3 class="about__block-title">${t('about.differentiatorTitle')}</h3>
            <p class="about__block-text">${t('about.differentiator')}</p>
          </div>

          <div class="carousel-head about__meta-head reveal">
            <span class="visually-hidden">${t('about.marketsTitle')}</span>
            ${CarouselNav('about-meta-track', t('about.metaPrev'), t('about.metaNext'))}
          </div>
          <div class="carousel-track about__meta" id="about-meta-track" tabindex="0" role="region" aria-label="${t('about.marketsTitle')}">
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

export function initAbout() {
  initCarousel('timeline-track');
  initCarousel('about-meta-track');
}
