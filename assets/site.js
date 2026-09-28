(() => {
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const menu = document.querySelector('.menu');
  const header = document.querySelector('.site-header');

  if (menu && header) {
    const button = document.createElement('button');
    button.className = 'menu-toggle';
    button.type = 'button';
    button.setAttribute('aria-expanded', 'false');
    button.setAttribute('aria-controls', 'mobile-menu');
    button.innerHTML = '<span></span><span></span><span></span>';
    header.querySelector('.nav')?.appendChild(button);

    const panel = document.createElement('div');
    panel.id = 'mobile-menu';
    panel.className = 'mobile-menu';
    panel.innerHTML = menu.innerHTML;
    header.appendChild(panel);

    const close = () => {
      panel.classList.remove('is-open');
      button.setAttribute('aria-expanded', 'false');
    };

    button.addEventListener('click', () => {
      const open = panel.classList.toggle('is-open');
      button.setAttribute('aria-expanded', String(open));
    });
    panel.querySelectorAll('a').forEach(a => a.addEventListener('click', close));
  }

  if (!reduce && 'IntersectionObserver' in window) {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });
    document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
  } else {
    document.querySelectorAll('.reveal').forEach(el => el.classList.add('is-visible'));
  }

  if (!reduce) {
    const stage = document.querySelector('[data-parallax]');
    if (stage) {
      stage.addEventListener('pointermove', event => {
        const rect = stage.getBoundingClientRect();
        const x = ((event.clientX - rect.left) / rect.width - 0.5) * 2;
        const y = ((event.clientY - rect.top) / rect.height - 0.5) * 2;
        stage.style.setProperty('--px', (x * 7).toFixed(2) + 'px');
        stage.style.setProperty('--py', (y * 7).toFixed(2) + 'px');
      }, { passive: true });
      stage.addEventListener('pointerleave', () => {
        stage.style.setProperty('--px', '0px');
        stage.style.setProperty('--py', '0px');
      }, { passive: true });
    }
  }

  document.querySelectorAll('[data-year]').forEach(el => {
    el.textContent = new Date().getFullYear();
  });
})();