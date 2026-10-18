/* Shared menu interaction for the home page and case pages. */
(() => {
  const initialized = new WeakSet();
  const bindMenu = (container, toggle, linkSelector = ':scope > a') => {
    if (!container || !toggle || initialized.has(container)) return;
    initialized.add(container);
    const setOpen = open => {
      container.classList.toggle('is-open', open);
      toggle.setAttribute('aria-expanded', String(open));
      toggle.setAttribute('aria-label', open ? 'Закрыть меню' : 'Открыть меню');
    };
    toggle.addEventListener('click', () => setOpen(!container.classList.contains('is-open')));
    container.querySelectorAll(linkSelector).forEach(link => link.addEventListener('click', () => setOpen(false)));
  };
  window.siteNavigation = { bindMenu };
  bindMenu(document.querySelector('.hero__nav'), document.querySelector('.hero__nav-toggle'));
})();
