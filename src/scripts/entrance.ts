if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
  const revealEls = document.querySelectorAll<HTMLElement>('.reveal:not(.no-reveal), .reveal-group > *:not(.no-reveal)');

  // start hidden until observed
  revealEls.forEach((el) => {
    if (el.dataset.revealed) return;
    el.style.opacity = '0';
  });

  const observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        const target = entry.target as HTMLElement;
        if (target.dataset.revealed) {
          observer.unobserve(target);
          continue;
        }
        target.dataset.revealed = 'true';
        target.style.opacity = '';
        target.style.animationPlayState = 'running';
        observer.unobserve(target);
      }
    },
    { threshold: 0.15, rootMargin: '0px 0px -5% 0px' }
  );

  revealEls.forEach((el) => {
    el.style.animationPlayState = 'paused';
    observer.observe(el);
  });
}
