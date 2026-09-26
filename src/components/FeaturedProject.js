import { t } from '../i18n/index.js';
import { icon } from '../utils/icons.js';
import { BrowserFrame } from './BrowserFrame.js';

export function FeaturedProject(project, lang) {
  const metricBlock = project.metric
    ? `<div class="featured-project__metric"><span class="featured-project__metric-value">${project.metric.value}</span> ${project.metric.label[lang]}</div>`
    : `<div class="featured-project__metric featured-project__metric--highlight">${project.highlight[lang]}</div>`;

  return `
    <article class="featured-project reveal" data-project-id="${project.id}">
      <div class="featured-project__media">
        <div class="featured-project__desktop">
          ${BrowserFrame({
            domain: project.domain,
            imageFile: project.screenshots.desktop,
            alt: `${project.name} — ${t('work.desktopLabel')}`,
          })}
        </div>
        <div class="featured-project__mobile">
          ${BrowserFrame({
            domain: project.domain,
            imageFile: project.screenshots.mobile,
            alt: `${project.name} — ${t('work.mobileLabel')}`,
            tall: true,
          })}
        </div>
      </div>
      <div class="featured-project__body">
        <p class="featured-project__category mono">${project.category[lang]}</p>
        <h3 class="featured-project__title">${project.name}</h3>
        ${metricBlock}
        <p class="featured-project__oneliner">${project.oneLiner[lang]}</p>
        <div class="chip-row featured-project__tags">
          ${project.tags[lang].map((tag) => `<span class="tag">${tag}</span>`).join('')}
        </div>
        <div class="featured-project__actions">
          <a class="btn btn--primary" href="${project.url}" target="_blank" rel="noopener">
            ${t('work.visitStore')} ${icon('arrowUpRight')}
          </a>
          <button type="button" class="btn btn--secondary" data-open-story="${project.id}">
            ${t('work.viewStory')} ${icon('arrowRight')}
          </button>
        </div>
      </div>
    </article>
  `;
}
