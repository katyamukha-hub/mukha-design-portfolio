(() => {
  const link = document.querySelector("[data-avalike-link]");
  const cover = document.querySelector("[data-avalike-cover]");
  const video = cover.querySelector("video");
  const storageKey = "avalike-cover-handoff";
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

  if (link) {
    if (location.hostname === "mukha.design") link.href = "/avalike";

    link.addEventListener("click", (event) => {
      if (event.defaultPrevented || event.button !== 0 ||
          event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;

      const rect = cover.getBoundingClientRect();
      const handoff = {
        time: video.currentTime,
        createdAt: Date.now(),
        bounds: [rect.left, rect.top, rect.width, rect.height],
        viewportWidth: window.innerWidth
      };
      if (video.readyState >= HTMLMediaElement.HAVE_CURRENT_DATA && video.videoWidth) {
        try {
          const canvas = document.createElement("canvas");
          canvas.width = Math.min(video.videoWidth, 960);
          canvas.height = Math.round(canvas.width * video.videoHeight / video.videoWidth);
          canvas.getContext("2d").drawImage(video, 0, 0, canvas.width, canvas.height);
          handoff.frame = canvas.toDataURL("image/jpeg", 0.82);
        } catch {
          // The destination can use its poster if the current frame is unavailable.
        }
      }
      try {
        sessionStorage.setItem(storageKey, JSON.stringify(handoff));
      } catch {
        // Storage can be disabled. The link still opens the case.
      }
    });

    return;
  }

  let handoff;
  try {
    handoff = JSON.parse(sessionStorage.getItem(storageKey));
    sessionStorage.removeItem(storageKey);
  } catch {
    // Direct visits and unavailable storage both use the normal player.
  }
  const fromHome = document.referrer && new URL(document.referrer).origin === location.origin &&
    /^\/(?:index\.html)?$/.test(new URL(document.referrer).pathname);
  const resume = fromHome && Number.isFinite(handoff?.time) &&
    handoff.time >= 0 && Date.now() - handoff.createdAt < 15000;

  if (!resume) return;

  const player = cover.querySelector(".avalike-cover-player");
  const still = document.createElement("img");
  still.className = "avalike-transition-still";
  still.alt = "";
  still.src = handoff.frame || video.poster;
  cover.classList.add("is-restoring-video");
  player.append(still);
  video.pause();

  const start = handoff.bounds;
  if (!reducedMotion.matches && typeof player.animate === "function" &&
      window.innerWidth === handoff.viewportWidth &&
      Array.isArray(start) && start.length === 4 && start.every(Number.isFinite) &&
      start[2] > 0 && start[3] > 0 && start[1] < window.innerHeight && start[1] + start[3] > 0) {
    // Wait for the complete hero and its layout, then start before the first paint.
    requestAnimationFrame(() => {
      const target = cover.getBoundingClientRect();
      const end = [target.left, target.top, target.width, target.height];
      const dx = end[0] - start[0];
      const dy = end[1] - start[1];
      const stretchX = Math.min(36, Math.abs(dx) * 0.13);
      const stretchY = Math.min(32, Math.abs(dy) * 0.11);
      const frame = ([left, top, width, height]) => ({
        left: `${left}px`, top: `${top}px`, width: `${width}px`, height: `${height}px`
      });
      const stretch = [
        start[0] + dx * 0.7 - stretchX / 2,
        start[1] + dy * 0.7 - stretchY / 2,
        start[2] + (end[2] - start[2]) * 0.7 + stretchX,
        start[3] + (end[3] - start[3]) * 0.7 + stretchY
      ];
      const overshoot = [
        end[0] + Math.max(-12, Math.min(12, dx * 0.035)),
        end[1] + Math.max(-14, Math.min(14, dy * 0.04)),
        end[2],
        end[3]
      ];

      cover.style.height = `${target.height}px`;
      document.documentElement.classList.add("is-avalike-arriving");
      const animation = player.animate([
        { ...frame(start), offset: 0, easing: "cubic-bezier(.28,.15,.47,1)" },
        { ...frame(stretch), offset: 0.52, easing: "ease-out" },
        { ...frame(overshoot), offset: 0.8, easing: "ease-in-out", backgroundColor: "#222224" },
        { ...frame(end), offset: 1, backgroundColor: "transparent" }
      ], { duration: 680, fill: "both" });
      const resize = new AbortController();
      const cleanup = () => {
        resize.abort();
        document.documentElement.classList.remove("is-avalike-arriving");
        cover.style.removeProperty("height");
        animation.cancel();
      };
      animation.finished.then(cleanup, cleanup);
      window.addEventListener("resize", () => animation.cancel(), { once: true, signal: resize.signal });
    });
  }

  const events = new AbortController();
  const options = { signal: events.signal };
  let positionRequested = false;
  const finish = () => {
    events.abort();
    clearTimeout(timeout);
    still.remove();
    cover.classList.remove("is-restoring-video");
    video.play().catch(() => {});
  };
  const timeout = setTimeout(finish, 4500);
  const seek = () => {
    if (positionRequested) return;
    positionRequested = true;
    const limit = Number.isFinite(video.duration) ? Math.max(0, video.duration - 0.05) : handoff.time;
    const position = Math.min(handoff.time, limit);
    if (Math.abs(video.currentTime - position) < 0.04 &&
        video.readyState >= HTMLMediaElement.HAVE_CURRENT_DATA) {
      finish();
      return;
    }
    try {
      video.currentTime = position;
    } catch {
      finish();
    }
  };

  video.addEventListener("seeked", finish, options);
  video.addEventListener("error", finish, options);
  video.addEventListener("loadedmetadata", seek, options);
  if (video.readyState >= HTMLMediaElement.HAVE_METADATA) seek();
})();
