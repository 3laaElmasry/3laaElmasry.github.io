import './styles/main.css';
import { getLang, onLangChange } from './i18n/index.js';
import { renderApp } from './app.js';

document.documentElement.lang = getLang();
document.documentElement.dir = getLang() === 'ar' ? 'rtl' : 'ltr';

renderApp(getLang());

onLangChange((lang) => {
  renderApp(lang);
});
