import { t } from '../i18n/index.js';
import { icon } from '../utils/icons.js';
import { BrowserFrame } from './BrowserFrame.js';
import avatarSrc from '../assets/images/hero/hero-800.webp';

export function botAvatar() {
  return `<img class="chat__msg-avatar" src="${avatarSrc}" alt="" aria-hidden="true" />`;
}

export function greetingBubble(text) {
  return `
    <div class="chat__msg chat__msg--bot">
      ${botAvatar()}
      <div class="chat__bubble">${text}</div>
    </div>
  `;
}

export function userBubble(text) {
  return `
    <div class="chat__msg chat__msg--user">
      <div class="chat__bubble chat__bubble--user">${text}</div>
    </div>
  `;
}

export function typingBubble() {
  return `
    <div class="chat__msg chat__msg--bot chat__msg--typing" id="chat-typing" aria-label="${t('work.chat.typing')}">
      ${botAvatar()}
      <div class="chat__bubble chat__typing-dots"><span></span><span></span><span></span></div>
    </div>
  `;
}

export function projectCardBubble(project, lang) {
  const metricBlock = project.metric
    ? `<div class="chat__bubble-metric"><span class="chat__bubble-metric-value">${project.metric.value}</span> ${project.metric.label[lang]}</div>`
    : `<div class="chat__bubble-metric chat__bubble-metric--highlight">${project.highlight[lang]}</div>`;

  return `
    <div class="chat__msg chat__msg--bot" data-project-msg="${project.id}">
      ${botAvatar()}
      <div class="chat__bubble chat__bubble--card">
        ${BrowserFrame({ domain: project.domain, imageFile: project.screenshots.desktop, alt: `${project.name} — ${project.category[lang]}` })}
        <p class="chat__bubble-category mono">${project.category[lang]}</p>
        <h3 class="chat__bubble-title">${project.name}</h3>
        ${metricBlock}
      </div>
    </div>
  `;
}

export function projectStoryBubble(project, lang) {
  const narrative = [project.challenge?.[lang], project.whatIBuilt[lang], project.result?.[lang]]
    .filter(Boolean)
    .join(' ');

  return `
    <div class="chat__msg chat__msg--bot">
      ${botAvatar()}
      <div class="chat__bubble">
        <p>${narrative}</p>
        <div class="chip-row chat__bubble-tags">
          ${project.tags[lang].map((tag) => `<span class="tag">${tag}</span>`).join('')}
        </div>
        <a class="btn btn--primary btn--sm chat__bubble-cta" href="${project.url}" target="_blank" rel="noopener">
          ${t('work.chat.viewSite')} ${icon('arrowUpRight')}
        </a>
      </div>
    </div>
  `;
}

export function closingBubble(text) {
  return `
    <div class="chat__msg chat__msg--bot">
      ${botAvatar()}
      <div class="chat__bubble">${text}</div>
    </div>
  `;
}
