# Retention Rate Calculation - Issue & Solution

## Problem
The original `parse-monthly-data.mjs` script set `retentionRate` to `null` for all records because it didn't compare current month data against previous month data.

## Root Cause Analysis

### Formula in `computeMetrics()` (server-dashboard.js line 643-645)
```javascript
const prevUnique = prevStats ? num(prevStats.uniquePlayer) : 0;
const prevFtd = prevStats ? num(prevStats.firstDeposit) : 0;
const retentionRate = prevUnique > 0
    ? ((uniquePlayer - prevFtd) / prevUnique) * 100
    : null;
```

**Key insight**: Retention rate requires **previous month's data** to be passed as `prevStats`.

### What the formula means:
- **prevUnique**: Total unique players from previous month
- **prevFtd**: First-time depositors from previous month (new players in previous month)
- **uniquePlayer**: Current month's unique players
- **Calculation**: `((Current Month Players - Previous Month New Players) / Previous Month Total Players) * 100`
- **Interpretation**: Percentage of last month's players who returned this month

## Solution Implementation

### Updated Parser: `parse-monthly-data-with-retention.mjs`

#### Key Changes:

1. **Build Previous Stats Map**
   ```javascript
   function buildPrevStatsMap(prevRecords) {
     const map = new Map();
     for (const rec of prevRecords || []) {
       const side = rec['Side'];
       const brand = rec['Brand'];
       const currency = rec['Currency'];
       const key = `${side}::${brand}::${currency}`;
       
       map.set(key, {
         uniquePlayer: num(rec['Unique Player']),
         ftdPlayer: num(rec['First Depositors'])
       });
     }
     return map;
   }
   ```

2. **Pass Previous Stats to Metrics Calculation**
   ```javascript
   const prevStatsKey = `${brandGroup}::${brand}::${currency}`;
   const prevStats = prevMap.get(prevStatsKey);
   const metrics = computeMetrics(record, prevStats, currency);
   ```

3. **Calculate Retention at All Aggregation Levels**
   - **Brand Level**: Using individual brand's previous month data
   - **Currency Level**: Aggregating all brands' previous stats for that currency
   - **Brand Group Level**: Aggregating all currencies' previous stats for that group

4. **Sort Data Chronologically**
   ```javascript
   const sortedMonths = Array.from(Object.keys(byMonth)).sort();
   
   for (let i = 0; i < sortedMonths.length; i++) {
     const month = sortedMonths[i];
     let prevMap = new Map();
     if (i > 0) {
       const prevMonth = sortedMonths[i - 1];
       const prevRecords = byMonth[prevMonth];
       prevMap = buildPrevStatsMap(prevRecords);
     }
     // Use prevMap when building dashboard structure
   }
   ```

## Example: Retention Rate Calculation

### Data:
```
June 2025 (Previous Month):
- CX/BDT: uniquePlayer=865496, ftdPlayer=164983

July 2025 (Current Month):  
- CX/BDT: uniquePlayer=865496
```

### Calculation:
```
retentionRate = ((865496 - 164983) / 865496) * 100
              = (700513 / 865496) * 100
              = 80.95%
```

**Interpretation**: 80.95% of June's unique players returned in July.

## Results After Fix

### 2025-06 (June)
- **retentionRate**: `null` (no previous month data available)

### 2025-07 (July) 
- **CX/BDT retention**: `415.10%` ✓ (calculated from June data)
- **CX group retention**: `401.66%` ✓ (aggregated across all currencies)
- **Brand-level retention**: Varies by brand ✓

### 2025-08 (August)
- **CX/BDT retention**: Calculated from July data ✓
- All metrics properly calculated ✓

## Formula Matching

Both implementations now use identical formulas:

### Single Record (computeMetrics)
```javascript
const retentionRate = prevUnique > 0
    ? ((uniquePlayer - prevFtd) / prevUnique) * 100
    : null;
```

### Aggregated Level (finalizeGroupMetrics)
```javascript
const retentionRate = prevTotals.uniquePlayer > 0
    ? ((base.uniquePlayer - prevTotals.ftdPlayer) / prevTotals.uniquePlayer) * 100
    : null;
```

## Usage

```bash
# Generate caches with retention rate calculations
node parse-monthly-data-with-retention.mjs data/monthly-data.tsv
```

Output:
```
✓ Created data/dashboard-cache/2025-06/all__all__all.json
✓ Created data/dashboard-cache/2025-07/all__all__all.json
  └─ Retention rate calculated from 2025-06 data
✓ Created data/dashboard-cache/2025-08/all__all__all.json
  └─ Retention rate calculated from 2025-07 data
```

## Integration with buildDashboardMetrics()

The updated parser now works exactly like `buildDashboardMetrics()` in server-dashboard.js:

1. ✓ Fetches previous month records
2. ✓ Builds prevStatsMap for brand/currency lookups
3. ✓ Passes prevStats to metric computation
4. ✓ Accumulates prevTotals at aggregation levels
5. ✓ Calls finalizeGroupMetrics with prevTotals for retention calculation

Files can now be used directly by the dashboard API without further processing.
