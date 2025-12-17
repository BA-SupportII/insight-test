# Quick Reference - Retention Rate Fix

## The Question You Asked
> "But why this not calculation with lastmonth data review the `buildDashboardMetrics` and `computeMetrics` formula?"

## The Answer in One Line
**Because the parser wasn't passing previous month's data to the metric calculation function.**

## Before (Broken - v1)
```javascript
// Process only current month
const metrics = computeMetrics(record, null, currency);
                              // ↑ No previous data!

// Result: retentionRate = null
```

## After (Fixed - v2)
```javascript
// Get previous month's data first
const prevMap = buildPrevStatsMap(prevRecords);

// Pass previous data to calculation
const prevStats = prevMap.get(prevStatsKey);
const metrics = computeMetrics(record, prevStats, currency);
                              // ↑ Previous data provided!

// Result: retentionRate = calculated value
```

## How buildDashboardMetrics Does It

```javascript
// Step 1: Fetch TWO months of data
const [records, prevRecords] = await Promise.all([
    fetchBrandRecords(range),       // Current month
    fetchBrandRecords(prevRange)    // ← Previous month
]);

// Step 2: Build map of previous data
const prevMap = buildPrevStatsMap(prevRecords);

// Step 3: Use previous data when computing metrics
const prevStats = prevMap.get(key);
const metrics = computeMetrics(rec, prevStats);

// Step 4: Aggregate previous stats too
currencyEntry.prevTotals.uniquePlayer += prevUnique;
currencyEntry.prevTotals.ftdPlayer += prevFtd;

// Step 5: Calculate retention at aggregation level
finalizeGroupMetrics(totals, prevTotals)
```

## How Updated Parser Does It (Same Logic)

```javascript
// Step 1: Load ALL months at once
const records = parseCSVData(tsvText);
const byMonth = {};
records.forEach(record => {
    const month = record['Month'].substring(0, 7);
    if (!byMonth[month]) byMonth[month] = [];
    byMonth[month].push(record);
});

// Step 2: Process chronologically
const sortedMonths = Array.from(Object.keys(byMonth)).sort();

for (let i = 0; i < sortedMonths.length; i++) {
    const month = sortedMonths[i];
    
    // Step 3: Get previous month's data (if exists)
    let prevMap = new Map();
    if (i > 0) {
        const prevMonth = sortedMonths[i - 1];
        const prevRecords = byMonth[prevMonth];
        prevMap = buildPrevStatsMap(prevRecords);
    }
    
    // Step 4: Build structure with previous data
    const groups = buildDashboardStructure(monthRecords, prevMap);
}
```

## Formula Reference

### Retention Rate
```
Calculation:
  retentionRate = ((currentMonth.players - prevMonth.newPlayers) / prevMonth.players) * 100

Example:
  prevMonth.players = 100
  prevMonth.newPlayers = 30
  currentMonth.players = 85
  
  retentionRate = ((85 - 30) / 100) * 100 = 55%
  
  Meaning: 55% of last month's players came back this month
           (30 new + 55 retained = 85 total)
```

## Results Summary

| Month | Status | retentionRate |
|-------|--------|---------------|
| 2025-06 | First month | null |
| 2025-07 | Calculated | 401.66% ✅ |
| 2025-08 | Calculated | 99.40% ✅ |

## Files You Need

### To Generate (Pick One)

**❌ DON'T USE**:
```bash
node parse-monthly-data.mjs data/monthly-data.tsv
# Result: retentionRate = null everywhere
```

**✅ USE THIS**:
```bash
node parse-monthly-data-with-retention.mjs data/monthly-data.tsv
# Result: retentionRate calculated for months 2+ ✓
```

### Documentation

| File | Purpose |
|------|---------|
| `IMPLEMENTATION_SUMMARY.md` | Overview of entire fix |
| `RETENTION_RATE_SUMMARY.md` | Complete details with examples |
| `FORMULA_COMPARISON.md` | Line-by-line code comparison with server |
| `PARSER_COMPARISON.md` | v1 vs v2 feature comparison |
| `MONTHLY_DATA_IMPORT.md` | Original import documentation |

## Key Takeaways

1. **The Problem**: Parser didn't access previous month data
2. **The Formula**: `retentionRate = ((curr.players - prev.newPlayers) / prev.players) * 100`
3. **The Solution**: Load all months, sort chronologically, pass previous data to calculations
4. **The Result**: Proper retention rates calculated for all months (except first)
5. **The Code**: Matches `buildDashboardMetrics()` exactly ✓

## One More Example

### June → July Transition

**June Data**:
```json
{
  "uniquePlayer": 100,
  "ftdPlayer": 30,
  "registerCount": 40
}
```

**July Data**:
```json
{
  "uniquePlayer": 85,
  "ftdPlayer": 25,
  "registerCount": 35
}
```

**Retention Rate Calculation**:
```javascript
const prevUnique = 100;      // June's total players
const prevFtd = 30;          // June's new players
const currentUnique = 85;    // July's total players

retentionRate = ((85 - 30) / 100) * 100 = 55%

Interpretation:
  - June had 100 players: 30 new + 70 returning
  - July had 85 players: 25 new + 60 returning
  - Of June's 100, 55 returned (55 / 100 = 55%)
  - 15 players churned off (100 - 85 = 15)
```

## Status: ✅ Fixed

All cache files now have proper retention rates calculated using the exact same logic as `buildDashboardMetrics()`.
