# BetNaga Integration - Quick Start

## Environment Variables to Set

```bash
# Required
export BETNAGA_BASE_URL=https://59249300.com
export BETNAGA_USERNAME=bnriskdara
export BETNAGA_PASSWORD=R%6w0gSr31

# Optional (defaults shown)
export BETNAGA_BRAND_NAME=BN88
export BETNAGA_BRAND_GROUP=CX
export BETNAGA_CURRENCY=BDT
```

## Testing the Integration

### 1. Start the Dashboard Server
```bash
node server-dashboard.js
```

### 2. Check Available Brands
```bash
curl http://localhost:4001/api/dashboard/options
```
Should include `BN88` in brands list and `CX` in brandGroups.

### 3. Fetch Metrics with BetNaga
```bash
# All brands including BetNaga
curl "http://localhost:4001/api/dashboard/metrics?startDate=2025-11-01&endDate=2025-11-30"

# Only BetNaga
curl "http://localhost:4001/api/dashboard/metrics?brands=BN88&startDate=2025-11-01&endDate=2025-11-30"

# Only CX group (includes BetNaga)
curl "http://localhost:4001/api/dashboard/metrics?brandGroups=CX&startDate=2025-11-01&endDate=2025-11-30"

# BetNaga with BDT currency
curl "http://localhost:4001/api/dashboard/metrics?currencies=BDT&startDate=2025-11-01&endDate=2025-11-30"
```

## Response Format

BetNaga appears as a brand row in the metrics response:

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
    "retentionRate": null,
    "ftdConversionRate": 21.25
  }
}
```

## Troubleshooting

### BetNaga Not Appearing

1. **Check environment variables are set**:
   - `BETNAGA_BASE_URL`
   - `BETNAGA_USERNAME`
   - `BETNAGA_PASSWORD`

2. **Check server logs** for warnings like:
   - `[dashboard] BetNaga login failed: ...`
   - `[dashboard] BetNaga PnL fetch failed: ...`

3. **Check network connectivity** to BetNaga API at `https://59249300.com`

### Credentials Not Working

1. Verify credentials are correct in environment
2. Check BetNaga TCG back office is accessible
3. Verify credentials have permission to access the PnL endpoint

### API Request Timeouts

- Default timeout: 15 seconds
- Check network connectivity to BetNaga API
- Verify BetNaga API is responding

## Files Modified

- `server-dashboard.js` - Main server file with all BetNaga integration code

## Documentation

- See `BETNAGA_INTEGRATION.md` for detailed technical documentation
