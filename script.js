const state = {
  language: detectLanguage(),
  region: detectRegion(),
};

const pricing = {
  moldova: {
    currency: "€",
    suffix: "",
    setup: { chatbot: 300, automation: 500, integrations: 400, voice: 700, full: 1200 },
    support: { none: 0, basic: 120, growth: 250, premium: 450 },
  },
  israel: {
    currency: "₪",
    suffix: "",
    setup: { chatbot: 1800, automation: 3000, integrations: 2500, voice: 4500, full: 7600 },
    support: { none: 0, basic: 650, growth: 1200, premium: 2200 },
  },
  international: {
    currency: "€",
    suffix: "",
    setup: { chatbot: 600, automation: 900, integrations: 700, voice: 1200, full: 2200 },
    support: { none: 0, basic: 220, growth: 450, premium: 850 },
  },
};

const complexityMultiplier = { basic: 1, standard: 1.35, advanced: 1.85 };
const channelPrice = { moldova: 70, israel: 350, international: 120 };

const ids = {
  language: document.getElementById("languageSelect"),
  region: document.getElementById("regionSelect"),
  calcRegion: document.getElementById("calcRegion"),
  formRegion: document.getElementById("formRegion"),
  solutionType: document.getElementById("solutionType"),
  complexity: document.getElementById("complexity"),
  support: document.getElementById("support"),
  channelChecks: document.getElementById("channelChecks"),
  setupPrice: document.getElementById("setupPrice"),
  monthlyPrice: document.getElementById("monthlyPrice"),
  menuToggle: document.querySelector(".menu-toggle"),
  nav: document.getElementById("site-nav"),
};

function detectLanguage() {
  const stored = localStorage.getItem("triple-ai-language");
  if (stored && TRANSLATIONS[stored]) return stored;

  const language = (navigator.language || "en").slice(0, 2).toLowerCase();
  if (["en", "ro", "ru", "he"].includes(language)) return language;
  return "en";
}

function detectRegion() {
  const stored = localStorage.getItem("triple-ai-region");
  if (stored && pricing[stored]) return stored;

  const locale = `${navigator.language || ""} ${Intl.DateTimeFormat().resolvedOptions().timeZone || ""}`.toLowerCase();
  if (locale.includes("israel") || locale.includes("jerusalem") || locale.includes("-il") || locale.endsWith("he")) return "israel";
  if (locale.includes("chisinau") || locale.includes("moldova") || locale.includes("-md") || locale.includes("ro")) return "moldova";
  return "international";
}

function t(path) {
  return path.split(".").reduce((value, key) => value?.[key], TRANSLATIONS[state.language]) ?? path;
}

function setOptions(select, options, selected) {
  select.innerHTML = Object.entries(options)
    .map(([value, label]) => `<option value="${value}" ${value === selected ? "selected" : ""}>${label}</option>`)
    .join("");
}

function applyTranslations() {
  const dictionary = TRANSLATIONS[state.language];
  document.documentElement.lang = state.language;
  document.documentElement.dir = state.language === "he" ? "rtl" : "ltr";
  document.title = dictionary.meta.title;
  document.querySelector("meta[name='description']").setAttribute("content", dictionary.meta.description);

  document.querySelectorAll("[data-i18n]").forEach((node) => {
    node.textContent = t(node.dataset.i18n);
  });

  renderValuePoints();
  renderVisualSignals();
  renderSolutions();
  renderComparison();
  renderTrust();
  renderIndustries();
  renderProcess();
  renderCalculatorOptions();
}

function renderValuePoints() {
  document.getElementById("valuePoints").innerHTML = t("hero.values")
    .map((item) => `<div class="value-card"><span></span><p>${item}</p></div>`)
    .join("");
}

function renderVisualSignals() {
  document.getElementById("visualSignals").innerHTML = t("visual.signals")
    .map((item, index) => `<div class="signal-card signal-${index}"><span>${item}</span><strong>${index === 0 ? "128" : index === 1 ? "34" : index === 2 ? "19" : "+22%"}</strong></div>`)
    .join("");
}

function renderSolutions() {
  document.getElementById("solutionsGrid").innerHTML = t("solutions.items")
    .map(
      (item, index) => `
        <article class="service-card reveal" style="--delay:${index * 70}ms">
          <div class="card-icon">${String(index + 1).padStart(2, "0")}</div>
          <h3>${item.title}</h3>
          <p>${item.description}</p>
          <ul>${item.features.map((feature) => `<li>${feature}</li>`).join("")}</ul>
        </article>
      `
    )
    .join("");
  observeReveals();
}

function renderComparison() {
  const blocks = [
    { title: t("comparison.withTitle"), items: t("comparison.with"), className: "positive" },
    { title: t("comparison.withoutTitle"), items: t("comparison.without"), className: "negative" },
  ];
  document.getElementById("comparisonGrid").innerHTML = blocks
    .map(
      (block) => `
        <article class="comparison-card ${block.className}">
          <h3>${block.title}</h3>
          <ul>${block.items.map((item) => `<li>${item}</li>`).join("")}</ul>
        </article>
      `
    )
    .join("");
}

function renderTrust() {
  document.getElementById("trustGrid").innerHTML = t("why.items")
    .map((item) => `<div class="trust-card"><span></span>${item}</div>`)
    .join("");
}

function renderIndustries() {
  document.getElementById("industryGrid").innerHTML = t("industries.items")
    .map(([title, description]) => `<article class="industry-card"><h3>${title}</h3><p>${description}</p></article>`)
    .join("");
}

function renderProcess() {
  document.getElementById("processSteps").innerHTML = t("process.steps")
    .map((step, index) => `<div class="process-step"><span>${index + 1}</span><p>${step}</p></div>`)
    .join("");
}

function renderCalculatorOptions() {
  setOptions(ids.region, t("pricing.regions"), state.region);
  setOptions(ids.calcRegion, t("pricing.regions"), state.region);
  setOptions(ids.formRegion, t("pricing.regions"), state.region);
  setOptions(ids.solutionType, t("pricing.solutions"), ids.solutionType.value || "chatbot");
  setOptions(ids.complexity, t("pricing.complexities"), ids.complexity.value || "basic");
  setOptions(ids.support, t("pricing.supportLevels"), ids.support.value || "basic");

  const selectedChannels = [...document.querySelectorAll("input[name='channels']:checked")].map((input) => input.value);
  ids.channelChecks.innerHTML = Object.entries(t("pricing.channelsList"))
    .map(([value, label]) => {
      const checked = selectedChannels.length ? selectedChannels.includes(value) : ["website", "whatsapp"].includes(value);
      return `<label class="check-pill"><input type="checkbox" name="channels" value="${value}" ${checked ? "checked" : ""} /><span>${label}</span></label>`;
    })
    .join("");

  document.querySelectorAll("input[name='channels']").forEach((input) => input.addEventListener("change", updatePrice));
  updatePrice();
}

function updatePrice() {
  const region = ids.calcRegion.value;
  const solution = ids.solutionType.value;
  const complexity = ids.complexity.value;
  const support = ids.support.value;
  const channels = document.querySelectorAll("input[name='channels']:checked").length;
  const regionPricing = pricing[region];

  const base = regionPricing.setup[solution] || regionPricing.setup.chatbot;
  const setup = Math.round(base * complexityMultiplier[complexity] + Math.max(0, channels - 1) * channelPrice[region]);
  const monthly = regionPricing.support[support] + Math.max(0, channels - 2) * Math.round(channelPrice[region] * 0.35);

  ids.setupPrice.textContent = `${t("pricing.starting")} ${formatPrice(setup, regionPricing)}`;
  ids.monthlyPrice.textContent = support === "none" ? formatPrice(0, regionPricing) : `${t("pricing.starting")} ${formatPrice(monthly, regionPricing)}`;
}

function formatPrice(value, regionPricing) {
  return `${regionPricing.currency}${value.toLocaleString("en-US")}${regionPricing.suffix}`;
}

function syncRegion(region) {
  state.region = region;
  localStorage.setItem("triple-ai-region", region);
  ids.region.value = region;
  ids.calcRegion.value = region;
  ids.formRegion.value = region;
  updatePrice();
}

function observeReveals() {
  const revealItems = document.querySelectorAll(".reveal:not(.is-visible)");

  if (!("IntersectionObserver" in window)) {
    revealItems.forEach((item) => item.classList.add("is-visible"));
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12 }
  );

  revealItems.forEach((item) => {
    item.classList.add("can-reveal");
    observer.observe(item);
  });
}

function bindEvents() {
  ids.language.value = state.language;
  ids.region.value = state.region;

  ids.language.addEventListener("change", (event) => {
    state.language = event.target.value;
    localStorage.setItem("triple-ai-language", state.language);
    applyTranslations();
  });

  ids.region.addEventListener("change", (event) => syncRegion(event.target.value));
  ids.calcRegion.addEventListener("change", (event) => syncRegion(event.target.value));
  ids.formRegion.addEventListener("change", (event) => syncRegion(event.target.value));
  [ids.solutionType, ids.complexity, ids.support].forEach((select) => select.addEventListener("change", updatePrice));

  ids.menuToggle.addEventListener("click", () => {
    const expanded = ids.menuToggle.getAttribute("aria-expanded") === "true";
    ids.menuToggle.setAttribute("aria-expanded", String(!expanded));
    ids.nav.classList.toggle("is-open");
    document.querySelector(".header-actions").classList.toggle("is-open");
  });

  document.querySelectorAll("a[href^='#']").forEach((anchor) => {
    anchor.addEventListener("click", () => {
      ids.menuToggle.setAttribute("aria-expanded", "false");
      ids.nav.classList.remove("is-open");
      document.querySelector(".header-actions").classList.remove("is-open");
    });
  });

  document.querySelector(".contact-form").addEventListener("submit", (event) => {
    event.preventDefault();
    const button = event.currentTarget.querySelector("button");
    const original = button.textContent;
    button.textContent = state.language === "ru" ? "Заявка подготовлена" : state.language === "ro" ? "Cerere pregatita" : state.language === "he" ? "הפנייה מוכנה" : "Request prepared";
    setTimeout(() => {
      button.textContent = original;
      event.currentTarget.reset();
      ids.formRegion.value = state.region;
    }, 1800);
  });
}

bindEvents();
applyTranslations();
observeReveals();
