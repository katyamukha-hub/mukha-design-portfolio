(() => {
  const link = document.querySelector("[data-avalike-link]");
  const video = link?.querySelector("[data-avalike-cover] video");
  if (!video) return;

  if (location.hostname === "mukha.design") link.href = "/avalike";
  const root = document.documentElement;
  const reducedMotion = matchMedia("(prefers-reduced-motion: reduce)");
  let opening = false;

  const animateCover = (cover, player, source, onFinish) => {
    const target = cover.getBoundingClientRect();
    const frame = (rect, borderRadius) => ({
      left: rect.left + "px",
      top: rect.top + "px",
      width: rect.width + "px",
      height: rect.height + "px",
      borderRadius
    });

    cover.style.height = target.height + "px";
    root.classList.add("is-avalike-arriving");
    const start = frame(source.rect, source.radius);
    const animation = player.animate([
      { ...start, offset: 0 },
      { ...start, offset: 0.1, easing: "cubic-bezier(.4,0,.25,1)" },
      { ...frame(target, getComputedStyle(cover).borderRadius), offset: 1 }
    ], { duration: 1000, fill: "both" });
    const events = new AbortController();
    const cleanup = () => {
      events.abort();
      root.classList.remove("is-avalike-arriving");
      cover.style.removeProperty("height");
      animation.cancel();
      onFinish?.();
    };
    window.addEventListener("resize", () => animation.cancel(), { signal: events.signal });
    animation.finished.then(cleanup, cleanup);
  };

  const keepPlayerConnected = (cover, main) => {
    const player = video.parentElement;
    // Some browsers restart media when a playing element is reparented.
    // Keep its original ancestor chain and align the player over the case slot.
    for (let child = player; child.parentElement !== document.body;) {
      const parent = child.parentElement;
      for (const sibling of [...parent.children]) {
        if (sibling !== child) sibling.remove();
      }
      for (const name of parent.getAttributeNames()) parent.removeAttribute(name);
      parent.className = "avalike-live-player-ancestor";
      child = parent;
    }
    player.removeAttribute("data-avalike-cover");
    player.className = "avalike-cover-player avalike-live-player";
    cover.classList.add("avalike-live-slot");
    cover.setAttribute("role", "img");
    cover.setAttribute("aria-label", video.getAttribute("aria-label"));
    player.setAttribute("aria-hidden", "true");
    const align = () => {
      const bounds = cover.getBoundingClientRect();
      Object.assign(player.style, {
        left: bounds.left + window.scrollX + "px",
        top: bounds.top + window.scrollY + "px",
        width: bounds.width + "px",
        height: bounds.height + "px",
        borderRadius: getComputedStyle(cover).borderRadius
      });
    };
    const observer = new ResizeObserver(align);
    observer.observe(main);
    observer.observe(cover);
    window.addEventListener("resize", align, { passive: true });
    document.fonts.ready.then(align);
    align();
    return align;
  };

  const prepareStyles = async (caseDocument, styles) => {
    const pending = [];
    for (const source of caseDocument.head.querySelectorAll('style, link[rel="stylesheet"]')) {
      const style = document.importNode(source, true);
      const media = style.media;
      style.media = "not all";
      styles.push({ style, media });
      if (style instanceof HTMLLinkElement) {
        pending.push(new Promise((resolve, reject) => {
          style.addEventListener("load", resolve, { once: true });
          style.addEventListener("error", reject, { once: true });
        }));
      }
      document.head.append(style);
    }
    let timeout;
    try {
      await Promise.race([
        Promise.all(pending),
        new Promise((_, reject) => {
          timeout = setTimeout(() => reject(new Error("Case styles timed out")), 5000);
        })
      ]);
    } finally {
      clearTimeout(timeout);
    }
  };

  const initCase = async (source) => {
    const appendScript = (script) => document.body.append(script);
    const loadScript = (src) => new Promise((resolve, reject) => {
      const script = document.createElement("script");
      script.src = src;
      script.onload = resolve;
      script.onerror = reject;
      appendScript(script);
    });
    const init = document.createElement("script");
    init.textContent = "(() => {\n" + source.textContent + "\n})();";
    appendScript(init);
    await Promise.all([loadScript("case-shared.js"), loadScript("case-chrome.js?v=2")]);
  };

  link.addEventListener("click", async (event) => {
    if (event.defaultPrevented || event.button !== 0 ||
        event.metaKey || event.ctrlKey || event.shiftKey || event.altKey ||
        reducedMotion.matches) return;

    event.preventDefault();
    if (opening) return;
    opening = true;
    const destination = link.href;
    const homeURL = location.href;
    const homeStyles = [...document.head.querySelectorAll('style, link[rel="stylesheet"]')];
    const caseStyles = [];
    let caseMounted = false;

    try {
      const response = await fetch(destination, { signal: AbortSignal.timeout(5000) });
      if (!response.ok) throw new Error("Case unavailable");
      const caseDocument = new DOMParser().parseFromString(await response.text(), "text/html");
      const main = caseDocument.querySelector("main.page");
      const placeholder = main?.querySelector("[data-avalike-destination] video");
      const init = caseDocument.querySelector("[data-avalike-init]");
      if (!placeholder || !init) throw new Error("Case layout unavailable");

      const destinationVideoClass = placeholder.className;
      const destinationVideoLabel = placeholder.getAttribute("aria-label");
      let player = placeholder.parentElement;
      const cover = player.parentElement;
      placeholder.remove();
      await prepareStyles(caseDocument, caseStyles);
      if (location.href !== homeURL || !link.isConnected) {
        caseStyles.forEach(({ style }) => style.remove());
        opening = false;
        return;
      }

      const source = { rect: video.getBoundingClientRect(), radius: getComputedStyle(video).borderRadius };
      const canMovePlayer = typeof Element.prototype.moveBefore === "function";
      const originalMain = video.closest("main");
      const homeContent = [...document.body.children].filter(element =>
        !element.matches("script, .email-toast") && (canMovePlayer || element !== originalMain)
      );
      history.pushState(null, "", destination);
      caseMounted = true;
      window.addEventListener("popstate", () => location.reload(), { once: true });
      window.dispatchEvent(new Event("avalike:leaving-home"));
      homeStyles.forEach(style => style.remove());
      caseStyles.forEach(({ style, media }) => { style.media = media; });
      document.body.append(main);
      if (canMovePlayer) player.moveBefore(video, null);
      video.className = destinationVideoClass;
      video.setAttribute("aria-label", destinationVideoLabel);
      video.width = video.videoWidth || 1920;
      video.height = video.videoHeight || 1080;
      homeContent.forEach(element => element.remove());
      document.body.className = caseDocument.body.className;
      document.title = caseDocument.title;
      window.scrollTo({ top: 0, left: 0, behavior: "instant" });

      let alignPlayer;
      if (!canMovePlayer) {
        player.remove();
        alignPlayer = keepPlayerConnected(cover, main);
        player = video.parentElement;
      }
      if (!reducedMotion.matches && typeof player.animate === "function") {
        animateCover(cover, player, source, alignPlayer);
      }
      video.play().catch(() => {});
      const heading = main.querySelector("h1");
      heading?.setAttribute("tabindex", "-1");
      heading?.focus({ preventScroll: true });
      await initCase(init);
    } catch (error) {
      console.warn("Avalike live transition unavailable", error);
      if (caseMounted) {
        location.reload();
      } else {
        caseStyles.forEach(({ style }) => style.remove());
        location.assign(destination);
      }
    }
  });
})();
