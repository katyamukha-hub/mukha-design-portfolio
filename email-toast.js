(() => {
  const toast = document.createElement('div');
  toast.className = 'email-toast';
  toast.setAttribute('role', 'status');
  toast.setAttribute('aria-live', 'polite');
  toast.setAttribute('aria-atomic', 'true');
  toast.innerHTML = '<span class="email-toast__icon" aria-hidden="true">✓</span><span class="email-toast__message">Почта скопирована</span><span class="email-toast__progress" aria-hidden="true"></span>';
  document.body.appendChild(toast);
  const message = toast.querySelector('.email-toast__message');
  let hideTimer;
  const show = () => {
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
  window.siteEmailCopy = { copy, show };
})();
