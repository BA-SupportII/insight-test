# Development Guide

This guide covers development, debugging, and extending the InsightTrack Dashboard.

## 📋 Table of Contents
1. [Setup](#setup)
2. [Development Workflow](#development-workflow)
3. [Code Organization](#code-organization)
4. [Adding Features](#adding-features)
5. [Debugging](#debugging)
6. [Testing](#testing)
7. [Performance](#performance)
8. [Common Tasks](#common-tasks)

---

## Setup

### Prerequisites
```bash
# Check Node.js version (14+ required)
node --version

# Install npm dependencies
npm install
```

### Development Environment
```bash
# Create .env from template
cp .env.example .env

# Edit with your credentials
# Edit API_BASE, AUTH_USER, AUTH_PASS, AUTH_TENANT
```

### Start Development Server
```bash
# Terminal 1: Start backend
npm run start:dashboard

# Terminal 2: Open browser
# http://localhost:4001/dashboard-pro
```

---

## Development Workflow

### File Structure for New Features

```
Feature: Add Monthly Comparison
├── Backend Changes
│   └── server-dashboard.js
│       └── New function: buildMonthlyComparison()
├── Frontend Changes
│   ├── public/dashboard-pro.html
│   │   └── Add comparison section markup
│   └── public/dashboard-pro.js
│       ├── Add state for comparison data
│       ├── Add renderComparison()
│       └── Update loadMetrics() to fetch comparison
└── Documentation
    └── Update PROJECT_STRUCTURE.md
```

### Coding Standards

#### JavaScript
```javascript
// ✅ Good: Clear naming, documented
function fetchMetricsForRange(startDate, endDate) {
  // Fetch metrics from API and return hierarchical structure
  const params = new URLSearchParams({
    startDate: isoDate(startDate),
    endDate: isoDate(endDate),
  });
  return fetchJSON(`/api/dashboard/metrics?${params}`);
}

// ❌ Bad: Unclear naming, no documentation
function fm(s, e) {
  const p = new URLSearchParams({ startDate: s, endDate: e });
  return fetchJSON(`/api/dashboard/metrics?${p}`);
}
```

#### HTML
```html
<!-- ✅ Good: Semantic, clear IDs, ARIA labels -->
<section class="filter-card">
  <div class="flex items-center gap-3">
    <label for="brandGroupSelect">Brand Group</label>
    <select id="brandGroupSelect" aria-label="Select brand groups"></select>
  </div>
</section>

<!-- ❌ Bad: Generic divs, unclear purpose -->
<div class="card">
  <div>Select</div>
  <select></select>
</div>
```

#### CSS/Tailwind
```html
<!-- ✅ Good: Responsive, consistent -->
<button class="px-3 py-1.5 rounded-full border text-sm font-medium hover:bg-slate-700 transition">
  Filter
</button>

<!-- ❌ Bad: Inline styles, not responsive -->
<button style="padding: 10px; border: 1px solid gray;">Filter</button>
```

---

## Code Organization

### Frontend Module Structure (`dashboard-pro.js`)

```javascript
// 1. Configuration & Constants
const defaultSettings = { ... };
const THEMES = { ... };

// 2. State Management
const state = {
  selects: {},
  cachedSnapshot: null,
  // ... rest of state
};

// 3. Utility Functions
function displayText(value) { ... }
function formatNumber(value) { ... }
function parseDateString(value) { ... }

// 4. DOM Manipulation
function renderTable(groups) { ... }
function renderSummary(groups) { ... }
function updateExportTable(groups) { ... }

// 5. Event Handlers
function wireQuickRangeButtons() { ... }
function wireSettingsPanel() { ... }

// 6. API Functions
async function fetchMetricsData(params) { ... }
async function loadOptions() { ... }

// 7. Initialization
document.addEventListener('DOMContentLoaded', async () => { ... });
```

### Backend Module Structure (`server-dashboard.js`)

```javascript
// 1. Imports & Configuration
import express from 'express';
const API_BASE = process.env.API_BASE || '...';

// 2. Auth & Tokens
async function authenticate() { ... }
function tokenValid() { ... }

// 3. Dimensions (Caching)
async function loadDimensions(force) { ... }
function hydrateDimensions(records, project) { ... }
function brandMetaFor(name) { ... }

// 4. Metrics Building
async function buildDashboardMetrics(query) { ... }
function computeMetrics(record, prevStats, currency) { ... }
function aggregateMetrics(rows) { ... }

// 5. API Routes
app.get('/api/dashboard/options', ...);
app.get('/api/dashboard/metrics', ...);

// 6. Server Start
start(PORT);
```

---

## Adding Features

### Example: Add a New Metric Column

#### Step 1: Backend (server-dashboard.js)

```javascript
// In computeMetrics() function, add:
const playerLifeValue = (totalDeposit - totalWithdraw) / uniquePlayer || 0;

// In aggregateMetrics(), add to sum:
playerLifeValue: base.playerLifeValue + (row.playerLifeValue || 0),
```

#### Step 2: Frontend (dashboard-pro.html)

```html
<!-- In table header (thead), add new th: -->
<th class="px-4 py-3 text-right" title="(Total Deposit - Total Withdraw) / Unique Player">
  <span class="header-label">Player LTV</span>
</th>

<!-- In export table header, add: -->
<th scope="col">Player LTV</th>
```

#### Step 3: Frontend (dashboard-pro.js)

```javascript
// In renderTable(), add cell render:
case 'playerLifeValue':
  return renderNumberCell(metrics.playerLifeValue);

// In buildExportRows(), add to metrics export:
playerLifeValue: metric.playerLifeValue,
```

#### Step 4: Update Documentation

```markdown
# BRAND_GROUP_DETAILS.md
| Player LTV | (Total Deposit - Total Withdraw) / Unique Player | Lifetime value per player |
```

---

## Debugging

### Browser DevTools

```javascript
// Check current state
console.log('Current state:', state);

// Check loaded metrics
console.log('Last groups:', state.lastGroups);

// Check selected filters
console.log('Brand groups:', state.selects.brandGroup.getValue());
console.log('Date range:', state.datePicker.selectedDates);

// Monitor API calls
// Open Network tab → Filter by /api/dashboard
```

### Backend Logging

```javascript
// Add debug logs in server-dashboard.js
console.log('[Dimensions] Loading for projects:', DIMENSION_PROJECTS);
console.log('[Metrics] Building with filters:', query);
console.log('[Auth] Token expires:', new Date(tokenExpMs).toISOString());

// Enable verbose output
process.env.DEBUG=* npm run start:dashboard
```

### Common Issues

#### "Cannot read property 'getValue' of undefined"
```javascript
// Issue: Tom Select not initialized
// Fix: Check if TomSelectCtor is loaded
if (!window.TomSelect) {
  console.error('Tom Select library not loaded');
  return;
}
```

#### "Metrics undefined after search"
```javascript
// Issue: API response malformed
// Fix: Check API response in Network tab
// Look for: response.ok, response.groups exists

// Add defensive coding:
if (!response?.groups || !Array.isArray(response.groups)) {
  console.error('Invalid metrics response:', response);
  return;
}
```

#### "Date range not saving to URL"
```javascript
// Issue: updateShareableUrl() not called
// Fix: Ensure called after successful search
saveSnapshot(groups, filters);
updateShareableUrl(filters);
```

---

## Testing

### Manual Testing Checklist

- [ ] **Selection Flow**
  - Select brand group → brands filtered
  - Select brand → currencies updated
  - Change date range → no issues
  
- [ ] **Search & Load**
  - Click Search → data loads
  - Summary cards update
  - Table populates

- [ ] **Interaction**
  - Click group row → expands/collapses
  - Click currency → shows brands
  - Sort by column → works

- [ ] **Export**
  - Click Export → preview shows
  - Download CSV → valid format
  - CSV data matches table

- [ ] **URL Sharing**
  - Apply filters → URL updates
  - Copy URL → share with user
  - New user opens URL → filters apply

- [ ] **Settings**
  - Adjust font size → size changes
  - Change theme → theme applies
  - Change negative color → updates

### Test Data

Create test scenarios:
```javascript
// In browser console:

// Test 1: Single brand group
state.selects.brandGroup.setValue(['cx'], true);
await loadMetrics(true);

// Test 2: Multiple currencies
state.selects.currency.setValue(['USD', 'INR'], true);
await loadMetrics(true);

// Test 3: Date range
state.datePicker.setDate(['2025-12-01', '2025-12-31'], true);
await loadMetrics(true);
```

---

## Performance

### Frontend Optimization

```javascript
// Good: Debounce expensive operations
const debouncedSearch = debounce(loadMetrics, 500);
input.addEventListener('change', debouncedSearch);

// Good: Cache DOM references
const tableBody = document.getElementById('tableBody');

// Bad: Repeated DOM queries
for (const row of data) {
  document.getElementById('tableBody').appendChild(row); // ❌
}

// Good: Batch DOM operations
const fragment = document.createDocumentFragment();
for (const row of data) {
  fragment.appendChild(row);
}
tableBody.appendChild(fragment);
```

### Backend Optimization

```javascript
// Good: Use dimension cache
if (dimCache.loaded && !force) {
  return; // Return cached data
}

// Good: Limit concurrent requests
const results = await mapWithConcurrency(brands, 6, fetchBrand);

// Bad: No request limits
const results = await Promise.all(brands.map(fetchBrand)); // ❌
```

### Caching Strategy

```
┌─────────────────────────────────────┐
│ Frontend                            │
├─────────────────────────────────────┤
│ Snapshot Cache (localStorage)       │
│ TTL: Session (until cleared)        │
│ Stores: Last search + results       │
└──────────────────┬──────────────────┘
                   │
                   ▼
┌─────────────────────────────────────┐
│ Backend                             │
├─────────────────────────────────────┤
│ Dimension Cache (in-memory)         │
│ TTL: 30 minutes                     │
│ Stores: Brand groups, group→brands  │
│                                     │
│ FX Rate Cache (in-memory)           │
│ TTL: 5 minutes                      │
│ Stores: Exchange rates              │
└─────────────────────────────────────┘
```

---

## Common Tasks

### Add a New Theme

```javascript
// In THEMES object (dashboard-pro.js):
{
  myTheme: {
    label: 'My Theme',
    cssVars: {
      '--bg-gradient': 'linear-gradient(135deg, #color1 0%, #color2 100%)',
      '--button-primary': '#color3',
      '--text-primary': '#color4',
      // ... copy all vars from existing theme
    }
  }
}
```

### Change Default Currency Set

```javascript
// In server-dashboard.js:
const DEFAULT_CURRENCY_SET = 'USD,EUR,GBP,JPY,AUD,CAD,CHF,CNY,INR';
```

### Add New Quick Range Button

```javascript
// 1. HTML (dashboard-pro.html):
<button class="quick-range-btn" data-range="last-week">Last Week</button>

// 2. JavaScript (dashboard-pro.js):
// Add case in getPresetRange():
case 'last-week': {
  const weekday = start.getDay() || 7;
  start.setDate(start.getDate() - (weekday - 1) - 7);
  end.setDate(start.getDate() + 6);
  break;
}
```

### Add New API Endpoint

```javascript
// In server-dashboard.js:
app.get('/api/dashboard/newfeature', async (req, res) => {
  try {
    const result = await buildNewFeature(req.query);
    res.json({ ok: true, data: result });
  } catch (err) {
    res.status(500).json({ ok: false, error: err?.message });
  }
});

// Then call from frontend:
async function fetchNewFeature(params) {
  return fetchJSON('/api/dashboard/newfeature', { method: 'GET', ...params });
}
```

### Debug Network Requests

```javascript
// Add request/response logging
const originalFetch = window.fetch;
window.fetch = function(...args) {
  console.log('Fetch:', args[0]);
  return originalFetch.apply(this, args)
    .then(response => {
      console.log('Response:', response.status);
      return response;
    });
};
```

---

## Code Review Checklist

Before committing:

- [ ] **Code Quality**
  - [ ] No console.log() statements (except dev)
  - [ ] No commented-out code blocks
  - [ ] Functions are < 50 lines where possible
  - [ ] Comments explain "why", not "what"

- [ ] **Performance**
  - [ ] No N+1 queries
  - [ ] Proper use of caching
  - [ ] Event listeners are cleaned up

- [ ] **Security**
  - [ ] No API keys in code
  - [ ] Input validation on backend
  - [ ] CORS properly configured

- [ ] **Documentation**
  - [ ] Code comments updated
  - [ ] README updated if needed
  - [ ] DEVELOPMENT.md reflects changes

- [ ] **Testing**
  - [ ] Feature works in target browsers
  - [ ] No console errors
  - [ ] Error handling present

---

## Resources

- **Frontend**: `/public/dashboard-pro.js` (2470+ lines, well-commented)
- **Backend**: `/server-dashboard.js` (1127+ lines, well-commented)
- **Structure**: `PROJECT_STRUCTURE.md`
- **Data Mapping**: `BRAND_GROUP_DETAILS.md`
- **API Spec**: Comments in `server-dashboard.js` route handlers

---

## Getting Help

1. Check existing code comments
2. Review PROJECT_STRUCTURE.md and BRAND_GROUP_DETAILS.md
3. Search GitHub issues (if applicable)
4. Ask team lead or code reviewer

---

**Last Updated**: December 2024
