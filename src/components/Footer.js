import { t } from '../i18n/index.js';
import { icon } from '../utils/icons.js';
import { site } from '../data/site.js';
import { socials } from '../data/socials.js';

export function Footer(lang) {
  const year = new Date().getFullYear();

  return `
    <footer class="footer">
      <div class="container footer__inner">
        <p class="footer__copy">© ${year} ${site.name[lang]}. ${t('footer.rights')}</p>
        <div class="footer__socials">
          ${socials
            .map(
              (social) => `
            <a class="footer__social" href="${social.url}" target="_blank" rel="noopener" aria-label="${social.label}">
              ${icon(social.id)}
            </a>
          `
            )
            .join('')}
        </div>
        <p class="footer__builtby mono">${t('footer.builtBy')}</p>
      </div>
    </footer>
  `;
}
