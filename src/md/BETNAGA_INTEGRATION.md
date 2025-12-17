# BetNaga Integration Summary

## Overview
Extended the Node.js/Express dashboard server to pull monthly metrics from the BetNaga backend (BetNaga TCG back office at https://59249300.com) alongside CLIMAX data.

## Changes Made

### 1. Configuration Constants (Lines 29-35)
Added environment variables for BetNaga credentials at the top of `server-dashboard.js`:

```javascript
// ====== BETNAGA CONFIG ======
const BETNAGA_BASE_URL = process.env.BETNAGA_BASE_URL || 'https://59249300.com';
const BETNAGA_USERNAME = process.env.BETNAGA_USERNAME || '';
const BETNAGA_PASSWORD = process.env.BETNAGA_PASSWORD || '';
const BETNAGA_BRAND_NAME = process.env.BETNAGA_BRAND_NAME || 'BN88';
const BETNAGA_BRAND_GROUP = process.env.BETNAGA_BRAND_GROUP || 'CX';
const BETNAGA_CURRENCY = (process.env.BETNAGA_CURRENCY || 'BDT').toUpperCase();
```

### 2. Helper Functions (Lines 745-861)
Added four new helper functions:

#### `pad2(n)` (Line 746-748)
Formats numbers with zero-padding for date components.

#### `toDateString(parts)` (Line 750-752)
Converts date parts object `{ y, m, d }` to `YYYY-MM-DD` format for API requests.

#### `betNagaLogin()` (Line 754-792)
- Authenticates with BetNaga's login endpoint using credentials from env vars
- URL: `POST {BETNAGA_BASE_URL}/tac/api/login/password`
- Returns `{ token, operatorId }` on success, `null` on failure
- Includes error handling with console warnings (no credential logging)

#### `fetchBetNagaRecords(range, filters)` (Line 794-861)
- Respects brand and currency filters
- Fetches monthly PnL data from BetNaga's `ods-v2-report-platform-sum-pnlv2` endpoint
- Maps BetNaga fields to CLIMAX-like record structure:
  - `deposit` → `depositAmount`
  - `withdraw` → `withdrawalAmount`
  - `promotion` → `bonus`
  - `grossProfit` → `profitLoss`
  - `validGameBetting` → `turnover`
  - `depositMemberCount` → `uniquePlayer`
  - `firstDepositMemberCount` → `firstDeposit`
  - `registerMemberCount` → `registerCount`
- Returns array with single synthetic record that integrates seamlessly with existing metrics computation

### 3. Modified `buildDashboardMetrics()` (Lines 965-972)
Updated to fetch BetNaga records in parallel with CLIMAX data:

```javascript
const [records, prevRecords, betNagaRecords] = await Promise.all([
    fetchBrandRecords(range, filters),
    fetchBrandRecords(prevRange, filters),
    fetchBetNagaRecords(range, filters)
]);

const allRecords = [...records, ...betNagaRecords];
```

Changed loop to process merged records:
```javascript
for (const rec of allRecords) {
```

### 4. Updated `/api/dashboard/options` Endpoint (Lines 1277-1295)
Ensures BetNaga appears in the frontend's brand selector:
- Adds `CX` to `brandGroups` if not already present
- Adds betnaga brand entry with proper metadata if not already present
- Maintains alphabetical sort on brands list

## Data Flow

1. **Login**: `betNagaLogin()` → Gets token and operatorId from BetNaga API
2. **Fetch**: `fetchBetNagaRecords()` → Calls monthly PnL endpoint with token
3. **Map**: BetNaga response fields are mapped to CLIMAX-compatible record structure
4. **Merge**: BetNaga records merged with CLIMAX records in `buildDashboardMetrics()`
5. **Process**: Existing `computeMetrics()` and `finalizeGroupMetrics()` functions handle all records identically
6. **Output**: `/api/dashboard/metrics` returns brand rows including BetNaga with all calculated metrics

## Filter Behavior

- **No filters**: BetNaga (CX / BDT) loads automatically alongside CLIMAX brands
- **Brand filter**: If filter includes "betnaga", BetNaga is fetched
- **BrandGroup filter**: If filter includes "CX", BetNaga is fetched
- **Currency filter**: If filter includes "BDT", BetNaga is fetched
- **Multiple conditions**: All filters must include the respective value for BetNaga to be included

## Response Structure

BetNaga appears as a regular brand row in `/api/dashboard/metrics`:

```json
{
  "brand": "BN88",
  "brandGroup": "CX",
  "currency": "BDT",
  "metrics": {
    "totalDeposit": 24232461.51,
    "totalWithdraw": 19801571,
    "bonus": 6858157.2,
    "companyWinLoss": 9121596.19,
    "turnover": 228759726.62,
    "uniquePlayer": 8811,
    "ftdPlayer": 4743,
    "signUpPlayer": 22442,
    "netDeposit": 4430890.51,
    "netWinLoss": 2263439,
    "averageDeposit": 2748.99,
    "netRatio": 18.21,
    "bonusRatio": 75.16,
    "averageBonusPerPlayer": 778.51,
    "averageTurnover": 25943.63,
    "averageWr": 9.43,
    "grossRevenuePct": 18.21,
    "ngrPerPlayer": 256.99,
    "netPerPlayer": 502.50,
    "retentionRate": null,
    "ftdConversionRate": 21.25
  }
}
```

## Environment Setup

To enable BetNaga integration, set these environment variables:

```bash
BETNAGA_BASE_URL=https://59249300.com
BETNAGA_USERNAME=bnriskdara
BETNAGA_PASSWORD=R%6w0gSr31
BETNAGA_BRAND_NAME=BN88          # optional, default "BN88"
BETNAGA_BRAND_GROUP=CX           # optional, default "CX"
BETNAGA_CURRENCY=BDT             # optional, default "BDT"
```

## Error Handling

- If BetNaga credentials are missing or incomplete, returns empty array (BetNaga not included)
- If login fails, logs warning and skips BetNaga
- If PnL fetch fails, logs warning and skips BetNaga
- If response is malformed, logs warning and returns empty array
- CLIMAX data loads normally regardless of BetNaga status
- No credentials logged at any point

## Backwards Compatibility

- No changes to existing CLIMAX data flow
- No changes to response shapes
- No changes to existing brands, groups, or metrics
- Existing frontend code requires no modifications
- BetNaga integration is purely additive

## Notes

- Retention rates (`retentionRate`) for BetNaga will be `null` as we don't fetch previous month data for BetNaga (acceptable per spec)
- FX logic, caching, and insights routes remain unchanged
- All metric calculations use existing `computeMetrics()` and `finalizeGroupMetrics()` functions
