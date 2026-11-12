(() => {
  const avalikePreviewParams = new URLSearchParams(location.search);
  const separatePanel = avalikePreviewParams.get("panel") === "separate";
  const inspectLayout = avalikePreviewParams.get("layout") === "1" && !separatePanel;
  if (!separatePanel && !inspectLayout) return;
  document.documentElement.classList.toggle("show-avalike-spacing-workspace", separatePanel);
  document.documentElement.classList.toggle("show-avalike-layout", inspectLayout);
  const caseKey = document.querySelector("[data-case-header]").dataset.caseHeader;
  const caseName = { avalike: "Avalike", skillshare: "Skillshare", mendi: "Mendi" }[caseKey];
  const isAvalike = caseKey === "avalike";
  const layoutSelector = isAvalike ? ".avalike-case" : ".case-layout";
  const desktop = window.matchMedia("(min-width: 1001px)");
  let layout = document.querySelector(layoutSelector);
  let previewDocument = document;
  const showMeasurements = () => {
    const jtbdSection = layout.querySelector('[aria-labelledby="jtbd-title"]');
    if (!isAvalike || !jtbdSection) return;
    const styles = getComputedStyle(layout);
    jtbdSection.dataset.sectionGap = styles.getPropertyValue("--avalike-section-gap").trim();
    const stacked = previewDocument.defaultView.matchMedia("(width < 700px)").matches;
    for (const row of jtbdSection.querySelectorAll(".avalike-jtbd-row")) {
      const rowStyle = getComputedStyle(row);
      row.dataset.cardGap = stacked ? "↕ " + rowStyle.rowGap : "↔ " + rowStyle.columnGap;
    }
  };
  const horizontalProjectMetrics = {
    "project-horizontal-gap": "columnGap",
    "project-period-width": "width",
    "project-team-width": "width",
    "project-role-width": "width"
  };
  const settings = [
    ["Контейнер и разделы", [
      ["container-width", "Ширина контейнера кейса", 1600, isAvalike ? ".avalike-intro" : ":scope", 160],
      ["section-gap", "Между основными разделами", 160],
      ["case-top-padding", "Верхний отступ кейса", 300],
      ["case-bottom-padding", "От кейса до контактов", 250],
    ]],
    ["Типографика и цвет", [
      ["hero-font-size", "Размер главного заголовка", 90, "#case-title", 16],
      ["heading-font-size", "Размер заголовков разделов", 72, "#results-title", 12],
      ["body-font-size", "Размер основного текста", 36, ".case-hero__description", 10],
      ["body-line-height", "Межстрочный интервал основного текста", 64, ".case-hero__description", 12],
      ["heading-color", "Цвет заголовков", null, "#case-title"],
      ["body-color", "Цвет основного текста", null, ".case-hero__description"],
      ["page-caption-color", "Цвет кепшенов на сером фоне", null, ".case-hero__eyebrow"],
    ["story-caption-color", "Цвет кепшенов на белом фоне", null, isAvalike ? ".avalike-story-card h3.case-caption" : ".hypotheses-card__label, .skillshare-hypothesis__label"],
    ]],
    ["Заголовки и медиа", [
      ["caption-title-gap", "Кепшен → заголовок", 100],
      ["hero-title-content-gap", "Главный заголовок → содержимое первого раздела", 120],
      ["title-content-gap", "Заголовки остальных разделов → содержимое", 120],
      ["text-media-gap", "Текст → фото или видео", 160],
      ["paragraph-gap", "Между абзацами и списками", 80, isAvalike ? undefined : ".case-layout-copy"],
    ]],
    ["Период работы, команда и моя роль", [
      ["video-project-gap", "Видеообложка → информация о проекте", 160],
      ["project-column-gap", "Между блоками · базовый отступ", 80],
      ["project-horizontal-gap", "Между блоками · шире 700 px", 80, ".case-meta__grid"],
      ["project-period-width", "Ширина блока «Период работы»", 1600, ".case-meta__item:nth-child(1)", 1],
      ["project-team-width", "Ширина блока «Команда»", 1600, ".case-meta__item:nth-child(2)", 1],
      ["project-role-width", "Ширина блока «Моя роль»", 1600, ".case-meta__item:nth-child(3)", 1],
      ["project-label-gap", "Между подписью и текстом", 40],
      ["project-label-font-size", "Размер подписей", 30, ".case-meta__item dt", 8],
      ["project-value-font-size", "Размер текста блока", 36, ".case-meta__item dd", 10],
    ]],
    ["Карточки JTBD", [
      ["jtbd-card-gap", "Между карточками JTBD", 80],
    ]],
    ["Белые карточки", [
      ["story-font-size", "Размер текста в белых карточках", 36, ".avalike-story-card .case-text-section__text", 10],
      ["story-card-padding", "Внутри белых карточек", 100],
      ["story-label-content-gap", "Подзаголовок карточки → текст", 80],
      ["story-step-gap", "Между шагами белых карточек", 100],
      ["story-paragraph-gap", "Между абзацами внутри шага", 100],
    ]],
  ];
  if (!isAvalike) {
    settings.splice(3, 3);
    const cards = ".jtbd-card, .hypotheses-card, .skillshare-hypothesis__card";
    settings.push(["Карточки", [
      ["story-font-size", "Размер текста карточек", 36, cards, 10],
      ["story-card-padding", "Внутри белых карточек", 100, ".hypotheses-card, .skillshare-hypothesis__card"],
      ["story-label-content-gap", "Подзаголовок карточки → текст", 80, ".hypotheses-card__label, .skillshare-hypothesis__label"],
      ["jtbd-card-gap", "Между карточками", 80, ".jtbd-board, .hypotheses-board, .skillshare-hypotheses-group"],
      ...(caseKey === "mendi" ? [
        ["hypothesis-background", "Фон карточек «Гипотезы»", null, ".hypotheses-card"],
        ["mendi-card-radius", "Скругление карточек «Гипотезы» и JTBD", 48, ".hypotheses-card"],
      ] : []),
      ...(caseKey === "skillshare" ? [
        ["hypothesis-group-gap", "Между группами гипотез", 100, ".skillshare-hypotheses-grid"],
        ["hypothesis-result-gap", "Между гипотезой и результатом", 80, ".skillshare-hypothesis"],
      ] : []),
      ["hypothesis-icon-top", "Значок результата · от верхнего края", 100, ".hypotheses-card__icon, .skillshare-hypothesis__icon"],
      ["hypothesis-icon-right", "Значок результата · от правого края", 100, ".hypotheses-card__icon, .skillshare-hypothesis__icon"],
    ]]);
  }
  const sharedSpacingReferences = {
    "section-gap": [":scope", "rowGap"],
    "case-top-padding": [":scope", "paddingTop"],
    "case-bottom-padding": [":scope", "paddingBottom"],
    "caption-title-gap": [".case-hero__text--title-only", "rowGap"],
    "hero-title-content-gap": [".case-hero__content", "rowGap"],
    "title-content-gap": [".case-layout-section", "rowGap"],
    "text-media-gap": [".case-layout-media-body", "rowGap"]
  };
  const findReference = (selector) => selector === ":scope" ? layout : layout.querySelector(selector);
  const panel = document.createElement("details");
  panel.className = "avalike-spacing-panel";
  panel.open = true;
  panel.innerHTML = `
    <summary>Отступы ${caseName}</summary>
    <form>
      <button type="reset">Сбросить настройки</button>
      <p role="status"></p>
      <div class="avalike-spacing-controls"></div>
    </form>`;
  const form = panel.querySelector("form");
  const breakpoints = [
    ["mobile", 390, "Мобильный", 760],
    ["desktop", 1200, "Десктоп", Infinity]
  ];
  const previousProfiles = {
    mobile: ["large-mobile", "small-mobile", "small-tablet"],
    desktop: ["desktop-medium", "desktop-grid", "desktop-nav", "wide-desktop", "compact-desktop", "tablet", "large-tablet"]
  };
  const widthSlider = document.createElement("input");
  widthSlider.type = "range";
  widthSlider.min = "280";
  widthSlider.max = "1920";
  widthSlider.value = "1200";
  widthSlider.setAttribute("aria-label", "Ширина предпросмотра " + caseName);
  const widthOutput = document.createElement("output");
  const breakpointLabel = document.createElement("label");
  breakpointLabel.className = "avalike-breakpoint-control";
  breakpointLabel.append("Ширина предпросмотра", widthOutput, widthSlider);
  const previewWidths = [390, 700, 768, 900, 1024, 1200, 1503];
  const presets = document.createElement("div");
  presets.className = "avalike-preview-presets";
  presets.setAttribute("role", "group");
  presets.setAttribute("aria-label", "Готовые ширины предпросмотра");
  const widthOptions = document.createElement("div");
  widthOptions.className = "avalike-preview-widths";
  const widthButton = (text, label) => {
    const button = document.createElement("button");
    button.type = "button";
    button.textContent = text;
    button.setAttribute("aria-label", label);
    return button;
  };
  const previousWidth = widthButton("←", "Предыдущая ширина");
  const nextWidth = widthButton("→", "Следующая ширина");
  const presetButtons = previewWidths.map(width => {
    const button = widthButton(String(width), width + " px");
    button.addEventListener("click", () => selectWidth(width));
    widthOptions.append(button);
    return button;
  });
  presets.append(previousWidth, widthOptions, nextWidth);
  const preview = document.createElement("div");
  preview.className = "avalike-breakpoint-preview";
  preview.hidden = true;
  const frame = document.createElement("iframe");
  frame.title = caseName + " на выбранной ширине";
  preview.append(frame);
  const exportButton = document.createElement("button");
  exportButton.type = "button";
  exportButton.textContent = "Скачать настройки";
  if (separatePanel) {
    form.prepend(breakpointLabel, presets);
    form.querySelector('[role="status"]').before(exportButton);
  }
  const showSettings = document.createElement("button");
  showSettings.type = "button";
  showSettings.className = "avalike-show-settings";
  showSettings.textContent = "Вернуть настройки";
  showSettings.hidden = true;
  if (separatePanel) {
    const fullWidth = document.createElement("button");
    fullWidth.type = "button";
    fullWidth.textContent = "На всю ширину";
    form.prepend(fullWidth);

    fullWidth.addEventListener("click", () => {
      document.documentElement.classList.add("avalike-full-preview");
      panel.hidden = true;
      showSettings.hidden = false;
      showSettings.focus();
    });

    showSettings.addEventListener("click", () => {
      document.documentElement.classList.remove("avalike-full-preview");
      showSettings.hidden = true;
      panel.hidden = false;
      fullWidth.focus();
    });
  }
  const status = form.querySelector('[role="status"]');
  const controlList = form.querySelector(".avalike-spacing-controls");
  const outlineLabel = document.createElement("label");
  outlineLabel.className = "avalike-outline-toggle";
  const outlineToggle = document.createElement("input");
  outlineToggle.type = "checkbox";
  outlineToggle.setAttribute("role", "switch");
  outlineToggle.checked = avalikePreviewParams.get("layout") === "1";
  outlineLabel.append("Показать контейнеры", outlineToggle);
  form.querySelector('button[type="reset"]').before(outlineLabel);
  const syncOutlines = () => {
    previewDocument.documentElement.classList.toggle("show-avalike-layout", outlineToggle.checked);
  };
  outlineToggle.addEventListener("change", syncOutlines);
  const bodyHighlight = document.createElement("button");
  bodyHighlight.type = "button";
  bodyHighlight.setAttribute("role", "switch");
  bodyHighlight.setAttribute("aria-checked", "false");
  bodyHighlight.textContent = "Подсветить";
  bodyHighlight.setAttribute("aria-label", "Подсветить основной текст");
  bodyHighlight.addEventListener("click", () => {
    const highlighted = bodyHighlight.getAttribute("aria-checked") === "true";
    bodyHighlight.setAttribute("aria-checked", String(!highlighted));
    layout.toggleAttribute("data-highlight-body", !highlighted);
  });
  const storageKey = caseKey + "-spacing-preview";
  const readSaved = () => {
    try {
      return JSON.parse(localStorage.getItem(storageKey)) || {};
    } catch {
      return {};
    }
  };
  let profileKey = "desktop";
  const drafts = new Map();
  let values = new Map();
  const applyValue = ({ name, property, selector }, value) => {
    if (value) layout.style.setProperty(property, value);
    else layout.style.removeProperty(property);
    if (selector) layout.toggleAttribute("data-" + name, Boolean(value));
  };
  const controls = settings.flatMap(([groupTitle, groupSettings], index) => {
    const group = document.createElement("details");
    group.className = "avalike-settings-group";
    group.open = index === 0;
    const heading = document.createElement("summary");
    heading.textContent = groupTitle;
    group.append(heading);
    controlList.append(group);
    return groupSettings.filter(([name, , , selector]) =>
      (!selector || findReference(selector)) && (name !== "caption-title-gap" || layout.querySelector(".case-hero__eyebrow"))
    ).map(([name, title, max, selector, min = 0]) => {
      const property = "--avalike-" + name;
      const isColor = max === null;
      const label = document.createElement("label");
      const input = document.createElement("input");
      const output = document.createElement("output");
      input.type = isColor ? "color" : "range";
      if (!isColor) {
        input.min = String(min);
        input.max = String(max);
      }
      input.setAttribute("aria-label", title);
      label.append(title);
      if (!isColor) label.append(output);
      label.append(input);
      if (name === "body-font-size") {
        const row = document.createElement("div");
        row.className = "avalike-body-font-control";
        row.append(label, bodyHighlight);
        group.append(row);
      } else {
        group.append(label);
      }
      const control = { name, property, input, output, selector, isColor, min, max };
      input.addEventListener("input", () => {
        const value = isColor ? input.value : input.value + "px";
        values.set(property, value);
        applyValue(control, value);
        output.textContent = value;
        saveProfile();
        showMeasurements();
      });
      return control;
    });
  });

  const readProfiles = () => {
    const saved = readSaved();
    return { ...(saved.values ? { desktop: saved } : {}), ...saved.profiles };
  };

  const readProfile = () => {
    const profiles = readProfiles();
    const fallback = previousProfiles[profileKey]?.find(key => profiles[key]);
    const saved = drafts.get(profileKey) || profiles[profileKey] || profiles[fallback];
    values = new Map();
    for (const { name, property, isColor, min, max } of controls) {
      const legacyProperty = {
        "story-step-gap": "--avalike-story-body-gap",
        "story-paragraph-gap": "--avalike-story-body-gap",
        "page-caption-color": "--avalike-caption-color",
        "story-caption-color": "--avalike-caption-color"
      }[name];
      const legacyValue = legacyProperty && saved?.values?.[legacyProperty];
      const value = saved?.values?.[property] ?? legacyValue;
      const size = parseInt(value, 10);
      if (typeof value === "string" && (isColor
        ? /^#[0-9a-f]{6}$/i.test(value)
        : /^\d+px$/.test(value) && size >= min && size <= max)) {
        values.set(property, value);
      }
    }
  };

  const syncPanel = () => {
    for (const control of controls) applyValue(control);
    if ((!separatePanel && !desktop.matches) || avalikePreviewParams.get("panel") === "off") {
      panel.remove();
      showSettings.remove();
      preview.hidden = true;
      document.documentElement.classList.remove("avalike-fixed-breakpoint");
      layout.removeAttribute("data-highlight-body");
      showMeasurements();
      return;
    }
    if (!panel.isConnected) document.body.append(panel);
    if (separatePanel && !showSettings.isConnected) document.body.append(showSettings);
    preview.hidden = !separatePanel;
    document.documentElement.classList.toggle("avalike-fixed-breakpoint", separatePanel);
    layout.toggleAttribute("data-highlight-body", bodyHighlight.getAttribute("aria-checked") === "true");
    syncOutlines();
    const probe = previewDocument.createElement("div");
    probe.style.cssText = "position:absolute;visibility:hidden;height:0";
    layout.append(probe);
    const hasHorizontalProject = previewDocument.defaultView.matchMedia("(width > 700px)").matches;
    for (const control of controls) {
      const { name, property, input, output, selector, isColor } = control;
      const spacing = !isAvalike && sharedSpacingReferences[name];
      const reference = spacing ? findReference(spacing[0]) : selector && findReference(selector);
      const override = values.get(property);
      const projectMetric = horizontalProjectMetrics[name];
      if (projectMetric) {
        input.disabled = !hasHorizontalProject;
        if (input.disabled) {
          output.textContent = "Шире 700 px";
          continue;
        }
      }
      if (isColor) {
        const color = getComputedStyle(reference)[name === "hypothesis-background" ? "backgroundColor" : "color"];
        const rgb = color.match(/\d+/g);
        input.value = override || "#" + rgb.slice(0, 3).map(channel => Number(channel).toString(16).padStart(2, "0")).join("");
        continue;
      }
      probe.style.width = "var(" + property + ")";
      const metric = (spacing && spacing[1]) || projectMetric || {
        "body-line-height": "lineHeight",
        "container-width": "width",
        "jtbd-card-gap": "rowGap",
        "paragraph-gap": "rowGap",
        "story-card-padding": "paddingTop",
        "story-label-content-gap": "marginBottom",
        "hypothesis-icon-top": "top",
        "hypothesis-icon-right": "right",
        "hypothesis-group-gap": "rowGap",
        "hypothesis-result-gap": "rowGap",
        "mendi-card-radius": "borderTopLeftRadius"
      }[name] || "fontSize";
      const size = override || (reference ? getComputedStyle(reference)[metric] : getComputedStyle(probe).width);
      input.value = String(Math.round(parseFloat(size)));
      output.textContent = input.value + "px";
    }
    probe.remove();
    for (const control of controls) applyValue(control, values.get(control.property));
    showMeasurements();
  };

  const snapshot = () => ({ values: Object.fromEntries(values) });

  const setPreviewLoading = (loading) => {
    controlList.inert = loading;
    form.querySelector('button[type="reset"]').disabled = loading;
    status.textContent = loading ? "Загружается предпросмотр…" : "";
  };

  const resizePreview = () => {
    const width = Number(widthSlider.value);
    const [nextProfile, , range] = breakpoints.find(([, , , limit]) => width <= limit);
    if (nextProfile !== profileKey) {
      profileKey = nextProfile;
      readProfile();
      status.textContent = "";
    }
    widthOutput.textContent = width + " px · " + range;
    presetButtons.forEach((button, index) => {
      button.setAttribute("aria-pressed", String(previewWidths[index] === width));
    });
    previousWidth.disabled = width <= previewWidths[0];
    nextWidth.disabled = width >= previewWidths[previewWidths.length - 1];
    frame.style.width = width + "px";
    preview.hidden = false;
    if (!preview.isConnected) document.body.append(preview);
    if (!frame.getAttribute("src")) {
      setPreviewLoading(true);
      frame.src = location.pathname;
    } else if (frame.contentDocument?.querySelector(layoutSelector)) {
      layout = frame.contentDocument.querySelector(layoutSelector);
      previewDocument = frame.contentDocument;
      syncPanel();
    }
  };
  const selectWidth = (width) => {
    widthSlider.value = String(width);
    resizePreview();
  };
  previousWidth.addEventListener("click", () => {
    const width = previewWidths.findLast(width => width < Number(widthSlider.value));
    if (width !== undefined) selectWidth(width);
  });
  nextWidth.addEventListener("click", () => {
    const width = previewWidths.find(width => width > Number(widthSlider.value));
    if (width !== undefined) selectWidth(width);
  });
  widthSlider.addEventListener("input", resizePreview);

  frame.addEventListener("load", () => {
    if (preview.hidden) return;
    const framedLayout = frame.contentDocument?.querySelector(layoutSelector);
    if (!framedLayout) return;
    previewDocument = frame.contentDocument;
    layout = framedLayout;
    for (const link of previewDocument.querySelectorAll(".case-nav__link")) {
      const url = new URL(link.href);
      if (url.origin !== location.origin) continue;
      url.searchParams.set("panel", "separate");
      link.href = url.href;
      link.target = "_top";
    }
    setPreviewLoading(false);
    syncPanel();
  });

  const saveProfile = () => {
    drafts.set(profileKey, snapshot());
    try {
      const profiles = readProfiles();
      profiles[profileKey] = snapshot();
      localStorage.setItem(storageKey, JSON.stringify({
        version: 2,
        profiles
      }));
      status.textContent = profileKey === "mobile"
        ? "Сохранено для мобильных."
        : "Сохранено для всех десктопных ширин.";
    } catch {
      status.textContent = "Браузер не дал сохранить настройки.";
    }
  };

  exportButton.addEventListener("click", () => {
    const savedProfiles = readProfiles();
    const profiles = {};
    const archivedProfiles = { ...savedProfiles };
    for (const [key] of breakpoints) {
      const fallback = previousProfiles[key]?.find(oldKey => savedProfiles[oldKey]);
      const saved = savedProfiles[key] || savedProfiles[fallback];
      if (saved) profiles[key] = saved;
      delete archivedProfiles[key];
    }
    const data = {
      version: 2,
      page: caseName,
      breakpoints: breakpoints.map(([key, width, range]) => [key, width, range]),
      profiles,
      archivedProfiles
    };
    const url = URL.createObjectURL(new Blob([JSON.stringify(data, null, 2)], { type: "application/json" }));
    const download = document.createElement("a");
    download.href = url;
    download.download = caseKey + "-responsive-settings.json";
    download.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  });

  form.addEventListener("reset", (event) => {
    event.preventDefault();
    values.clear();
    saveProfile();
    syncPanel();
  });
  desktop.addEventListener("change", () => {
    if (separatePanel) resizePreview();
    else syncPanel();
  });
  readProfile();
  syncPanel();
  if (separatePanel) resizePreview();
})();
