import { t } from '../i18n/index.js';
import { icon } from '../utils/icons.js';
import { qs, qsa } from '../utils/dom.js';
import { getProjectImage } from '../utils/images.js';

let lastFocused = null;

export function ProjectModal() {
  return `
    <div class="modal-overlay" id="project-modal" hidden>
      <div class="modal" role="dialog" aria-modal="true" aria-labelledby="modal-title">
        <button type="button" class="modal__close" id="modal-close" aria-label="${t('modal.close')}">
          ${icon('close')}
        </button>
        <div class="modal__content" id="modal-content"></div>
      </div>
    </div>
  `;
}

function renderModalContent(project, lang) {
  const desktopSrc = getProjectImage(project.screenshots.desktop);
  const mobileSrc = getProjectImage(project.screenshots.mobile);
  const secondaryDesktop = project.screenshots.desktopSecondary
    ? getProjectImage(project.screenshots.desktopSecondary)
    : null;
  const secondaryMobile = project.screenshots.mobileSecondary
    ? getProjectImage(project.screenshots.mobileSecondary)
    : null;

  return `
    <p class="modal__category mono">${project.category[lang]}</p>
    <h2 class="modal__title" id="modal-title">${project.name}</h2>
    <div class="modal__media">
      ${desktopSrc ? `<img src="${desktopSrc}" alt="${project.name} desktop" class="modal__img modal__img--desktop" loading="lazy" />` : ''}
      ${mobileSrc ? `<img src="${mobileSrc}" alt="${project.name} mobile" class="modal__img modal__img--mobile" loading="lazy" />` : ''}
      ${secondaryDesktop ? `<img src="${secondaryDesktop}" alt="${project.name} product page" class="modal__img modal__img--desktop" loading="lazy" />` : ''}
      ${secondaryMobile ? `<img src="${secondaryMobile}" alt="${project.name} product page mobile" class="modal__img modal__img--mobile" loading="lazy" />` : ''}
    </div>
    ${
      project.challenge
        ? `<section class="modal__section"><h3>${t('modal.challenge')}</h3><p>${project.challenge[lang]}</p></section>`
        : ''
    }
    <section class="modal__section"><h3>${t('modal.whatIBuilt')}</h3><p>${project.whatIBuilt[lang]}</p></section>
    ${
      project.result
        ? `<section class="modal__section"><h3>${t('modal.result')}</h3><p>${project.result[lang]}</p></section>`
        : ''
    }
    <div class="chip-row modal__tags">
      ${project.tags[lang].map((tag) => `<span class="tag">${tag}</span>`).join('')}
    </div>
    <a class="btn btn--primary modal__cta" href="${project.url}" target="_blank" rel="noopener">
      ${t('modal.visitStore')} ${icon('arrowUpRight')}
    </a>
  `;
}

function getFocusable(container) {
  return qsa(
    'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])',
    container
  );
}

function trapFocus(event) {
  const overlay = qs('#project-modal');
  if (!overlay || overlay.hidden) return;
  if (event.key !== 'Tab') return;
  const focusable = getFocusable(overlay);
  if (!focusable.length) return;
  const first = focusable[0];
  const last = focusable[focusable.length - 1];
  if (event.shiftKey && document.activeElement === first) {
    event.preventDefault();
    last.focus();
  } else if (!event.shiftKey && document.activeElement === last) {
    event.preventDefault();
    first.focus();
  }
}

export function closeProjectModal() {
  const overlay = qs('#project-modal');
  if (!overlay) return;
  overlay.hidden = true;
  document.body.style.overflow = '';
  lastFocused?.focus();
}

export function openProjectModal(project, lang) {
  const overlay = qs('#project-modal');
  const content = qs('#modal-content');
  if (!overlay || !content) return;
  lastFocused = document.activeElement;
  content.innerHTML = renderModalContent(project, lang);
  overlay.hidden = false;
  document.body.style.overflow = 'hidden';
  qs('#modal-close')?.focus();
}

export function initProjectModal() {
  const overlay = qs('#project-modal');
  const closeBtn = qs('#modal-close');

  closeBtn?.addEventListener('click', closeProjectModal);
  overlay?.addEventListener('click', (event) => {
    if (event.target === overlay) closeProjectModal();
  });
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && overlay && !overlay.hidden) closeProjectModal();
    trapFocus(event);
  });
}
