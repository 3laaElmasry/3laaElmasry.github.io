import { site } from '../data/site.js';

export function getWhatsAppUrl(lang) {
  const message = site.whatsappMessage[lang] || site.whatsappMessage.en;
  return `https://wa.me/${site.whatsappNumber}?text=${encodeURIComponent(message)}`;
}
