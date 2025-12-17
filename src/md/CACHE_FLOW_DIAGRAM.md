# Cache System Flow Diagrams

## User Flow

```
┌─────────────────────────────────────────────────────────────┐
│                    Dashboard User                           │
└───────────────────────┬─────────────────────────────────────┘
                        │
                        ▼
            ┌───────────────────────┐
            │  Select Filters:      │
            │  - Brand Groups       │
            │  - Brands             │
            │  - Currencies         │
            │  - Date Range         │
            └───────────┬───────────┘
                        │
                        ▼
            ┌───────────────────────┐
            │  Click "Search"       │
            └───────────┬───────────┘
                        │
            ┌───────────▼───────────┐
            │ Check Disk Cache      │
            │ (current month)       │
            └───────┬───────┬───────┘
                    │       │
         [FOUND]────┘       └────[NOT FOUND]
            │                      │
            ▼                      ▼
     ┌────────────┐      ┌─────────────────┐
     │ Load from  │      │ Fetch from API  │
     │ Disk Cache │      │ (upstream)      │
     └────┬───────┘      └────────┬────────┘
          │                       │
          │                       ▼
          │              ┌────────────────┐
          │              │ Save to Disk   │
          │              │ Cache          │
          │              └────────┬───────┘
          │                       │
          └───────┬───────────────┘
                  │
                  ▼
     ┌────────────────────────────┐
     │ Save to Browser            │
     │ localStorage (fallback)    │
     └────────────┬───────────────┘
                  │
                  ▼
     ┌────────────────────────────┐
     │ Render Table               │
     │ Show Status:               │
     │ - "(cached)" or "(fresh)"  │
     └────────────┬───────────────┘
                  │
                  ▼
     ┌────────────────────────────┐
     │ Notify Assistant           │
     │ (for insights)             │
     └────────────────────────────┘
```

## Data Flow: Save Operation

```
Browser (dashboard-pro.js)
    │
    ├─► loadMetrics()
    │   └─► renderTable(groups)
    │   └─► saveSnapshot(groups, filters)
    │       └─► saveCacheSnapshot(groups, filters)
    │           │
    │           └─► fetch('/api/dashboard/cache/save', {
    │               year, month, brandGroup, brand, currency, data
    │           })
    │
    ▼
Server (server-dashboard.js)
    │
    ├─► POST /api/dashboard/cache/save
    │   │
    │   ├─► saveCacheData(year, month, group, brand, currency, data)
    │   │   │
    │   │   ├─► ensureCacheDir()
    │   │   │   └─► fs.mkdir(data/dashboard-cache, { recursive: true })
    │   │   │
    │   │   ├─► getCacheFilePath(year, month, group, brand, currency)
    │   │   │   └─► return "2025-01/group__brand__currency.json"
    │   │   │
    │   │   └─► fs.writeFile(path, JSON.stringify(data))
    │   │       └─► File saved to disk ✓
    │   │
    │   └─► return { ok: true, success: true, path: "..." }
    │
    ▼
Response back to Browser
    │
    └─► console.log('[Cache] Saved to disk: ...')
```

## Data Flow: Load Operation

```
Browser (dashboard-pro.js)
    │
    ├─► loadMetrics()
    │   │
    │   ├─► getCacheMonthKey()
    │   │   └─► return {year: 2025, month: 1}
    │   │
    │   └─► loadCacheSnapshot()
    │       │
    │       └─► fetch('/api/dashboard/cache/load?year=2025&month=1...')
    │
    ▼
Server (server-dashboard.js)
    │
    ├─► GET /api/dashboard/cache/load
    │   │
    │   ├─► loadCacheData(year, month, group, brand, currency)
    │   │   │
    │   │   ├─► ensureCacheDir()
    │   │   │
    │   │   ├─► getCacheFilePath(year, month, group, brand, currency)
    │   │   │   └─► return "2025-01/group__brand__currency.json"
    │   │   │
    │   │   └─► fs.readFile(path)
    │   │       └─► JSON.parse(content)
    │   │           └─► return {success: true, data: {...}}
    │   │
    │   └─► return {ok: true, success: true, data: {...}}
    │
    ▼
Response back to Browser
    │
    └─► Use cached data
        └─► renderTable(groups)
        └─► setStatus("... (cached)")
```

## Directory Structure Timeline

### Initially
```
data/
└── dashboard-settings.json
```

### After First Search (January 2025)
```
data/
├── dashboard-settings.json
└── dashboard-cache/
    └── 2025-01/
        └── all__all__all.json
```

### After Multiple Searches
```
data/
├── dashboard-settings.json
└── dashboard-cache/
    └── 2025-01/
        ├── all__all__all.json
        ├── premium__brand_a__usd.json
        ├── premium__brand_b__inr.json
        ├── standard__brand_c__gbp.json
        └── ...
```

### After Month Changes (February 2025)
```
data/
├── dashboard-settings.json
└── dashboard-cache/
    ├── 2025-01/
    │   ├── all__all__all.json
    │   ├── premium__brand_a__usd.json
    │   └── ...
    └── 2025-02/
        ├── all__all__all.json
        ├── premium__brand_a__usd.json
        └── ...
```

## File Naming Example

### Input:
```javascript
brandGroup = "Premium Group"
brand = "Brand A"
currency = "USD"
```

### Sanitization Process:
```
"Premium Group" → "premium group" → "premium_group"
"Brand A"      → "brand a"      → "brand_a"
"USD"          → "usd"          → "usd"
```

### Output:
```
premium_group__brand_a__usd.json
```

## Cache Hit/Miss Decision Tree

```
┌─────────────────────┐
│  Load Metrics?      │
└──────────┬──────────┘
           │
           ▼
    ┌──────────────┐
    │  Get current │
    │  month/year  │
    └──────┬───────┘
           │
           ▼
  ┌────────────────────┐
  │  Month equals      │
  │  current month?    │
  └────┬──────┬────────┘
   YES │      │ NO
       │      └──────────────────┐
       │                         │
       ▼                         ▼
┌────────────────┐       ┌──────────────┐
│ Fetch from     │       │ Can't use    │
│ Disk Cache     │       │ cached data  │
│ ✓ CACHE HIT    │       │ for old      │
└────────────────┘       │ months       │
                         └──────────────┘
                                │
                                ▼
                         ┌──────────────┐
                         │ Fetch from   │
                         │ API          │
                         │ ✗ CACHE MISS │
                         └──────────────┘
```

## API Call Sequence

### Successful Cache Load

```
Browser                          Server
   │                                │
   │──1. GET /api/dashboard/cache/list?year=2025&month=1──▶
   │                                │
   │                                ├─ Check for 2025-01/
   │                                ├─ List files
   │                                │
   │◀──2. [entries]────────────────────
   │
   │──3. GET /api/dashboard/cache/load?year=2025&month=1──▶
   │                                │
   │                                ├─ Read file
   │                                ├─ Parse JSON
   │                                │
   │◀──4. {success: true, data: {...}}───
   │
   └─ Render table, show "(cached)"
```

### Cache Miss → API Fetch

```
Browser                          Server
   │                                │
   │──1. GET /api/dashboard/cache/list?year=2025&month=1──▶
   │                                │
   │                                ├─ Directory not found
   │                                │
   │◀──2. {entries: []}──────────────────
   │
   │──3. GET /api/dashboard/metrics?...──▶
   │                                │
   │                                ├─ Fetch from API
   │                                ├─ Build metrics
   │                                │
   │◀──4. {groups: [...]}───────────────
   │
   │──5. POST /api/dashboard/cache/save──▶
   │                                │
   │                                ├─ Create 2025-01/
   │                                ├─ Write JSON
   │                                │
   │◀──6. {success: true}──────────────
   │
   └─ Render table, show "(fresh)"
```

## Month Transition

```
┌─────────────────────────────┐
│      Current Month: Jan     │
├─────────────────────────────┤
│ Cache Location:             │
│ data/dashboard-cache/2025-01│
└────────────┬────────────────┘
             │
             │ Time passes...
             │ New month starts
             ▼
┌─────────────────────────────┐
│      Current Month: Feb     │
├─────────────────────────────┤
│ Cache Location:             │
│ data/dashboard-cache/2025-02│
│                             │
│ Old 2025-01 cache still     │
│ exists (can be manually     │
│ deleted)                    │
└─────────────────────────────┘
```

## Cache Lifecycle

```
         ┌────────────┐
         │   Start    │
         └─────┬──────┘
               │
               ▼
     ┌──────────────────────┐
     │  User searches data  │
     └──────────┬───────────┘
                │
                ▼
     ┌──────────────────────┐
     │  Check disk cache    │
     │  for month           │
     └──────┬────────┬──────┘
            │        │
         [HIT]      [MISS]
            │        │
            ▼        ▼
        ┌──┐    ┌──────┐
        │✓ │    │ API  │
        └──┘    └──┬───┘
            │       │
            ▼       ▼
        ┌──────────────────┐
        │ Save to disk     │
        └──────┬───────────┘
               │
               ▼
        ┌──────────────────┐
        │ Save to localStorage
        └──────┬───────────┘
               │
               ▼
        ┌──────────────────┐
        │ Display results  │
        │ with source tag  │
        └──────┬───────────┘
               │
               ▼
        ┌──────────────────┐
        │ Month changes?   │
        └──────┬─────┬─────┘
            [NO]    [YES]
             │       │
             │       ▼
             │  ┌─────────────┐
             │  │ New cache   │
             │  │ for month   │
             │  └──────┬──────┘
             │         │
             └────┬────┘
                  │
                  ▼
          ┌────────────────┐
          │ (Back to top)  │
          └────────────────┘
```

## Performance Comparison

```
                        ┌────────────────┬────────────────┐
                        │  API Fetch     │  Disk Cache    │
├─────────────────────┬─────────────────┼────────────────┤
│ Network             │  2-5 seconds    │  0 ms          │
│ Disk I/O            │  0 ms           │  50-200 ms     │
│ Data Processing     │  500-1000 ms    │  500-1000 ms   │
│ Rendering           │  100-300 ms     │  100-300 ms    │
├─────────────────────┼─────────────────┼────────────────┤
│ TOTAL               │  ~3-6 sec       │  ~0.6-1.5 sec  │
│ SPEEDUP             │  ───────        │  3-10x faster  │
└─────────────────────┴─────────────────┴────────────────┘
```
