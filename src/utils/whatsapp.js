import { getSite } from '../content/store.js';

export function getWhatsAppUrl(lang) {
  const site = getSite();
  const message = site.whatsappMessage[lang] || site.whatsappMessage.en;
  return `https://wa.me/${site.whatsappNumber}?text=${encodeURIComponent(message)}`;
}
