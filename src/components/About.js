import { t } from '../i18n/index.js';
import { icon } from '../utils/icons.js';
import { proofStats, weja } from '../data/experience.js';
import { devProjects } from '../data/devProjects.js';
import { SkillsGroups, initSkillsGroups } from './SkillsGroups.js';
import { DevProjectCard } from './DevProjectCard.js';

import portraitWebp from '../assets/images/hero/hero-800.webp';
import portraitJpg from '../assets/images/hero/hero-1200.jpg';

// One section for the person behind the work: the story, the engineering
// proof, the skills and the side projects, laid out as a bento grid.
export function About(lang) {
  const timeline = t('about.timeline.items');
  return `
    <section id="about" class="about">
      <div class="container">
        <div class="section-head reveal">
          <h2 class="section-head__title">${t('engineering.title')}</h2>
          <p class="section-head__subtitle">${t('engineering.subtitle')}</p>
        </div>

        <div class="about__bento">
          <article class="bento bento--story reveal">
            <picture>
              <source type="image/webp" srcset="${portraitWebp}" />
              <img src="${portraitJpg}" alt="${t('hero.heroAlt')}" width="96" height="96" loading="lazy" class="about__avatar" />
            </picture>
            <h3 class="bento__title">${t('about.title')}</h3>
            <p class="bento__text">${t('about.differentiator')}</p>
            <ul class="about__facts">
              <li>${icon('globe')}<span>${t('about.markets')}</span></li>
              <li>${icon('education')}<span>${t('about.education')}</span></li>
            </ul>
          </article>

          <article class="bento bento--journey reveal" data-reveal-delay="60">
            <h3 class="bento__label">${t('about.timeline.title')}</h3>
            <ol class="journey">
              ${timeline
                .map((item) => `<li><span class="journey__when">${item.year}</span><span class="journey__what">${item.text}</span></li>`)
                .join('')}
            </ol>
          </article>

          <div class="about__proof reveal" data-reveal-delay="120">
            ${proofStats
              .map(
                (stat) => `
              <div class="bento bento--stat">
                <span class="bento__value">${stat.value}</span>
                <span class="bento__caption">${t(stat.labelKey)}</span>
              </div>`
              )
              .join('')}
          </div>

          <article class="bento bento--skills reveal">
            <h3 class="bento__label">${t('engineering.skills.title')}</h3>
            ${SkillsGroups()}
          </article>

          <article class="bento bento--experience reveal" data-reveal-delay="60">
            <h3 class="bento__label">${t(weja.titleKey)} · ${weja.company}</h3>
            <p class="bento__meta">${t(weja.periodKey)}</p>
            <ul class="about__bullets">
              ${t(weja.bulletsKey).slice(0, 3).map((bullet) => `<li>${bullet}</li>`).join('')}
            </ul>
          </article>

          <article class="bento bento--dev reveal" data-reveal-delay="120">
            <h3 class="bento__label">${t('engineering.devProjects.title')}</h3>
            <ul class="dev-projects">
              ${devProjects.map((project) => DevProjectCard(project, lang)).join('')}
            </ul>
          </article>
        </div>
      </div>
    </section>
  `;
}

export function initAbout() {
  initSkillsGroups();
}
