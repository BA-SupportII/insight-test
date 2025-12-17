# FX Live Rate Fix - Multi-Currency Support

## Issue
Live FX rates were only working for USD because:
1. Apps Script was calling external API providers directly with non-USD base currencies
2. Most free FX API providers only support USD as the base currency
3. Server's live FX cache was not keyed by base currency - it would overwrite when switching bases

## Solution
Implemented server-based live FX rate fetching with per-currency caching.

## Changes Made

### 1. **Server Cache** (`server-dashboard.js` line 53)
Changed from single cache object to per-base-currency cache map:
```javascript
// Before
const fxCache = { base: 'USD', fetchedAt: 0, rates: null, date: null };

// After
const fxCacheMap = new Map(); // Store caches per base currency
```

### 2. **Server FX Fetch** (`server-dashboard.js` lines 219-276)
Updated `fetchLatestFx()` to:
- Maintain separate cache entries for each base currency
- Properly check/store cached rates per base
- Return correct rates for any requested base (USD, EUR, AED, etc.)

### 3. **Apps Script Live Fetch** (`Webappproject` lines 515-545)
Updated `getRatesForDate()` to:
- Use server endpoint for live rates: `/api/dashboard/fx?base={currency}`
- Fall back to direct API providers if server is unavailable
- Support any base currency through server

## API Flow

```
Apps Script → Server (/api/dashboard/fx?base=EUR) → Providers (fawaz, exchangerate.host, ER-API) 
→ Returns rates with selected base
```

## What It Fixes
✅ Live rates now work for all currencies (USD, EUR, AED, GBP, INR, etc.)  
✅ Per-currency caching prevents cache conflicts  
✅ Server handles multi-base-currency requests  
✅ Fallback providers ensure coverage for non-USD bases  
✅ No more relying on providers that only support USD base  

## Cache Behavior
- Each base currency has its own 5-minute cache
- EUR cache stays independent from USD cache
- Switching currencies doesn't invalidate other caches
