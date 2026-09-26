import { icon } from '../utils/icons.js';

export function CarouselNav(trackId, prevLabel, nextLabel) {
  return `
    <div class="carousel-nav">
      <button type="button" class="carousel-nav__btn" data-carousel-prev="${trackId}" aria-label="${prevLabel}">
        ${icon('arrowRight')}
      </button>
      <button type="button" class="carousel-nav__btn" data-carousel-next="${trackId}" aria-label="${nextLabel}">
        ${icon('arrowRight')}
      </button>
    </div>
  `;
}
