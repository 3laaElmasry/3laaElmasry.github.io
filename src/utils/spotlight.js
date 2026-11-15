// Soft light that follows the pointer across a card. The card reads
// --mx / --my in CSS; touch devices never fire this, so they just get the plain card.
const SELECTOR = '.project-card, .featured-project, .service-card';

export function initSpotlight(root = document) {
  if (!window.matchMedia('(hover: hover)').matches) return;
  root.querySelectorAll(SELECTOR).forEach((card) => {
    card.addEventListener('pointermove', (event) => {
      const rect = card.getBoundingClientRect();
      card.style.setProperty('--mx', `${event.clientX - rect.left}px`);
      card.style.setProperty('--my', `${event.clientY - rect.top}px`);
    });
  });
}
