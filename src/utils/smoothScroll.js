// Every in-page jump (nav links, "See my work", the hero chips) glides to its
// target instead of snapping. Installed once; it works on re-rendered markup
// because the click listener sits on the document.
const DURATION_MS = 900;
const HEADER_OFFSET = 96; // clears the floating header
let frame;

const reducedMotion = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const ease = (t) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);

function glideTo(top) {
  cancelAnimationFrame(frame);
  const max = document.documentElement.scrollHeight - window.innerHeight;
  const end = Math.max(0, Math.min(top, max));
  if (reducedMotion()) return window.scrollTo(0, end);

  const start = window.scrollY;
  const startTime = performance.now();
  const step = (now) => {
    const progress = Math.min((now - startTime) / DURATION_MS, 1);
    window.scrollTo(0, start + (end - start) * ease(progress));
    if (progress < 1) frame = requestAnimationFrame(step);
  };
  frame = requestAnimationFrame(step);
}

export function scrollToElement(element, { center = false } = {}) {
  const rect = element.getBoundingClientRect();
  const top = center
    ? window.scrollY + rect.top - (window.innerHeight - rect.height) / 2
    : window.scrollY + rect.top - HEADER_OFFSET;
  glideTo(top);
}

export function initSmoothScroll() {
  document.addEventListener('click', (event) => {
    const link = event.target.closest('a[href^="#"]');
    if (!link) return;
    const id = link.getAttribute('href').slice(1);
    const target = id === 'top' || id === '' ? document.body : document.getElementById(id);
    if (!target) return;
    event.preventDefault();
    if (target === document.body) glideTo(0);
    else scrollToElement(target);
    history.replaceState(null, '', `#${id}`);
  });
  // the reader always wins: any manual scroll stops the glide
  ['wheel', 'touchstart', 'keydown'].forEach((type) =>
    window.addEventListener(type, () => cancelAnimationFrame(frame), { passive: true })
  );
}
