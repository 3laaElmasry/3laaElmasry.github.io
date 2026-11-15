import { t } from '../i18n/index.js';
import { icon, socialIcon } from '../utils/icons.js';
import { getWhatsAppUrl } from '../utils/whatsapp.js';
import { getSite, getSocials } from '../content/store.js';

export function Contact(lang) {
  const site = getSite();
  const telHref = `tel:${site.phone.replace(/\s+/g, '')}`;

  return `
    <section id="contact" class="contact">
      <div class="container">
        <div class="contact__panel reveal">
          <h2 class="contact__title">${t('contact.title')}</h2>
          <div class="contact__actions">
            <a class="btn btn--whatsapp contact__cta" href="${getWhatsAppUrl(lang)}" target="_blank" rel="noopener">
              ${icon('whatsapp')}<span>${t('hero.ctaPrimary')}</span>
            </a>
            <a class="contact__link" href="mailto:${site.email}">${icon('email')}<span>${site.email}</span></a>
            <a class="contact__link" href="${telHref}">${icon('phone')}<span dir="ltr">${site.phone}</span></a>
          </div>
          <div class="contact__socials" aria-label="${t('contact.socialsTitle')}">
            ${getSocials()
              .map(
                (social) => `
              <a class="contact__social-link" href="${social.url}" target="_blank" rel="noopener" aria-label="${social.label}">
                ${socialIcon(social.icon)}
              </a>`
              )
              .join('')}
          </div>
        </div>
      </div>
    </section>
  `;
}
