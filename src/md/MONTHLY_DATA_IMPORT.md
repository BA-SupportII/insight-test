# Monthly Data Import - Complete

## Summary
Successfully parsed and generated dashboard cache files for 3 months of financial data (June-August 2025) organized by folder with proper metric aggregation.

## Files Created

### Monthly Dashboard Caches
- **2025-06**: `data/dashboard-cache/2025-06/all__all__all.json` (50.5 KB)
- **2025-07**: `data/dashboard-cache/2025-07/all__all__all.json` (227 KB)
- **2025-08**: `data/dashboard-cache/2025-08/all__all__all.json` (226 KB)

### Input Data
- **Source**: `data/monthly-data.tsv` - Tab-separated monthly financial data

### Parser Script
- **Script**: `parse-monthly-data.mjs` - Node.js ES6 module that processes TSV data

## Data Structure

Each monthly cache follows the same structure as existing dashboards (2025-09, 2025-10, 2025-11):

```json
{
  "timestamp": 1765441514358,
  "filters": {
    "startDate": "2025-08-01",
    "endDate": "2025-08-31",
    "brandGroups": [],
    "brands": [],
    "currencies": []
  },
  "groups": [
    {
      "brandGroup": "CX",
      "metrics": { /* aggregated metrics */ },
      "currencies": [
        {
          "currency": "INR",
          "metrics": { /* currency-level metrics */ },
          "brands": [
            {
              "brand": "VB",
              "brandGroup": "CX",
              "currency": "INR",
              "metrics": { /* individual brand metrics */ }
            }
          ]
        }
      ]
    }
  ]
}
```

## Metrics Included

### Base Metrics (Direct from Data)
- `totalDeposit` - Total deposits (with multiplier for VND/IDR)
- `totalWithdraw` - Total withdrawals (with multiplier for VND/IDR)
- `bonus` - Bonuses distributed (with multiplier for VND/IDR)
- `companyWinLoss` - Company win/loss (with multiplier for VND/IDR)
- `uniquePlayer` - Unique players
- `ftdPlayer` - First-time depositors
- `signUpPlayer` - Registered users
- `turnover` - Total stake/turnover (with multiplier for VND/IDR)

### Derived Metrics (Calculated)
- `netDeposit` - totalDeposit - totalWithdraw
- `netWinLoss` - companyWinLoss - bonus
- `averageDeposit` - totalDeposit / uniquePlayer
- `netRatio` - (netDeposit / totalDeposit) * 100
- `bonusRatio` - (bonus / companyWinLoss) * 100
- `averageBonusPerPlayer` - bonus / uniquePlayer
- `averageTurnover` - turnover / uniquePlayer
- `averageWr` - turnover / totalDeposit (Wagering Ratio)
- `grossRevenuePct` - (netDeposit / totalDeposit) * 100
- `ngrPerPlayer` - netWinLoss / uniquePlayer
- `netPerPlayer` - netDeposit / uniquePlayer
- `ftdConversionRate` - (ftdPlayer / signUpPlayer) * 100
- `retentionRate` - null (placeholder, needs historical data)

## Aggregation Hierarchy

Data is aggregated at three levels:

1. **Brand Level**: Individual brand + currency combination
2. **Currency Level**: Sum of all brands in that currency
3. **Brand Group Level**: Sum of all currencies in that brand group

All aggregations use the same `finalizeGroupMetrics()` function from server-dashboard.js to ensure consistency.

## Currency Multipliers

Applied during metric computation:
- **VND, IDR**: Multiplier = 1000 (for large currency amounts)
- **All others**: Multiplier = 1

## Data Organization

Monthly data grouped by:
- **Side** → Brand Group (CX, MCW, PB, RJ, SE, BE, AB, OZ, BJ, K9, WW, E28, WBX, WAU, W6, C24, V9)
- **Brand** → Individual brand identifier
- **Currency** → Transaction currency (INR, BDT, VND, PHP, PKR, USD, etc.)

## Integration with Existing System

The generated files follow the same naming and structure as existing dashboard caches, allowing them to be used directly with:
- `buildDashboardMetrics()` - Dashboard metric computation
- `computeMetrics()` - Individual record metric calculation
- `finalizeGroupMetrics()` - Aggregation finalization
- Dashboard API endpoints expecting `all__all__all.json` format

## Usage

To regenerate caches from the source data:

```bash
node parse-monthly-data.mjs data/monthly-data.tsv
```

This will:
1. Parse the TSV file
2. Group data by month
3. Compute metrics for each brand/currency combination
4. Aggregate to currency and brand group levels
5. Create month folders if they don't exist
6. Write `all__all__all.json` files to each month directory

## Notes

- Timestamps are set to current time when generated
- Filter arrays (brandGroups, brands, currencies) are empty in the aggregated files (can be populated during dashboard queries)
- Previous month retention rates are not calculated (would need historical data from previous periods)
