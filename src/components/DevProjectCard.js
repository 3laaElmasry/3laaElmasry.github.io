import { t } from '../i18n/index.js';
import { icon } from '../utils/icons.js';

// A compact row, deliberately quieter than the Shopify project cards.
export function DevProjectCard(project, lang) {
  return `
    <li class="dev-project">
      <div class="dev-project__main">
        <h4 class="dev-project__name">${project.name}</h4>
        <p class="dev-project__desc">${project.description[lang]}</p>
      </div>
      <div class="dev-project__links">
        <a href="${project.github}" target="_blank" rel="noopener" aria-label="${project.name} ${t('engineering.devProjects.github')}">${icon('github')}</a>
        ${
          project.live
            ? `<a href="${project.live}" target="_blank" rel="noopener" aria-label="${project.name} ${t('engineering.devProjects.live')}">${icon('arrowUpRight')}</a>`
            : ''
        }
      </div>
    </li>
  `;
}
