import { qs, qsa } from './dom.js';

let cleanup;

// Scroll-driven header behavior: compact state, page progress bar, and
// highlighting the nav link of the section currently on screen.
export function initNavScroll(navbar) {
  cleanup?.(); // the app re-renders on language change; drop the old listeners

  const progress = qs('#scroll-progress');
  const links = qsa('.navbar__link[data-nav-target]');

  const onScroll = () => {
    navbar.classList.toggle('navbar--scrolled', window.scrollY > 24);
    if (progress) {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      progress.style.setProperty('--progress', max > 0 ? Math.min(window.scrollY / max, 1) : 0);
    }
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        links.forEach((link) =>
          link.classList.toggle('navbar__link--active', link.dataset.navTarget === entry.target.id)
        );
      });
    },
    { rootMargin: '-45% 0px -50% 0px' }
  );
  links.forEach((link) => {
    const section = document.getElementById(link.dataset.navTarget);
    if (section) observer.observe(section);
  });

  cleanup = () => {
    window.removeEventListener('scroll', onScroll);
    observer.disconnect();
  };
}
