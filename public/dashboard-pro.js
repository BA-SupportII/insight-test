const defaultSettings = {
  fontScale: 1,
  negativeColor: "#f87171",
  theme: "midnight",
};

const THEMES = {
  midnight: {
    label: "Midnight",
    cssVars: {
      "--bg-gradient":
        "linear-gradient(135deg, #151924 0%, #111727 50%, #0d101a 100%)",
      "--glow-gradient":
        "radial-gradient(circle at 20% 20%, rgba(56, 189, 248, 0.25), transparent 60%)",
      "--topbar-bg": "rgba(18, 24, 37, 0.9)",
      "--bottombar-bg": "rgba(12, 16, 26, 0.9)",
      "--surface-panel": "rgba(22, 28, 41, 0.9)",
      "--surface-card": "rgba(16, 21, 32, 0.92)",
      "--surface-card-border": "rgba(94, 234, 212, 0.12)",
      "--surface-table": "rgba(13, 17, 26, 0.92)",
      "--surface-table-border": "rgba(59, 130, 246, 0.32)",
      "--surface-hover": "rgba(59, 130, 246, 0.12)",
      "--header-bg": "rgba(20, 25, 40, 0.95)",
      "--button-primary": "#38bdf8",
      "--button-primary-hover": "#0ea5e9",
      "--button-primary-contrast": "#0f172a",
      "--button-secondary": "rgba(59, 130, 246, 0.16)",
      "--button-secondary-border": "rgba(59, 130, 246, 0.32)",
      "--badge-bg": "rgba(30, 41, 59, 0.6)",
      "--badge-border": "rgba(94, 234, 212, 0.3)",
      "--text-primary": "#e2eafc",
      "--text-secondary": "#94a3c0",
    },
  },
  aurora: {
    label: "Aurora",
    cssVars: {
      "--bg-gradient":
        "linear-gradient(135deg, #06111c 0%, #0b2b37 40%, #133b40 100%)",
      "--glow-gradient":
        "radial-gradient(circle at 80% 15%, rgba(94, 234, 212, 0.35), transparent 55%)",
      "--topbar-bg": "rgba(11, 31, 45, 0.92)",
      "--bottombar-bg": "rgba(8, 24, 35, 0.9)",
      "--surface-panel": "rgba(13, 36, 48, 0.94)",
      "--surface-card": "rgba(9, 26, 38, 0.96)",
      "--surface-card-border": "rgba(56, 189, 248, 0.25)",
      "--surface-table": "rgba(7, 20, 31, 0.94)",
      "--surface-table-border": "rgba(59, 130, 246, 0.28)",
      "--surface-hover": "rgba(94, 234, 212, 0.12)",
      "--header-bg": "rgba(8, 30, 45, 0.96)",
      "--button-primary": "#5eead4",
      "--button-primary-hover": "#2dd4bf",
      "--button-primary-contrast": "#052f2b",
      "--button-secondary": "rgba(56, 189, 248, 0.18)",
      "--button-secondary-border": "rgba(125, 211, 252, 0.38)",
      "--badge-bg": "rgba(56, 189, 248, 0.16)",
      "--badge-border": "rgba(125, 211, 252, 0.4)",
      "--text-primary": "#e0f7fa",
      "--text-secondary": "#a1d4f5",
    },
  },
  ember: {
    label: "Ember",
    cssVars: {
      "--bg-gradient":
        "linear-gradient(135deg, #24110f 0%, #311412 50%, #1a0d0b 100%)",
      "--glow-gradient":
        "radial-gradient(circle at 25% 15%, rgba(249, 115, 22, 0.3), transparent 60%)",
      "--topbar-bg": "rgba(40, 18, 18, 0.92)",
      "--bottombar-bg": "rgba(24, 12, 12, 0.92)",
      "--surface-panel": "rgba(37, 17, 17, 0.94)",
      "--surface-card": "rgba(28, 13, 13, 0.95)",
      "--surface-card-border": "rgba(248, 113, 113, 0.28)",
      "--surface-table": "rgba(22, 10, 10, 0.94)",
      "--surface-table-border": "rgba(249, 115, 22, 0.3)",
      "--surface-hover": "rgba(249, 115, 22, 0.12)",
      "--header-bg": "rgba(32, 14, 14, 0.95)",
      "--button-primary": "#f97316",
      "--button-primary-hover": "#fb923c",
      "--button-primary-contrast": "#1f0a07",
      "--button-secondary": "rgba(249, 115, 22, 0.18)",
      "--button-secondary-border": "rgba(249, 115, 22, 0.4)",
      "--badge-bg": "rgba(249, 115, 22, 0.16)",
      "--badge-border": "rgba(248, 113, 113, 0.38)",
      "--text-primary": "#ffe7d6",
      "--text-secondary": "#fca5a5",
    },
  },
  horizon: {
    label: "Horizon",
    cssVars: {
      "--bg-gradient":
        "linear-gradient(135deg, #0f172a 0%, #1f2937 45%, #0f172a 100%)",
      "--glow-gradient":
        "radial-gradient(circle at 70% 80%, rgba(255, 184, 108, 0.28), transparent 55%)",
      "--topbar-bg": "rgba(23, 31, 53, 0.92)",
      "--bottombar-bg": "rgba(14, 20, 35, 0.92)",
      "--surface-panel": "rgba(20, 28, 46, 0.94)",
      "--surface-card": "rgba(17, 25, 43, 0.95)",
      "--surface-card-border": "rgba(251, 191, 36, 0.25)",
      "--surface-table": "rgba(13, 19, 33, 0.94)",
      "--surface-table-border": "rgba(251, 191, 36, 0.25)",
      "--surface-hover": "rgba(251, 191, 36, 0.12)",
      "--header-bg": "rgba(20, 28, 48, 0.96)",
      "--button-primary": "#fbbf24",
      "--button-primary-hover": "#f59e0b",
      "--button-primary-contrast": "#1f2937",
      "--button-secondary": "rgba(59, 130, 246, 0.18)",
      "--button-secondary-border": "rgba(147, 197, 253, 0.35)",
      "--badge-bg": "rgba(59, 130, 246, 0.16)",
      "--badge-border": "rgba(147, 197, 253, 0.35)",
      "--text-primary": "#f8fafc",
      "--text-secondary": "#cbd5f5",
    },
  },
  neo: {
    label: "Neo Glow",
    cssVars: {
      "--bg-gradient":
        "linear-gradient(135deg, #020617 0%, #0f172a 40%, #1e1b4b 100%)",
      "--glow-gradient":
        "radial-gradient(circle at 15% 85%, rgba(147, 51, 234, 0.35), transparent 55%)",
      "--topbar-bg": "rgba(17, 23, 54, 0.94)",
      "--bottombar-bg": "rgba(10, 16, 38, 0.94)",
      "--surface-panel": "rgba(12, 18, 43, 0.95)",
      "--surface-card": "rgba(9, 14, 35, 0.97)",
      "--surface-card-border": "rgba(168, 85, 247, 0.32)",
      "--surface-table": "rgba(6, 10, 26, 0.95)",
      "--surface-table-border": "rgba(59, 130, 246, 0.35)",
      "--surface-hover": "rgba(168, 85, 247, 0.16)",
      "--header-bg": "rgba(12, 18, 42, 0.97)",
      "--button-primary": "#a855f7",
      "--button-primary-hover": "#c084fc",
      "--button-primary-contrast": "#0f172a",
      "--button-secondary": "rgba(59, 130, 246, 0.18)",
      "--button-secondary-border": "rgba(129, 140, 248, 0.35)",
      "--badge-bg": "rgba(129, 140, 248, 0.2)",
      "--badge-border": "rgba(196, 181, 253, 0.4)",
      "--text-primary": "#ede9fe",
      "--text-secondary": "#c4b5fd",
    },
  },
};

const MONTH_METADATA = [
  { index: 0, name: "January", patterns: [/\bjanuary\b/, /\bjan\b/] },
  { index: 1, name: "February", patterns: [/\bfebruary\b/, /\bfeb\b/] },
  { index: 2, name: "March", patterns: [/\bmarch\b/, /\bmar\b/] },
  { index: 3, name: "April", patterns: [/\bapril\b/, /\bapr\b/] },
  { index: 4, name: "May", patterns: [/\bmay\b/] },
  { index: 5, name: "June", patterns: [/\bjune\b/, /\bjun\b/] },
  { index: 6, name: "July", patterns: [/\bjuly\b/, /\bjul\b/] },
  { index: 7, name: "August", patterns: [/\baugust\b/, /\baug\b/] },
  { index: 8, name: "September", patterns: [/\bseptember\b/, /\bsept?\b/] },
  { index: 9, name: "October", patterns: [/\boctober\b/, /\boct\b/] },
  { index: 10, name: "November", patterns: [/\bnovember\b/, /\bnov\b/] },
  { index: 11, name: "December", patterns: [/\bdecember\b/, /\bdec\b/] },
];

const STORAGE_KEYS = {
  snapshot: "dashboard:lastSnapshot",
  sort: "dashboard:sortOrder",
  assistantMode: "dashboard:assistantMode",
  assistantHistory: "dashboard:assistantHistory",
};

const CACHE_API = {
  save: '/api/dashboard/cache/save',
  load: '/api/dashboard/cache/load',
  list: '/api/dashboard/cache/list',
};

const state = {
  selects: {},
  datePicker: null,
  searchButton: null,
  searchSpinner: null,
  lastGroups: [],
  currentGroupsRaw: [],
  cachedSnapshot: null,
  snapshotApplied: false,
  sortOrder: "desc",
  pendingUrlFilters: null,
  lastFilters: null,
  options: {
    brandGroups: [],
    brands: [],
    currencies: [],
    brandLookup: new Map(),
    groupToBrands: new Map(),
  },
  settings: { ...defaultSettings },
  settingsPanel: {
    overlay: null,
    fontDisplay: null,
    colorPicker: null,
    themeContainer: null,
  },
  exportView: {
    overlay: null,
    tableBody: null,
    trigger: null,
    close: null,
    open: false,
    lastTrigger: null,
    download: null,
  },
  assistant: {
    open: true,
    mode: "quick",
    messages: [],
    elements: {
      panel: null,
      messages: null,
      input: null,
      send: null,
      modeLabel: null,
      modeDescriptor: null,
      toggle: null,
      quickButton: null,
      verifiedButton: null,
      hints: null,
      status: null,
    },
    downloads: new Map(),
    busy: false,
    counter: 0,
  },
};

const numberFormatter = new Intl.NumberFormat("en-US", {
  maximumFractionDigits: 2,
});
const percentFormatter = new Intl.NumberFormat("en-US", {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

async function getCacheMonthKey(startDate) {
  // If startDate is provided (e.g., "2025-11-15"), extract year-month from it
  // Otherwise fallback to current date
  let date;
  if (startDate && typeof startDate === 'string') {
    // Parse date string format: "YYYY-MM-DD"
    const parts = startDate.split('-');
    if (parts.length >= 2) {
      const year = parseInt(parts[0], 10);
      const month = parseInt(parts[1], 10);
      if (!isNaN(year) && !isNaN(month)) {
        return { year, month };
      }
    }
  }
  // Fallback to current date
  date = new Date();
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  return { year, month };
}

function normalizeAllToBrand(obj) {
  if (obj === null || obj === undefined) return obj;
  if (typeof obj !== 'object') return obj;
  
  if (Array.isArray(obj)) {
    return obj.map(item => normalizeAllToBrand(item));
  }
  
  const normalized = {};
  for (const [key, value] of Object.entries(obj)) {
    if (typeof value === 'object') {
      normalized[key] = normalizeAllToBrand(value);
    } else {
      normalized[key] = value;
    }
  }
  
  // If brandGroup is "All", set it to match the brand value
  if (normalized.brandGroup === 'All' && normalized.brand) {
    normalized.brandGroup = normalized.brand;
  }
  
  return normalized;
}

async function saveCacheSnapshot(groups, filters = {}) {
  if (!Array.isArray(groups) || !groups.length) return;
  try {
    const { year, month } = await getCacheMonthKey(filters.startDate);
    const brandGroup = ensureArray(filters.brandGroups || [])?.[0] || 'all';
    const brand = ensureArray(filters.brands || [])?.[0] || 'all';
    const currency = ensureArray(filters.currencies || [])?.[0] || 'all';
    
    const normalizedGroups = normalizeAllToBrand(groups);
    const cacheData = {
      timestamp: Date.now(),
      filters,
      groups: normalizedGroups,
    };
    
    const response = await fetch(CACHE_API.save, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({
        year,
        month,
        brandGroup,
        brand,
        currency,
        data: cacheData,
      }),
    });
    
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const result = await response.json();
    if (result.ok) {
      console.log(`[Cache] Saved to disk: ${year}-${String(month).padStart(2, '0')}/${brandGroup}__${brand}__${currency}.json`);
    } else {
      console.warn('[Cache] Failed to save:', result.error);
    }
  } catch (err) {
    console.warn('[Cache] Failed to save snapshot to disk', err);
  }
}

async function loadCacheSnapshot() {
  try {
    const { year, month } = await getCacheMonthKey();
    const response = await fetch(`${CACHE_API.load}?year=${year}&month=${month}`);
    if (!response.ok) return null;
    const result = await response.json();
    if (!result.success || !result.data?.groups) return null;
    return result.data;
  } catch (err) {
    console.warn('[Cache] Failed to load snapshot from disk', err);
    return null;
  }
}

async function listCachedItems() {
  try {
    const { year, month } = await getCacheMonthKey();
    const response = await fetch(`${CACHE_API.list}?year=${year}&month=${month}`);
    if (!response.ok) return [];
    const result = await response.json();
    return result.success ? result.entries || [] : [];
  } catch (err) {
    console.warn('[Cache] Failed to list items', err);
    return [];
  }
}

function refreshIcons() {
  if (window.lucide?.createIcons) window.lucide.createIcons();
}

function setStatus(message, tone = "info") {
  const el = document.getElementById("statusMessage");
  if (!el) return;
  if (!message) {
    el.classList.add("hidden");
    return;
  }
  const toneClass = {
    info: "status-info",
    success: "status-success",
    error: "status-error",
  };
  el.className = `status-banner ${toneClass[tone] || toneClass.info}`;
  el.textContent = message;
  el.classList.remove("hidden");
}

function displayText(value) {
  if (value === null || value === undefined) return "--";
  const trimmed = String(value).trim();
  return trimmed.length ? trimmed : "--";
}

function rawValue(value) {
  if (value === null || value === undefined) return "";
  const trimmed = String(value).trim();
  return trimmed.length ? trimmed : "";
}

function parseDateString(value) {
  if (!value) return null;
  const parts = value.split("-").map(Number);
  if (parts.length !== 3 || parts.some((part) => Number.isNaN(part)))
    return null;
  return new Date(parts[0], parts[1] - 1, parts[2]);
}

function assistantDetectMonth(question) {
  const lower = question.toLowerCase();
  for (const month of MONTH_METADATA) {
    if (month.patterns.some((pattern) => pattern.test(lower))) {
      return month;
    }
  }
  return null;
}

function assistantNeedsExpandedRange(question, filters) {
  const lower = question.toLowerCase();
  const hasFrom = /\b(from|since)\b/.test(lower);
  const hasUntilNow =
    /\b(until|till|up to|through)\s+now\b/.test(lower) ||
    /\bto\s+now\b/.test(lower);
  const mentionsNow = hasUntilNow || /\bnow\b/.test(lower);
  const rangeKeywords =
    /(year to date|ytd|month to date|mtd|quarter|qtd|past \d+\s+(day|days|week|weeks|month|months|year|years)|last \d+\s+(day|days|week|weeks|month|months|year|years)|entire month|whole month|full year)/;
  const monthMention = assistantDetectMonth(lower);
  const wantsExtendedRange = Boolean(
    (monthMention && hasFrom) || hasUntilNow || rangeKeywords.test(lower),
  );

  if (!wantsExtendedRange) {
    return { needsRange: false };
  }

  const hasFilters = Boolean(filters.startDate && filters.endDate);
  const singleDay = hasFilters && filters.startDate === filters.endDate;
  if (!hasFilters || singleDay) {
    return {
      needsRange: true,
      reason: "insufficient-range",
      month: monthMention?.index ?? null,
    };
  }

  const startDate = parseDateString(filters.startDate);
  const endDate = parseDateString(filters.endDate);
  if (!startDate || !endDate) {
    return {
      needsRange: true,
      reason: "insufficient-range",
      month: monthMention?.index ?? null,
    };
  }

  if (monthMention) {
    const monthIndex = monthMention.index;
    if (startDate.getMonth() > monthIndex || endDate.getMonth() < monthIndex) {
      return {
        needsRange: true,
        reason: "month-outside-range",
        month: monthIndex,
      };
    }
  }

  if (mentionsNow) {
    const todayIso = isoDate(new Date());
    if (filters.endDate !== todayIso) {
      return {
        needsRange: true,
        reason: "until-now",
        month: monthMention?.index ?? null,
      };
    }
  }

  return { needsRange: false };
}

function parseUrlFilters() {
  const params = new URLSearchParams(window.location.search);
  if (!params.toString()) return null;

  const parseList = (key) => {
    const value = params.get(key);
    if (!value) return [];
    return value
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean);
  };

  const filters = {
    startDate: rawValue(params.get("start")),
    endDate: rawValue(params.get("end")),
    brandGroups: parseList("brandGroups"),
    brands: parseList("brands"),
    currencies: parseList("currencies"),
  };

  const sort = rawValue(params.get("sort"));
  if (sort === "asc" || sort === "desc") {
    filters.sortOrder = sort;
  }

  const mode = rawValue(params.get("assistant"));
  if (mode === "quick" || mode === "verified") {
    filters.assistantMode = mode;
  }

  const hasValues =
    filters.startDate ||
    filters.endDate ||
    filters.brandGroups.length ||
    filters.brands.length ||
    filters.currencies.length ||
    filters.sortOrder ||
    filters.assistantMode;

  return hasValues ? filters : null;
}

function updateShareableUrl(filters = {}) {
  try {
    const params = new URLSearchParams();
    if (filters.startDate) params.set("start", filters.startDate);
    if (filters.endDate) params.set("end", filters.endDate);
    if (filters.brandGroups?.length)
      params.set("brandGroups", filters.brandGroups.join(","));
    if (filters.brands?.length) params.set("brands", filters.brands.join(","));
    if (filters.currencies?.length)
      params.set("currencies", filters.currencies.join(","));
    if (state.sortOrder) params.set("sort", state.sortOrder);
    if (state.assistant?.mode && state.assistant.mode !== "quick") {
      params.set("assistant", state.assistant.mode);
    }
    const query = params.toString();
    const nextUrl = query
      ? `${window.location.pathname}?${query}`
      : window.location.pathname;
    window.history.replaceState(null, "", nextUrl);
  } catch (err) {
    console.warn("Failed to update shareable URL", err);
  }
}

async function applyUrlFilters() {
  const filters = state.pendingUrlFilters;
  if (!filters) return null;

  if (filters.sortOrder && filters.sortOrder !== state.sortOrder) {
    state.sortOrder = filters.sortOrder;
    try {
      localStorage.setItem(STORAGE_KEYS.sort, state.sortOrder);
    } catch {
      // ignore storage errors
    }
  }

  const setValues = (select, values) => {
    if (!select || !Array.isArray(values) || !values.length) return false;
    try {
      select.setValue(values, true);
      return true;
    } catch (err) {
      console.warn("Failed to apply select values from URL", err);
      return false;
    }
  };

  if (filters.brandGroups?.length) {
    setValues(state.selects.brandGroup, filters.brandGroups);
  } else if (state.selects.brandGroup) {
    state.selects.brandGroup.clear(true);
  }

  refreshBrandOptionsForGroups();

  if (filters.brands?.length) {
    setValues(state.selects.brand, filters.brands);
  } else if (state.selects.brand) {
    state.selects.brand.clear(true);
  }

  refreshCurrencyOptions();

  if (filters.currencies?.length) {
    setValues(state.selects.currency, filters.currencies);
  } else if (state.selects.currency) {
    state.selects.currency.clear(true);
  }

  if (filters.startDate && filters.endDate) {
    state.datePicker?.setDate([filters.startDate, filters.endDate], false);
  } else if (filters.startDate) {
    state.datePicker?.setDate([filters.startDate], false);
  }

  state.lastFilters = filters;
  if (filters.assistantMode) {
    assistantSetMode(filters.assistantMode, { announce: false });
  }
  state.pendingUrlFilters = null;
  return filters;
}

function normalizeGroupName(value) {
  return rawValue(value).toLowerCase();
}

function ensureArray(value) {
  if (value == null || value === "") return [];
  return Array.isArray(value) ? value : [value];
}

function formatNumber(value) {
  if (value === null || value === undefined || Number.isNaN(value)) return "--";
  return numberFormatter.format(Number(value));
}

function formatPercent(value) {
  if (value === null || value === undefined || !Number.isFinite(value))
    return "--";
  return `${percentFormatter.format(value)}%`;
}

function renderNumberCell(value) {
  const formatted = formatNumber(value);
  if (formatted === "--") return formatted;
  return Number(value) < 0
    ? `<span class="text-negative">${formatted}</span>`
    : formatted;
}

function renderPercentCell(value) {
  const formatted = formatPercent(value);
  if (formatted === "--") return formatted;
  return Number(value) < 0
    ? `<span class="text-negative">${formatted}</span>`
    : formatted;
}

function buildExportRows(groups) {
  const rows = [];
  (groups || []).forEach((group) => {
    const groupName = displayText(group?.brandGroup);
    const currencies = Array.isArray(group?.currencies) ? group.currencies : [];

    if (!currencies.length) {
      rows.push({
        brandGroup: groupName,
        brand: "All Brands",
        currency: "--",
        metrics: group?.metrics || {},
      });
      return;
    }

    currencies.forEach((currency) => {
      const currencyCode = displayText(currency?.currency);
      const brands = Array.isArray(currency?.brands) ? currency.brands : [];

      if (brands.length) {
        brands.forEach((brand) => {
          rows.push({
            brandGroup: groupName,
            brand: displayText(brand?.brand),
            currency: currencyCode,
            metrics: brand?.metrics || {},
          });
        });
      } else {
        rows.push({
          brandGroup: groupName,
          brand: "All Brands",
          currency: currencyCode,
          metrics: currency?.metrics || {},
        });
      }
    });
  });
  return rows;
}

const EXPORT_CSV_COLUMNS = [
  { header: "Brand Group", type: "text", getter: (row) => row.brandGroup },
  { header: "Brand", type: "text", getter: (row) => row.brand },
  { header: "Currency", type: "text", getter: (row) => row.currency },
  {
    header: "SignUp Player",
    type: "number",
    getter: (row) => row.metrics.signUpPlayer,
  },
  {
    header: "FTD Player",
    type: "number",
    getter: (row) => row.metrics.ftdPlayer,
  },
  {
    header: "Total Deposit",
    type: "number",
    getter: (row) => row.metrics.totalDeposit,
  },
  {
    header: "Total Withdraw",
    type: "number",
    getter: (row) => row.metrics.totalWithdraw,
  },
  {
    header: "Net Deposit",
    type: "number",
    getter: (row) => row.metrics.netDeposit,
  },
  {
    header: "Ave DEP",
    type: "number",
    getter: (row) => row.metrics.averageDeposit,
  },
  {
    header: "Net Ratio %",
    type: "percent",
    getter: (row) => row.metrics.netRatio,
  },
  { header: "Bonus", type: "number", getter: (row) => row.metrics.bonus },
  {
    header: "Bonus %",
    type: "percent",
    getter: (row) => row.metrics.bonusRatio,
  },
  {
    header: "Ave Bonus / Player",
    type: "number",
    getter: (row) => row.metrics.averageBonusPerPlayer,
  },
  {
    header: "Unique Player",
    type: "number",
    getter: (row) => row.metrics.uniquePlayer,
  },
  { header: "Turnover", type: "number", getter: (row) => row.metrics.turnover },
  {
    header: "Ave Turnover",
    type: "number",
    getter: (row) => row.metrics.averageTurnover,
  },
  { header: "Ave WR", type: "number", getter: (row) => row.metrics.averageWr },
  {
    header: "Gross Revenue %",
    type: "percent",
    getter: (row) => row.metrics.grossRevenuePct,
  },
  {
    header: "NGR per Player",
    type: "number",
    getter: (row) => row.metrics.ngrPerPlayer,
  },
  {
    header: "Net per Player",
    type: "number",
    getter: (row) => row.metrics.netPerPlayer,
  },
  {
    header: "Net Win/Loss",
    type: "number",
    getter: (row) => row.metrics.netWinLoss,
  },
  {
    header: "Retention Rate %",
    type: "percent",
    getter: (row) => row.metrics.retentionRate,
  },
  {
    header: "FTD Conversion %",
    type: "percent",
    getter: (row) => row.metrics.ftdConversionRate,
  },
  {
    header: "Company Win/Loss",
    type: "number",
    getter: (row) => row.metrics.companyWinLoss,
  },
];

function formatCsvText(value) {
  if (value === null || value === undefined) return "";
  const text = String(value).trim();
  return text === "--" ? "" : text;
}

function formatCsvNumber(value) {
  const num = Number(value);
  if (!Number.isFinite(num)) return "";
  return Number.isInteger(num) ? String(num) : num.toFixed(2);
}

function formatCsvPercent(value) {
  const num = Number(value);
  if (!Number.isFinite(num)) return "";
  return `${percentFormatter.format(num)}%`;
}

function csvEscape(value) {
  if (value === null || value === undefined) return "";
  const text = String(value);
  if (/[",\r\n]/.test(text)) {
    return `"${text.replace(/"/g, '""')}"`;
  }
  return text;
}

function downloadExportCsv() {
  const groups = state.lastGroups;
  if (!Array.isArray(groups) || !groups.length) {
    setStatus("Load metrics before exporting.", "info");
    return;
  }

  const rows = buildExportRows(groups);
  if (!rows.length) {
    setStatus("No metrics available for export.", "info");
    return;
  }

  const csvLines = [];
  csvLines.push(EXPORT_CSV_COLUMNS.map((col) => csvEscape(col.header)));

  rows.forEach((row) => {
    const values = EXPORT_CSV_COLUMNS.map((col) => {
      const raw = typeof col.getter === "function" ? col.getter(row) : "";
      if (col.type === "number") return csvEscape(formatCsvNumber(raw));
      if (col.type === "percent") return csvEscape(formatCsvPercent(raw));
      return csvEscape(formatCsvText(raw));
    });
    csvLines.push(values);
  });

  const csvContent = csvLines.map((line) => line.join(",")).join("\r\n");
  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const fileName = `dashboard-export-${new Date().toISOString().slice(0, 10)}.csv`;

  const link = document.createElement("a");
  link.href = url;
  link.download = fileName;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);

  setTimeout(() => URL.revokeObjectURL(url), 0);
  setStatus("CSV export generated.", "success");
}

function updateExportTable(groups = state.lastGroups) {
  const tbody = state.exportView.tableBody;
  if (!tbody) return;

  const rows = buildExportRows(groups);
  if (!rows.length) {
    tbody.innerHTML =
      '<tr><td class="export-empty" colspan="24">Run a search to populate the export view.</td></tr>';
    if (state.exportView.download) state.exportView.download.disabled = true;
    return;
  }
  if (state.exportView.download) state.exportView.download.disabled = false;

  const html = rows
    .map(
      (row) => `
      <tr>
        <td>${escapeHtml(row.brandGroup)}</td>
        <td>${escapeHtml(row.brand)}</td>
        <td>${escapeHtml(row.currency)}</td>
        <td class="export-cell-number">${renderNumberCell(row.metrics.signUpPlayer)}</td>
        <td class="export-cell-number">${renderNumberCell(row.metrics.ftdPlayer)}</td>
        <td class="export-cell-number">${renderNumberCell(row.metrics.totalDeposit)}</td>
        <td class="export-cell-number">${renderNumberCell(row.metrics.totalWithdraw)}</td>
        <td class="export-cell-number">${renderNumberCell(row.metrics.netDeposit)}</td>
        <td class="export-cell-number">${renderNumberCell(row.metrics.averageDeposit)}</td>
        <td class="export-cell-number">${renderPercentCell(row.metrics.netRatio)}</td>
        <td class="export-cell-number">${renderNumberCell(row.metrics.bonus)}</td>
        <td class="export-cell-number">${renderPercentCell(row.metrics.bonusRatio)}</td>
        <td class="export-cell-number">${renderNumberCell(row.metrics.averageBonusPerPlayer)}</td>
        <td class="export-cell-number">${renderNumberCell(row.metrics.uniquePlayer)}</td>
        <td class="export-cell-number">${renderNumberCell(row.metrics.turnover)}</td>
        <td class="export-cell-number">${renderNumberCell(row.metrics.averageTurnover)}</td>
        <td class="export-cell-number">${renderNumberCell(row.metrics.averageWr)}</td>
        <td class="export-cell-number">${renderPercentCell(row.metrics.grossRevenuePct)}</td>
        <td class="export-cell-number">${renderNumberCell(row.metrics.ngrPerPlayer)}</td>
        <td class="export-cell-number">${renderNumberCell(row.metrics.netPerPlayer)}</td>
        <td class="export-cell-number">${renderNumberCell(row.metrics.netWinLoss)}</td>
        <td class="export-cell-number">${renderPercentCell(row.metrics.retentionRate)}</td>
        <td class="export-cell-number">${renderPercentCell(row.metrics.ftdConversionRate)}</td>
        <td class="export-cell-number">${renderNumberCell(row.metrics.companyWinLoss)}</td>
      </tr>
    `,
    )
    .join("");
  tbody.innerHTML = html;
}

function toggleExportOverlay(show) {
  const view = state.exportView;
  const overlay = view.overlay;
  if (!overlay) return;
  const shouldShow = typeof show === "boolean" ? show : !view.open;
  if (shouldShow === view.open) return;

  overlay.classList.toggle("show", shouldShow);
  overlay.setAttribute("aria-hidden", shouldShow ? "false" : "true");
  view.open = shouldShow;

  if (shouldShow) {
    view.lastTrigger =
      document.activeElement instanceof HTMLElement
        ? document.activeElement
        : null;
    updateExportTable();
    refreshIcons();
    requestAnimationFrame(() => {
      view.close?.focus();
    });
  } else if (view.lastTrigger?.focus) {
    view.lastTrigger.focus();
  }
}

function isoDate(date) {
  const d = new Date(date);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function todayStart() {
  const now = new Date();
  now.setHours(0, 0, 0, 0);
  return now;
}

function getPresetRange(preset) {
  const start = new Date();
  const end = new Date(start);
  switch (preset) {
    case "this-month":
      start.setDate(1);
      end.setMonth(end.getMonth() + 1, 0);
      break;
    case "last-month":
      start.setDate(1);
      start.setMonth(start.getMonth() - 1);
      end.setDate(0);
      break;
    case "prev-month": {
      // Previous month = 2 months ago
      const current = new Date();
      const prevMonth = new Date(
        current.getFullYear(),
        current.getMonth() - 2,
        1,
      );
      start.setFullYear(prevMonth.getFullYear(), prevMonth.getMonth(), 1);
      const lastDay = new Date(
        prevMonth.getFullYear(),
        prevMonth.getMonth() + 1,
        0,
      );
      end.setFullYear(
        lastDay.getFullYear(),
        lastDay.getMonth(),
        lastDay.getDate(),
      );
      break;
    }
    default:
      break;
  }
  return [start, end];
}

async function fetchJSON(url, options) {
  const response = await fetch(url, options);
  if (!response.ok) {
    const text = await response.text().catch(() => "");
    throw new Error(`Request failed: ${response.status} ${text}`);
  }
  return response.json();
}

async function fetchMetricsData(params) {
  const queryString =
    params instanceof URLSearchParams
      ? params.toString()
      : new URLSearchParams(params).toString();
  const data = await fetchJSON(`/api/dashboard/metrics?${queryString}`);
  return Array.isArray(data.groups) ? data.groups : [];
}

function setLoading(loading, { manual = false } = {}) {
  const tbody = document.getElementById("tableBody");
  if (manual && state.searchButton && state.searchSpinner) {
    state.searchButton.disabled = loading;
    state.searchButton.classList.toggle("opacity-70", loading);
    state.searchSpinner.classList.toggle("show", loading);
  }
  if (loading && tbody) {
    tbody.innerHTML =
      '<tr><td colspan="23" class="text-center py-12 text-slate-400">Loading metrics...</td></tr>';
  }
}

function renderSummary(groups) {
  const depositEl = document.querySelector('[data-summary="deposit"]');
  const netEl = document.querySelector('[data-summary="net"]');
  const turnoverEl = document.querySelector('[data-summary="turnover"]');
  const topBrandEl = document.querySelector('[data-summary="topBrand"]');
  const infoDeposit = document.querySelector('[data-summary-info="deposit"]');
  const infoNet = document.querySelector('[data-summary-info="net"]');
  const infoTurnover = document.querySelector('[data-summary-info="turnover"]');
  const infoTop = document.querySelector('[data-summary-info="topBrand"]');

  if (!Array.isArray(groups) || !groups.length) {
    [depositEl, netEl, turnoverEl, topBrandEl].forEach(
      (el) => el && (el.textContent = "--"),
    );
    [infoDeposit, infoNet, infoTurnover, infoTop].forEach(
      (el) => el && (el.textContent = "Awaiting search..."),
    );
    return;
  }

  const totals = groups.reduce(
    (acc, group) => ({
      deposit: acc.deposit + (Number(group.metrics.totalDeposit) || 0),
      net: acc.net + (Number(group.metrics.netDeposit) || 0),
      turnover: acc.turnover + (Number(group.metrics.turnover) || 0),
    }),
    { deposit: 0, net: 0, turnover: 0 },
  );

  const allBrands = flattenBrandNodes(groups);
  const topBrand = allBrands.length
    ? allBrands.reduce(
        (best, current) =>
          Number(current.metrics?.netDeposit) >
          Number(best?.metrics?.netDeposit || -Infinity)
            ? current
            : best,
        allBrands[0],
      )
    : null;

  if (depositEl) depositEl.textContent = formatNumber(totals.deposit);
  if (netEl) netEl.textContent = formatNumber(totals.net);
  if (turnoverEl) turnoverEl.textContent = formatNumber(totals.turnover);
  if (topBrandEl) {
    topBrandEl.textContent = topBrand
      ? `${displayText(topBrand.brand)} (${displayText(topBrand.currency)})`
      : "--";
  }

  if (infoDeposit) infoDeposit.textContent = "Across all groups";
  if (infoNet) infoNet.textContent = "After withdrawals";
  if (infoTurnover) infoTurnover.textContent = "Total wagering volume";
  if (infoTop) {
    infoTop.textContent = topBrand
      ? `Net deposit: ${formatNumber(topBrand.metrics.netDeposit)}`
      : "Run a search to update";
  }
}

function updateAiResponse(html) {
  const box = document.getElementById("aiResponse");
  if (box) box.innerHTML = html;
}

function answerQuestion(question) {
  const q = question.trim().toLowerCase();
  if (!q.length) return "<p>Please enter a question.</p>";
  if (!state.lastGroups.length)
    return "<p>No data loaded. Run a search first.</p>";

  const groups = state.lastGroups;
  const allBrands = flattenBrandNodes(groups);
  const allCurrencies = flattenCurrencyNodes(groups);

  const totalDeposit = groups.reduce(
    (sum, g) => sum + (Number(g.metrics.totalDeposit) || 0),
    0,
  );
  const totalNet = groups.reduce(
    (sum, g) => sum + (Number(g.metrics.netDeposit) || 0),
    0,
  );
  const totalTurnover = groups.reduce(
    (sum, g) => sum + (Number(g.metrics.turnover) || 0),
    0,
  );

  const topBrandByNet = allBrands.reduce(
    (best, current) =>
      Number(current.metrics?.netDeposit) >
      Number(best?.metrics?.netDeposit || -Infinity)
        ? current
        : best,
    null,
  );

  const topGroupsByDeposit = [...groups]
    .sort(
      (a, b) =>
        (Number(b.metrics.totalDeposit) || 0) -
        (Number(a.metrics.totalDeposit) || 0),
    )
    .slice(0, 3);

  const topGroupsByTurnover = [...groups]
    .sort(
      (a, b) =>
        (Number(b.metrics.turnover) || 0) - (Number(a.metrics.turnover) || 0),
    )
    .slice(0, 3);

  const topCurrencyByTurnover = allCurrencies.reduce(
    (best, current) =>
      Number(current.metrics?.turnover) >
      Number(best?.metrics?.turnover || -Infinity)
        ? current
        : best,
    null,
  );

  const topRetentionGroup = groups.reduce((best, current) => {
    const value = Number(current.metrics.retentionRate);
    if (!Number.isFinite(value)) return best;
    if (!best) return current;
    return value > Number(best.metrics.retentionRate || -Infinity)
      ? current
      : best;
  }, null);

  if (q.includes("highest") && q.includes("net") && q.includes("deposit")) {
    if (!topBrandByNet) return "<p>Could not determine the top brand yet.</p>";
    return `<p><strong>${displayText(topBrandByNet.brand)}</strong> in ${displayText(topBrandByNet.currency)} leads net deposit with <span class="text-negative">${formatNumber(topBrandByNet.metrics.netDeposit)}</span>.</p>`;
  }

  if (q.includes("total deposit") && q.includes("net")) {
    return `<ul>
      <li>Total deposit: <strong>${formatNumber(totalDeposit)}</strong></li>
      <li>Net deposit: <strong>${formatNumber(totalNet)}</strong></li>
      <li>Turnover: <strong>${formatNumber(totalTurnover)}</strong></li>
    </ul>`;
  }

  if (q.includes("top") && q.includes("group") && q.includes("turnover")) {
    const items = topGroupsByTurnover
      .map(
        (group, idx) =>
          `<li>${idx + 1}. ${displayText(group.brandGroup)}: ${formatNumber(group.metrics.turnover)}</li>`,
      )
      .join("");
    return `<p>Top groups by turnover:</p><ul>${items}</ul>`;
  }

  if (q.includes("top") && q.includes("group") && q.includes("deposit")) {
    const items = topGroupsByDeposit
      .map(
        (group, idx) =>
          `<li>${idx + 1}. ${displayText(group.brandGroup)}: ${formatNumber(group.metrics.totalDeposit)}</li>`,
      )
      .join("");
    return `<p>Top groups by total deposit:</p><ul>${items}</ul>`;
  }

  if (
    q.includes("currency") &&
    q.includes("turnover") &&
    topCurrencyByTurnover
  ) {
    return `<p>${displayText(topCurrencyByTurnover.group)} in ${displayText(topCurrencyByTurnover.currency)} leads turnover at <strong>${formatNumber(topCurrencyByTurnover.metrics.turnover)}</strong>.</p>`;
  }

  if (q.includes("retention")) {
    if (
      !topRetentionGroup ||
      !Number.isFinite(topRetentionGroup.metrics.retentionRate)
    ) {
      return "<p>Retention rate data is unavailable for the current selection.</p>";
    }
    return `<p><strong>${displayText(topRetentionGroup.brandGroup)}</strong> retention runs <span class="text-negative">${formatPercent(topRetentionGroup.metrics.retentionRate)}</span>.</p>`;
  }

  if (q.includes("summary") || q.includes("overview")) {
    return `<p>
      Loaded ${groups.length} brand group${groups.length === 1 ? "" : "s"} covering ${allBrands.length} brand${allBrands.length === 1 ? "" : "s"}.
      Combined deposit <strong>${formatNumber(totalDeposit)}</strong>, net deposit <strong>${formatNumber(totalNet)}</strong>, turnover <strong>${formatNumber(totalTurnover)}</strong>.
    </p>`;
  }

  return `<p>Summary: ${groups.length} groups, ${allBrands.length} brands. Total deposit ${formatNumber(totalDeposit)}, net deposit ${formatNumber(totalNet)}, turnover ${formatNumber(totalTurnover)}.</p>`;
}

function renderTable(groups) {
  const tbody = document.getElementById("tableBody");
  const summaryEl = document.getElementById("resultSummary");
  const lastUpdated = document.getElementById("lastUpdated");

  if (!Array.isArray(groups) || !groups.length) {
    tbody.innerHTML =
      '<tr><td colspan="23" class="text-center py-12 text-slate-400">Select a date range and press search.</td></tr>';
    summaryEl.textContent =
      "Select filters then press search to populate the table.";
    lastUpdated.textContent = "Last updated: --";
    state.lastGroups = [];
    state.currentGroupsRaw = [];
    refreshCurrencyOptions();
    renderSummary([]);
    updateExportTable([]);
    refreshIcons();
    return;
  }

  state.currentGroupsRaw = groups;

  const sortFactor = state.sortOrder === "asc" ? 1 : -1;
  const sortedGroups = [...groups].sort((a, b) => {
    const aValue = Number(a.metrics.totalDeposit) || 0;
    const bValue = Number(b.metrics.totalDeposit) || 0;
    if (aValue === bValue) return a.brandGroup.localeCompare(b.brandGroup);
    return (aValue - bValue) * sortFactor;
  });

  const currencyCount = sortedGroups.reduce(
    (sum, group) => sum + (group.currencies ? group.currencies.length : 0),
    0,
  );
  const brandCount = sortedGroups.reduce(
    (sum, group) =>
      sum +
      (group.currencies || []).reduce(
        (inner, currency) =>
          inner + ((currency.brands && currency.brands.length) || 0),
        0,
      ),
    0,
  );

  const rows = [];
  sortedGroups.forEach((group, groupIdx) => {
    const groupId = `group-${groupIdx}`;
    rows.push(`
      <tr class="group-row border-b border-slate-800/60" data-group-id="${groupId}">
        <td class="px-4 py-3 font-semibold">
          <button class="flex items-center gap-2 text-slate-100 hover:text-sky-300 transition toggle-group" data-target="${groupId}">
            <i data-lucide="chevron-down" class="w-4 h-4 transition-transform"></i>
            <span>${displayText(group.brandGroup)}</span>
          </button>
        </td>
        <td class="px-4 py-3 text-sm text-slate-400">All</td>
        <td class="px-4 py-3 text-right">${renderNumberCell(group.metrics.signUpPlayer)}</td>
        <td class="px-4 py-3 text-right">${renderNumberCell(group.metrics.ftdPlayer)}</td>
        <td class="px-4 py-3 text-right">${renderNumberCell(group.metrics.totalDeposit)}</td>
        <td class="px-4 py-3 text-right">${renderNumberCell(group.metrics.totalWithdraw)}</td>
        <td class="px-4 py-3 text-right">${renderNumberCell(group.metrics.netDeposit)}</td>
        <td class="px-4 py-3 text-right">${renderNumberCell(group.metrics.averageDeposit)}</td>
        <td class="px-4 py-3 text-right">${renderPercentCell(group.metrics.netRatio)}</td>
        <td class="px-4 py-3 text-right">${renderNumberCell(group.metrics.bonus)}</td>
        <td class="px-4 py-3 text-right">${renderPercentCell(group.metrics.bonusRatio)}</td>
        <td class="px-4 py-3 text-right">${renderNumberCell(group.metrics.averageBonusPerPlayer)}</td>
        <td class="px-4 py-3 text-right">${renderNumberCell(group.metrics.uniquePlayer)}</td>
        <td class="px-4 py-3 text-right">${renderNumberCell(group.metrics.turnover)}</td>
        <td class="px-4 py-3 text-right">${renderNumberCell(group.metrics.averageTurnover)}</td>
        <td class="px-4 py-3 text-right">${renderNumberCell(group.metrics.averageWr)}</td>
        <td class="px-4 py-3 text-right">${renderPercentCell(group.metrics.grossRevenuePct)}</td>
        <td class="px-4 py-3 text-right">${renderNumberCell(group.metrics.ngrPerPlayer)}</td>
        <td class="px-4 py-3 text-right">${renderNumberCell(group.metrics.netPerPlayer)}</td>
        <td class="px-4 py-3 text-right">${renderNumberCell(group.metrics.netWinLoss)}</td>
        <td class="px-4 py-3 text-right">${renderPercentCell(group.metrics.retentionRate)}</td>
        <td class="px-4 py-3 text-right">${renderPercentCell(group.metrics.ftdConversionRate)}</td>
        <td class="px-4 py-3 text-right">${renderNumberCell(group.metrics.companyWinLoss)}</td>
      </tr>
    `);

    const sortedCurrencies = [...(group.currencies || [])].sort((a, b) => {
      const aValue = Number(a.metrics.totalDeposit) || 0;
      const bValue = Number(b.metrics.totalDeposit) || 0;
      if (aValue === bValue) return a.currency.localeCompare(b.currency);
      return (aValue - bValue) * sortFactor;
    });

    sortedCurrencies.forEach((currency, currencyIdx) => {
      const currencyId = `${groupId}-curr-${currencyIdx}`;
      rows.push(`
        <tr class="currency-row hidden border-t border-slate-800/50" data-group-id="${groupId}" data-currency-id="${currencyId}">
          <td class="px-6 py-2 text-slate-200 text-sm">
            <button class="flex items-center gap-2 toggle-currency text-slate-200 hover:text-emerald-200 transition" data-target="${currencyId}">
              <i data-lucide="chevron-down" class="w-4 h-4 transition-transform"></i>
              <span>${displayText(group.brandGroup)} &rsaquo; ${displayText(currency.currency)}</span>
            </button>
          </td>
          <td class="px-4 py-2 text-sm">${displayText(currency.currency)}</td>
          <td class="px-4 py-2 text-right">${renderNumberCell(currency.metrics.signUpPlayer)}</td>
          <td class="px-4 py-2 text-right">${renderNumberCell(currency.metrics.ftdPlayer)}</td>
          <td class="px-4 py-2 text-right">${renderNumberCell(currency.metrics.totalDeposit)}</td>
          <td class="px-4 py-2 text-right">${renderNumberCell(currency.metrics.totalWithdraw)}</td>
          <td class="px-4 py-2 text-right">${renderNumberCell(currency.metrics.netDeposit)}</td>
          <td class="px-4 py-2 text-right">${renderNumberCell(currency.metrics.averageDeposit)}</td>
          <td class="px-4 py-2 text-right">${renderPercentCell(currency.metrics.netRatio)}</td>
          <td class="px-4 py-2 text-right">${renderNumberCell(currency.metrics.bonus)}</td>
          <td class="px-4 py-2 text-right">${renderPercentCell(currency.metrics.bonusRatio)}</td>
          <td class="px-4 py-2 text-right">${renderNumberCell(currency.metrics.averageBonusPerPlayer)}</td>
          <td class="px-4 py-2 text-right">${renderNumberCell(currency.metrics.uniquePlayer)}</td>
          <td class="px-4 py-2 text-right">${renderNumberCell(currency.metrics.turnover)}</td>
          <td class="px-4 py-2 text-right">${renderNumberCell(currency.metrics.averageTurnover)}</td>
          <td class="px-4 py-2 text-right">${renderNumberCell(currency.metrics.averageWr)}</td>
          <td class="px-4 py-2 text-right">${renderPercentCell(currency.metrics.grossRevenuePct)}</td>
          <td class="px-4 py-2 text-right">${renderNumberCell(currency.metrics.ngrPerPlayer)}</td>
          <td class="px-4 py-2 text-right">${renderNumberCell(currency.metrics.netPerPlayer)}</td>
          <td class="px-4 py-2 text-right">${renderNumberCell(currency.metrics.netWinLoss)}</td>
          <td class="px-4 py-2 text-right">${renderPercentCell(currency.metrics.retentionRate)}</td>
          <td class="px-4 py-2 text-right">${renderPercentCell(currency.metrics.ftdConversionRate)}</td>
          <td class="px-4 py-2 text-right">${renderNumberCell(currency.metrics.companyWinLoss)}</td>
        </tr>
      `);

      const sortedBrands = [...(currency.brands || [])].sort((a, b) => {
        const aValue = Number(a.metrics.totalDeposit) || 0;
        const bValue = Number(b.metrics.totalDeposit) || 0;
        if (aValue === bValue) return a.brand.localeCompare(b.brand);
        return (aValue - bValue) * sortFactor;
      });

      sortedBrands.forEach((brand) => {
        rows.push(`
          <tr class="brand-row hidden border-t border-slate-800/40" data-group-id="${groupId}" data-currency-id="${currencyId}">
            <td class="px-10 py-2 text-slate-300 text-sm">${displayText(brand.brand)}</td>
            <td class="px-4 py-2 text-sm">${displayText(brand.currency)}</td>
            <td class="px-4 py-2 text-right">${renderNumberCell(brand.metrics.signUpPlayer)}</td>
            <td class="px-4 py-2 text-right">${renderNumberCell(brand.metrics.ftdPlayer)}</td>
            <td class="px-4 py-2 text-right">${renderNumberCell(brand.metrics.totalDeposit)}</td>
            <td class="px-4 py-2 text-right">${renderNumberCell(brand.metrics.totalWithdraw)}</td>
            <td class="px-4 py-2 text-right">${renderNumberCell(brand.metrics.netDeposit)}</td>
            <td class="px-4 py-2 text-right">${renderNumberCell(brand.metrics.averageDeposit)}</td>
            <td class="px-4 py-2 text-right">${renderPercentCell(brand.metrics.netRatio)}</td>
            <td class="px-4 py-2 text-right">${renderNumberCell(brand.metrics.bonus)}</td>
            <td class="px-4 py-2 text-right">${renderPercentCell(brand.metrics.bonusRatio)}</td>
            <td class="px-4 py-2 text-right">${renderNumberCell(brand.metrics.averageBonusPerPlayer)}</td>
            <td class="px-4 py-2 text-right">${renderNumberCell(brand.metrics.uniquePlayer)}</td>
            <td class="px-4 py-2 text-right">${renderNumberCell(brand.metrics.turnover)}</td>
            <td class="px-4 py-2 text-right">${renderNumberCell(brand.metrics.averageTurnover)}</td>
            <td class="px-4 py-2 text-right">${renderNumberCell(brand.metrics.averageWr)}</td>
            <td class="px-4 py-2 text-right">${renderPercentCell(brand.metrics.grossRevenuePct)}</td>
            <td class="px-4 py-2 text-right">${renderNumberCell(brand.metrics.ngrPerPlayer)}</td>
            <td class="px-4 py-2 text-right">${renderNumberCell(brand.metrics.netPerPlayer)}</td>
            <td class="px-4 py-2 text-right">${renderNumberCell(brand.metrics.netWinLoss)}</td>
            <td class="px-4 py-2 text-right">${renderPercentCell(brand.metrics.retentionRate)}</td>
            <td class="px-4 py-2 text-right">${renderPercentCell(brand.metrics.ftdConversionRate)}</td>
            <td class="px-4 py-2 text-right">${renderNumberCell(brand.metrics.companyWinLoss)}</td>
          </tr>
        `);
      });
    });
  });

  tbody.innerHTML = rows.join("");
  summaryEl.textContent = `Showing ${sortedGroups.length} brand group${sortedGroups.length === 1 ? "" : "s"}, ${currencyCount} currency${currencyCount === 1 ? "" : "ies"}, ${brandCount} brand${brandCount === 1 ? "" : "s"}.`;
  lastUpdated.textContent = `Last updated: ${new Date().toLocaleString()}`;
  state.lastGroups = sortedGroups;
  refreshCurrencyOptions();
  renderSummary(sortedGroups);
  updateExportTable(sortedGroups);

  const collapseCurrency = (currencyId) => {
    if (!currencyId) return;
    const currencyRow = tbody.querySelector(
      `tr.currency-row[data-currency-id="${currencyId}"]`,
    );
    if (!currencyRow) return;
    currencyRow.classList.remove("expanded", "row-highlight-currency");
    const currencyBtn = currencyRow.querySelector(".toggle-currency");
    const icon = currencyBtn?.querySelector('[data-lucide="chevron-down"]');
    if (icon) icon.style.transform = "rotate(0deg)";
    const brandRows = tbody.querySelectorAll(
      `tr.brand-row[data-currency-id="${currencyId}"]`,
    );
    brandRows.forEach((row) => {
      row.classList.add("hidden");
      row.classList.remove("row-highlight-currency");
    });
  };

  const collapseGroup = (groupId) => {
    if (!groupId) return;
    const groupRow = tbody.querySelector(
      `tr.group-row[data-group-id="${groupId}"]`,
    );
    if (!groupRow) return;
    groupRow.classList.remove("expanded", "row-highlight-group");
    const groupBtn = groupRow.querySelector(".toggle-group");
    const icon = groupBtn?.querySelector('[data-lucide="chevron-down"]');
    if (icon) icon.style.transform = "rotate(0deg)";

    const currencyRows = tbody.querySelectorAll(
      `tr.currency-row[data-group-id="${groupId}"]`,
    );
    currencyRows.forEach((row) => {
      row.classList.add("hidden");
      row.classList.remove(
        "expanded",
        "row-highlight-group",
        "row-highlight-currency",
      );
      collapseCurrency(row.dataset.currencyId);
    });
  };

  tbody.querySelectorAll(".toggle-group").forEach((btn) => {
    btn.addEventListener("click", () => {
      const groupId = btn.dataset.target;
      const parentRow = btn.closest("tr");
      const icon = btn.querySelector('[data-lucide="chevron-down"]');
      const currencyRows = tbody.querySelectorAll(
        `tr.currency-row[data-group-id="${groupId}"]`,
      );
      const brandRows = tbody.querySelectorAll(
        `tr.brand-row[data-group-id="${groupId}"]`,
      );
      const expanded = !parentRow.classList.contains("expanded");

      if (expanded) {
        tbody.querySelectorAll("tr.group-row.expanded").forEach((row) => {
          const otherId = row.dataset.groupId;
          if (otherId !== groupId) collapseGroup(otherId);
        });
      }

      parentRow.classList.toggle("expanded", expanded);
      if (icon)
        icon.style.transform = expanded ? "rotate(180deg)" : "rotate(0deg)";

      currencyRows.forEach((row) => row.classList.toggle("hidden", !expanded));
      brandRows.forEach((row) => {
        row.classList.add("hidden");
        row.classList.remove("row-highlight-currency");
      });

      if (expanded) {
        parentRow.classList.add("row-highlight-group");
        currencyRows.forEach((row) => {
          row.classList.add("row-highlight-group");
          row.classList.remove("row-highlight-currency");
          row.classList.remove("expanded");
          const innerIcon = row.querySelector(
            '.toggle-currency [data-lucide="chevron-down"]',
          );
          if (innerIcon) innerIcon.style.transform = "rotate(0deg)";
          collapseCurrency(row.dataset.currencyId);
        });
      } else {
        collapseGroup(groupId);
      }
    });
  });

  tbody.querySelectorAll(".toggle-currency").forEach((btn) => {
    btn.addEventListener("click", () => {
      const currencyId = btn.dataset.target;
      const parentRow = btn.closest("tr");
      const icon = btn.querySelector('[data-lucide="chevron-down"]');
      const brandRows = tbody.querySelectorAll(
        `tr.brand-row[data-currency-id="${currencyId}"]`,
      );
      const expanded = !parentRow.classList.contains("expanded");

      if (expanded) {
        tbody
          .querySelectorAll(
            `tr.currency-row.expanded[data-group-id="${parentRow.dataset.groupId}"]`,
          )
          .forEach((row) => {
            if (row.dataset.currencyId !== currencyId)
              collapseCurrency(row.dataset.currencyId);
          });
      }

      parentRow.classList.toggle("expanded", expanded);
      brandRows.forEach((row) => row.classList.toggle("hidden", !expanded));
      if (icon)
        icon.style.transform = expanded ? "rotate(180deg)" : "rotate(0deg)";

      if (expanded) {
        parentRow.classList.add("row-highlight-currency");
        brandRows.forEach((row) => row.classList.add("row-highlight-currency"));
      } else {
        collapseCurrency(currencyId);
      }
    });
  });

  refreshIcons();
  bindDepositSortHeader();
}

function bindDepositSortHeader() {
  const header = document.getElementById("col-total-deposit");
  if (!header || header.dataset.bound) return;
  header.dataset.bound = "true";
  header.tabIndex = 0;
  header.setAttribute("role", "button");
  header.setAttribute(
    "aria-pressed",
    state.sortOrder === "desc" ? "true" : "false",
  );

  const toggleSort = () => {
    state.sortOrder = state.sortOrder === "desc" ? "asc" : "desc";
    try {
      localStorage.setItem(STORAGE_KEYS.sort, state.sortOrder);
    } catch {
      // ignore storage failures
    }
    header.setAttribute(
      "aria-pressed",
      state.sortOrder === "desc" ? "true" : "false",
    );
    if (state.currentGroupsRaw?.length) {
      renderTable(state.currentGroupsRaw);
    }
    updateShareableUrl(state.lastFilters || {});
  };

  header.addEventListener("click", toggleSort);
  header.addEventListener("keypress", (event) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      toggleSort();
    }
  });
}

async function loadMetrics(manual = false) {
  const params = collectParams();
  if (!params) {
    setStatus("Pick start and end dates, then press search.", "error");
    return;
  }

  setStatus("Checking disk cache...", "info");
  setLoading(true, { manual });
  try {
    let groups = null;
    let fromCache = false;

    // Try to load from disk cache first
    const cachedData = await loadCacheSnapshot();
    if (cachedData && cachedData.groups && Array.isArray(cachedData.groups)) {
      groups = cachedData.groups;
      fromCache = true;
      setStatus("Loaded from disk cache for this month.", "success");
    } else {
      // Fetch from upstream if cache miss
      setStatus("Fetching metrics from upstream...", "info");
      groups = await fetchMetricsData(params);
    }

    renderTable(groups);
    const filters = {
      startDate: params.get("startDate"),
      endDate: params.get("endDate"),
      brandGroups: ensureArray(
        params.get("brandGroups") ? params.get("brandGroups").split(",") : [],
      ),
      brands: ensureArray(
        params.get("brands") ? params.get("brands").split(",") : [],
      ),
      currencies: ensureArray(
        params.get("currencies") ? params.get("currencies").split(",") : [],
      ),
    };
    state.lastFilters = filters;
    updateShareableUrl(filters);
    if (groups.length) {
      const source = fromCache ? " (cached)" : " (fresh)";
      setStatus(
        `Loaded ${groups.length} group${groups.length === 1 ? "" : "s"}.${source}`,
        "success",
      );
      saveSnapshot(groups, filters);
      assistantNotifyDataRefresh(groups, filters, { mode: "verified" });
    } else {
      setStatus(
        "No data matched these filters. Try expanding the selection.",
        "info",
      );
      assistantNotifyNoData();
    }
  } catch (err) {
    console.error(err);
    renderTable([]);
    setStatus("Failed to load metrics. Please try again.", "error");
    assistantNotifyError(err);
  } finally {
    setLoading(false, { manual });
  }
}

function wireQuickRangeButtons() {
  document.querySelectorAll(".quick-range-btn").forEach((button) => {
    button.addEventListener("click", () => {
      const preset = button.dataset.range || "today";
      const [start, end] = getPresetRange(preset);
      state.datePicker?.setDate([start, end], true);
      setStatus(`Applied preset range: ${preset.replace(/-/g, " ")}`, "info");
    });
  });
}

function buildThemeOptions() {
  const container = document.getElementById("themeOptions");
  if (!container) return;
  state.settingsPanel.themeContainer = container;
  container.innerHTML = "";
  Object.entries(THEMES).forEach(([key, theme]) => {
    const button = document.createElement("button");
    button.className = "settings-chip";
    button.textContent = theme.label;
    button.setAttribute("data-theme", key);
    button.addEventListener("click", () => {
      persistSettings({ theme: key });
    });
    container.appendChild(button);
  });
}

function wireSettingsPanel() {
  state.settingsPanel.overlay = document.getElementById("settingsOverlay");
  state.settingsPanel.fontDisplay = document.getElementById("fontScaleDisplay");
  state.settingsPanel.colorPicker = document.getElementById(
    "negativeColorPicker",
  );
  buildThemeOptions();

  document
    .getElementById("openSettings")
    ?.addEventListener("click", () => toggleSettingsPanel(true));
  document
    .getElementById("closeSettings")
    ?.addEventListener("click", () => toggleSettingsPanel(false));
  state.settingsPanel.overlay?.addEventListener("click", (event) => {
    if (event.target === state.settingsPanel.overlay)
      toggleSettingsPanel(false);
  });

  document.getElementById("fontUp")?.addEventListener("click", () => {
    const next = Math.min(1.6, state.settings.fontScale + 0.05);
    persistSettings({ fontScale: parseFloat(next.toFixed(2)) });
  });

  document.getElementById("fontDown")?.addEventListener("click", () => {
    const next = Math.max(0.7, state.settings.fontScale - 0.05);
    persistSettings({ fontScale: parseFloat(next.toFixed(2)) });
  });

  state.settingsPanel.colorPicker?.addEventListener("input", (event) => {
    const value = event.target.value;
    persistSettings({ negativeColor: value });
  });
}

function escapeHtml(value) {
  if (value == null) return "";
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function assistantTogglePanel(open) {
  const el = state.assistant.elements;
  if (!el.panel) return;
  state.assistant.open = open;
  el.panel.classList.toggle("assistant-panel--collapsed", !open);
  document.body.classList.toggle("assistant-collapsed", !open);
  if (el.toggle) {
    el.toggle.innerHTML = open
      ? '<i data-lucide="panel-right-close"></i> Hide Assistant'
      : '<i data-lucide="panel-right-open"></i> Show Assistant';
  }
  if (el.modeDescriptor) {
    el.modeDescriptor.textContent =
      state.assistant.mode === "verified" ? "Verified" : "Quick Preview";
  }
  refreshIcons();
}

function assistantSetMode(mode, { announce = true } = {}) {
  const el = state.assistant.elements;
  state.assistant.mode = mode;
  if (el.quickButton) {
    el.quickButton.classList.toggle("active", mode === "quick");
    el.quickButton.setAttribute(
      "aria-checked",
      mode === "quick" ? "true" : "false",
    );
  }
  if (el.verifiedButton) {
    el.verifiedButton.classList.toggle("active", mode === "verified");
    el.verifiedButton.setAttribute(
      "aria-checked",
      mode === "verified" ? "true" : "false",
    );
  }
  if (el.modeDescriptor)
    el.modeDescriptor.textContent =
      mode === "verified" ? "Verified" : "Quick Preview";
  if (el.modeLabel)
    el.modeLabel.textContent =
      mode === "verified" ? "Verified Mode" : "Quick Preview";
  try {
    localStorage.setItem(STORAGE_KEYS.assistantMode, mode);
  } catch {
    // ignore storage issues
  }
  updateShareableUrl(state.lastFilters || {});
  if (announce) {
    assistantAddMessage(
      "system",
      `<div class="assistant-card assistant-card--meta"><i data-lucide="sliders-horizontal"></i><span>Assistant switched to <strong>${mode === "verified" ? "Verified" : "Quick Preview"}</strong> mode.</span></div>`,
      { html: true },
    );
  }
}

function assistantScrollToBottom() {
  const el = state.assistant.elements.messages;
  if (!el) return;
  requestAnimationFrame(() => {
    el.scrollTo({ top: el.scrollHeight, behavior: "smooth" });
  });
}

function assistantRenderMessages() {
  const el = state.assistant.elements.messages;
  if (!el) return;
  const frag = document.createDocumentFragment();
  state.assistant.downloads.clear();

  state.assistant.messages.forEach((message) => {
    const article = document.createElement("article");
    article.className = `assistant-message assistant-message--${message.role}`;
    article.dataset.id = message.id;
    article.setAttribute("role", "article");
    article.setAttribute(
      "aria-live",
      message.role === "assistant" ? "polite" : "off",
    );

    const bubble = document.createElement("div");
    bubble.className = "assistant-bubble";
    bubble.innerHTML =
      message.html || `<p>${escapeHtml(message.text || "")}</p>`;

    if (message.thinking) {
      bubble.classList.add("assistant-bubble--thinking");
    }

    if (message.download) {
      const button = document.createElement("button");
      button.type = "button";
      button.className = "assistant-download";
      button.setAttribute("data-download-id", message.id);
      button.innerHTML = '<i data-lucide="download"></i>Export CSV';
      bubble.appendChild(button);
      state.assistant.downloads.set(message.id, message.download);
    }

    const meta = document.createElement("footer");
    meta.className = "assistant-meta";
    const time = new Date(message.timestamp || Date.now()).toLocaleTimeString();
    meta.innerHTML = `<span>${time}</span>${message.mode ? `<span>${message.mode === "verified" ? "Verified" : "Quick Preview"}</span>` : ""}`;

    article.appendChild(bubble);
    article.appendChild(meta);
    frag.appendChild(article);
  });

  el.innerHTML = "";
  el.appendChild(frag);
  refreshIcons();
}

function assistantAddMessage(role, content, options = {}) {
  const id = `msg-${++state.assistant.counter}`;
  const message = {
    id,
    role,
    text: typeof content === "string" ? content : "",
    html: options.html
      ? content
      : typeof content === "string"
        ? `<p>${escapeHtml(content)}</p>`
        : "",
    timestamp: Date.now(),
    thinking: options.thinking || false,
    download: options.download || null,
    mode: options.mode,
  };
  state.assistant.messages.push(message);
  assistantRenderMessages();
  assistantScrollToBottom();
  return id;
}

function assistantUpdateMessage(id, updates = {}) {
  const message = state.assistant.messages.find((item) => item.id === id);
  if (!message) return;
  Object.assign(message, updates);
  if (updates.download) {
    state.assistant.downloads.set(id, updates.download);
  } else if (updates.download === null) {
    state.assistant.downloads.delete(id);
  }
  assistantRenderMessages();
  assistantScrollToBottom();
}

function assistantConvertToCSV(headers, rows) {
  const escapeValue = (value) => {
    if (value == null) return "";
    const str = String(value);
    if (/[",\n]/.test(str)) {
      return `"${str.replace(/"/g, '""')}"`;
    }
    return str;
  };
  const lines = [];
  if (headers?.length) lines.push(headers.map(escapeValue).join(","));
  (rows || []).forEach((row) => {
    const values = Array.isArray(row)
      ? row
      : headers.map((header) => (row && header in row ? row[header] : ""));
    lines.push(values.map(escapeValue).join(","));
  });
  return lines.join("\n");
}

function assistantHandleMessageClick(event) {
  const downloadBtn = event.target.closest("[data-download-id]");
  if (downloadBtn) {
    const id = downloadBtn.getAttribute("data-download-id");
    const payload = state.assistant.downloads.get(id);
    if (!payload) return;
    const csv = assistantConvertToCSV(
      payload.headers || [],
      payload.rows || [],
    );
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = payload.filename || `insight-${Date.now()}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setTimeout(() => URL.revokeObjectURL(url), 1000);
    return;
  }

  const rerunBtn = event.target.closest("[data-rerun-intent]");
  if (rerunBtn) {
    const question = rerunBtn.getAttribute("data-rerun-intent");
    if (question) assistantProcessQuestion(question);
  }
}

function assistantAutosizeInput(event) {
  const input = event.currentTarget;
  if (!input) return;
  input.style.height = "auto";
  const max = 200;
  input.style.height = `${Math.min(input.scrollHeight + 2, max)}px`;
}

function assistantHandleSend() {
  const el = state.assistant.elements;
  if (!el.input) return;
  const question = el.input.value.trim();
  if (!question) return;
  assistantProcessQuestion(question);
  el.input.value = "";
  assistantAutosizeInput({ currentTarget: el.input });
}

async function assistantPrepareDataset(mode) {
  if (mode === "verified") {
    const params = collectParams();
    if (!params) {
      return state.cachedSnapshot && state.cachedSnapshot.groups?.length
        ? {
            groups: state.cachedSnapshot.groups,
            filters: state.cachedSnapshot.filters,
            timestamp: state.cachedSnapshot.timestamp,
            mode: "quick",
            fallback: true,
          }
        : null;
    }
    const filters = {
      startDate: params.get("startDate"),
      endDate: params.get("endDate"),
      brandGroups: ensureArray(
        params.get("brandGroups") ? params.get("brandGroups").split(",") : [],
      ),
      brands: ensureArray(
        params.get("brands") ? params.get("brands").split(",") : [],
      ),
      currencies: ensureArray(
        params.get("currencies") ? params.get("currencies").split(",") : [],
      ),
    };
    const groups = await fetchMetricsData(params);
    renderTable(groups);
    if (groups.length) {
      saveSnapshot(groups, filters);
      assistantNotifyDataRefresh(groups, filters, { mode: "verified" });
      return { groups, filters, timestamp: Date.now(), mode: "verified" };
    }
    assistantNotifyNoData();
    return null;
  }

  const snapshot = state.cachedSnapshot;
  if (state.lastGroups?.length) {
    return {
      groups: state.lastGroups,
      filters: snapshot?.filters || {},
      timestamp: snapshot?.timestamp || Date.now(),
      mode: "quick",
    };
  }
  if (snapshot?.groups?.length) {
    return {
      groups: snapshot.groups,
      filters: snapshot.filters || {},
      timestamp: snapshot.timestamp || Date.now(),
      mode: "quick",
    };
  }
  return null;
}

function assistantBuildList(items, formatter, ordered = true) {
  if (!items?.length)
    return '<p class="assistant-empty">No data available.</p>';
  const tag = ordered ? "ol" : "ul";
  return `<${tag}>${items.map((item, idx) => `<li>${formatter(item, idx)}</li>`).join("")}</${tag}>`;
}

function assistantFormatFilters(filters) {
  if (!filters) return "current selection";
  if (filters.startDate && filters.endDate) {
    return `${filters.startDate} → ${filters.endDate}`;
  }
  return "current selection";
}

function assistantGenerateInsight(question, dataset) {
  const groups = dataset.groups || [];
  const filters = dataset.filters || {};
  const timestamp = dataset.timestamp || Date.now();
  const rangeLabel = assistantFormatFilters(filters);
  const rangeCheck = assistantNeedsExpandedRange(question, filters);
  if (rangeCheck.needsRange) {
    const requestedLabel =
      rangeCheck.month != null
        ? `${MONTH_METADATA[rangeCheck.month].name} to now`
        : "the timeframe you mentioned";
    const currentScope =
      filters.startDate && filters.endDate
        ? `${filters.startDate} &rarr; ${filters.endDate}`
        : "No date range selected";
    return {
      title: "Load Requested Time Range",
      icon: "calendar-range",
      intro: `I need data covering ${requestedLabel} before I can analyse it.`,
      sections: [
        {
          title: "Current Dataset",
          icon: "clock",
          body: `<p>Loaded range: <strong>${currentScope}</strong> with ${groups.length} brand group${groups.length === 1 ? "" : "s"}.</p>`,
        },
        {
          title: "Next Step",
          icon: "filter",
          body: "<p>Update the dashboard filters to the requested dates, click <strong>Search</strong>, then ask again.</p>",
        },
      ],
      recommendations: [
        rangeCheck.month != null
          ? `Set the start date to ${MONTH_METADATA[rangeCheck.month].name} 1 and the end date to today, refresh the table, then retry your question.`
          : "Adjust the date range to cover the period mentioned, reload the metrics, and ask again.",
      ],
      csv: null,
      footer: `Scope: ${rangeLabel} • ${groups.length} group${groups.length === 1 ? "" : "s"} • ${dataset.mode === "verified" ? "Verified" : "Quick Preview"}`,
    };
  }
  const q = question.toLowerCase();
  const allBrands = flattenBrandNodes(groups);
  const allCurrencies = flattenCurrencyNodes(groups);

  const totalDeposit = groups.reduce(
    (sum, g) => sum + (Number(g.metrics.totalDeposit) || 0),
    0,
  );
  const totalNet = groups.reduce(
    (sum, g) => sum + (Number(g.metrics.netDeposit) || 0),
    0,
  );
  const totalTurnover = groups.reduce(
    (sum, g) => sum + (Number(g.metrics.turnover) || 0),
    0,
  );

  const topGroupsByDeposit = [...groups]
    .sort(
      (a, b) =>
        (Number(b.metrics.totalDeposit) || 0) -
        (Number(a.metrics.totalDeposit) || 0),
    )
    .slice(0, 5);
  const topBrandsByDeposit = [...allBrands]
    .sort(
      (a, b) =>
        (Number(b.metrics.totalDeposit) || 0) -
        (Number(a.metrics.totalDeposit) || 0),
    )
    .slice(0, 5);
  const lossBrands = [...allBrands]
    .filter((item) => Number(item.metrics.netDeposit) < 0)
    .sort(
      (a, b) =>
        (Number(a.metrics.netDeposit) || 0) -
        (Number(b.metrics.netDeposit) || 0),
    )
    .slice(0, 5);
  const retentionChallengers = [...groups]
    .filter((item) => Number.isFinite(item.metrics.retentionRate))
    .sort(
      (a, b) =>
        (Number(a.metrics.retentionRate) || 0) -
        (Number(b.metrics.retentionRate) || 0),
    )
    .slice(0, 3);
  const currencyLeaders = [...allCurrencies]
    .sort(
      (a, b) =>
        (Number(b.metrics.totalDeposit) || 0) -
        (Number(a.metrics.totalDeposit) || 0),
    )
    .slice(0, 5);

  let intent = "summary";
  if (/(top|best|highest).*(deposit|volume)/.test(q)) intent = "deposit";
  else if (/(loss|negative|decline|drop|risk)/.test(q)) intent = "loss";
  else if (/(retention|ftd|conversion)/.test(q)) intent = "retention";
  else if (/(turnover|wager|bet|volume)/.test(q)) intent = "turnover";

  const response = {
    title: "",
    icon: "sparkles",
    intro: "",
    sections: [],
    recommendations: [],
    csv: null,
    footer: `Scope: ${rangeLabel} • ${groups.length} group${groups.length === 1 ? "" : "s"} • ${dataset.mode === "verified" ? "Verified" : "Quick Preview"}`,
  };

  if (intent === "deposit") {
    response.title = "Deposit Leaders";
    response.icon = "trophy";
    response.intro = `Top performers by total deposit for ${rangeLabel}.`;
    response.sections.push({
      title: "Brand Group Leaders",
      icon: "crown",
      body: assistantBuildList(
        topGroupsByDeposit.slice(0, 5),
        (item, idx) =>
          `<strong>${idx + 1}. ${displayText(item.brandGroup)}</strong> — ${formatNumber(item.metrics.totalDeposit)} deposit, ${formatPercent(item.metrics.netRatio)} net ratio`,
      ),
    });
    response.sections.push({
      title: "Brand Spotlight",
      icon: "sparkles",
      body: assistantBuildList(
        topBrandsByDeposit,
        (item, idx) =>
          `<strong>${idx + 1}. ${displayText(item.brand)}</strong> (${displayText(item.currency)}) — ${formatNumber(item.metrics.totalDeposit)} deposit, net ${formatNumber(item.metrics.netDeposit)}`,
      ),
    });
    response.recommendations.push(
      "Reinforce acquisition campaigns for the top-performing brand groups to sustain momentum.",
    );
    if (lossBrands.length) {
      response.recommendations.push(
        `Monitor ${displayText(lossBrands[0].brand)} (${displayText(lossBrands[0].currency)}) due to negative net deposit.`,
      );
    }
    response.csv = {
      filename: `deposit-leaders-${Date.now()}.csv`,
      headers: [
        "Rank",
        "Scope",
        "Name",
        "Currency",
        "Total Deposit",
        "Net Deposit",
        "Turnover",
      ],
      rows: [
        ...topGroupsByDeposit.map((item, idx) => [
          idx + 1,
          "Brand Group",
          item.brandGroup,
          "--",
          Number(item.metrics.totalDeposit || 0),
          Number(item.metrics.netDeposit || 0),
          Number(item.metrics.turnover || 0),
        ]),
        ...topBrandsByDeposit.map((item, idx) => [
          idx + 1,
          "Brand",
          item.brand,
          item.currency,
          Number(item.metrics.totalDeposit || 0),
          Number(item.metrics.netDeposit || 0),
          Number(item.metrics.turnover || 0),
        ]),
      ],
    };
    return response;
  }

  if (intent === "loss") {
    response.title = "Loss & Risk Report";
    response.icon = "shield-alert";
    response.intro = `Brands with negative net deposit or performance risk across ${rangeLabel}.`;
    response.sections.push({
      title: "Brands in Drawdown",
      icon: "alert-triangle",
      body: lossBrands.length
        ? assistantBuildList(
            lossBrands,
            (item, idx) =>
              `<strong>${idx + 1}. ${displayText(item.brand)}</strong> (${displayText(item.currency)}) — net ${formatNumber(item.metrics.netDeposit)}, turnover ${formatNumber(item.metrics.turnover)}`,
          )
        : '<p class="assistant-empty">No brands are currently reporting negative net deposits.</p>',
    });
    response.sections.push({
      title: "Retention Pressure",
      icon: "users",
      body: retentionChallengers.length
        ? assistantBuildList(
            retentionChallengers,
            (item) =>
              `${displayText(item.brandGroup)} — retention ${formatPercent(item.metrics.retentionRate)} · FTD conversion ${formatPercent(item.metrics.ftdConversionRate)}`,
          )
        : '<p class="assistant-empty">Retention is stable across brand groups.</p>',
    });
    if (lossBrands.length) {
      response.recommendations.push(
        `Activate win-back offers for ${displayText(lossBrands[0].brand)} (${displayText(lossBrands[0].currency)}) to recover net losses.`,
      );
    }
    if (retentionChallengers.length) {
      response.recommendations.push(
        `Investigate CRM touchpoints for ${displayText(retentionChallengers[0].brandGroup)} to improve retention.`,
      );
    }
    response.csv = {
      filename: `risk-report-${Date.now()}.csv`,
      headers: [
        "Rank",
        "Brand",
        "Currency",
        "Net Deposit",
        "Total Deposit",
        "Turnover",
        "Retention %",
      ],
      rows: lossBrands.map((item, idx) => [
        idx + 1,
        item.brand,
        item.currency,
        Number(item.metrics.netDeposit || 0),
        Number(item.metrics.totalDeposit || 0),
        Number(item.metrics.turnover || 0),
        Number(item.metrics.retentionRate || 0),
      ]),
    };
    return response;
  }

  if (intent === "retention") {
    response.title = "Retention & Conversion";
    response.icon = "repeat";
    response.intro = `Retention health overview for ${rangeLabel}.`;
    response.sections.push({
      title: "Highest Retention",
      icon: "target",
      body: assistantBuildList(
        [...groups]
          .filter((item) => Number.isFinite(item.metrics.retentionRate))
          .sort(
            (a, b) =>
              (Number(b.metrics.retentionRate) || 0) -
              (Number(a.metrics.retentionRate) || 0),
          )
          .slice(0, 5),
        (item, idx) =>
          `<strong>${idx + 1}. ${displayText(item.brandGroup)}</strong> — retention ${formatPercent(item.metrics.retentionRate)}, FTD conversion ${formatPercent(item.metrics.ftdConversionRate)}`,
      ),
    });
    response.sections.push({
      title: "Low Retention Watchlist",
      icon: "alert-octagon",
      body: retentionChallengers.length
        ? assistantBuildList(
            retentionChallengers,
            (item, idx) =>
              `<strong>${idx + 1}. ${displayText(item.brandGroup)}</strong> — retention ${formatPercent(item.metrics.retentionRate)}, unique players ${formatNumber(item.metrics.uniquePlayer)}`,
          )
        : '<p class="assistant-empty">No critical retention risks detected.</p>',
    });
    response.recommendations.push(
      "Review onboarding and bonus lifecycle journeys for low-retention cohorts.",
    );
    response.csv = {
      filename: `retention-overview-${Date.now()}.csv`,
      headers: [
        "Rank",
        "Brand Group",
        "Retention %",
        "FTD Conversion %",
        "Unique Players",
      ],
      rows: [...groups]
        .filter((item) => Number.isFinite(item.metrics.retentionRate))
        .map((item, idx) => [
          idx + 1,
          item.brandGroup,
          Number(item.metrics.retentionRate || 0),
          Number(item.metrics.ftdConversionRate || 0),
          Number(item.metrics.uniquePlayer || 0),
        ]),
    };
    return response;
  }

  if (intent === "turnover") {
    response.title = "Turnover Highlights";
    response.icon = "activity";
    response.intro = `Top wagering performance for ${rangeLabel}.`;
    response.sections.push({
      title: "Brand Group Turnover",
      icon: "chart-line",
      body: assistantBuildList(
        [...groups]
          .sort(
            (a, b) =>
              (Number(b.metrics.turnover) || 0) -
              (Number(a.metrics.turnover) || 0),
          )
          .slice(0, 5),
        (item, idx) =>
          `<strong>${idx + 1}. ${displayText(item.brandGroup)}</strong> — turnover ${formatNumber(item.metrics.turnover)}, WR ${formatNumber(item.metrics.averageWr)}`,
      ),
    });
    response.sections.push({
      title: "Currency Momentum",
      icon: "coins",
      body: assistantBuildList(
        currencyLeaders,
        (item, idx) =>
          `<strong>${idx + 1}. ${displayText(item.currency)}</strong> — turnover ${formatNumber(item.metrics.turnover)}, deposit ${formatNumber(item.metrics.totalDeposit)}`,
      ),
    });
    response.recommendations.push(
      "Align acquisition budgets with high-turnover currencies to maximise wagering volume.",
    );
    response.csv = {
      filename: `turnover-leaders-${Date.now()}.csv`,
      headers: [
        "Rank",
        "Scope",
        "Name",
        "Turnover",
        "Total Deposit",
        "Average WR",
      ],
      rows: [
        ...[...groups]
          .sort(
            (a, b) =>
              (Number(b.metrics.turnover) || 0) -
              (Number(a.metrics.turnover) || 0),
          )
          .slice(0, 5)
          .map((item, idx) => [
            idx + 1,
            "Brand Group",
            item.brandGroup,
            Number(item.metrics.turnover || 0),
            Number(item.metrics.totalDeposit || 0),
            Number(item.metrics.averageWr || 0),
          ]),
        ...currencyLeaders.map((item, idx) => [
          idx + 1,
          "Currency",
          item.currency,
          Number(item.metrics.turnover || 0),
          Number(item.metrics.totalDeposit || 0),
          Number(item.metrics.averageWr || 0),
        ]),
      ],
    };
    return response;
  }

  response.title = "Performance Overview";
  response.icon = "sparkle";
  response.intro = `High-level summary for ${rangeLabel}.`;
  const leadingGroup = topGroupsByDeposit[0];
  const leadingBrand = topBrandsByDeposit[0];
  response.sections.push({
    title: "Key Metrics",
    icon: "gauge",
    body: `
      <div class="assistant-metric-grid">
        <div><span>Total Deposit</span><strong>${formatNumber(totalDeposit)}</strong></div>
        <div><span>Net Deposit</span><strong>${formatNumber(totalNet)}</strong></div>
        <div><span>Turnover</span><strong>${formatNumber(totalTurnover)}</strong></div>
      </div>
    `,
  });
  response.sections.push({
    title: "Highlights",
    icon: "star",
    body: `
      <ul>
        <li><strong>Brand Group:</strong> ${displayText(leadingGroup?.brandGroup || "--")} (${formatNumber(leadingGroup?.metrics?.totalDeposit || 0)} deposit)</li>
        <li><strong>Brand:</strong> ${displayText(leadingBrand?.brand || "--")} (${displayText(leadingBrand?.currency || "--")})</li>
        <li><strong>Top Currency:</strong> ${displayText(currencyLeaders[0]?.currency || "--")}</li>
      </ul>
    `,
  });
  if (lossBrands.length) {
    response.recommendations.push(
      `Prioritise margin recovery for ${displayText(lossBrands[0].brand)} which is currently negative ${formatNumber(lossBrands[0].metrics.netDeposit)}.`,
    );
  }
  if (retentionChallengers.length) {
    response.recommendations.push(
      `Boost retention initiatives for ${displayText(retentionChallengers[0].brandGroup)} (retention ${formatPercent(retentionChallengers[0].metrics.retentionRate)}).`,
    );
  }
  response.csv = {
    filename: `summary-${Date.now()}.csv`,
    headers: ["Metric", "Value"],
    rows: [
      ["Total Deposit", totalDeposit],
      ["Net Deposit", totalNet],
      ["Turnover", totalTurnover],
      ["Top Brand Group", leadingGroup?.brandGroup || "--"],
      [
        "Top Brand Group Deposit",
        Number(leadingGroup?.metrics?.totalDeposit || 0),
      ],
      ["Top Brand", leadingBrand?.brand || "--"],
      ["Top Brand Currency", leadingBrand?.currency || "--"],
    ],
  };
  return response;
}

function assistantProcessQuestion(question) {
  if (state.assistant.busy) {
    assistantAddMessage(
      "system",
      '<div class="assistant-card assistant-card--meta"><i data-lucide="timer"></i><span>Still working on the previous request...</span></div>',
      { html: true },
    );
    return;
  }

  assistantAddMessage("user", question);
  const thinkingId = assistantAddMessage(
    "assistant",
    `<div class="assistant-card assistant-card--thinking"><div class="assistant-thinking"><i data-lucide="loader-2" class="assistant-spin"></i><span>Analyzing (${state.assistant.mode === "verified" ? "Verified" : "Quick Preview"})...</span></div></div>`,
    { html: true, thinking: true, mode: state.assistant.mode },
  );

  state.assistant.busy = true;
  assistantPrepareDataset(state.assistant.mode)
    .then((dataset) => {
      if (!dataset || !dataset.groups?.length) {
        assistantUpdateMessage(thinkingId, {
          html: '<div class="assistant-card"><p class="assistant-empty">No cached data available. Run a search to load metrics first.</p></div>',
          thinking: false,
        });
        return;
      }
      const insight = assistantGenerateInsight(question, dataset);
      const sections = insight.sections
        .map(
          (section) => `
            <section class="assistant-section">
              <header><i data-lucide="${section.icon || "sparkles"}"></i><h5>${section.title}</h5></header>
              <div>${section.body}</div>
            </section>`,
        )
        .join("");
      const recommendations = insight.recommendations?.length
        ? `<section class="assistant-section assistant-section--actions"><header><i data-lucide="check-circle-2"></i><h5>Recommended Actions</h5></header><ul>${insight.recommendations
            .map((item) => `<li>${item}</li>`)
            .join("")}</ul></section>`
        : "";
      const footer = `<footer class="assistant-footnote"><i data-lucide="radar"></i><span>${insight.footer}</span></footer>`;
      const html = `
        <div class="assistant-card">
          <header class="assistant-card-header">
            <i data-lucide="${insight.icon || "sparkles"}"></i>
            <div>
              <h4>${insight.title || "Insight"}</h4>
              <p>${insight.intro || ""}</p>
            </div>
          </header>
          ${sections}
          ${recommendations}
          ${footer}
        </div>
      `;
      assistantUpdateMessage(thinkingId, {
        html,
        download: insight.csv || null,
        thinking: false,
        mode: dataset.mode,
      });
    })
    .catch((error) => {
      assistantUpdateMessage(thinkingId, {
        html: `<div class="assistant-card"><p class="text-negative">Unable to complete the request: ${escapeHtml(error.message || error)}</p></div>`,
        thinking: false,
      });
    })
    .finally(() => {
      state.assistant.busy = false;
      assistantScrollToBottom();
      refreshIcons();
    });
}

function assistantBuildHints() {
  const el = state.assistant.elements.hints;
  if (!el) return;
  const hints = [
    "Who are the top deposit brand groups?",
    "Show brands with losses this month.",
    "Summarise retention performance.",
    "Highlight turnover by currency.",
  ];
  el.innerHTML = "";
  hints.forEach((text) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "assistant-hint-btn";
    button.textContent = text;
    button.addEventListener("click", () => assistantProcessQuestion(text));
    el.appendChild(button);
  });
}

function assistantNotifyDataRefresh(
  groups,
  filters,
  { mode = "quick", silent = false, timestamp = Date.now() } = {},
) {
  state.assistant.latestDataset = { groups, filters, mode, timestamp };
  const el = state.assistant.elements.status;
  if (el) {
    const label = mode === "verified" ? "Verified dataset" : "Quick snapshot";
    el.textContent = `${label} • updated ${new Date(timestamp).toLocaleTimeString()}`;
  }
  if (!silent) {
    assistantAddMessage(
      "system",
      `<div class="assistant-card assistant-card--meta"><i data-lucide="database"></i><span>Dataset refreshed (${groups?.length || 0} groups).</span></div>`,
      { html: true, mode },
    );
  }
}

function assistantNotifyNoData() {
  state.assistant.latestDataset = null;
  const el = state.assistant.elements.status;
  if (el) el.textContent = "No dataset loaded";
  assistantAddMessage(
    "system",
    '<div class="assistant-card assistant-card--meta"><i data-lucide="info"></i><span>Data cleared. Load metrics to continue.</span></div>',
    { html: true },
  );
}

function assistantNotifyError(error) {
  assistantAddMessage(
    "system",
    `<div class="assistant-card assistant-card--meta text-negative"><i data-lucide="alert-triangle"></i><span>${escapeHtml(error?.message || "Assistant error occurred")}</span></div>`,
    { html: true },
  );
}

function assistantInit() {
  const el = state.assistant.elements;
  el.panel = document.getElementById("assistantPanel");
  if (!el.panel) return;
  el.messages = document.getElementById("assistantMessages");
  el.input = document.getElementById("assistantInput");
  el.send = document.getElementById("assistantSend");
  el.toggle = document.getElementById("assistantToggle");
  el.collapse = document.getElementById("assistantCollapse");
  el.quickButton = document.getElementById("assistantModeQuick");
  el.verifiedButton = document.getElementById("assistantModeVerified");
  el.hints = document.getElementById("assistantHints");
  el.modeDescriptor = document.getElementById("assistantModeDescriptor");
  el.modeLabel = document.getElementById("assistantModeLabel");
  el.status = document.getElementById("assistantStatus");

  if (state.pendingUrlFilters?.assistantMode) {
    state.assistant.mode = state.pendingUrlFilters.assistantMode;
  } else {
    try {
      const storedMode = localStorage.getItem(STORAGE_KEYS.assistantMode);
      if (storedMode === "verified" || storedMode === "quick") {
        state.assistant.mode = storedMode;
      }
    } catch {
      state.assistant.mode = "quick";
    }
  }

  assistantSetMode(state.assistant.mode, { announce: false });
  assistantBuildHints();

  el.send?.addEventListener("click", assistantHandleSend);
  el.input?.addEventListener("keydown", (event) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      assistantHandleSend();
    }
  });
  el.input?.addEventListener("input", assistantAutosizeInput);

  const toggleHandler = () => assistantTogglePanel(!state.assistant.open);
  el.toggle?.addEventListener("click", toggleHandler);
  el.collapse?.addEventListener("click", toggleHandler);

  el.quickButton?.addEventListener("click", () => assistantSetMode("quick"));
  el.verifiedButton?.addEventListener("click", () =>
    assistantSetMode("verified"),
  );

  el.messages?.addEventListener("click", assistantHandleMessageClick);

  assistantTogglePanel(state.assistant.open);
  assistantRenderMessages();
}

document.addEventListener("DOMContentLoaded", async () => {
  state.pendingUrlFilters = parseUrlFilters();
  state.searchButton = document.getElementById("searchBtn");
  state.searchSpinner = document.getElementById("searchSpinner");
  state.exportView.overlay = document.getElementById("exportOverlay");
  state.exportView.tableBody = document.getElementById("exportTableBody");
  state.exportView.trigger = document.getElementById("openExport");
  state.exportView.close = document.getElementById("closeExport");
  state.exportView.download = document.getElementById("downloadExportCsv");

  state.exportView.trigger?.addEventListener("click", () =>
    toggleExportOverlay(true),
  );
  state.exportView.close?.addEventListener("click", () =>
    toggleExportOverlay(false),
  );
  state.exportView.overlay?.addEventListener("click", (event) => {
    if (event.target === state.exportView.overlay) toggleExportOverlay(false);
  });
  state.exportView.download?.addEventListener("click", downloadExportCsv);

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && state.exportView.open) {
      toggleExportOverlay(false);
    }
  });

  if (!state.pendingUrlFilters?.sortOrder) {
    try {
      const storedSort = localStorage.getItem(STORAGE_KEYS.sort);
      if (storedSort === "asc" || storedSort === "desc") {
        state.sortOrder = storedSort;
      }
    } catch {
      state.sortOrder = "desc";
    }
  }

  const cachedSnapshot = loadSnapshotFromStorage();
  if (cachedSnapshot) {
    state.cachedSnapshot = cachedSnapshot;
  }

  const TomSelectCtor =
    window.TomSelect || window.tomSelect || window.Tomselect;
  const flatpickrCtor = window.flatpickr || window.Flatpickr;
  if (!TomSelectCtor || !flatpickrCtor) {
    setStatus("Required UI libraries failed to load. Please refresh.", "error");
    return;
  }

  state.selects.brandGroup = new TomSelectCtor("#brandGroupSelect", {
    valueField: "value",
    labelField: "label",
    searchField: ["label"],
    plugins: ["remove_button", "checkbox_options"],
    closeAfterSelect: false,
    hideSelected: true,
    persist: false,
    placeholder: "All brand groups",
  });

  state.selects.brand = new TomSelectCtor("#brandSelect", {
    valueField: "value",
    labelField: "label",
    searchField: ["label", "value"],
    plugins: ["remove_button", "checkbox_options"],
    closeAfterSelect: false,
    hideSelected: true,
    persist: false,
    placeholder: "All brands",
  });

  state.selects.currency = new TomSelectCtor("#currencySelect", {
    valueField: "value",
    labelField: "label",
    searchField: ["label"],
    plugins: ["remove_button", "checkbox_options"],
    closeAfterSelect: false,
    hideSelected: true,
    persist: false,
    placeholder: "All currencies",
  });

  state.selects.brandGroup?.on("change", () => {
    refreshBrandOptionsForGroups();
    refreshCurrencyOptions();
  });

  state.selects.brand?.on("change", () => {
    refreshCurrencyOptions();
  });

  state.datePicker = flatpickrCtor("#dateRange", {
    mode: "range",
    dateFormat: "Y-m-d",
  });

  wireQuickRangeButtons();
  wireSettingsPanel();
  assistantInit();

  document.getElementById("resetFilters")?.addEventListener("click", () => {
    state.selects.brandGroup?.clear();
    state.selects.brand?.clear();
    state.selects.currency?.clear();
    refreshBrandOptionsForGroups();
    refreshCurrencyOptions();
    state.datePicker?.clear();
    state.lastGroups = [];
    state.currentGroupsRaw = [];
    state.lastFilters = null;
    renderTable([]);
    assistantNotifyNoData();
    updateShareableUrl({});
    setStatus("Filters cleared. Pick a new range to begin.", "info");
  });

  state.searchButton?.addEventListener("click", () => loadMetrics(true));

  await loadSettings();
  applySettings(state.settings);

  await loadOptions();
  const urlFilters = await applyUrlFilters();
  const shouldAutoLoad = !!(urlFilters?.startDate && urlFilters?.endDate);
  if (urlFilters) {
    updateShareableUrl(urlFilters);
  }

  if (!urlFilters && state.cachedSnapshot && !state.snapshotApplied) {
    applySnapshot(state.cachedSnapshot, { announce: false });
  } else if (shouldAutoLoad) {
    await loadMetrics();
  } else if (state.lastGroups?.length) {
    renderTable(state.lastGroups);
  }

  assistantRenderMessages();
  assistantTogglePanel(state.assistant.open);
  refreshIcons();

  if (!state.lastGroups?.length) {
    setStatus("Select a date range and press search to load metrics.", "info");
  }
});
function flattenCurrencyNodes(groups) {
  const list = [];
  (groups || []).forEach((group) => {
    (group.currencies || []).forEach((currency) => {
      list.push({
        group: group.brandGroup,
        currency: currency.currency,
        metrics: currency.metrics,
        brands: currency.brands || [],
      });
    });
  });
  return list;
}

function flattenBrandNodes(groups) {
  const list = [];
  (groups || []).forEach((group) => {
    (group.currencies || []).forEach((currency) => {
      (currency.brands || []).forEach((brand) => {
        list.push({
          group: group.brandGroup,
          currency: currency.currency,
          brand: brand.brand,
          metrics: brand.metrics,
        });
      });
    });
  });
  return list;
}

function applyTheme(themeKey) {
  const theme = THEMES[themeKey] || THEMES.midnight;
  Object.entries(theme.cssVars).forEach(([key, value]) => {
    document.documentElement.style.setProperty(key, value);
  });
  if (document.body) {
    document.body.setAttribute("data-theme", themeKey);
  }
}

function applySettings(settings) {
  state.settings = { ...defaultSettings, ...settings };
  document.documentElement.style.setProperty(
    "--font-scale",
    state.settings.fontScale,
  );
  document.documentElement.style.setProperty(
    "--negative-color",
    state.settings.negativeColor,
  );
  applyTheme(state.settings.theme);

  if (state.settingsPanel.fontDisplay) {
    state.settingsPanel.fontDisplay.textContent = `${Math.round(state.settings.fontScale * 100)}%`;
  }
  if (state.settingsPanel.colorPicker) {
    state.settingsPanel.colorPicker.value = state.settings.negativeColor;
  }
  if (state.settingsPanel.themeContainer) {
    Array.from(
      state.settingsPanel.themeContainer.querySelectorAll(".settings-chip"),
    ).forEach((chip) => {
      const key = chip.getAttribute("data-theme");
      chip.classList.toggle("active", key === state.settings.theme);
    });
  }
}

async function loadSettings() {
  try {
    const json = await fetchJSON("/api/dashboard/settings");
    applySettings(json.settings || defaultSettings);
  } catch (err) {
    console.warn("Failed to load dashboard settings", err);
    applySettings(defaultSettings);
  }
}

async function persistSettings(partial) {
  applySettings({ ...state.settings, ...partial });
  try {
    await fetchJSON("/api/dashboard/settings", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(state.settings),
    });
  } catch (err) {
    console.warn("Failed to persist settings", err);
  }
}

function toggleSettingsPanel(show) {
  const overlay = state.settingsPanel.overlay;
  if (!overlay) return;
  overlay.classList.toggle("show", show);
  if (show) {
    applySettings(state.settings);
  }
}

function saveSnapshot(groups, filters = {}) {
  if (!Array.isArray(groups) || !groups.length) return;
  const snapshot = {
    timestamp: Date.now(),
    filters,
    groups,
  };
  try {
    localStorage.setItem(STORAGE_KEYS.snapshot, JSON.stringify(snapshot));
    state.cachedSnapshot = snapshot;
  } catch (err) {
    console.warn("Failed to persist snapshot to browser", err);
  }
  // Also save to disk
  saveCacheSnapshot(groups, filters);
}

function loadSnapshotFromStorage() {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.snapshot);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed?.groups)) return null;
    return parsed;
  } catch {
    return null;
  }
}

function applySnapshot(snapshot, { announce = true } = {}) {
  if (!snapshot || !Array.isArray(snapshot.groups)) return;
  state.cachedSnapshot = snapshot;
  state.lastGroups = snapshot.groups;
  state.snapshotApplied = true;

  const filters = snapshot.filters || {};
  const applySelect = (select, values) => {
    if (!select || !values?.length) return;
    const validValues = ensureArray(values);
    if (validValues.length) {
      select.clear(true);
      select.setValue(
        validValues.filter((value) => select.options[value]),
        true,
      );
    }
  };

  applySelect(state.selects.brandGroup, filters.brandGroups);
  applySelect(state.selects.brand, filters.brands);
  applySelect(state.selects.currency, filters.currencies);

  if (filters.startDate && filters.endDate && state.datePicker) {
    state.datePicker.setDate([filters.startDate, filters.endDate], true);
  }

  renderTable(snapshot.groups);
  if (announce) {
    const date = new Date(snapshot.timestamp || Date.now()).toLocaleString();
    setStatus(`Loaded cached dataset from ${date}.`, "success");
  }
  assistantNotifyDataRefresh(snapshot.groups, snapshot.filters, {
    mode: "quick",
    silent: true,
    timestamp: snapshot.timestamp,
  });
}

function collectParams() {
  if (!state.datePicker || !state.datePicker.selectedDates.length) return null;
  const range = state.datePicker.selectedDates;
  const start = range[0];
  const end = range[1] || range[0];
  const params = new URLSearchParams();
  params.set("startDate", isoDate(start));
  params.set("endDate", isoDate(end));

  const brandGroups = ensureArray(state.selects.brandGroup?.getValue());
  const brands = ensureArray(state.selects.brand?.getValue());
  const currencies = ensureArray(state.selects.currency?.getValue());

  if (brandGroups.length) params.set("brandGroups", brandGroups.join(","));
  if (brands.length) params.set("brands", brands.join(","));
  if (currencies.length) params.set("currencies", currencies.join(","));
  return params;
}

function refreshBrandOptionsForGroups() {
  if (!state.options.brands?.length) return;
  const brandSelect = state.selects.brand;
  if (!brandSelect) return;
  const selectedGroups = ensureArray(state.selects.brandGroup?.getValue())
    .map(normalizeGroupName)
    .filter(Boolean);
  const hasSelection = selectedGroups.length > 0;
  let availableBrands = state.options.brands;

  if (hasSelection) {
    const seen = new Set();
    const filtered = [];
    selectedGroups.forEach((groupKey) => {
      const list = state.options.groupToBrands.get(groupKey) || [];
      list.forEach((brand) => {
        if (seen.has(brand.value)) return;
        seen.add(brand.value);
        filtered.push(brand);
      });
    });
    availableBrands = filtered;
  }

  const previousSelection = ensureArray(brandSelect.getValue());
  brandSelect.clearOptions();
  availableBrands.forEach((brand) => {
    brandSelect.addOption({
      value: brand.value,
      label: brand.label,
      group: brand.group,
      groupKey: brand.groupKey || normalizeGroupName(brand.group),
      project: brand.project,
    });
  });
  brandSelect.refreshOptions(false);

  if (!availableBrands.length) {
    brandSelect.clear(true);
    return;
  }

  const stillValid = previousSelection.filter((value) =>
    availableBrands.some((brand) => brand.value === value),
  );
  if (stillValid.length) {
    brandSelect.setValue(stillValid, true);
  } else if (previousSelection.length) {
    brandSelect.clear(true);
  }
}

function refreshCurrencyOptions() {
  const currencySelect = state.selects.currency;
  if (!currencySelect) return;

  const selectedGroups = ensureArray(state.selects.brandGroup?.getValue())
    .map(normalizeGroupName)
    .filter(Boolean);
  const derived = new Set();

  (state.lastGroups || []).forEach((group) => {
    const groupKey = normalizeGroupName(group.brandGroup);
    if (selectedGroups.length && !selectedGroups.includes(groupKey)) return;
    (group.currencies || []).forEach((currency) => {
      if (currency?.currency) derived.add(currency.currency);
    });
  });

  let currencyValues = Array.from(derived);
  if (!currencyValues.length)
    currencyValues = state.options.currencies?.slice?.() || [];

  const previous = ensureArray(currencySelect.getValue());
  currencySelect.clearOptions();
  currencyValues.forEach((value) =>
    currencySelect.addOption({ value, label: value }),
  );
  currencySelect.refreshOptions(false);

  const stillValid = previous.filter((value) => currencyValues.includes(value));
  if (stillValid.length) {
    currencySelect.setValue(stillValid, true);
  } else if (previous.length) {
    currencySelect.clear(true);
  }
}

async function loadOptions() {
  try {
    const options = await fetchJSON("/api/dashboard/options");
    const brandGroups = Array.isArray(options.brandGroups)
      ? options.brandGroups
      : [];
    const brands = Array.isArray(options.brands) ? options.brands : [];
    const currencies = Array.isArray(options.currencies)
      ? options.currencies
      : [];

    state.options.brandGroups = brandGroups;
    state.options.brands = brands;
    state.options.currencies = currencies;
    state.options.brandLookup = new Map(
      brands.map((item) => [item.value, item]),
    );
    state.options.groupToBrands = new Map();
    brands.forEach((brand) => {
      const groupKey = brand.groupKey || normalizeGroupName(brand.group);
      if (!state.options.groupToBrands.has(groupKey)) {
        state.options.groupToBrands.set(groupKey, []);
      }
      state.options.groupToBrands.get(groupKey).push(brand);
    });

    const brandGroupSelect = state.selects.brandGroup;
    if (brandGroupSelect) {
      const previous = ensureArray(brandGroupSelect.getValue());
      brandGroupSelect.clearOptions();
      brandGroups.forEach((opt) =>
        brandGroupSelect.addOption({
          value: opt.value,
          label: opt.label,
          key: opt.key,
        }),
      );
      brandGroupSelect.refreshOptions(false);
      if (previous.length) {
        const valid = previous.filter((value) =>
          brandGroups.some((option) => option.value === value),
        );
        if (valid.length) brandGroupSelect.setValue(valid, true);
      }
    }

    refreshBrandOptionsForGroups();
    refreshCurrencyOptions();
  } catch (err) {
    console.error("Failed to load filter options", err);
    setStatus("Could not load dimension filters. Try refreshing.", "error");
  }
}
