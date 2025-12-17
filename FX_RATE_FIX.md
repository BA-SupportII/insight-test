# FX Rate Per Currency Fix

## Issue
The Apps Script (Webappproject) was attempting to fetch FX rates directly from external APIs, which caused issues with:
- Rate limiting on external API calls
- Inconsistent fallback handling for missing currencies
- Poor error handling and retries

## Solution
Moved FX rate fetching to the server backend (`server-dashboard.js`), which now acts as a centralized point for all FX rate requests.

## Changes Made

### 1. **Server Endpoint** (`server-dashboard.js`)
Added `/api/dashboard/fx/monthly` endpoint that:
- Fetches EOM (End of Month) rates from Frankfurter API for all available currencies
- Fills in missing currencies (AED, BDT, LKR, MMK, NPR, OMR, PKR, SAR, VND) with fallback providers:
  - Fawaz currency API (dated snapshots)
  - CurrencyFreaks (for pegged currencies)
  - ExchangeRate-API (as final fallback)
- Returns rates with source mapping so you know where each rate came from
- Supports batch requests (multiple months in one call)

### 2. **Apps Script Updates** (`Webappproject`)
Modified to use the server endpoint:
- Replaced `fetchFrankfurter()` with `fetchMonthlyFxFromServer()`
- Updated `eomRates()` to fetch from server
- Refactored `getMonthlyRates()` to batch fetch all months at once instead of individual calls

## API Flow

```
Apps Script → Server (/api/dashboard/fx/monthly) → Frankfurter + Fallbacks → Rates returned with source map
```

## Query Parameters
- `months`: CSV of months (e.g., "2025-07,2025-08,2025-09")
- `base`: Base currency (default: USD)

## Response Format
```json
{
  "2025-07": {
    "base": "USD",
    "month": "2025-07",
    "date": "2025-07-31",
    "rates": {
      "USD": 1,
      "AED": 3.67,
      "AUD": 1.52,
      ...
    },
    "sourceMap": {
      "USD": "ecb",
      "AED": "fallback",
      "BDT": "fallback",
      ...
    }
  }
}
```

## Benefits
✅ Centralized FX rate management  
✅ Batch requests (no N+1 calls)  
✅ Better fallback handling for all currencies  
✅ Source tracking for debugging  
✅ Reduced load on external APIs  
✅ Single cache point for all apps  
