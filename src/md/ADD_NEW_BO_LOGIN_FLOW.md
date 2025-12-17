# Complete Flow: Add New BO Login (100% Working)

## Overview
This guide walks through adding a new Business Object (BO) login system (like BetNaga) to the Insight dashboard. The process integrates a new data source alongside existing CLIMAX data.

---

## Step 1: Define BO Configuration Constants

**File:** `server-dashboard.js` (Top section, after imports)

Add environment variables for your new BO:

```javascript
// ====== [YOUR_BO]_CONFIG ======
const YOUR_BO_BASE_URL = process.env.YOUR_BO_BASE_URL || 'https://your-bo-api.com';
const YOUR_BO_USERNAME = process.env.YOUR_BO_USERNAME || '';
const YOUR_BO_PASSWORD = process.env.YOUR_BO_PASSWORD || '';
const YOUR_BO_BRAND_NAME = process.env.YOUR_BO_BRAND_NAME || 'YOUR_BRAND';
const YOUR_BO_BRAND_GROUP = process.env.YOUR_BO_BRAND_GROUP || 'YOUR_GROUP';
const YOUR_BO_CURRENCY = (process.env.YOUR_BO_CURRENCY || 'USD').toUpperCase();
```

**Example:** For a BO called "GamePlatform":
```javascript
const GAMEPLATFORM_BASE_URL = process.env.GAMEPLATFORM_BASE_URL || 'https://api.gameplatform.com';
const GAMEPLATFORM_USERNAME = process.env.GAMEPLATFORM_USERNAME || '';
const GAMEPLATFORM_PASSWORD = process.env.GAMEPLATFORM_PASSWORD || '';
const GAMEPLATFORM_BRAND_NAME = process.env.GAMEPLATFORM_BRAND_NAME || 'GP100';
const GAMEPLATFORM_BRAND_GROUP = process.env.GAMEPLATFORM_BRAND_GROUP || 'GAMES';
const GAMEPLATFORM_CURRENCY = (process.env.GAMEPLATFORM_CURRENCY || 'USD').toUpperCase();
```

---

## Step 2: Create Helper Functions

**File:** `server-dashboard.js` (Helper functions section)

### 2.1 Login Function

```javascript
async function yourBoLogin() {
  if (!YOUR_BO_USERNAME || !YOUR_BO_PASSWORD) {
    console.warn('[dashboard] [YOUR_BO] Credentials not configured, skipping');
    return null;
  }

  try {
    const response = await fetch(`${YOUR_BO_BASE_URL}/api/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        username: YOUR_BO_USERNAME,
        password: YOUR_BO_PASSWORD
      }),
      timeout: 15000
    });

    if (!response.ok) {
      console.warn(`[dashboard] [YOUR_BO] Login failed: ${response.status}`);
      return null;
    }

    const data = await response.json();
    
    // Adjust these fields based on YOUR_BO's actual response
    return {
      token: data.token || data.accessToken,
      operatorId: data.operatorId || data.userId
    };
  } catch (err) {
    console.warn(`[dashboard] [YOUR_BO] Login error: ${err.message}`);
    return null;
  }
}
```

### 2.2 Fetch Records Function

```javascript
async function fetchYourBoRecords(range, filters) {
  const login = await yourBoLogin();
  if (!login) return [];

  try {
    // Check if filters should include this BO
    const shouldInclude = 
      !filters.brands || filters.brands.includes('your_bo') ||
      !filters.brandGroups || filters.brandGroups.includes('YOUR_GROUP') ||
      !filters.currencies || filters.currencies.includes('USD');

    if (!shouldInclude) return [];

    // Build date parameters (adjust to YOUR_BO's API format)
    const startDate = range.y + '-' + pad2(range.m) + '-01';
    const endDate = range.y + '-' + pad2(range.m + 1) + '-01'; // or last day of month

    const response = await fetch(
      `${YOUR_BO_BASE_URL}/api/metrics?startDate=${startDate}&endDate=${endDate}`,
      {
        headers: {
          'Authorization': `Bearer ${login.token}`,
          'Content-Type': 'application/json'
        },
        timeout: 15000
      }
    );

    if (!response.ok) {
      console.warn(`[dashboard] [YOUR_BO] Fetch failed: ${response.status}`);
      return [];
    }

    const data = await response.json();

    // Map YOUR_BO response fields to CLIMAX-compatible structure
    // Adjust field mappings based on YOUR_BO's actual response
    return [{
      brand: YOUR_BO_BRAND_NAME,
      brandGroup: YOUR_BO_BRAND_GROUP,
      currency: YOUR_BO_CURRENCY,
      
      // Map YOUR_BO fields to CLIMAX fields
      depositAmount: data.deposit || 0,
      withdrawalAmount: data.withdraw || 0,
      bonus: data.promotion || 0,
      profitLoss: data.grossProfit || 0,
      turnover: data.validGameBetting || 0,
      uniquePlayer: data.depositMemberCount || 0,
      firstDeposit: data.firstDepositMemberCount || 0,
      registerCount: data.registerMemberCount || 0
    }];

  } catch (err) {
    console.warn(`[dashboard] [YOUR_BO] Fetch error: ${err.message}`);
    return [];
  }
}
```

---

## Step 3: Update buildDashboardMetrics Function

**File:** `server-dashboard.js` - Find `buildDashboardMetrics()` function

Change the Promise.all() call from:
```javascript
const [records, prevRecords, betNagaRecords] = await Promise.all([
  fetchBrandRecords(range, filters),
  fetchBrandRecords(prevRange, filters),
  fetchBetNagaRecords(range, filters)
]);
```

To:
```javascript
const [records, prevRecords, betNagaRecords, yourBoRecords] = await Promise.all([
  fetchBrandRecords(range, filters),
  fetchBrandRecords(prevRange, filters),
  fetchBetNagaRecords(range, filters),
  fetchYourBoRecords(range, filters)
]);
```

Then merge records:
```javascript
const allRecords = [...records, ...betNagaRecords, ...yourBoRecords];
```

---

## Step 4: Update Dashboard Options Endpoint

**File:** `server-dashboard.js` - Find `/api/dashboard/options` endpoint

In the endpoint, add YOUR_BO brand to options:

```javascript
// Ensure YOUR_BO brand is in the list
if (!brands.some(b => b.brand === 'YOUR_BRAND')) {
  brands.push({
    brand: 'YOUR_BRAND',
    group: 'YOUR_GROUP',
    currency: 'USD'
  });
}

// Ensure YOUR_GROUP is in brandGroups
if (!brandGroups.includes('YOUR_GROUP')) {
  brandGroups.push('YOUR_GROUP');
}

brands.sort((a, b) => a.brand.localeCompare(b.brand));
```

---

## Step 5: Environment Configuration

**File:** `.env` or set system environment variables

```bash
# YOUR_BO Configuration
YOUR_BO_BASE_URL=https://your-bo-api.com
YOUR_BO_USERNAME=your_username
YOUR_BO_PASSWORD=your_password
YOUR_BO_BRAND_NAME=YOUR_BRAND
YOUR_BO_BRAND_GROUP=YOUR_GROUP
YOUR_BO_CURRENCY=USD
```

**Example for GamePlatform:**
```bash
GAMEPLATFORM_BASE_URL=https://api.gameplatform.com
GAMEPLATFORM_USERNAME=game_admin
GAMEPLATFORM_PASSWORD=secure_password
GAMEPLATFORM_BRAND_NAME=GP100
GAMEPLATFORM_BRAND_GROUP=GAMES
GAMEPLATFORM_CURRENCY=USD
```

---

## Step 6: Testing & Validation

### 6.1 Start Server
```bash
node server-dashboard.js
```

### 6.2 Check Available Brands
```bash
curl http://localhost:4001/api/dashboard/options
```

Verify YOUR_BRAND appears in brands list and YOUR_GROUP in brandGroups.

### 6.3 Fetch Metrics (All)
```bash
curl "http://localhost:4001/api/dashboard/metrics?startDate=2025-11-01&endDate=2025-11-30"
```

### 6.4 Fetch Metrics (Filtered by Brand)
```bash
curl "http://localhost:4001/api/dashboard/metrics?brands=YOUR_BRAND&startDate=2025-11-01&endDate=2025-11-30"
```

### 6.5 Fetch Metrics (Filtered by Group)
```bash
curl "http://localhost:4001/api/dashboard/metrics?brandGroups=YOUR_GROUP&startDate=2025-11-01&endDate=2025-11-30"
```

### 6.6 Check Server Logs
Look for:
- `[dashboard] [YOUR_BO] Login successful` (success indicator)
- `[dashboard] [YOUR_BO] Login failed` (credential issue)
- `[dashboard] [YOUR_BO] Credentials not configured` (env var missing)

---

## Step 7: Troubleshooting Checklist

| Issue | Solution |
|-------|----------|
| BO not appearing | Check environment variables are set and server restarted |
| Login failed | Verify credentials are correct in YOUR_BO back office |
| API timeout | Check network connectivity to YOUR_BO API endpoint |
| Wrong field mapping | Verify YOUR_BO's actual response field names match your function |
| No metrics returned | Check if YOUR_BO has data for the requested date range |
| Filter not working | Verify filter logic in `fetchYourBoRecords()` matches your brand/group names |

---

## Step 8: Key Integration Points

### Record Structure
Your BO records must map to this structure (matching CLIMAX format):

```javascript
{
  brand: string,           // 'YOUR_BRAND'
  brandGroup: string,      // 'YOUR_GROUP'
  currency: string,        // 'USD'
  depositAmount: number,
  withdrawalAmount: number,
  bonus: number,
  profitLoss: number,
  turnover: number,
  uniquePlayer: number,
  firstDeposit: number,
  registerCount: number
}
```

### Filter Logic
- **No filters**: BO loads automatically
- **Brand filter**: Include if filter has your brand
- **BrandGroup filter**: Include if filter has your group
- **Currency filter**: Include if filter has your currency
- **Multiple filters**: All must match for inclusion

### Metrics Calculation
No changes needed - existing `computeMetrics()` and `finalizeGroupMetrics()` functions handle all records identically.

---

## Step 9: Production Deployment

1. **Update .env** with actual BO credentials
2. **Test in staging** before production
3. **Monitor server logs** for login/fetch errors
4. **Set up alerts** for failed BO login attempts
5. **Document credentials** in secure credential manager

---

## Reference: Field Mapping Examples

### BetNaga (Reference)
```
deposit → depositAmount
withdraw → withdrawalAmount
promotion → bonus
grossProfit → profitLoss
validGameBetting → turnover
depositMemberCount → uniquePlayer
firstDepositMemberCount → firstDeposit
registerMemberCount → registerCount
```

### Your BO
Update based on actual API response fields:
```
[your_field] → [climax_field]
```

---

## Success Indicators

✅ Your BO appears in `/api/dashboard/options`
✅ Your BO brand row appears in `/api/dashboard/metrics`
✅ All metrics are calculated (not null/0)
✅ Filters work correctly (brand, group, currency)
✅ No server errors in logs
✅ Login succeeds on server startup
