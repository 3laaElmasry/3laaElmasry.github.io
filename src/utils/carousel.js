import { qs, qsa } from './dom.js';

export function initCarousel(trackId) {
  const track = document.getElementById(trackId);
  if (!track) return;
  const prevBtn = qs(`[data-carousel-prev="${trackId}"]`);
  const nextBtn = qs(`[data-carousel-next="${trackId}"]`);

  function step() {
    const item = track.firstElementChild;
    if (!item) return track.clientWidth;
    const style = getComputedStyle(track);
    const gap = parseFloat(style.columnGap || style.gap || '0');
    return item.getBoundingClientRect().width + gap;
  }

  const isRtl = document.documentElement.dir === 'rtl';
  const dir = isRtl ? -1 : 1;

  prevBtn?.addEventListener('click', () => track.scrollBy({ left: -dir * step(), behavior: 'smooth' }));
  nextBtn?.addEventListener('click', () => track.scrollBy({ left: dir * step(), behavior: 'smooth' }));

  qsa(':scope > *', track).forEach((item) => item.setAttribute('tabindex', '0'));
}
