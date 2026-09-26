import { t } from '../i18n/index.js';
import { skillGroups } from '../data/skills.js';

export function SkillsGroups() {
  return `
    <div class="skills-groups reveal">
      ${skillGroups
        .map(
          (group) => `
            <div class="skills-groups__group">
              <h4 class="skills-groups__label mono">${t(group.groupKey)}</h4>
              <div class="chip-row">
                ${group.items.map((item) => `<span class="chip">${item}</span>`).join('')}
              </div>
            </div>
          `
        )
        .join('')}
    </div>
  `;
}
