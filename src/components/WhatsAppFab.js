import { t } from '../i18n/index.js';
import { getWhatsAppUrl } from '../utils/whatsapp.js';
import { icon } from '../utils/icons.js';

export function WhatsAppFab(lang) {
  return `
    <a
      class="whatsapp-fab"
      href="${getWhatsAppUrl(lang)}"
      target="_blank"
      rel="noopener"
      aria-label="${t('whatsappFab.label')}"
    >
      ${icon('whatsapp')}
    </a>
  `;
}
