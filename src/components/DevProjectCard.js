import { t } from '../i18n/index.js';
import { icon } from '../utils/icons.js';

export function DevProjectCard(project, lang) {
  const liveLink = project.live
    ? `<a class="dev-project-card__link" href="${project.live}" target="_blank" rel="noopener">
        ${icon('arrowUpRight')} ${t('engineering.devProjects.live')}
      </a>`
    : '';

  return `
    <article class="dev-project-card reveal">
      <div class="dev-project-card__head mono">
        <span class="dev-project-card__dots" aria-hidden="true">
          <span></span><span></span><span></span>
        </span>
        <span class="dev-project-card__tag">&lt;/&gt;</span>
      </div>
      <h3 class="dev-project-card__name mono">${project.name}</h3>
      <p class="dev-project-card__desc">${project.description[lang]}</p>
      <div class="chip-row dev-project-card__stack">
        ${project.stack.map((item) => `<span class="tag">${item}</span>`).join('')}
      </div>
      <div class="dev-project-card__links">
        <a class="dev-project-card__link" href="${project.github}" target="_blank" rel="noopener">
          ${icon('github')} ${t('engineering.devProjects.github')}
        </a>
        ${liveLink}
      </div>
    </article>
  `;
}
