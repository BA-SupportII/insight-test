# Dashboard Cache System

## Overview

The dashboard now supports persistent file-based caching of metrics data organized by month. Instead of relying solely on browser localStorage, all fetched data is automatically saved to the local file system and organized by date.

## Cache Structure

Data is stored in the following directory structure:

```
data/
└── dashboard-cache/
    ├── 2025-01/
    │   ├── group_a__brand_1__usd.json
    │   ├── group_a__brand_2__inr.json
    │   └── ...
    ├── 2025-02/
    │   ├── group_b__brand_3__mxn.json
    │   └── ...
    └── ...
```

### File Naming Convention

Each cache file is named using the format:
```
{brandGroup}__{brand}__{currency}.json
```

- **brandGroup**: Brand group identifier (sanitized, lowercase)
- **brand**: Brand identifier (sanitized, lowercase)
- **currency**: Currency code (sanitized, lowercase)
- Special value `all` is used for empty or wildcard selections

### Directory Organization

- Files are organized by **month** in the format `YYYY-MM`
- Each month directory contains all cached data for that period
- This allows easy data retention management by month

## Data Format

Each cache file contains:

```json
{
  "timestamp": 1609459200000,
  "filters": {
    "startDate": "2025-01-01",
    "endDate": "2025-01-31",
    "brandGroups": ["Group A"],
    "brands": ["Brand 1"],
    "currencies": ["USD"]
  },
  "groups": [
    {
      "brandGroup": "Group A",
      "metrics": { /* ... */ },
      "currencies": [
        {
          "currency": "USD",
          "metrics": { /* ... */ },
          "brands": [
            {
              "brand": "Brand 1",
              "brandGroup": "Group A",
              "currency": "USD",
              "metrics": { /* ... */ }
            }
          ]
        }
      ]
    }
  ]
}
```

## How It Works

### Saving Cache

When you fetch metrics:
1. Data is fetched from the upstream API
2. Automatically saved to disk cache with current month/year
3. Also saved to browser localStorage for backward compatibility

### Loading Cache

When you load metrics:
1. System checks disk cache for current month
2. If found, loads from disk cache (faster)
3. If not found, fetches from upstream API
4. Status message indicates source: "(cached)" or "(fresh)"

## API Endpoints

### Save Cache
```bash
POST /api/dashboard/cache/save
```

**Request Body:**
```json
{
  "year": 2025,
  "month": 1,
  "brandGroup": "group_a",
  "brand": "brand_1",
  "currency": "USD",
  "data": {
    "timestamp": 1609459200000,
    "filters": { /* ... */ },
    "groups": [ /* ... */ ]
  }
}
```

### Load Cache
```bash
GET /api/dashboard/cache/load?year=2025&month=1&brandGroup=group_a&brand=brand_1&currency=USD
```

**Response:**
```json
{
  "ok": true,
  "success": true,
  "data": {
    "timestamp": 1609459200000,
    "filters": { /* ... */ },
    "groups": [ /* ... */ ]
  }
}
```

### List Cache by Month
```bash
GET /api/dashboard/cache/list?year=2025&month=1
```

**Response:**
```json
{
  "ok": true,
  "success": true,
  "entries": [
    {
      "brandGroup": "group_a",
      "brand": "brand_1",
      "currency": "usd",
      "file": "group_a__brand_1__usd.json"
    },
    { /* ... */ }
  ]
}
```

## Frontend Functions

### `saveCacheSnapshot(groups, filters)`
Saves fetched metrics data to disk cache.

```javascript
await saveCacheSnapshot(groups, {
  startDate: "2025-01-01",
  endDate: "2025-01-31",
  brandGroups: ["Group A"],
  brands: ["Brand 1"],
  currencies: ["USD"]
});
```

### `loadCacheSnapshot()`
Loads cached data from disk for the current month.

```javascript
const cached = await loadCacheSnapshot();
if (cached && cached.groups) {
  // Use cached data
  renderTable(cached.groups);
}
```

### `listCachedItems()`
Lists all cached items for the current month.

```javascript
const items = await listCachedItems();
items.forEach(item => {
  console.log(`${item.brandGroup} / ${item.brand} / ${item.currency}`);
});
```

## Benefits

1. **Performance**: Faster data loading on repeated queries within the same month
2. **Offline Access**: Can view cached data without API connection
3. **Data Organization**: Automatic monthly organization makes retention easy
4. **Multi-User**: Each user maintains their own cache
5. **Persistent**: Data survives browser restarts
6. **Flexibility**: Supports caching by brand group, brand, and currency combinations

## Cache Management

### Manual Cleanup

To clear cache for a specific month:
```bash
rm -rf data/dashboard-cache/2025-01
```

To clear all cache:
```bash
rm -rf data/dashboard-cache
```

### Automatic Retention (Optional)

You can add automatic cleanup by implementing a scheduled task:

```javascript
async function cleanupOldCache(monthsToKeep = 3) {
  const now = new Date();
  const cutoff = new Date(now.getFullYear(), now.getMonth() - monthsToKeep, 1);
  // Delete directories older than cutoff
}
```

## Status Messages

The dashboard provides feedback about cache status:

- **"Checking disk cache..."** - Looking for cached data
- **"Loaded from disk cache for this month. (cached)"** - Data loaded from disk
- **"Fetching metrics from upstream..."** - Fetching fresh data from API
- **"Loaded X groups. (fresh)"** - New data from API

## Troubleshooting

**Q: Cache data seems outdated**
A: Clear the cache for that month: `rm -rf data/dashboard-cache/2025-01`

**Q: Permission errors when saving cache**
A: Ensure the `data/` directory is writable: `chmod 755 data/`

**Q: Cache file is corrupted**
A: Delete the specific file and re-fetch the data.

## Configuration

No additional configuration required. The system automatically:
- Creates cache directories as needed
- Sanitizes filenames for safe file storage
- Organizes by current month
- Maintains compatibility with browser cache

## Future Enhancements

Possible improvements:
- Compression of cache files
- Cache versioning/migration
- Automatic cleanup of old cache
- Cache statistics dashboard
- Multi-month cache querying
