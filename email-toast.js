(() => {
  const toast = document.createElement('div');
  toast.className = 'email-toast';
  toast.setAttribute('role', 'status');
  toast.setAttribute('aria-live', 'polite');
  toast.setAttribute('aria-atomic', 'true');
  toast.innerHTML = '<span class="email-toast__message">Почта скопирована</span>';
  document.body.appendChild(toast);
  const message = toast.querySelector('.email-toast__message');
  let hideTimer;
  const show = () => {
    if (window.matchMedia('(min-width: 768px) and (hover: hover) and (pointer: fine)').matches) return;
    clearTimeout(hideTimer);
    toast.classList.remove('is-visible');
    message.textContent = '';
    void toast.offsetWidth;
    message.textContent = 'Почта скопирована';
    toast.classList.add('is-visible');
    hideTimer = setTimeout(() => toast.classList.remove('is-visible'), 2200);
  };
  const copy = async (address) => {
    try {
      if (!navigator.clipboard?.writeText) throw new Error('Clipboard unavailable');
      await navigator.clipboard.writeText(address);
      return true;
    } catch {
      const field = document.createElement('textarea');
      field.value = address;
      field.setAttribute('readonly', '');
      field.style.cssText = 'position:fixed;left:-9999px;top:0;opacity:0;font-size:16px';
      const focused = document.activeElement;
      document.body.appendChild(field);
      field.select();
      field.setSelectionRange(0, address.length);
      let copied = false;
      try { copied = document.execCommand('copy'); } catch { /* No false success toast. */ }
      field.remove();
      focused?.focus({ preventScroll: true });
      return copied;
    }
  };
  const bind = (element, { container = element?.parentElement, button } = {}) => {
    if (!element || element.dataset.emailCopyBound) return;
    element.dataset.emailCopyBound = 'true';
    const desktop = window.matchMedia('(min-width: 768px) and (hover: hover) and (pointer: fine)');
    let cursor = document.querySelector('.contacts-copy-cursor');
    if (!cursor) {
      cursor = document.createElement('div');
      cursor.className = 'contacts-copy-cursor';
      cursor.setAttribute('aria-hidden', 'true');
      cursor.innerHTML = '<img class="is-copy-icon" src="assets/Icons/copy_coursor.svg" alt=""><img class="is-copied-icon" src="assets/Icons/copied_coursor.svg" alt="">';
      document.body.appendChild(cursor);
    }
    const defaultIcon = cursor.querySelector('.is-copy-icon');
    const copiedIcon = cursor.querySelector('.is-copied-icon');
    const reset = () => {
      cursor.classList.remove('is-visible', 'is-copied');
      defaultIcon.classList.remove('is-copied-icon');
      copiedIcon.classList.add('is-copied-icon');
      container?.classList.remove('is-email-hover');
    };
    element.setAttribute('role', 'button');
    element.setAttribute('tabindex', '0');
    element.setAttribute('aria-label', 'Скопировать email katya@mukha.design');
    document.addEventListener('pointermove', event => {
      if (!desktop.matches || event.pointerType === 'touch') { reset(); return; }
      const bounds = element.getBoundingClientRect();
      const inside = event.clientX >= bounds.left && event.clientX <= bounds.right &&
        event.clientY >= bounds.top && event.clientY <= bounds.bottom;
      if (!inside) { reset(); return; }
      cursor.style.left = `${event.clientX}px`;
      cursor.style.top = `${event.clientY}px`;
      cursor.classList.add('is-visible');
      container?.classList.add('is-email-hover');
    });
    element.addEventListener('pointerleave', reset);
    window.addEventListener('scroll', reset, { passive: true });
    window.addEventListener('blur', reset);
    desktop.addEventListener('change', reset);
    const activate = async event => {
      const keyboard = event.detail === 0;
      if (!(await copy('katya@mukha.design'))) {
        reset();
        toast.classList.remove('is-visible');
        return;
      }
      if (!desktop.matches) { reset(); show(); return; }
      if (keyboard) {
        const bounds = element.getBoundingClientRect();
        cursor.style.left = `${bounds.left + bounds.width / 2}px`;
        cursor.style.top = `${bounds.top + bounds.height / 2}px`;
      }
      cursor.classList.add('is-visible', 'is-copied');
      defaultIcon.classList.add('is-copied-icon');
      copiedIcon.classList.remove('is-copied-icon');
    };
    element.addEventListener('click', activate);
    button?.addEventListener('click', activate);
    element.addEventListener('keydown', event => {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        element.click();
      }
    });
    element.addEventListener('blur', reset);
  };
  window.siteEmailCopy = { copy, show, bind };
})();
