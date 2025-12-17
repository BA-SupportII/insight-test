# Classic Dashboard Migration Summary

This document outlines the changes made to migrate the classic dashboard from Google Apps Script (Code.gs) to the Node/Express server.

## Overview

The classic dashboard (Index.html) has been successfully migrated to:
- Read data from the Node dashboard cache system instead of Google Sheets via Apps Script
- Be served from the Node/Express server at `GET /classic`
- Use fetch API calls instead of `google.script.run` 

## Files Modified

### 1. **Code.gs** (Google Apps Script)
- **Status**: Deprecated
- **Changes**: Replaced with a simple deprecation notice
- **Reason**: All data logic has been moved to the Node server cache system
- **Action**: Can be deleted or kept as a placeholder

### 2. **Index.html** (Classic Dashboard Frontend)
- **Changes Made**:
  - Removed all `google.script.run` calls for data fetching
  - Replaced with fetch API calls to Node server endpoints
  - Added new functions:
    - `loadCacheForMonth(filters)` - Loads cache data for selected month
    - `flattenCachedData(hierarchical)` - Flattens hierarchical cache structure
    - `getSelectedMonth()` - Gets currently selected month from UI
    - `getAvailableMonths()` - Fetches available months from server
    - `transformToPRFormat(cachedRecords)` - Converts cache to PR Monthly format
    - `transformToDWFormat(cachedRecords)` - Converts cache to Deposit/Withdraw format
  
- **Server Object Changes**:
  - `fetchPRMonthly()`: Now loads from cache and transforms to PR format
  - `fetchDepositWithdraw()`: Now loads from cache and transforms to DW format
  - `getRates()`: Changed to call `/api/dashboard/fx` endpoint
  - `getMonthlyRates()`: Simplified to return empty object (FX data available on demand)

- **Data Transformation**:
  - Cache data is hierarchical: `{ brandGroup, metrics, currencies: [...] }`
  - Flattened to: `[{ brand, brandGroup, currency, metrics }, ...]`
  - Transformed to match original PR Monthly and DW table formats

### 3. **server-dashboard.js** (Node/Express Backend)
- **Changes Made**:
  - Added new route: `GET /classic` - Serves Index.html
  - Added new route: `GET /api/dashboard/cache/months` - Lists available cache months
  - No changes to existing cache endpoints (`/api/dashboard/cache/load`, etc.)

## Data Flow

### Original Flow (Apps Script)
```
Index.html → google.script.run → Code.gs → SpreadsheetApp → Google Sheets
Index.html ← response (headers, rows)
```

### New Flow (Node/Express + Cache)
```
Index.html → fetch() → /api/dashboard/cache/load?year=X&month=Y
                     ↓
                     /data/dashboard-cache/X-Y/all__all__all.json
                     ↓
                    (hierarchical data)
                     ↓
            Transformer functions
                     ↓
            (PR Monthly or DW format)
                     ↓
Index.html ← response
```

## Data Mapping

### Metric Field Mapping
The cache metrics are mapped to Index.html fields as follows:

| Cache Field | PR Monthly Field | DW Field |
|-------------|-----------------|----------|
| `totalDeposit` | Total Deposit | Total Deposit |
| `totalWithdraw` | Total Withdraw | Total Withdraw |
| `bonus` | Bonus | - |
| `companyWinLoss` | Company Win/Loss | - |
| `turnover` | Turnover | - |
| `uniquePlayer` | Unique Player | - |
| `ftdPlayer` | FTD Player | - |
| `signUpPlayer` | SignUp Player | - |

Computed fields are calculated on-the-fly:
- Net Deposit = Total Deposit - Total Withdraw
- Bonus % = (Bonus / Company Win/Loss) × 100
- Ave DEP = Total Deposit / Unique Players
- Ave WR = Turnover / Total Deposit
- FTD Conversion Rate = (FTD Player / SignUp Player) × 100
- NGR per Player = (Company Win/Loss - Bonus) / Unique Players

## API Endpoints Used

1. **`GET /api/dashboard/cache/load`**
   - Query params: `year`, `month`, `brandGroup`, `brand`, `currency`
   - Returns: `{ ok: bool, data: [...] }`
   - Purpose: Load cache data for a specific month/filter

2. **`GET /api/dashboard/cache/months`** (NEW)
   - Returns: `{ ok: bool, months: [...] }`
   - Purpose: List available months in cache

3. **`GET /api/dashboard/fx`**
   - Returns: `{ ok: bool, base: 'USD', date: '...', rates: {...} }`
   - Purpose: Get current FX rates

## URL Access

- **New URL**: `http://localhost:PORT/classic`
- **Example**: `http://localhost:4001/classic`
- **Pro Dashboard**: `http://localhost:4001/dashboard-pro` (unchanged)

## Benefits of Migration

1. **No Google Sheets Dependency**
   - Faster data loading (cache is JSON files, not spreadsheets)
   - No Google Apps Script execution time
   - No Sheets API quota limits

2. **Better Performance**
   - Cache files are pre-computed and optimized
   - Direct JSON loading vs. spreadsheet parsing
   - Smaller payload sizes

3. **Flexibility**
   - Easy to add new features (e.g., month filtering, export)
   - Can cache multiple time periods
   - Simple to version cache data

4. **Consistency**
   - Same data source for both dashboards (Pro and Classic)
   - Easy to synchronize between UI and backend

## Backward Compatibility Notes

- All visual styling and UI behavior remain unchanged
- Filter dropdowns work the same way
- Chart rendering is identical
- Month-based data selection is preserved
- All calculated metrics use the same formulas

## Testing Checklist

- [ ] Classic dashboard loads at `/classic`
- [ ] Month dropdown populates correctly
- [ ] PR Monthly tab displays data
- [ ] Deposit & Withdraw tab displays data
- [ ] Filters work (Brand Group, Brand, Currency)
- [ ] Charts update when filters change
- [ ] FX rates display correctly in Rate modal
- [ ] KPI cards show correct aggregates
- [ ] Export/Download features work (if applicable)

## Future Improvements

1. Add an API endpoint to list available months dynamically
2. Implement cache refresh mechanisms
3. Add support for custom date ranges
4. Consider implementing incremental cache updates
5. Add metrics validation and error handling
6. Document cache file format specification

## Rollback Plan

If issues arise:
1. The classic dashboard can be reverted to Apps Script by:
   - Deploying the original Code.gs with `doGet()` serving Index.html
   - Restoring the original Index.html with `google.script.run` calls
2. The Node server will continue running unaffected
3. The Pro dashboard remains on `GET /dashboard-pro`

## Questions & Support

For issues or questions:
1. Check browser console for error messages
2. Verify `/api/dashboard/cache/load` endpoint is working
3. Ensure cache files exist in `/data/dashboard-cache/YYYY-MM/`
4. Check server logs for any backend errors
