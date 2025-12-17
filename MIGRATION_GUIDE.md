# Classic Dashboard Migration - Developer Guide

## Quick Start

The classic dashboard has been migrated from Google Apps Script to the Node/Express server. No Google Sheets dependencies remain.

### Access the Dashboard
```
http://localhost:4001/classic
```

### Key Changes

1. **Data Source**: Google Sheets → Dashboard Cache (JSON files)
2. **Backend**: Google Apps Script → Node/Express server
3. **Data Fetch**: `google.script.run` → `fetch()` API calls

## Architecture

### Cache Structure
```
/data/dashboard-cache/
  ├── 2025-01/
  │   ├── all__all__all.json      (all data for Jan 2025)
  │   ├── mcw__all__all.json      (MCW brand group)
  │   └── ...
  ├── 2025-02/
  │   └── ...
```

### Cache File Format (Hierarchical)
```javascript
[
  {
    brandGroup: "MCW",
    metrics: { totalDeposit: 1000, ... },
    currencies: [
      {
        currency: "USD",
        metrics: { totalDeposit: 500, ... },
        brands: [
          {
            brand: "MCW",
            brandGroup: "MCW",
            currency: "USD",
            metrics: { totalDeposit: 500, ... }
          }
        ]
      }
    ]
  }
]
```

## Data Flow

### 1. User selects month from dropdown
```javascript
// UI fires change event
dwMonth.value = "2025-01"
```

### 2. Cache loader fetches data
```javascript
const cached = await loadCacheForMonth({ month: "2025-01" })
// Calls: GET /api/dashboard/cache/load?year=2025&month=01
```

### 3. Data gets flattened
```javascript
// Converts hierarchical to flat array
[
  { brand: "MCW", currency: "USD", metrics: {...} },
  { brand: "MCW", currency: "EUR", metrics: {...} },
  ...
]
```

### 4. Data gets transformed
```javascript
// Converts cache format to Index.html format
// transformToPRFormat() or transformToDWFormat()
```

### 5. UI renders tables/charts
```javascript
// Uses same rendering logic as before
renderTablePR(headers, rows)
```

## Key Functions in Index.html

### `loadCacheForMonth(filters)`
Loads cache data for the selected month.

```javascript
const cached = await loadCacheForMonth()
// Returns: [ { brand, brandGroup, currency, metrics }, ... ]
```

### `flattenCachedData(hierarchical)`
Converts hierarchical cache structure to flat array.

```javascript
const flat = flattenCachedData(cachedHierarchy)
```

### `transformToPRFormat(records)`
Converts cache records to PR Monthly format.

```javascript
const { headers, rows } = transformToPRFormat(records)
```

### `transformToDWFormat(records)`
Converts cache records to Deposit/Withdraw format.

```javascript
const { headers, rows, monthHeaders } = transformToDWFormat(records)
```

### `getSelectedMonth()`
Gets the currently selected month from UI.

```javascript
const month = getSelectedMonth() // "2025-01"
```

### `getAvailableMonths()`
Fetches list of available months from server.

```javascript
const months = await getAvailableMonths()
// Returns: ["2025-02", "2025-01", "2024-12", ...]
```

## API Endpoints

### `GET /classic`
Serves the classic dashboard HTML.

```
GET http://localhost:4001/classic
Response: Index.html
```

### `GET /api/dashboard/cache/load`
Loads cache data for a specific month/filter.

```
GET /api/dashboard/cache/load?year=2025&month=01&brandGroup=&brand=&currency=
Response: { ok: true, data: [...] }
```

### `GET /api/dashboard/cache/months`
Lists available months in the cache.

```
GET /api/dashboard/cache/months
Response: { ok: true, months: ["2025-02", "2025-01", ...] }
```

### `GET /api/dashboard/fx`
Gets current FX rates.

```
GET /api/dashboard/fx
Response: { ok: true, base: "USD", date: "2025-01-31", rates: {...} }
```

## Troubleshooting

### Issue: "Failed to load cache data"
**Cause**: Cache files don't exist for selected month  
**Solution**: 
1. Check if `/data/dashboard-cache/YYYY-MM/all__all__all.json` exists
2. Populate cache using `/api/dashboard/cache/save` endpoint
3. Verify month format is YYYY-MM

### Issue: Data shows as blank or "—"
**Cause**: Cache returned empty data or transformation failed  
**Solution**:
1. Open browser DevTools (F12)
2. Check Network tab for `/api/dashboard/cache/load` response
3. Check Console for error messages
4. Verify cache file contains valid data

### Issue: Filters not working
**Cause**: Filter UI hasn't been updated with new data  
**Solution**:
1. Ensure `prepareFiltersForRows()` is called after loading data
2. Check that `renderMulti()` is properly initializing filter dropdowns
3. Verify filter change handlers are wired correctly

### Issue: Charts not updating
**Cause**: Chart update logic not triggered after data load  
**Solution**:
1. Call `chartRefreshFromCurrent()` after data transformation
2. Verify chart data format matches expected structure
3. Check Chart.js instance is properly initialized

## Development Notes

### Metric Calculations
All computed metrics are calculated in the transformation functions:
- Net Deposit = Total Deposit - Total Withdraw
- Bonus % = (Bonus / Company Win/Loss) × 100
- Ave DEP = Total Deposit / Unique Players

These must match the original Code.gs calculations exactly.

### Month Selection
The month dropdown is populated with available months from:
1. Server API: `/api/dashboard/cache/months`
2. Fallback: Last 6 months from current date

### Error Handling
All network calls have try-catch blocks that:
1. Log errors to console
2. Return empty arrays/objects on failure
3. Allow UI to show "—" (no data) gracefully

### Compatibility
- All visual styling is unchanged
- All chart types are unchanged
- All filter behaviors are unchanged
- All computed formulas are unchanged

## Testing

### Manual Testing Steps

1. **Load the page**
   ```
   http://localhost:4001/classic
   ```

2. **Check data loads**
   - Wait for tables to render
   - Verify KPI cards show values
   - Check charts appear

3. **Test month selection**
   - Click month dropdown
   - Select different month
   - Verify data updates

4. **Test filtering**
   - Click filter dropdowns
   - Select values
   - Verify table/charts update

5. **Test FX rates**
   - Click "Rate" button
   - Check exchange rates display
   - Toggle between Live/Monthly tabs

### Automated Testing
Consider adding tests for:
- `loadCacheForMonth()` with various months
- `flattenCachedData()` with hierarchical input
- `transformToPRFormat()` and `transformToDWFormat()`
- Filter logic with transformed data
- Chart rendering with different metrics

## Performance Notes

- Cache loading: ~100-500ms per month (depends on file size)
- Data transformation: <50ms
- UI rendering: <100ms
- Total perceived load time: ~200-600ms

For production optimization:
- Consider caching transformed data in localStorage
- Implement progressive loading (show data as it arrives)
- Lazy-load charts
- Use Web Workers for data transformation

## Future Enhancements

1. **Dynamic month listing**
   - Already implemented via `/api/dashboard/cache/months`
   
2. **Date range selection**
   - Would require multi-month cache loading
   - Need to aggregate data across months

3. **Real-time data updates**
   - Use WebSockets to push cache updates
   - Auto-refresh dashboard on new data

4. **Export functionality**
   - Export tables as CSV/Excel
   - Export charts as PNG/PDF

5. **Cache warming**
   - Pre-load common months on app startup
   - Use Service Workers for offline support

## Code References

### Main Files Modified
- `Index.html` - 170 lines of new/modified code (data loading section)
- `server-dashboard.js` - 20 lines added (new endpoints)
- `code.gs` - Replaced with deprecation notice

### Key Code Sections
- Lines 4182-4350: Server wrappers and data transformers
- Lines 4208-4500: Cache loading and flattening functions
- Lines 4520-4680: PR/DW format transformers

### Related Code Not Modified
- All table rendering logic (lines 5500+)
- All chart rendering logic (lines 5800+)
- All filter logic (lines 5700+)
- All UI event handlers remain unchanged
