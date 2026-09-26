import { t } from '../i18n/index.js';
import { icon } from '../utils/icons.js';
import { BrowserFrame } from './BrowserFrame.js';

export function ProjectCard(project, lang) {
  const metricBlock = project.metric
    ? `<div class="project-card__metric"><span class="project-card__metric-value">${project.metric.value}</span> ${project.metric.label[lang]}</div>`
    : `<div class="project-card__metric project-card__metric--highlight">${project.highlight[lang]}</div>`;

  return `
    <article class="project-card reveal" data-project-id="${project.id}">
      ${BrowserFrame({
        domain: project.domain,
        imageFile: project.screenshots.desktop,
        alt: `${project.name} — ${project.category[lang]}`,
      })}
      <div class="project-card__body">
        <p class="project-card__category mono">${project.category[lang]}</p>
        <h3 class="project-card__title">${project.name}</h3>
        ${metricBlock}
        <p class="project-card__oneliner">${project.oneLiner[lang]}</p>
        <div class="chip-row project-card__tags">
          ${project.tags[lang].map((tag) => `<span class="tag">${tag}</span>`).join('')}
        </div>
        <div class="project-card__actions">
          <a class="project-card__link" href="${project.url}" target="_blank" rel="noopener">
            ${t('work.visitStore')} ${icon('arrowUpRight')}
          </a>
          <button type="button" class="project-card__link project-card__link--story" data-open-story="${project.id}">
            ${t('work.viewStory')} ${icon('arrowRight')}
          </button>
        </div>
      </div>
    </article>
  `;
}
