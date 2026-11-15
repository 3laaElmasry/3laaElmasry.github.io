import { getLang, t } from '../i18n/index.js';
import { getSkillGroups } from '../content/store.js';
import { qsa } from '../utils/dom.js';

// Skills as tabs: one row of group names, one panel of chips. Showing a single
// group at a time keeps the block one screen tall however many groups exist.
export function SkillsGroups() {
  const lang = getLang();
  const groups = getSkillGroups();
  return `
    <div class="skills">
      <div class="skills__tabs" role="tablist" aria-label="${t('engineering.skills.title')}">
        ${groups
          .map(
            (group, index) => `
          <button type="button" role="tab" class="skills__tab" id="skill-tab-${index}"
            aria-selected="${index === 0}" aria-controls="skill-panel-${index}" tabindex="${index === 0 ? 0 : -1}">
            ${group.label[lang] || group.label.en}
          </button>`
          )
          .join('')}
      </div>
      ${groups
        .map(
          (group, index) => `
        <div class="skills__panel chip-row" role="tabpanel" id="skill-panel-${index}" aria-labelledby="skill-tab-${index}" ${index === 0 ? '' : 'hidden'}>
          ${group.items.map((item) => `<span class="chip">${item}</span>`).join('')}
        </div>`
        )
        .join('')}
    </div>
  `;
}

export function initSkillsGroups() {
  const tabs = qsa('.skills__tab');
  const select = (tab) => {
    tabs.forEach((other) => {
      const active = other === tab;
      other.setAttribute('aria-selected', String(active));
      other.tabIndex = active ? 0 : -1;
      document.getElementById(other.getAttribute('aria-controls')).hidden = !active;
    });
  };
  tabs.forEach((tab, index) => {
    tab.addEventListener('click', () => select(tab));
    tab.addEventListener('keydown', (event) => {
      if (event.key !== 'ArrowRight' && event.key !== 'ArrowLeft') return;
      const forward = (event.key === 'ArrowRight') !== (document.documentElement.dir === 'rtl');
      const next = tabs[(index + (forward ? 1 : -1) + tabs.length) % tabs.length];
      select(next);
      next.focus();
    });
  });
}
