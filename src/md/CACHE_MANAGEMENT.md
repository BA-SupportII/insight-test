# Cache Management Guide

## Filesystem Organization

All cached data is stored in: `data/dashboard-cache/`

### View Cache Directory
```bash
# Windows
dir data\dashboard-cache

# Linux/Mac
ls -la data/dashboard-cache
```

### Example Structure
```
data/dashboard-cache/
├── 2025-01/
│   ├── all__all__all.json                    # Full month snapshot
│   ├── premium__brand_a__usd.json            # Premium group, Brand A, USD
│   ├── premium__brand_b__inr.json            # Premium group, Brand B, INR
│   ├── standard__brand_c__eur.json           # Standard group, Brand C, EUR
│   └── all__brand_d__gbp.json                # All groups, Brand D, GBP
├── 2025-02/
│   ├── all__all__all.json
│   └── ...
└── 2025-03/
    └── ...
```

## Manual Cache Operations

### 1. View Single Cache File

```bash
# Windows
type data\dashboard-cache\2025-01\premium__brand_a__usd.json

# Linux/Mac
cat data/dashboard-cache/2025-01/premium__brand_a__usd.json
```

### 2. List All Cached Items for a Month

```bash
# Windows
dir data\dashboard-cache\2025-01

# Linux/Mac
ls -la data/dashboard-cache/2025-01
```

### 3. Check Cache File Size

```bash
# Windows - Individual file
dir data\dashboard-cache\2025-01\premium__brand_a__usd.json

# Windows - Total month
dir /s data\dashboard-cache\2025-01

# Linux/Mac - Individual file
ls -lh data/dashboard-cache/2025-01/premium__brand_a__usd.json

# Linux/Mac - Total month
du -sh data/dashboard-cache/2025-01
```

### 4. Delete Specific Cache

```bash
# Windows - Delete single file
del data\dashboard-cache\2025-01\premium__brand_a__usd.json

# Linux/Mac - Delete single file
rm data/dashboard-cache/2025-01/premium__brand_a__usd.json

# Windows - Delete entire month
rmdir /s /q data\dashboard-cache\2025-01

# Linux/Mac - Delete entire month
rm -rf data/dashboard-cache/2025-01
```

### 5. Clear All Cache

```bash
# Windows
rmdir /s /q data\dashboard-cache

# Linux/Mac
rm -rf data/dashboard-cache
```

## Via API (Programmatic)

### Check if data is cached

```bash
curl "http://localhost:4001/api/dashboard/cache/list?year=2025&month=1"
```

Response:
```json
{
  "ok": true,
  "success": true,
  "entries": [
    {
      "brandGroup": "premium",
      "brand": "brand_a",
      "currency": "usd",
      "file": "premium__brand_a__usd.json"
    }
  ]
}
```

### Load specific cached data

```bash
curl "http://localhost:4001/api/dashboard/cache/load?year=2025&month=1&brandGroup=premium&brand=brand_a&currency=usd"
```

### Save cache manually

```bash
curl -X POST http://localhost:4001/api/dashboard/cache/save \
  -H "Content-Type: application/json" \
  -d '{
    "year": 2025,
    "month": 1,
    "brandGroup": "premium",
    "brand": "brand_a",
    "currency": "usd",
    "data": {
      "timestamp": 1704067200000,
      "filters": {"startDate": "2025-01-01"},
      "groups": []
    }
  }'
```

## Automated Cache Cleanup

### Via Node.js Script

Create `cleanup-cache.js`:

```javascript
import fs from 'fs/promises';
import path from 'path';

async function cleanupOldCache(monthsToKeep = 3) {
  const cacheDir = path.join(process.cwd(), 'data', 'dashboard-cache');
  const now = new Date();
  
  try {
    const months = await fs.readdir(cacheDir);
    
    for (const month of months) {
      const [year, monthNum] = month.split('-').map(Number);
      const monthDate = new Date(year, monthNum - 1, 1);
      const ageInMonths = 
        (now.getFullYear() - year) * 12 + 
        (now.getMonth() - (monthNum - 1));
      
      if (ageInMonths > monthsToKeep) {
        const monthPath = path.join(cacheDir, month);
        await fs.rm(monthPath, { recursive: true, force: true });
        console.log(`Deleted cache: ${month}`);
      }
    }
  } catch (err) {
    console.error('Cleanup failed:', err);
  }
}

cleanupOldCache(3); // Keep 3 months
```

Run:
```bash
node cleanup-cache.js
```

### Scheduled Cleanup (Every Month)

Using Node-cron, add to `server-dashboard.js`:

```javascript
import cron from 'node-cron';

// Run cleanup on 1st of every month at 2 AM
cron.schedule('0 2 1 * *', async () => {
  console.log('Running monthly cache cleanup...');
  await cleanupOldCache(3); // Keep 3 months
});
```

## Cache Statistics

### Get Total Cache Size

```bash
# Windows
dir /s data\dashboard-cache | find "bytes"

# Linux/Mac
du -sh data/dashboard-cache

# More detailed
du -sh data/dashboard-cache/*
```

### Count Files

```bash
# Windows
dir /s /b data\dashboard-cache\*.json | find /c ".json"

# Linux/Mac
find data/dashboard-cache -name "*.json" | wc -l
```

### Cache Age

```bash
# Windows - Show file modification dates
dir /s data\dashboard-cache

# Linux/Mac - Show file modification dates
find data/dashboard-cache -type f -name "*.json" -exec ls -lh {} \;
```

## Archive Old Cache

### Backup to ZIP

```bash
# Windows (using built-in compression)
powershell Compress-Archive -Path data\dashboard-cache\2024-* -DestinationPath data\dashboard-cache-2024.zip

# Linux/Mac
tar -czf data/dashboard-cache-2024.tar.gz data/dashboard-cache/2024-*
```

### Extract Backup

```bash
# Windows
powershell Expand-Archive -Path data\dashboard-cache-2024.zip

# Linux/Mac
tar -xzf data/dashboard-cache-2024.tar.gz
```

## Troubleshooting

### Issue: Cache files not being saved

**Check file permissions:**
```bash
# Windows
icacls data\dashboard-cache /grant:r "%username%:(F)"

# Linux/Mac
chmod 755 data/dashboard-cache
chmod 755 data/dashboard-cache/*/*
```

**Check disk space:**
```bash
# Windows
dir C:\

# Linux/Mac
df -h
```

### Issue: Corrupted cache file

**Delete and re-fetch:**
```bash
# Windows
del data\dashboard-cache\2025-01\<filename>.json

# Linux/Mac
rm data/dashboard-cache/2025-01/<filename>.json
```

Then search the dashboard to re-fetch and cache the data.

### Issue: Cache loading slowly

**Check file size:**
```bash
# If files are very large (>10MB), consider cleanup
du -sh data/dashboard-cache/2025-01/
```

## Best Practices

1. **Keep last 3-6 months** of cache for balance between storage and speed
2. **Clean up monthly** using scheduled cleanup script
3. **Monitor cache size** - set up alerts if exceeding 500MB
4. **Archive yearly** before deletion for compliance
5. **Backup cache** if storing long-term analytics history

## Cache Retention Policy Example

```javascript
// Keep cache for:
// - Current month: Always
// - Previous 2 months: Always  
// - Older than 3 months: Delete

async function applyRetentionPolicy() {
  const cacheDir = 'data/dashboard-cache';
  const now = new Date();
  const retention = 3; // months
  
  const dirs = await fs.readdir(cacheDir);
  
  for (const dir of dirs) {
    const [y, m] = dir.split('-').map(Number);
    const date = new Date(y, m - 1);
    const monthsDiff = 
      (now.getFullYear() - y) * 12 + 
      (now.getMonth() - (m - 1));
    
    if (monthsDiff > retention) {
      await fs.rm(path.join(cacheDir, dir), 
        { recursive: true }
      );
      console.log(`Deleted: ${dir}`);
    }
  }
}
```

## Integration with CI/CD

### GitHub Actions Example

```yaml
name: Cache Cleanup
on:
  schedule:
    - cron: '0 2 1 * *'  # 1st of month

jobs:
  cleanup:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Cleanup old cache
        run: node cleanup-cache.js
      - name: Commit changes
        run: |
          git add data/dashboard-cache
          git commit -m "chore: cleanup old cache"
          git push
```
