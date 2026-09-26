import { t } from '../i18n/index.js';
import { projects } from '../data/projects.js';
import { FeaturedProject } from './FeaturedProject.js';
import { ProjectCard } from './ProjectCard.js';
import { openProjectModal } from './ProjectModal.js';
import { qs } from '../utils/dom.js';

export function Work(lang) {
  const featured = projects.find((p) => p.featured);
  const rest = projects.filter((p) => !p.featured);

  return `
    <section id="work" class="work">
      <div class="container">
        <div class="section-head reveal">
          <span class="section-head__eyebrow mono">${t('work.eyebrow')}</span>
          <h2 class="section-head__title">${t('work.title')}</h2>
          <p class="section-head__subtitle">${t('work.subtitle')}</p>
        </div>
        ${featured ? FeaturedProject(featured, lang) : ''}
        <div class="work__grid">
          ${rest.map((project) => ProjectCard(project, lang)).join('')}
        </div>
      </div>
    </section>
  `;
}

export function initWork(lang) {
  const work = qs('#work');
  work?.addEventListener('click', (event) => {
    const trigger = event.target.closest('[data-open-story]');
    if (!trigger) return;
    const project = projects.find((p) => p.id === trigger.dataset.openStory);
    if (project) openProjectModal(project, lang);
  });
}
