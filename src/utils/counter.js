const prefersReducedMotion = () =>
  window.matchMedia('(prefers-reduced-motion: reduce)').matches;

function animateValue(el, target, duration) {
  const suffix = el.dataset.suffix || '';
  const start = performance.now();

  function tick(now) {
    const progress = Math.min((now - start) / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    const current = Math.round(target * eased);
    el.textContent = `${current}${suffix}`;
    if (progress < 1) requestAnimationFrame(tick);
  }
  requestAnimationFrame(tick);
}

export function initCounters(root = document) {
  const els = root.querySelectorAll('[data-counter]');
  if (!els.length) return;

  if (prefersReducedMotion()) {
    els.forEach((el) => {
      el.textContent = `${el.dataset.counter}${el.dataset.suffix || ''}`;
    });
    return;
  }

  const obs = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const target = Number(entry.target.dataset.counter);
          animateValue(entry.target, target, 1400);
          obs.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.4 }
  );

  els.forEach((el) => obs.observe(el));
}
