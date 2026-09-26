import { t, getLang } from '../i18n/index.js';
import { getWhatsAppUrl } from '../utils/whatsapp.js';
import { icon } from '../utils/icons.js';
import { projects } from '../data/projects.js';
import { qs } from '../utils/dom.js';
import avatarSrc from '../assets/images/hero/hero-800.webp';
import {
  greetingBubble,
  userBubble,
  typingBubble,
  projectCardBubble,
  projectStoryBubble,
  closingBubble,
} from './ChatMessage.js';

let nextIndex = 0;
let closed = false;

export function Work(lang) {
  return `
    <section id="work" class="work">
      <div class="container">
        <div class="section-head reveal">
          <span class="section-head__eyebrow mono">${t('work.eyebrow')}</span>
          <h2 class="section-head__title">${t('work.title')}</h2>
          <p class="section-head__subtitle">${t('work.subtitle')}</p>
        </div>
        <div class="chat reveal">
          <div class="chat__header">
            <img class="chat__avatar" src="${avatarSrc}" alt="" />
            <div class="chat__header-info">
              <span class="chat__header-name">Alaa</span>
              <span class="chat__header-status">
                <span class="chat__status-dot" aria-hidden="true"></span>
                ${t('work.chat.online')}
              </span>
            </div>
          </div>
          <div class="chat__log" id="chat-log" role="log" aria-live="polite"></div>
          <div class="chat__actions">
            <button type="button" class="btn btn--secondary chat__next" id="chat-next">
              ${t('work.chat.next')} ${icon('arrowRight')}
            </button>
            <a class="btn btn--whatsapp chat__contact" href="${getWhatsAppUrl(lang)}" target="_blank" rel="noopener">
              ${icon('whatsapp')} ${t('work.chat.contact')}
            </a>
          </div>
        </div>
      </div>
    </section>
  `;
}

function reducedMotion() {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

function scrollLogToBottom(log) {
  log.scrollTop = log.scrollHeight;
}

function appendBot(log, html) {
  log.insertAdjacentHTML('beforeend', html);
  scrollLogToBottom(log);
}

function showProject(log, lang, index) {
  const project = projects[index];
  appendBot(log, projectCardBubble(project, lang));
  appendBot(log, projectStoryBubble(project, lang));
}

function advance({ withUserBubble = true, immediate = false } = {}) {
  const log = qs('#chat-log');
  const nextBtn = qs('#chat-next');
  if (!log || closed) return;
  const lang = getLang();

  if (nextIndex >= projects.length) {
    appendBot(log, closingBubble(t('work.chat.closing')));
    closed = true;
    nextBtn?.setAttribute('hidden', '');
    return;
  }

  const run = () => {
    const msgTyping = qs('#chat-typing');
    msgTyping?.remove();
    showProject(log, lang, nextIndex);
    nextIndex += 1;
  };

  if (withUserBubble) appendBot(log, userBubble(t('work.chat.userNext')));

  if (immediate || reducedMotion()) {
    run();
  } else {
    appendBot(log, typingBubble());
    setTimeout(run, 700);
  }
}

export function initWork(lang) {
  const log = qs('#chat-log');
  const nextBtn = qs('#chat-next');
  if (!log) return;

  nextIndex = 0;
  closed = false;
  nextBtn?.removeAttribute('hidden');
  log.innerHTML = '';
  appendBot(log, greetingBubble(t('work.chat.greeting')));
  advance({ withUserBubble: false, immediate: true });

  nextBtn?.addEventListener('click', () => advance());
}

export function revealProjectInChat(id) {
  const log = qs('#chat-log');
  if (!log) return;
  const target = () => log.querySelector(`[data-project-msg="${id}"]`);
  let guard = 0;
  while (!target() && nextIndex < projects.length && guard < projects.length + 1) {
    advance({ withUserBubble: false, immediate: true });
    guard += 1;
  }
  const el = target();
  if (!el) return;
  qs('#work')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  setTimeout(() => el.scrollIntoView({ behavior: 'smooth', block: 'center' }), 350);
  el.querySelector('.chat__bubble')?.classList.add('chat__bubble--highlight');
  setTimeout(() => el.querySelector('.chat__bubble')?.classList.remove('chat__bubble--highlight'), 1800);
}
