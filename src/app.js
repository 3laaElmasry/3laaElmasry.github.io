import { Navbar, initNavbar } from './components/Navbar.js';
import { Hero, initHero } from './components/Hero.js';
import { StatsStrip, initStatsStrip } from './components/StatsStrip.js';
import { BrandsMarquee } from './components/BrandsMarquee.js';
import { Work, initWork } from './components/Work.js';
import { Services, initServices } from './components/Services.js';
import { Process } from './components/Process.js';
import { Engineering, initEngineering } from './components/Engineering.js';
import { About } from './components/About.js';
import { Contact } from './components/Contact.js';
import { Footer } from './components/Footer.js';
import { WhatsAppFab } from './components/WhatsAppFab.js';
import { ProjectModal, initProjectModal } from './components/ProjectModal.js';
import { initReveal } from './utils/reveal.js';
import { initCounters } from './utils/counter.js';

export function renderApp(lang) {
  const app = document.getElementById('app');
  app.innerHTML = `
    ${Navbar(lang)}
    <main id="main">
      ${Hero(lang)}
      ${StatsStrip(lang)}
      ${BrandsMarquee(lang)}
      ${Work(lang)}
      ${Services(lang)}
      ${Process(lang)}
      ${Engineering(lang)}
      ${About(lang)}
      ${Contact(lang)}
    </main>
    ${Footer(lang)}
    ${WhatsAppFab(lang)}
    ${ProjectModal(lang)}
  `;

  initNavbar(lang);
  initHero(lang);
  initStatsStrip();
  initWork(lang);
  initServices();
  initEngineering();
  initProjectModal(lang);
  initReveal();
  initCounters();
}
