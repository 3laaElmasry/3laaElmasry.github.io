import { getLang } from '../i18n/index.js';
import { getSkillGroups } from '../content/store.js';

export function SkillsGroups() {
  const lang = getLang();
  return getSkillGroups()
    .map(
      (group) => `
        <div class="skills-groups__group">
          <h4 class="skills-groups__label mono">${group.label[lang] || group.label.en}</h4>
          <div class="chip-row">
            ${group.items.map((item) => `<span class="chip">${item}</span>`).join('')}
          </div>
        </div>
      `
    )
    .join('');
}
