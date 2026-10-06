(() => {
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reduce) return;

  const reveal = [...document.querySelectorAll('.principle-grid article,.feature-row,.logo-strip > div,.update-card,.quote')];
  reveal.forEach((el, i) => { el.classList.add('motion-reveal'); el.style.setProperty('--motion-delay', `${Math.min(i * 55, 280)}ms`); });

  const io = new IntersectionObserver(entries => entries.forEach(entry => {
    if (entry.isIntersecting) { entry.target.classList.add('is-visible'); io.unobserve(entry.target); }
  }), { threshold: .12, rootMargin: '0px 0px -45px' });
  reveal.forEach(el => io.observe(el));

  const frame = document.querySelector('.hero-frame');
  if (frame) {
    frame.addEventListener('pointermove', e => {
      if (innerWidth < 900) return;
      const r = frame.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width - .5;
      const y = (e.clientY - r.top) / r.height - .5;
      frame.style.setProperty('--mx', `${x * 5}deg`);
      frame.style.setProperty('--my', `${y * -4}deg`);
    });
    frame.addEventListener('pointerleave', () => { frame.style.setProperty('--mx', '0deg'); frame.style.setProperty('--my', '0deg'); });
  }

  const hero = document.querySelector('.lh-hero');
  const glow = document.querySelector('.hero-glow');
  addEventListener('scroll', () => {
    if (!hero || !glow) return;
    const y = Math.min(scrollY, hero.offsetHeight);
    glow.style.transform = `translate3d(-50%, ${y * .055}px, 0)`;
  }, { passive: true });
})();
