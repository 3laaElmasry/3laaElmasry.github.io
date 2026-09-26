import { t } from '../i18n/index.js';
import { proofStats } from '../data/experience.js';
import { devProjects } from '../data/devProjects.js';
import { ExperienceCard } from './ExperienceCard.js';
import { SkillsGroups } from './SkillsGroups.js';
import { DevProjectCard } from './DevProjectCard.js';
import { CarouselNav } from './CarouselNav.js';
import { initCarousel } from '../utils/carousel.js';

function proofRow() {
  return `
    <div class="carousel-head engineering__proof-head reveal">
      <span class="visually-hidden">${t('engineering.eyebrow')}</span>
      ${CarouselNav('proof-track', t('engineering.proof.prev'), t('engineering.proof.next'))}
    </div>
    <div class="carousel-track engineering__proof" id="proof-track" tabindex="0" role="region" aria-label="${t('engineering.eyebrow')}">
      ${proofStats
        .map(
          (stat) => `
            <div class="engineering__proof-item">
              <span class="engineering__proof-value">${stat.value}</span>
              <span class="engineering__proof-label">${t(stat.labelKey)}</span>
              ${stat.subKey ? `<span class="engineering__proof-sub mono">${t(stat.subKey)}</span>` : ''}
            </div>
          `
        )
        .join('')}
    </div>
  `;
}

export function Engineering(lang) {
  return `
    <section id="engineering" class="engineering">
      <div class="container">
        <div class="section-head reveal">
          <span class="section-head__eyebrow mono">${t('engineering.eyebrow')}</span>
          <h2 class="section-head__title">${t('engineering.title')}</h2>
          <p class="section-head__subtitle">${t('engineering.subtitle')}</p>
        </div>

        ${proofRow()}
        ${ExperienceCard()}

        <div class="engineering__skills">
          <div class="carousel-head reveal">
            <h3 class="engineering__subhead">${t('engineering.skills.title')}</h3>
            ${CarouselNav('skills-track', t('engineering.skills.prev'), t('engineering.skills.next'))}
          </div>
          <div class="carousel-track skills-groups" id="skills-track" tabindex="0" role="region" aria-label="${t('engineering.skills.title')}">
            ${SkillsGroups()}
          </div>
        </div>

        <div class="engineering__devprojects">
          <div class="carousel-head reveal">
            <div class="engineering__devhead">
              <h3 class="engineering__subhead">${t('engineering.devProjects.title')}</h3>
              <p class="engineering__devsubtitle">${t('engineering.devProjects.subtitle')}</p>
            </div>
            ${CarouselNav('dev-projects-track', t('engineering.devProjects.prev'), t('engineering.devProjects.next'))}
          </div>
          <div class="carousel-track dev-project-grid" id="dev-projects-track" tabindex="0" role="region" aria-label="${t('engineering.devProjects.title')}">
            ${devProjects.map((project) => DevProjectCard(project, lang)).join('')}
          </div>
        </div>
      </div>
    </section>
  `;
}

export function initEngineering() {
  initCarousel('proof-track');
  initCarousel('skills-track');
  initCarousel('dev-projects-track');
}
