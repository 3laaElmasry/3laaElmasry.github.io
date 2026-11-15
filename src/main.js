import './styles/main.css';
import { getLang, onLangChange } from './i18n/index.js';
import { renderApp } from './app.js';
import { refreshContent } from './content/store.js';
import { initSmoothScroll } from './utils/smoothScroll.js';

document.documentElement.lang = getLang();
document.documentElement.dir = getLang() === 'ar' ? 'rtl' : 'ltr';

renderApp(getLang());

onLangChange((lang) => {
  renderApp(lang);
});

initSmoothScroll();

// Content edited in the admin dashboard arrives after first paint.
refreshContent().then((changed) => {
  if (changed) renderApp(getLang());
});
