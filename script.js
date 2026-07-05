var pricing = {
  moldova: {
    currency: "\u20ac",
    suffix: "",
    setup: { chatbot: 300, automation: 500, integrations: 400, voice: 700, full: 1200 },
    support: { none: 0, basic: 120, growth: 250, premium: 450 },
  },
  israel: {
    currency: "\u20aa",
    suffix: "",
    setup: { chatbot: 1800, automation: 3000, integrations: 2500, voice: 4500, full: 7600 },
    support: { none: 0, basic: 650, growth: 1200, premium: 2200 },
  },
  international: {
    currency: "\u20ac",
    suffix: "",
    setup: { chatbot: 600, automation: 900, integrations: 700, voice: 1200, full: 2200 },
    support: { none: 0, basic: 220, growth: 450, premium: 850 },
  },
};

var complexityMultiplier = { basic: 1, standard: 1.35, advanced: 1.85 };
var channelPrice = { moldova: 70, israel: 350, international: 120 };

var ids = {
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
  headerActions: document.querySelector(".header-actions"),
};

var state = {
  language: detectLanguage(),
  region: detectRegion(),
};

function getStored(key) {
  try {
    return window.localStorage ? localStorage.getItem(key) : null;
  } catch (error) {
    return null;
  }
}

function setStored(key, value) {
  try {
    if (window.localStorage) localStorage.setItem(key, value);
  } catch (error) {}
}

function detectLanguage() {
  var stored = getStored("triple-ai-language");
  if (stored && window.TRANSLATIONS && TRANSLATIONS[stored]) return stored;

  var language = (navigator.language || "en").slice(0, 2).toLowerCase();
  if (["en", "ro", "ru", "he"].indexOf(language) !== -1) return language;
  return "en";
}

function detectRegion() {
  var stored = getStored("triple-ai-region");
  if (stored && pricing[stored]) return stored;

  var timezone = "";
  try {
    timezone = Intl.DateTimeFormat().resolvedOptions().timeZone || "";
  } catch (error) {}

  var locale = ((navigator.language || "") + " " + timezone).toLowerCase();
  if (locale.indexOf("israel") !== -1 || locale.indexOf("jerusalem") !== -1 || locale.indexOf("-il") !== -1 || locale.slice(-2) === "he") return "israel";
  if (locale.indexOf("chisinau") !== -1 || locale.indexOf("moldova") !== -1 || locale.indexOf("-md") !== -1 || locale.indexOf("ro") !== -1) return "moldova";
  return "international";
}

function t(path) {
  var dictionary = window.TRANSLATIONS && TRANSLATIONS[state.language] ? TRANSLATIONS[state.language] : null;
  var value = dictionary;
  var parts = path.split(".");

  for (var i = 0; i < parts.length; i += 1) {
    if (!value || typeof value !== "object" || !(parts[i] in value)) return path;
    value = value[parts[i]];
  }

  return value;
}

function setOptions(select, options, selected) {
  if (!select || !options) return;

  var html = "";
  var keys = Object.keys(options);
  for (var i = 0; i < keys.length; i += 1) {
    var value = keys[i];
    html += '<option value="' + value + '"' + (value === selected ? " selected" : "") + ">" + options[value] + "</option>";
  }
  select.innerHTML = html;
}

function applyTranslations() {
  if (!window.TRANSLATIONS || !TRANSLATIONS[state.language]) {
    updatePrice();
    observeReveals();
    return;
  }

  var dictionary = TRANSLATIONS[state.language];
  document.documentElement.lang = state.language;
  document.documentElement.dir = state.language === "he" ? "rtl" : "ltr";
  document.title = dictionary.meta.title;

  var description = document.querySelector("meta[name='description']");
  if (description) description.setAttribute("content", dictionary.meta.description);

  var translatable = document.querySelectorAll("[data-i18n]");
  for (var i = 0; i < translatable.length; i += 1) {
    translatable[i].textContent = t(translatable[i].getAttribute("data-i18n"));
  }

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
  var items = t("hero.values");
  if (!items || !items.length) return;

  var html = "";
  for (var i = 0; i < items.length; i += 1) {
    html += '<div class="value-card"><span></span><p>' + items[i] + "</p></div>";
  }
  document.getElementById("valuePoints").innerHTML = html;
}

function renderVisualSignals() {
  var items = t("visual.signals");
  var values = ["128", "34", "19", "+22%"];
  if (!items || !items.length) return;

  var html = "";
  for (var i = 0; i < items.length; i += 1) {
    html += '<div class="signal-card signal-' + i + '"><span>' + items[i] + "</span><strong>" + values[i] + "</strong></div>";
  }
  document.getElementById("visualSignals").innerHTML = html;
}

function renderSolutions() {
  var items = t("solutions.items");
  if (!items || !items.length) return;

  var html = "";
  for (var i = 0; i < items.length; i += 1) {
    var item = items[i];
    var number = i + 1 < 10 ? "0" + (i + 1) : String(i + 1);
    html += '<article class="service-card reveal" style="--delay:' + i * 70 + 'ms">';
    html += '<div class="card-icon">' + number + "</div>";
    html += "<h3>" + item.title + "</h3>";
    html += "<p>" + item.description + "</p><ul>";
    for (var f = 0; f < item.features.length; f += 1) html += "<li>" + item.features[f] + "</li>";
    html += "</ul></article>";
  }
  document.getElementById("solutionsGrid").innerHTML = html;
  observeReveals();
}

function renderComparison() {
  var blocks = [
    { title: t("comparison.withTitle"), items: t("comparison.with"), className: "positive" },
    { title: t("comparison.withoutTitle"), items: t("comparison.without"), className: "negative" },
  ];
  var html = "";

  for (var i = 0; i < blocks.length; i += 1) {
    html += '<article class="comparison-card ' + blocks[i].className + '"><h3>' + blocks[i].title + "</h3><ul>";
    for (var j = 0; j < blocks[i].items.length; j += 1) html += "<li>" + blocks[i].items[j] + "</li>";
    html += "</ul></article>";
  }
  document.getElementById("comparisonGrid").innerHTML = html;
}

function renderTrust() {
  var items = t("why.items");
  if (!items || !items.length) return;

  var html = "";
  for (var i = 0; i < items.length; i += 1) html += '<div class="trust-card"><span></span>' + items[i] + "</div>";
  document.getElementById("trustGrid").innerHTML = html;
}

function renderIndustries() {
  var items = t("industries.items");
  if (!items || !items.length) return;

  var html = "";
  for (var i = 0; i < items.length; i += 1) html += '<article class="industry-card"><h3>' + items[i][0] + "</h3><p>" + items[i][1] + "</p></article>";
  document.getElementById("industryGrid").innerHTML = html;
}

function renderProcess() {
  var steps = t("process.steps");
  if (!steps || !steps.length) return;

  var html = "";
  for (var i = 0; i < steps.length; i += 1) html += '<div class="process-step"><span>' + (i + 1) + "</span><p>" + steps[i] + "</p></div>";
  document.getElementById("processSteps").innerHTML = html;
}

function renderCalculatorOptions() {
  var selectedSolution = ids.solutionType && ids.solutionType.value ? ids.solutionType.value : "chatbot";
  var selectedComplexity = ids.complexity && ids.complexity.value ? ids.complexity.value : "basic";
  var selectedSupport = ids.support && ids.support.value ? ids.support.value : "basic";

  setOptions(ids.region, t("pricing.regions"), state.region);
  setOptions(ids.calcRegion, t("pricing.regions"), state.region);
  setOptions(ids.formRegion, t("pricing.regions"), state.region);
  setOptions(ids.solutionType, t("pricing.solutions"), selectedSolution);
  setOptions(ids.complexity, t("pricing.complexities"), selectedComplexity);
  setOptions(ids.support, t("pricing.supportLevels"), selectedSupport);
  renderChannels();
  updatePrice();
}

function getSelectedChannels() {
  var selected = [];
  var checked = document.querySelectorAll("input[name='channels']:checked");
  for (var i = 0; i < checked.length; i += 1) selected.push(checked[i].value);
  return selected;
}

function renderChannels() {
  if (!ids.channelChecks) return;

  var options = t("pricing.channelsList");
  if (!options || typeof options !== "object") return;

  var selected = getSelectedChannels();
  var defaults = ["website", "whatsapp"];
  var keys = Object.keys(options);
  var html = "";

  for (var i = 0; i < keys.length; i += 1) {
    var value = keys[i];
    var checked = selected.length ? selected.indexOf(value) !== -1 : defaults.indexOf(value) !== -1;
    html += '<label class="check-pill"><input type="checkbox" name="channels" value="' + value + '"' + (checked ? " checked" : "") + " /><span>" + options[value] + "</span></label>";
  }

  ids.channelChecks.innerHTML = html;
  bindChannelEvents();
}

function bindChannelEvents() {
  var inputs = document.querySelectorAll("input[name='channels']");
  for (var i = 0; i < inputs.length; i += 1) inputs[i].addEventListener("change", updatePrice);
}

function updatePrice() {
  if (!ids.calcRegion || !ids.solutionType || !ids.complexity || !ids.support || !ids.setupPrice || !ids.monthlyPrice) return;

  var region = ids.calcRegion.value || state.region || "international";
  var solution = ids.solutionType.value || "chatbot";
  var complexity = ids.complexity.value || "basic";
  var support = ids.support.value || "basic";
  var channels = document.querySelectorAll("input[name='channels']:checked").length;
  var regionPricing = pricing[region] || pricing.international;
  var base = regionPricing.setup[solution] || regionPricing.setup.chatbot;
  var setup = Math.round(base * (complexityMultiplier[complexity] || 1) + Math.max(0, channels - 1) * (channelPrice[region] || channelPrice.international));
  var monthly = (regionPricing.support[support] || 0) + Math.max(0, channels - 2) * Math.round((channelPrice[region] || channelPrice.international) * 0.35);
  var starting = window.TRANSLATIONS ? t("pricing.starting") : "Starting from";

  ids.setupPrice.textContent = starting + " " + formatPrice(setup, regionPricing);
  ids.monthlyPrice.textContent = support === "none" ? formatPrice(0, regionPricing) : starting + " " + formatPrice(monthly, regionPricing);
}

function formatPrice(value, regionPricing) {
  return regionPricing.currency + Number(value).toLocaleString("en-US") + regionPricing.suffix;
}

function syncRegion(region) {
  state.region = region || "international";
  setStored("triple-ai-region", state.region);
  if (ids.region) ids.region.value = state.region;
  if (ids.calcRegion) ids.calcRegion.value = state.region;
  if (ids.formRegion) ids.formRegion.value = state.region;
  updatePrice();
}

function observeReveals() {
  var revealItems = document.querySelectorAll(".reveal:not(.is-visible)");

  if (!("IntersectionObserver" in window)) {
    for (var i = 0; i < revealItems.length; i += 1) revealItems[i].classList.add("is-visible");
    return;
  }

  var observer = new IntersectionObserver(function (entries) {
    for (var i = 0; i < entries.length; i += 1) {
      if (entries[i].isIntersecting) {
        entries[i].target.classList.add("is-visible");
        observer.unobserve(entries[i].target);
      }
    }
  }, { threshold: 0.12 });

  for (var j = 0; j < revealItems.length; j += 1) {
    revealItems[j].classList.add("can-reveal");
    observer.observe(revealItems[j]);
  }
}

function closeMenu() {
  if (!ids.menuToggle || !ids.nav || !ids.headerActions) return;
  ids.menuToggle.setAttribute("aria-expanded", "false");
  ids.nav.classList.remove("is-open");
  ids.headerActions.classList.remove("is-open");
}

function bindEvents() {
  if (ids.language) {
    ids.language.value = state.language;
    ids.language.addEventListener("change", function (event) {
      state.language = event.target.value;
      setStored("triple-ai-language", state.language);
      applyTranslations();
    });
  }

  if (ids.region) {
    ids.region.value = state.region;
    ids.region.addEventListener("change", function (event) { syncRegion(event.target.value); });
  }
  if (ids.calcRegion) ids.calcRegion.addEventListener("change", function (event) { syncRegion(event.target.value); });
  if (ids.formRegion) ids.formRegion.addEventListener("change", function (event) { syncRegion(event.target.value); });
  if (ids.solutionType) ids.solutionType.addEventListener("change", updatePrice);
  if (ids.complexity) ids.complexity.addEventListener("change", updatePrice);
  if (ids.support) ids.support.addEventListener("change", updatePrice);
  bindChannelEvents();

  if (ids.menuToggle && ids.nav && ids.headerActions) {
    ids.menuToggle.addEventListener("click", function () {
      var expanded = ids.menuToggle.getAttribute("aria-expanded") === "true";
      ids.menuToggle.setAttribute("aria-expanded", expanded ? "false" : "true");
      ids.nav.classList.toggle("is-open");
      ids.headerActions.classList.toggle("is-open");
    });
  }

  var anchors = document.querySelectorAll("a[href^='#']");
  for (var i = 0; i < anchors.length; i += 1) anchors[i].addEventListener("click", closeMenu);

  var form = document.querySelector(".contact-form");
  if (form) {
    form.addEventListener("submit", function (event) {
      event.preventDefault();
      var button = event.currentTarget.querySelector("button");
      if (!button) return;
      var original = button.textContent;
      button.textContent = "Request prepared";
      setTimeout(function () {
        button.textContent = original;
        event.currentTarget.reset();
        if (ids.formRegion) ids.formRegion.value = state.region;
      }, 1800);
    });
  }
}

bindEvents();
applyTranslations();
observeReveals();
