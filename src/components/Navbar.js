import { t, getLang, setLang } from '../i18n/index.js';
import { getWhatsAppUrl } from '../utils/whatsapp.js';
import { icon } from '../utils/icons.js';
import { qs, qsa } from '../utils/dom.js';
import { site } from '../data/site.js';

const NAV_LINKS = [
  { href: '#work', key: 'nav.work' },
  { href: '#services', key: 'nav.services' },
  { href: '#engineering', key: 'nav.engineering' },
  { href: '#about', key: 'nav.about' },
  { href: '#contact', key: 'nav.contact' },
];

function navLinksHtml(idPrefix) {
  return NAV_LINKS.map(
    (link) => `<a href="${link.href}" class="${idPrefix}__link">${t(link.key)}</a>`
  ).join('');
}

export function Navbar(lang) {
  const otherLangLabel = t('nav.langToggle');
  return `
    <header class="navbar" id="navbar">
      <div class="container navbar__inner">
        <a href="#top" class="navbar__logo">${site.logoText}</a>
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
      <div class="mobile-menu" id="mobile-menu" role="dialog" aria-modal="true" aria-label="${t('nav.menuOpen')}" hidden>
        <div class="mobile-menu__inner">
          <button type="button" class="mobile-menu__close" id="mobile-menu-close" aria-label="${t('nav.menuClose')}">
            ${icon('close')}
          </button>
          <nav class="mobile-menu__links" aria-label="Mobile">
            ${navLinksHtml('mobile-menu')}
          </nav>
          <a class="btn btn--whatsapp mobile-menu__whatsapp" href="${getWhatsAppUrl(lang)}" target="_blank" rel="noopener">
            ${icon('whatsapp')}<span>${t('nav.whatsapp')}</span>
          </a>
        </div>
      </div>
    </header>
  `;
}

export function initNavbar() {
  const navbar = qs('#navbar');
  const burger = qs('#navbar-burger');
  const menu = qs('#mobile-menu');
  const closeBtn = qs('#mobile-menu-close');
  const langToggle = qs('#lang-toggle');

  const onScroll = () => {
    navbar.classList.toggle('navbar--scrolled', window.scrollY > 10);
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  function openMenu() {
    menu.hidden = false;
    burger.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden';
    qs('.mobile-menu__close', menu)?.focus();
  }

  function closeMenu() {
    menu.hidden = true;
    burger.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
    burger.focus();
  }

  burger?.addEventListener('click', openMenu);
  closeBtn?.addEventListener('click', closeMenu);
  qsa('.mobile-menu__link', menu).forEach((link) => link.addEventListener('click', closeMenu));

  menu?.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') closeMenu();
  });

  langToggle?.addEventListener('click', () => {
    setLang(getLang() === 'ar' ? 'en' : 'ar');
  });
}
