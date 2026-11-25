document.addEventListener('DOMContentLoaded', () => {
  const cards = [...document.querySelectorAll('.info-card, .service-card, .program-card')];
  const groupIndexes = new Map();

  cards.forEach(card => {
    const group = card.closest('.row') || document.body;
    const index = groupIndexes.get(group) || 0;
    groupIndexes.set(group, index + 1);
    card.classList.add('reveal-card');
    card.style.setProperty('--reveal-delay', `${index * 100}ms`);
  });

  if (!('IntersectionObserver' in window) || window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    cards.forEach(card => card.classList.add('is-visible'));
    return;
  }

  const observer = new IntersectionObserver((entries, currentObserver) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('is-visible');
      currentObserver.unobserve(entry.target);
    });
  }, { threshold: 0.16, rootMargin: '0px 0px -36px 0px' });

  cards.forEach(card => observer.observe(card));
});
