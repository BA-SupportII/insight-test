# BN88 Login Flow - 100% Working

## Setup

### 1. Environment Variables
Set these in your `.env` file:

```
BETNAGA_BASE_URL=https://59249300.com
BETNAGA_USERNAME=your_operator_name
BETNAGA_PASSWORD=your_password
```

## Login Flow

### Step 1: Initialize Login Request
```javascript
const url = `${BETNAGA_BASE_URL}/tac/api/login/password`;

const body = {
    operatorName: BETNAGA_USERNAME,
    password: BETNAGA_PASSWORD
};
```

### Step 2: Send POST Request with Headers
```javascript
const resp = await fetch(url, {
    method: 'POST',
    headers: {
        'content-type': 'application/json',
        'accept': 'application/json, text/plain, */*',
        'accept-encoding': 'gzip, deflate, br',
        'accept-language': 'en-US,en;q=0.9',
        'cache-control': 'no-cache',
        'pragma': 'no-cache',
        'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko)',
        'origin': BETNAGA_BASE_URL,
        'referer': BETNAGA_BASE_URL + '/',
        'x-requested-with': 'XMLHttpRequest',
        'sec-fetch-site': 'same-origin',
        'sec-fetch-mode': 'cors',
        'sec-fetch-dest': 'empty'
    },
    body: JSON.stringify(body),
    timeout: 15000
});
```

### Step 3: Parse Response
```javascript
if (!resp.ok) {
    console.error('Login failed - HTTP', resp.status);
    return null;
}

const json = await resp.json();
const token = json?.token;
const operatorId = json?.operatorId;

if (!token || !operatorId) {
    console.error('Response missing token or operatorId');
    return null;
}

return { token, operatorId };
```

## Expected Response Structure
```json
{
    "token": "Bearer_token_here",
    "operatorId": "12345"
}
```

## Using the Token for Data Requests
```javascript
const url = `${BETNAGA_BASE_URL}/tac/api/relay/get/ods-v2-report-platform-sum-pnlv2`;
const response = await fetch(url, {
    method: 'GET',
    headers: {
        'authorization': token,
        'accept': 'application/json, text/plain, */*',
        'accept-encoding': 'gzip, deflate, br',
        'accept-language': 'en-US,en;q=0.9',
        'cache-control': 'no-cache',
        'pragma': 'no-cache',
        'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko)',
        'origin': BETNAGA_BASE_URL,
        'referer': BETNAGA_BASE_URL + '/',
        'x-requested-with': 'XMLHttpRequest',
        'sec-fetch-site': 'same-origin',
        'sec-fetch-mode': 'cors',
        'sec-fetch-dest': 'empty'
    }
});
```

## Complete Login Function
```javascript
async function betNagaLogin(baseUrl, username, password) {
    console.log('BN88: Login attempt...');
    
    if (!baseUrl || !username || !password) {
        console.error('Missing credentials');
        return null;
    }

    const url = `${baseUrl.replace(/\/+$/, '')}/tac/api/login/password`;
    
    const body = {
        operatorName: username,
        password: password
    };

    try {
        const resp = await fetch(url, {
            method: 'POST',
            headers: {
                'content-type': 'application/json',
                'accept': 'application/json, text/plain, */*',
                'accept-encoding': 'gzip, deflate, br',
                'accept-language': 'en-US,en;q=0.9',
                'cache-control': 'no-cache',
                'pragma': 'no-cache',
                'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko)',
                'origin': baseUrl.replace(/\/+$/, ''),
                'referer': baseUrl.replace(/\/+$/, '') + '/',
                'x-requested-with': 'XMLHttpRequest',
                'sec-fetch-site': 'same-origin',
                'sec-fetch-mode': 'cors',
                'sec-fetch-dest': 'empty'
            },
            body: JSON.stringify(body),
            timeout: 15000
        });

        console.log('BN88: Login response status:', resp.status);
        
        if (!resp.ok) {
            const text = await resp.text();
            console.error('BN88: Login failed - HTTP', resp.status, '- Response:', text);
            return null;
        }

        const json = await resp.json();
        console.log('BN88: Login response body:', json);
        
        const token = json?.token;
        const operatorId = json?.operatorId;
        
        if (!token || !operatorId) {
            console.error('BN88: Login response missing token or operatorId');
            return null;
        }

        console.log('BN88: Login successful - operatorId:', operatorId);
        return { token, operatorId };
    } catch (err) {
        console.error('BN88: Login error:', err?.message || err);
        return null;
    }
}
```

## Testing
```javascript
// Test the login
const result = await betNagaLogin(
    'https://59249300.com',
    'your_operator_name',
    'your_password'
);

if (result) {
    console.log('Login successful:', result);
} else {
    console.log('Login failed');
}
```

## Common Issues & Fixes

| Issue | Cause | Fix |
|-------|-------|-----|
| `HTTP 401/403` | Invalid credentials | Verify username/password |
| `Missing token in response` | Wrong endpoint | Use `/tac/api/login/password` |
| `CORS error` | Missing headers | Include all required headers |
| `Timeout` | Network issue | Check internet connection |
| `Invalid JSON response` | Server error | Log raw response text |

## Key Points
- ✅ **Endpoint**: `{BETNAGA_BASE_URL}/tac/api/login/password`
- ✅ **Method**: POST
- ✅ **Content-Type**: `application/json`
- ✅ **Body Fields**: `operatorName`, `password`
- ✅ **Response Fields**: `token`, `operatorId`
- ✅ **Token Usage**: Use as `authorization` header in subsequent requests
