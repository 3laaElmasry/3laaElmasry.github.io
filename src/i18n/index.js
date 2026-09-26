import { en } from './en.js';
import { ar } from './ar.js';

const STORAGE_KEY = 'alaa-portfolio-lang';
const dictionaries = { en, ar };

function detectLang() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved === 'en' || saved === 'ar') return saved;
  } catch {
    /* localStorage unavailable */
  }
  const nav = typeof navigator !== 'undefined' ? navigator.language : 'en';
  return nav && nav.toLowerCase().startsWith('ar') ? 'ar' : 'en';
}

let currentLang = detectLang();
const listeners = new Set();

export function getLang() {
  return currentLang;
}

export function setLang(lang) {
  if (lang !== 'en' && lang !== 'ar') return;
  currentLang = lang;
  try {
    localStorage.setItem(STORAGE_KEY, lang);
  } catch {
    /* localStorage unavailable */
  }
  document.documentElement.lang = lang;
  document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
  listeners.forEach((fn) => fn(lang));
}

export function onLangChange(fn) {
  listeners.add(fn);
  return () => listeners.delete(fn);
}

export function t(key) {
  const dict = dictionaries[currentLang] || en;
  const value = key.split('.').reduce((acc, part) => (acc ? acc[part] : undefined), dict);
  if (value === undefined) {
    const fallback = key.split('.').reduce((acc, part) => (acc ? acc[part] : undefined), en);
    return fallback !== undefined ? fallback : key;
  }
  return value;
}
