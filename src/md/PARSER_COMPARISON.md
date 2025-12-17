# Parser Scripts Comparison

## Overview

Two parser scripts for generating monthly dashboard caches from TSV data. The second version adds proper retention rate calculation.

## Version 1: `parse-monthly-data.mjs`
**Status**: Initial version (retention rates = null)

### Limitations
- Processes each month independently
- No access to previous month data
- `retentionRate` always = `null`
- Quick to implement but incomplete metrics

### Processing Flow
```
Read TSV
  ↓
Group by Month
  ↓
For each month:
  └─ Build dashboard structure
  └─ Compute metrics (no prev stats)
  └─ Write all__all__all.json
```

## Version 2: `parse-monthly-data-with-retention.mjs` ✓ RECOMMENDED
**Status**: Enhanced version (full metric calculation)

### Improvements
✓ Chronologically sorts months  
✓ Builds previous month stats map  
✓ Passes prev stats to computeMetrics  
✓ Accumulates previous totals at aggregation levels  
✓ Calculates actual retention rates  
✓ Matches server-dashboard.js logic exactly

### Processing Flow
```
Read TSV
  ↓
Group by Month
  ↓
Sort Months Chronologically
  ↓
For each month (i):
  ├─ If i > 0:
  │  └─ Build prevMap from month[i-1]
  ├─ Build dashboard structure (with prevMap)
  ├─ computeMetrics(record, prevStats)
  ├─ Aggregate with prevTotals
  ├─ finalizeGroupMetrics(totals, prevTotals)
  └─ Write all__all__all.json
```

## Feature Comparison Table

| Feature | v1 | v2 |
|---------|----|----|
| Month grouping | ✓ | ✓ |
| Metric aggregation | ✓ | ✓ |
| Currency multipliers | ✓ | ✓ |
| Base metrics | ✓ | ✓ |
| Derived metrics | ✓ | ✓ |
| **Retention rate** | ✗ | ✓ |
| **Previous stats tracking** | ✗ | ✓ |
| **Chronological processing** | ✗ | ✓ |
| **FTD conversion rate** | ✓ | ✓ |

## Code Comparison: Key Differences

### Version 1: Independent Processing
```javascript
// No previous data access
function buildDashboardStructure(records) {
  // Process only current month
  for (const [brand, record] of Object.entries(brandMap)) {
    const metrics = computeMetrics(record, null, currency);
    // prevStats is null → retentionRate = null
  }
}
```

### Version 2: Historical Awareness
```javascript
// With previous month data
function buildDashboardStructure(records, prevMap = new Map()) {
  // Process current month with historical context
  for (const [brand, record] of Object.entries(brandMap)) {
    const prevStatsKey = `${brandGroup}::${brand}::${currency}`;
    const prevStats = prevMap.get(prevStatsKey);
    const metrics = computeMetrics(record, prevStats, currency);
    // prevStats provided → retentionRate calculated
  }
}
```

## Retention Rate Calculation Details

### Version 1
```javascript
function computeMetrics(record, prevStats = null, currency = '') {
  // ...
  let retentionRate = null;  // Always null since prevStats not provided
  // ...
}
```

### Version 2
```javascript
function computeMetrics(record, prevStats = null, currency = '') {
  // ...
  let retentionRate = null;
  if (prevStats) {
    const prevUnique = num(prevStats.uniquePlayer);
    const prevFtd = num(prevStats.ftdPlayer);
    if (prevUnique > 0) {
      retentionRate = ((uniquePlayer - prevFtd) / prevUnique) * 100;
    }
  }
  // ...
}

function finalizeGroupMetrics(base, prevTotals = { uniquePlayer: 0, ftdPlayer: 0 }) {
  // ...
  let retentionRate = null;
  const prevUnique = num(prevTotals.uniquePlayer);
  const prevFtd = num(prevTotals.ftdPlayer);
  if (prevUnique > 0) {
    retentionRate = ((base.uniquePlayer - prevFtd) / prevUnique) * 100;
  }
  // ...
}
```

## Output Examples

### Version 1 Output (2025-07)
```json
{
  "brandGroup": "CX",
  "metrics": {
    "uniquePlayer": 927977,
    "ftdPlayer": 179949,
    "retentionRate": null,  // ✗ Missing calculation
    "ftdConversionRate": 29.31
  }
}
```

### Version 2 Output (2025-07)
```json
{
  "brandGroup": "CX",
  "metrics": {
    "uniquePlayer": 927977,
    "ftdPlayer": 179949,
    "retentionRate": 401.66,  // ✓ Calculated from June data
    "ftdConversionRate": 29.31
  }
}
```

## Performance Comparison

| Metric | v1 | v2 |
|--------|----|----|
| Processing time | Faster | Slightly slower |
| Memory usage | Lower | Higher (stores prev data) |
| Accuracy | Incomplete | Complete |
| Server compatibility | Partial | Full |

## Recommendation

**Use Version 2: `parse-monthly-data-with-retention.mjs`**

Reasons:
1. Matches `buildDashboardMetrics()` logic exactly
2. Provides complete metrics for all KPIs
3. Minimal performance overhead
4. Direct integration with dashboard API
5. Future-proof for cross-month analysis

## Migration Guide

If you've already used v1, regenerate with v2:

```bash
# Remove old incomplete caches (optional)
rm data/dashboard-cache/2025-06/all__all__all.json
rm data/dashboard-cache/2025-07/all__all__all.json
rm data/dashboard-cache/2025-08/all__all__all.json

# Generate with retention rates
node parse-monthly-data-with-retention.mjs data/monthly-data.tsv
```

All files will now have proper retention rate calculations.
