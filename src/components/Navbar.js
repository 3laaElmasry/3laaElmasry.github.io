import { t, getLang, setLang } from '../i18n/index.js';
import { getWhatsAppUrl } from '../utils/whatsapp.js';
import { icon, socialIcon } from '../utils/icons.js';
import { qs, qsa } from '../utils/dom.js';
import { getSite, getSocials } from '../content/store.js';
import { initNavScroll } from '../utils/navScroll.js';

// must match the .mobile-menu transition in navbar.css
const MENU_CLOSE_MS = 320;

const NAV_LINKS = [
  { href: '#work', key: 'nav.work', icon: 'work' },
  { href: '#services', key: 'nav.services', icon: 'services' },
  { href: '#about', key: 'nav.about', icon: 'about' },
  { href: '#contact', key: 'nav.contact', icon: 'email' },
];

// The mobile sheet shows each destination as a full-width row: icon, label, chevron.
function menuRowsHtml() {
  return NAV_LINKS.map(
    (link, index) => `
      <a href="${link.href}" class="mobile-menu__link" style="--i:${index}">
        <span class="mobile-menu__icon" aria-hidden="true">${icon(link.icon)}</span>
        <span class="mobile-menu__label">${t(link.key)}</span>
        <span class="mobile-menu__chevron" aria-hidden="true">${icon('chevronRight')}</span>
      </a>`
  ).join('');
}

function navLinksHtml(idPrefix) {
  return NAV_LINKS.map(
    (link, index) =>
      `<a href="${link.href}" class="${idPrefix}__link" data-nav-target="${link.href.slice(1)}" style="--i:${index}">${t(link.key)}</a>`
  ).join('');
}

export function Navbar(lang) {
  const otherLangLabel = t('nav.langToggle');
  return `
    <div class="scroll-progress" id="scroll-progress" aria-hidden="true"></div>
    <header class="navbar" id="navbar">
      <div class="container navbar__inner">
        <a href="#top" class="navbar__logo">${getSite().logoText}</a>
        <nav class="navbar__links" aria-label="Primary">
          ${navLinksHtml('navbar')}
        </nav>
        <div class="navbar__actions">
          <button type="button" class="lang-toggle" id="lang-toggle" aria-label="${
            lang === 'ar' ? 'Switch to English' : 'التبديل للعربية'
          }">${otherLangLabel}</button>
          <a class="btn btn--whatsapp btn--sm navbar__whatsapp" href="${getWhatsAppUrl(lang)}" target="_blank" rel="noopener">
            ${icon('whatsapp')}<span>${t('nav.whatsapp')}</span>
          </a>
          <button type="button" class="navbar__burger" id="navbar-burger" aria-label="${t('nav.menuOpen')}" aria-expanded="false" aria-controls="mobile-menu">
            ${icon('menu')}
          </button>
        </div>
      </div>
    </header>
    <div class="mobile-menu" id="mobile-menu" role="dialog" aria-modal="true" aria-label="${t('nav.menuOpen')}" hidden>
      <div class="mobile-menu__inner">
        <button type="button" class="mobile-menu__close" id="mobile-menu-close" aria-label="${t('nav.menuClose')}">
          ${icon('close')}
        </button>
        <span class="mobile-menu__logo">${getSite().logoText}</span>
        <nav class="mobile-menu__links" aria-label="Mobile">
          ${menuRowsHtml()}
        </nav>
        <div class="mobile-menu__foot">
          <a class="btn btn--whatsapp mobile-menu__whatsapp" href="${getWhatsAppUrl(lang)}" target="_blank" rel="noopener">
            ${icon('whatsapp')}<span>${t('hero.ctaPrimary')}</span>
          </a>
          <div class="mobile-menu__socials">
            ${getSocials()
              .map(
                (social) =>
                  `<a href="${social.url}" target="_blank" rel="noopener" aria-label="${social.label}">${socialIcon(social.icon)}</a>`
              )
              .join('')}
          </div>
        </div>
      </div>
    </div>
  `;
}

export function initNavbar() {
  const navbar = qs('#navbar');
  const burger = qs('#navbar-burger');
  const menu = qs('#mobile-menu');
  const closeBtn = qs('#mobile-menu-close');
  const langToggle = qs('#lang-toggle');

  initNavScroll(navbar);

  function getFocusable() {
    return qsa('a[href], button:not([disabled])', menu);
  }

  function trapFocus(event) {
    if (event.key !== 'Tab' || menu.hidden) return;
    const focusable = getFocusable();
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

  let closeTimer;

  function openMenu() {
    clearTimeout(closeTimer);
    menu.hidden = false;
    // next frame, so the browser sees the closed state first and animates from it
    requestAnimationFrame(() => menu.classList.add('is-open'));
    burger.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden';
    qs('.mobile-menu__close', menu)?.focus();
  }

  function closeMenu() {
    menu.classList.remove('is-open');
    closeTimer = setTimeout(() => {
      menu.hidden = true;
    }, MENU_CLOSE_MS);
    burger.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
    burger.focus();
  }

  burger?.addEventListener('click', openMenu);
  closeBtn?.addEventListener('click', closeMenu);
  qsa('.mobile-menu__link', menu).forEach((link) => link.addEventListener('click', closeMenu));

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && menu && !menu.hidden) closeMenu();
    trapFocus(event);
  });

  langToggle?.addEventListener('click', () => {
    setLang(getLang() === 'ar' ? 'en' : 'ar');
  });
}
