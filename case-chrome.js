/* Shared chrome; case bodies and their active case navigation stay in each page. */
(() => {
  const page = document.querySelector('body > main.page');
  const header = page?.querySelector('[data-case-header]');
  const footer = page?.querySelector('[data-case-footer]');
  if (!header || !footer) return;
  header.innerHTML = `
      <button class="portfolio-header__toggle" type="button" aria-label="Открыть меню" aria-expanded="false"><span></span><span></span><span></span></button>
      <nav class="portfolio-header__nav" aria-label="Основная навигация">
        <a href="https://mukha.design/">home,</a>
        <a href="https://mukha.design/#facts">обо&nbsp;мне,</a>
        <a href="https://mukha.design/#contacts">контакты</a>
      </nav>
      <nav class="portfolio-header__actions" aria-label="CV и Telegram">
        <a class="portfolio-header__action" href="assets/files/katya-mukha-cv.pdf" target="_blank" rel="noreferrer"><img class="portfolio-header__arrow" src="assets/Icons/arrow.svg" alt="">cv</a>
        <a class="portfolio-header__action" href="https://t.me/katyamukha" target="_blank" rel="noreferrer"><img class="portfolio-header__arrow" src="assets/Icons/arrow.svg" alt="">telegram</a>
      </nav>
    `;
  footer.innerHTML = `
      <div class="portfolio-footer__content">
        <div class="portfolio-footer__email-group">
          <img class="portfolio-footer__email" src="mail.svg" alt="katya@mukha.design" role="button" tabindex="0" aria-label="Скопировать email katya@mukha.design">
          <nav class="portfolio-footer__links" aria-label="Контакты">
            <a href="https://www.linkedin.com/in/katya-mukha-598907429/" target="_blank" rel="noreferrer" data-underline="linkedin">linkedin</a>
            <a href="https://t.me/katyamukha" target="_blank" rel="noreferrer" data-underline="telegram">telegram</a>
            <a href="assets/files/katya-mukha-cv.pdf" data-underline="cv">cv</a>
            <a href="https://www.instagram.com/katya.mukha/" target="_blank" rel="noreferrer" data-underline="inst">inst</a>
          </nav>
        </div>
      </div>
    `;
  const toggle = header.querySelector('.portfolio-header__toggle');
  window.siteNavigation.bindMenu(header, toggle, '.portfolio-header__nav a');
  const email = footer.querySelector('.portfolio-footer__email');
  const mobile = window.matchMedia('(max-width: 767px)');
  const syncMobileChrome = () => {
    email.src = mobile.matches ? 'assets/images/mail-text.svg' : 'mail.svg';
    footer.querySelectorAll('a[href*="t.me"], a[href*="instagram.com"]').forEach(link => {
      if (mobile.matches) { link.removeAttribute('target'); link.removeAttribute('rel'); }
      else { link.target = '_blank'; link.rel = 'noreferrer'; }
    });
  };
  // Use the same alpha tint as the home page without editing the source SVG paths.
  if (!document.getElementById('mobile-heading-ink')) {
    const definitions = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    definitions.setAttribute('width', '0');
    definitions.setAttribute('height', '0');
    definitions.setAttribute('aria-hidden', 'true');
    definitions.style.cssText = 'position:absolute;pointer-events:none;overflow:hidden';
    definitions.innerHTML = '<defs><filter id="mobile-heading-ink" color-interpolation-filters="sRGB"><feFlood flood-color="#212222" result="ink"/><feComposite in="ink" in2="SourceAlpha" operator="in"/></filter></defs>';
    document.body.appendChild(definitions);
  }
  mobile.addEventListener('change', syncMobileChrome);
  syncMobileChrome();
  email.addEventListener('click', async () => {
    if (await window.siteEmailCopy.copy('katya@mukha.design')) window.siteEmailCopy.show();
  });
  email.addEventListener('keydown', event => {
    if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); email.click(); }
  });
})();
