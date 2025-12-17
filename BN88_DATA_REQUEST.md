# BN88 Data Request - Query Parameters

## Endpoint
```
GET https://59249300.com/tac/api/relay/get/ods-v2-report-platform-sum-pnlv2
```

## Query Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `dateOption` | string | Yes | `MONTH` or `CUSTOM` |
| `startDate` | string (YYYY-MM-DD) | Yes | Start date |
| `endDate` | string (YYYY-MM-DD) | Yes | End date |
| `page` | number | Yes | Page number (starts at 1) |
| `size` | number | Yes | Records per page |
| `operatorId` | number | Yes | From login response |

## Option 1: MONTH
For monthly aggregated data:
```
GET https://59249300.com/tac/api/relay/get/ods-v2-report-platform-sum-pnlv2?
  dateOption=MONTH
  &startDate=2025-12-01
  &endDate=2025-12-31
  &page=1
  &size=10
  &operatorId=2929275
```

## Option 2: CUSTOM
For custom date ranges (same day or multiple days):
```
GET https://59249300.com/tac/api/relay/get/ods-v2-report-platform-sum-pnlv2?
  dateOption=CUSTOM
  &startDate=2025-12-11
  &endDate=2025-12-11
  &page=1
  &size=10
  &operatorId=2929275
```

## JavaScript Example
```javascript
async function fetchBN88Data(token, operatorId, dateOption = 'CUSTOM', startDate, endDate) {
    const url = new URL('https://59249300.com/tac/api/relay/get/ods-v2-report-platform-sum-pnlv2');
    
    url.searchParams.set('dateOption', dateOption);  // 'MONTH' or 'CUSTOM'
    url.searchParams.set('startDate', startDate);    // '2025-12-11'
    url.searchParams.set('endDate', endDate);        // '2025-12-11'
    url.searchParams.set('page', '1');
    url.searchParams.set('size', '10');
    url.searchParams.set('operatorId', String(operatorId));
    
    const response = await fetch(url.toString(), {
        method: 'GET',
        headers: {
            'authorization': token,
            'accept': 'application/json, text/plain, */*',
            'accept-encoding': 'gzip, deflate, br',
            'accept-language': 'en-US,en;q=0.9',
            'cache-control': 'no-cache',
            'pragma': 'no-cache',
            'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko)',
            'x-requested-with': 'XMLHttpRequest',
            'sec-fetch-site': 'same-origin',
            'sec-fetch-mode': 'cors',
            'sec-fetch-dest': 'empty'
        }
    });
    
    return response.json();
}
```

## Usage Examples

### Monthly Data
```javascript
const data = await fetchBN88Data(token, 2929275, 'MONTH', '2025-12-01', '2025-12-31');
```

### Single Day
```javascript
const data = await fetchBN88Data(token, 2929275, 'CUSTOM', '2025-12-11', '2025-12-11');
```

### Date Range
```javascript
const data = await fetchBN88Data(token, 2929275, 'CUSTOM', '2025-12-01', '2025-12-15');
```
