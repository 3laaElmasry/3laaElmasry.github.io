import { t } from '../i18n/index.js';
import { socialIcon } from '../utils/icons.js';
import { getSite, getSocials } from '../content/store.js';

export function Footer(lang) {
  const year = new Date().getFullYear();
  const site = getSite();

  return `
    <footer class="footer">
      <div class="container footer__inner">
        <p class="footer__copy">© ${year} ${site.name[lang]}. ${t('footer.rights')}</p>
        <div class="footer__socials">
          ${getSocials()
            .map(
              (social) => `
            <a class="footer__social" href="${social.url}" target="_blank" rel="noopener" aria-label="${social.label}">
              ${socialIcon(social.icon)}
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
