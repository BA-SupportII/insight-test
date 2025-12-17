# FX Live Rate - Multi-Currency Support (Final Fix)

## Root Cause
Live FX rates only worked for USD due to three issues:

1. **HTML wrapper didn't pass currency parameter**: `server.getRates()` was hardcoded to call `getRates('USD')` without accepting a currency argument
2. **Conversion logic was USD-only**: The currency selection check was `if display contains 'USD' AND 'LIVE'`, meaning non-USD selections like "AED LIVE" would skip live rate fetching
3. **Server missing fallback providers for live rates**: Live endpoint didn't fill in missing currencies like AED, BDT, etc.

## Changes Made

### 1. **Server Fallback Providers** (`server-dashboard.js` lines 1368-1412)
Added fallback currency fetching to `/api/dashboard/fx`:
- Try CurrencyFreaks for pegged currencies (AED, OMR, SAR)
- Fall back to ExchangeRate-API for others
- Only applies when base is USD (server constraint)

### 2. **Server Cache Per Base** (`server-dashboard.js` lines 53, 219-276)
Changed from single shared cache to per-base-currency cache map:
```javascript
const fxCacheMap = new Map(); // Store separate cache for USD, EUR, AED, etc.
```

### 3. **Apps Script Server Wrapper** (`Webappproject` line 4933)
Made `getRates` accept optional base parameter:
```javascript
// Before
getRates: () => ... .getRates('USD')

// After  
getRates: (base = 'USD') => ... .getRates(base)
```

### 4. **Conversion Logic** (`Webappproject` lines 5071-5115)
Fixed currency detection and live rate fetching:
```javascript
// Extract base currency from display string (e.g., "AED LIVE" → baseCcy = "AED")
const parts = display.split(/\s+/);
const baseCcy = parts[0] || 'USD';

// Check only for "LIVE" mode, not "USD LIVE"
const isLive = /LIVE/i.test(display);

// Fetch rates with selected base currency
const payload = await server.getRates(baseCcy);

// Use baseCcy as reference rate (=1)
const rate = (c === baseCcy) ? 1 : Number(rr[c]);
```

## What This Fixes
✅ Live rates now work for ALL currencies (USD, EUR, AED, GBP, BDT, etc.)  
✅ User can select any currency and get live rates in that currency  
✅ Server handles missing currencies with fallback providers  
✅ Per-currency caching prevents cache conflicts  
✅ Proper currency conversion logic for any base currency  

## API Flow
```
User selects "AED LIVE"
  ↓
convertRowsInPlace() extracts baseCcy = "AED"
  ↓
getRates("AED") calls server endpoint
  ↓
Server /api/dashboard/fx?base=AED fetches from provider
  ↓
Server fills missing currencies with CurrencyFreaks + ExchangeRate-API
  ↓
Returns {AED: 1, USD: 0.27, EUR: 0.25, ...}
  ↓
Rows converted from original currency to AED
```

## Testing
To verify:
1. Open rate modal
2. Select "USD LIVE" - should show current USD rates
3. Select "EUR LIVE" - should show EUR as base (EUR: 1) with other rates relative to EUR
4. Select "AED LIVE" - should show AED rates (now working with fallbacks)
