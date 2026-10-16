(() => {
  const sectionNav = document.querySelector('.case-section-nav');
  const caseNav = document.querySelector('.case-nav');
  const sectionList = sectionNav?.querySelector('.case-section-nav__list');

  if (!sectionNav || !caseNav || !sectionList) return;

  const updateAvailableHeight = () => {
    const navTop = Number.parseFloat(window.getComputedStyle(sectionNav).top);
    const lowerNavTop = caseNav.getBoundingClientRect().top;
    const safeGap = 16;

    sectionNav.style.setProperty('--case-section-nav-top', `${Number.isFinite(navTop) ? navTop : 124}px`);
    sectionNav.style.setProperty(
      '--case-section-nav-clearance',
      `${Math.max(safeGap, window.innerHeight - lowerNavTop + safeGap)}px`
    );
  };

  const revealActiveLink = () => {
    const activeLink = sectionList.querySelector('.case-section-nav__link.is-active');
    const activeItem = activeLink?.closest('li');

    if (!activeItem || sectionList.scrollHeight <= sectionList.clientHeight + 1) return;

    const listRect = sectionList.getBoundingClientRect();
    const itemRect = activeItem.getBoundingClientRect();

    if (itemRect.top < listRect.top) {
      sectionList.scrollTop -= listRect.top - itemRect.top;
    } else if (itemRect.bottom > listRect.bottom) {
      sectionList.scrollTop += itemRect.bottom - listRect.bottom;
    }
  };

  const updateNavigation = () => {
    updateAvailableHeight();
    revealActiveLink();
  };

  window.addEventListener('resize', updateNavigation, { passive: true });
  window.addEventListener('load', updateNavigation, { once: true });

  const activeLinkObserver = new MutationObserver(() => {
    requestAnimationFrame(revealActiveLink);
  });
  sectionList.querySelectorAll('.case-section-nav__link').forEach((link) => {
    activeLinkObserver.observe(link, { attributes: true, attributeFilter: ['class'] });
  });

  if ('ResizeObserver' in window) {
    const sizeObserver = new ResizeObserver(updateNavigation);
    sizeObserver.observe(caseNav);
    sizeObserver.observe(sectionNav);
  }

  requestAnimationFrame(updateNavigation);
})();
