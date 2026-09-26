import { t } from '../i18n/index.js';
import { proofStats } from '../data/experience.js';
import { devProjects } from '../data/devProjects.js';
import { ExperienceCard } from './ExperienceCard.js';
import { SkillsGroups } from './SkillsGroups.js';
import { DevProjectCard } from './DevProjectCard.js';

function proofRow() {
  return `
    <div class="engineering__proof reveal">
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
          <h3 class="engineering__subhead reveal">${t('engineering.skills.title')}</h3>
          ${SkillsGroups()}
        </div>

        <div class="engineering__devprojects">
          <div class="engineering__devhead reveal">
            <h3 class="engineering__subhead">${t('engineering.devProjects.title')}</h3>
            <p class="engineering__devsubtitle">${t('engineering.devProjects.subtitle')}</p>
          </div>
          <div class="dev-project-grid">
            ${devProjects.map((project) => DevProjectCard(project, lang)).join('')}
          </div>
        </div>
      </div>
    </section>
  `;
}
