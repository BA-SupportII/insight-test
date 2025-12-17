import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Helper to convert values to numbers
function num(val) {
  if (!val || val === '' || val === '--') return 0;
  const parsed = parseFloat(String(val).replace(/,/g, ''));
  return isNaN(parsed) ? 0 : parsed;
}

// Calculate retention rate for metrics
function calculateRetentionRate(currentMetrics, prevMetrics) {
  if (!prevMetrics) {
    return null;
  }

  const prevUnique = num(prevMetrics.uniquePlayer);
  const currentFtd = num(currentMetrics.ftdPlayer);

  if (prevUnique > 0) {
    const currentUnique = num(currentMetrics.uniquePlayer);
    return ((currentUnique - currentFtd) / prevUnique) * 100;
  }

  return null;
}

// Build map of metrics by brand/currency from cache file
function buildMetricsMap(cacheData) {
  const map = new Map();

  for (const group of cacheData.groups || []) {
    const brandGroup = group.brandGroup;

    for (const currency of group.currencies || []) {
      const currencyCode = currency.currency;

      // Store currency-level metrics
      const currencyKey = `${brandGroup}::${currencyCode}`;
      map.set(currencyKey, {
        metrics: currency.metrics,
        type: 'currency'
      });

      // Store brand-level metrics
      for (const brand of currency.brands || []) {
        const brandName = brand.brand;
        const brandKey = `${brandGroup}::${brandName}::${currencyCode}`;
        map.set(brandKey, {
          metrics: brand.metrics,
          type: 'brand'
        });
      }
    }

    // Store brand group metrics
    map.set(brandGroup, {
      metrics: group.metrics,
      type: 'group'
    });
  }

  return map;
}

// Update retention rates in cache data
function updateRetentionRates(cacheData, prevMetricsMap) {
  for (const group of cacheData.groups || []) {
    const brandGroup = group.brandGroup;

    // Get previous group metrics
    const prevGroupMetrics = prevMetricsMap.get(brandGroup)?.metrics;
    group.metrics.retentionRate = calculateRetentionRate(group.metrics, prevGroupMetrics);

    for (const currency of group.currencies || []) {
      const currencyCode = currency.currency;

      // Get previous currency metrics
      const prevCurrencyKey = `${brandGroup}::${currencyCode}`;
      const prevCurrencyMetrics = prevMetricsMap.get(prevCurrencyKey)?.metrics;
      currency.metrics.retentionRate = calculateRetentionRate(currency.metrics, prevCurrencyMetrics);

      // Update brands
      for (const brand of currency.brands || []) {
        const brandName = brand.brand;

        // Get previous brand metrics
        const prevBrandKey = `${brandGroup}::${brandName}::${currencyCode}`;
        const prevBrandMetrics = prevMetricsMap.get(prevBrandKey)?.metrics;
        brand.metrics.retentionRate = calculateRetentionRate(brand.metrics, prevBrandMetrics);
      }
    }
  }

  return cacheData;
}

// Main function
function fixRetentionRates() {
  const cacheBaseDir = path.join(__dirname, '..', '..', 'data', 'dashboard-cache');

  // Months to process
  const months = ['2025-09', '2025-10', '2025-11'];
  const allMonths = ['2025-06', '2025-07', '2025-08', ...months];

  console.log('Fixing retention rates for existing cache files...\n');

  for (let i = 0; i < months.length; i++) {
    const month = months[i];
    const monthIndex = allMonths.indexOf(month);

    // Get previous month
    const prevMonth = monthIndex > 0 ? allMonths[monthIndex - 1] : null;

    const cacheFilePath = path.join(cacheBaseDir, month, 'all__all__all.json');

    if (!fs.existsSync(cacheFilePath)) {
      console.log(`⚠️  File not found: ${cacheFilePath}`);
      continue;
    }

    // Read current month cache
    const cacheText = fs.readFileSync(cacheFilePath, 'utf-8');
    const cacheData = JSON.parse(cacheText);

    // Build previous metrics map if previous month exists
    let prevMetricsMap = new Map();
    if (prevMonth) {
      const prevCacheFilePath = path.join(cacheBaseDir, prevMonth, 'all__all__all.json');

      if (fs.existsSync(prevCacheFilePath)) {
        const prevCacheText = fs.readFileSync(prevCacheFilePath, 'utf-8');
        const prevCacheData = JSON.parse(prevCacheText);
        prevMetricsMap = buildMetricsMap(prevCacheData);
      } else {
        console.log(`⚠️  Previous month cache not found: ${prevCacheFilePath}`);
      }
    }

    // Update retention rates
    const updatedCacheData = updateRetentionRates(cacheData, prevMetricsMap);

    // Update timestamp to current time
    updatedCacheData.timestamp = Date.now();

    // Write updated cache
    fs.writeFileSync(cacheFilePath, JSON.stringify(updatedCacheData, null, 2));

    console.log(`✓ Fixed ${cacheFilePath}`);
    if (prevMonth) {
      console.log(`  └─ Retention rate calculated from ${prevMonth} data`);
    } else {
      console.log(`  └─ No previous month data (first month)`);
    }
  }

  console.log('\n✓ All retention rates updated successfully');
}

// Run the fix
fixRetentionRates();
