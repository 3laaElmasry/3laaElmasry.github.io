import { t } from '../i18n/index.js';
import { icon } from '../utils/icons.js';
import { getWhatsAppUrl } from '../utils/whatsapp.js';
import { site } from '../data/site.js';
import { socials } from '../data/socials.js';

export function Contact(lang) {
  const telHref = `tel:${site.phone.replace(/\s+/g, '')}`;

  return `
    <section id="contact" class="contact">
      <div class="container">
        <div class="section-head reveal">
          <span class="section-head__eyebrow mono">${t('contact.eyebrow')}</span>
          <h2 class="contact__title">${t('contact.title')}</h2>
        </div>

        <div class="contact__cards reveal">
          <a class="contact-card" href="${getWhatsAppUrl(lang)}" target="_blank" rel="noopener">
            <span class="contact-card__icon contact-card__icon--whatsapp">${icon('whatsapp')}</span>
            <span class="contact-card__label mono">${t('contact.whatsapp')}</span>
            <span class="contact-card__value">${site.phone}</span>
          </a>
          <a class="contact-card" href="mailto:${site.email}">
            <span class="contact-card__icon">${icon('email')}</span>
            <span class="contact-card__label mono">${t('contact.email')}</span>
            <span class="contact-card__value">${site.email}</span>
          </a>
          <a class="contact-card" href="${telHref}">
            <span class="contact-card__icon">${icon('phone')}</span>
            <span class="contact-card__label mono">${t('contact.phone')}</span>
            <span class="contact-card__value">${site.phone}</span>
          </a>
        </div>

        <div class="contact__socials reveal">
          <h3 class="contact__socials-title mono">${t('contact.socialsTitle')}</h3>
          <div class="contact__socials-row">
            ${socials
              .map(
                (social) => `
                  <a class="contact__social-link" href="${social.url}" target="_blank" rel="noopener" aria-label="${social.label}">
                    ${icon(social.id)}
                  </a>
                `
              )
              .join('')}
          </div>
        </div>
      </div>
    </section>
  `;
}
