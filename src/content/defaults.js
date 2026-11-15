import { projects } from '../data/projects.js';
import { skillGroups } from '../data/skills.js';
import { socials } from '../data/socials.js';
import { site } from '../data/site.js';
import { en } from '../i18n/en.js';
import { ar } from '../i18n/ar.js';

// The content that ships inside the bundle. It is what the site shows before
// the database answers, and what it keeps showing if the database is unreachable.
export function defaultContent() {
  return {
    projects,
    skillGroups: skillGroups.map((group) => ({
      id: group.id,
      label: {
        en: en.engineering.skills.groups[group.id],
        ar: ar.engineering.skills.groups[group.id],
      },
      items: group.items,
    })),
    socials: socials.map((social) => ({ ...social, icon: social.id, visible: true })),
    contact: {
      phone: site.phone,
      whatsappNumber: site.whatsappNumber,
      email: site.email,
      whatsappMessage: site.whatsappMessage,
    },
  };
}
