import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Data provided by user
const brandData = [
  { month: '2025-09', side: 'CX', brand: 'BVS', currency: 'BDT', deposit: 487365680.01, withdraw: 409815183.69, bonus: 75290218.04, winloss: 155545312.86, turnover: 4319442591.55, registered: 8462, ftd: 3233, unique: 31630 },
  { month: '2025-09', side: 'CX', brand: 'BVS', currency: 'INR', deposit: 92430459.65, withdraw: 75944459.07, bonus: 13626248.74, winloss: 28886325.04, turnover: 986444056.19, registered: 1162, ftd: 313, unique: 2414 },
  { month: '2025-09', side: 'CX', brand: 'BVS', currency: 'VND', deposit: 73003555000, withdraw: 66681221000, bonus: 10062278990, winloss: 16526270410, turnover: 660364889440, registered: 1095, ftd: 375, unique: 8980 },
  { month: '2025-09', side: 'CX', brand: 'BVS', currency: 'PHP', deposit: 81810683, withdraw: 70548731, bonus: 13043959.68, winloss: 25016788.82, turnover: 814295780.5, registered: 2989, ftd: 1038, unique: 2946 },
  { month: '2025-09', side: 'CX', brand: 'JWB', currency: 'BDT', deposit: 1215125667.30, withdraw: 984062303.59, bonus: 145304197.24, winloss: 409349596.26, turnover: 11358820367.97, registered: 12332, ftd: 5814, unique: 66377 },
  
  { month: '2025-08', side: 'CX', brand: 'BVS', currency: 'BDT', deposit: 556004081.75, withdraw: 468872881.44, bonus: 81512118.79, winloss: 169929895.35, turnover: 4898606114.10, registered: 9497, ftd: 4368, unique: 36466 },
  { month: '2025-08', side: 'CX', brand: 'BVS', currency: 'INR', deposit: 109986231.64, withdraw: 87280034.71, bonus: 15711784.45, winloss: 39181625.61, turnover: 1198503863.03, registered: 1287, ftd: 361, unique: 2770 },
  { month: '2025-08', side: 'CX', brand: 'BVS', currency: 'VND', deposit: 75257465360, withdraw: 67998148600, bonus: 10787388420, winloss: 17548308200, turnover: 720779815530, registered: 1525, ftd: 493, unique: 3314 },
  { month: '2025-08', side: 'CX', brand: 'BVS', currency: 'PHP', deposit: 81913249.94, withdraw: 71001079, bonus: 15612142.85, winloss: 27024530.28, turnover: 1060184237.90, registered: 3316, ftd: 1425, unique: 9903 },
  { month: '2025-08', side: 'CX', brand: 'JWB', currency: 'BDT', deposit: 1392823917.27, withdraw: 1127334771.81, bonus: 157967446.15, winloss: 452250729.13, turnover: 13083851903.87, registered: 17016, ftd: 7793, unique: 76332 },
  
  { month: '2025-07', side: 'CX', brand: 'BVS', currency: 'BDT', deposit: 579300905.58, withdraw: 489741982.86, bonus: 83934556.37, winloss: 177489946.69, turnover: 5136044186.49, registered: 10182, ftd: 4048, unique: 36741 },
  { month: '2025-07', side: 'CX', brand: 'BVS', currency: 'INR', deposit: 113062099.60, withdraw: 89187639.37, bonus: 14062252.93, winloss: 38138617.49, turnover: 1128564039.25, registered: 1329, ftd: 407, unique: 3536 },
  { month: '2025-07', side: 'CX', brand: 'BVS', currency: 'VND', deposit: 80853078960, withdraw: 67750806840, bonus: 11207195340, winloss: 24314592530, turnover: 759476483360, registered: 1682, ftd: 514, unique: 9523 },
  { month: '2025-07', side: 'CX', brand: 'BVS', currency: 'PHP', deposit: 76235023, withdraw: 65589326, bonus: 11675557.86, winloss: 22871481.05, turnover: 742902976.30, registered: 2874, ftd: 1175, unique: 3382 },
  { month: '2025-07', side: 'CX', brand: 'JWB', currency: 'BDT', deposit: 1352158166.25, withdraw: 1123697703.73, bonus: 148075350.33, winloss: 388086893.96, turnover: 12308676938.24, registered: 16458, ftd: 7323, unique: 75616 },
  
  { month: '2025-06', side: 'CX', brand: 'BVS', currency: 'BDT', deposit: 604170146.66, withdraw: 511529786.59, bonus: 90216570.51, winloss: 184354307.45, turnover: 5311748681.65, registered: 20681, ftd: 5460, unique: 36741 },
  { month: '2025-06', side: 'CX', brand: 'BVS', currency: 'INR', deposit: 111353491, withdraw: 98119612.72, bonus: 17688684.57, winloss: 32673810.64, turnover: 1327418242.64, registered: 1959, ftd: 1139, unique: 3536 },
  { month: '2025-06', side: 'CX', brand: 'BVS', currency: 'VND', deposit: 84155932200, withdraw: 77239674000, bonus: 11644563930, winloss: 18539960610, turnover: 772033457060, registered: 1158, ftd: 449, unique: 9523 },
  { month: '2025-06', side: 'CX', brand: 'BVS', currency: 'PHP', deposit: 80081978, withdraw: 73018009, bonus: 13272676.76, winloss: 20690981.35, turnover: 816880974.69, registered: 3674, ftd: 1477, unique: 3382 },
  { month: '2025-06', side: 'CX', brand: 'JWB', currency: 'BDT', deposit: 1501971022.83, withdraw: 1221968031.73, bonus: 173195693.69, winloss: 470746926.41, turnover: 13512977830.61, registered: 20616, ftd: 8623, unique: 75616 },
  
  { month: '2025-10', side: 'CX', brand: 'BVS', currency: 'BDT', deposit: 479300486.53, withdraw: 407167782.18, bonus: 70402753.49, winloss: 144429052.90, turnover: 4215519846.27, registered: 7308, ftd: 3100, unique: 29251 },
  { month: '2025-10', side: 'CX', brand: 'BVS', currency: 'INR', deposit: 98148575.26, withdraw: 80335147.98, bonus: 13631520.68, winloss: 31466041.37, turnover: 1042667577.81, registered: 1235, ftd: 357, unique: 2473 },
  { month: '2025-10', side: 'CX', brand: 'BVS', currency: 'VND', deposit: 68789691000, withdraw: 61256133000, bonus: 9111788510, winloss: 16723157000, turnover: 604184669790, registered: 694, ftd: 217, unique: 2304 },
  { month: '2025-10', side: 'CX', brand: 'BVS', currency: 'PHP', deposit: 72217754, withdraw: 60748255, bonus: 10126299.14, winloss: 20911384.77, turnover: 636775714.48, registered: 2565, ftd: 672, unique: 6920 },
  { month: '2025-10', side: 'CX', brand: 'JWB', currency: 'BDT', deposit: 1179392199.47, withdraw: 959149261.44, bonus: 127663376.19, winloss: 366730573.43, turnover: 10313665435.60, registered: 14013, ftd: 5655, unique: 63660 },
  
  { month: '2025-11', side: 'CX', brand: 'BVS', currency: 'BDT', deposit: 407522116, withdraw: 351131778, bonus: 94874968, winloss: 128001884, turnover: 3753160313, registered: 13278, ftd: 3765, unique: 30815 },
  { month: '2025-11', side: 'CX', brand: 'BVS', currency: 'INR', deposit: 90733990, withdraw: 80270229, bonus: 17717798, winloss: 27198147, turnover: 1182480375, registered: 3131, ftd: 535, unique: 3052 },
  { month: '2025-11', side: 'CX', brand: 'BVS', currency: 'VND', deposit: 69192485370, withdraw: 66016826000, bonus: 13282391860, winloss: 12975243390, turnover: 607143543140, registered: 1956, ftd: 879, unique: 2615 },
  { month: '2025-11', side: 'CX', brand: 'BVS', currency: 'PHP', deposit: 56585522, withdraw: 48331132, bonus: 17264719, winloss: 20557347, turnover: 615979228, registered: 8751, ftd: 1387, unique: 7029 },
  { month: '2025-11', side: 'CX', brand: 'JWB', currency: 'BDT', deposit: 1078072171.71, withdraw: 905777635.48, bonus: 163775312.60, winloss: 313802166.13, turnover: 9855377059.26, registered: 14348, ftd: 5991, unique: 76214 },
];

// Compute metrics from raw data
function computeMetrics(data) {
  const netDeposit = data.deposit - data.withdraw;
  const netWinLoss = data.winloss;
  const averageDeposit = data.unique > 0 ? data.deposit / data.unique : 0;
  const netRatio = data.deposit > 0 ? (netWinLoss / data.deposit) * 100 : 0;
  const bonusRatio = data.deposit > 0 ? (data.bonus / data.deposit) * 100 : 0;
  const averageBonusPerPlayer = data.unique > 0 ? data.bonus / data.unique : 0;
  const averageTurnover = data.unique > 0 ? data.turnover / data.unique : 0;
  const averageWr = data.turnover > 0 ? (netWinLoss / data.turnover) * 100 : 0;
  const grossRevenuePct = netRatio;
  const ngrPerPlayer = data.unique > 0 ? netWinLoss / data.unique : 0;
  const netPerPlayer = data.unique > 0 ? netDeposit / data.unique : 0;
  const ftdConversionRate = data.registered > 0 ? (data.ftd / data.registered) * 100 : 0;

  return {
    totalDeposit: data.deposit,
    totalWithdraw: data.withdraw,
    bonus: data.bonus,
    companyWinLoss: data.winloss,
    uniquePlayer: data.unique,
    ftdPlayer: data.ftd,
    signUpPlayer: data.registered,
    turnover: data.turnover,
    netDeposit,
    netWinLoss,
    averageDeposit,
    netRatio,
    bonusRatio,
    averageBonusPerPlayer,
    averageTurnover,
    averageWr,
    grossRevenuePct,
    ngrPerPlayer,
    netPerPlayer,
    retentionRate: null, // Will be calculated later
    ftdConversionRate
  };
}

// Group data by month
const dataByMonth = {};
brandData.forEach(d => {
  if (!dataByMonth[d.month]) dataByMonth[d.month] = [];
  dataByMonth[d.month].push(d);
});

// Process each month
const months = ['2025-06', '2025-07', '2025-08', '2025-09', '2025-10', '2025-11'];
const cacheBaseDir = path.join(__dirname, 'data', 'dashboard-cache');

// Build metrics map from previous month for retention calculation
function buildMetricsMap(cacheData) {
  const map = new Map();
  for (const group of cacheData.groups || []) {
    const brandGroup = group.brandGroup;
    for (const currency of group.currencies || []) {
      const currencyCode = currency.currency;
      const currencyKey = `${brandGroup}::${currencyCode}`;
      map.set(currencyKey, { metrics: currency.metrics, type: 'currency' });
      
      for (const brand of currency.brands || []) {
        const brandName = brand.brand;
        const brandKey = `${brandGroup}::${brandName}::${currencyCode}`;
        map.set(brandKey, { metrics: brand.metrics, type: 'brand' });
      }
    }
    map.set(brandGroup, { metrics: group.metrics, type: 'group' });
  }
  return map;
}

// Calculate retention rate
function calculateRetentionRate(currentMetrics, prevMetrics) {
  if (!prevMetrics) return null;
  const prevUnique = prevMetrics.uniquePlayer || 0;
  const currentFtd = currentMetrics.ftdPlayer || 0;
  if (prevUnique > 0) {
    const currentUnique = currentMetrics.uniquePlayer || 0;
    return ((currentUnique - currentFtd) / prevUnique) * 100;
  }
  return null;
}

console.log('Processing BVS and JWB data for all months...\n');

for (const month of months) {
  const cacheFilePath = path.join(cacheBaseDir, month, 'all__all__all.json');
  
  if (!fs.existsSync(cacheFilePath)) {
    console.log(`⚠️  Cache file not found: ${cacheFilePath}`);
    continue;
  }

  const cacheText = fs.readFileSync(cacheFilePath, 'utf-8');
  const cacheData = JSON.parse(cacheText);

  // Load previous month metrics for retention calculation
  const monthIndex = months.indexOf(month);
  const prevMonth = monthIndex > 0 ? months[monthIndex - 1] : null;
  let prevMetricsMap = new Map();
  
  if (prevMonth) {
    const prevCacheFilePath = path.join(cacheBaseDir, prevMonth, 'all__all__all.json');
    if (fs.existsSync(prevCacheFilePath)) {
      const prevCacheText = fs.readFileSync(prevCacheFilePath, 'utf-8');
      const prevCacheData = JSON.parse(prevCacheText);
      prevMetricsMap = buildMetricsMap(prevCacheData);
    }
  }

  // Find CX brand group
  let cxGroup = cacheData.groups.find(g => g.brandGroup === 'CX');
  if (!cxGroup) {
    cxGroup = { brandGroup: 'CX', metrics: {}, currencies: [] };
    cacheData.groups.push(cxGroup);
  }

  // Group current month's data by currency
  const monthData = dataByMonth[month] || [];
  const dataByMCurrency = {};
  
  monthData.forEach(d => {
    if (!dataByMCurrency[d.currency]) dataByMCurrency[d.currency] = [];
    dataByMCurrency[d.currency].push(d);
  });

  // Update currencies with BVS and JWB data
  for (const [currencyCode, currencyRecords] of Object.entries(dataByMCurrency)) {
    let currencyObj = cxGroup.currencies.find(c => c.currency === currencyCode);
    
    if (!currencyObj) {
      currencyObj = { currency: currencyCode, metrics: {}, brands: [] };
      cxGroup.currencies.push(currencyObj);
    }

    // Ensure brands array exists
    if (!currencyObj.brands) currencyObj.brands = [];

    // Update brands
    for (const brandRec of currencyRecords) {
      const brandMetrics = computeMetrics(brandRec);
      
      let brandObj = currencyObj.brands.find(b => b.brand === brandRec.brand);
      if (!brandObj) {
        brandObj = {
          brand: brandRec.brand,
          brandGroup: 'CX',
          currency: currencyCode,
          metrics: brandMetrics
        };
        currencyObj.brands.push(brandObj);
      } else {
        brandObj.metrics = brandMetrics;
      }

      // Calculate retention rate for brand
      const prevBrandKey = `CX::${brandRec.brand}::${currencyCode}`;
      const prevBrandMetrics = prevMetricsMap.get(prevBrandKey)?.metrics;
      brandObj.metrics.retentionRate = calculateRetentionRate(brandObj.metrics, prevBrandMetrics);
    }

    // Recalculate currency-level metrics (aggregate from brands)
    if (currencyObj.brands.length > 0) {
      const aggregated = {
        totalDeposit: 0,
        totalWithdraw: 0,
        bonus: 0,
        companyWinLoss: 0,
        uniquePlayer: 0,
        ftdPlayer: 0,
        signUpPlayer: 0,
        turnover: 0,
        netDeposit: 0,
        netWinLoss: 0,
        averageDeposit: 0,
        netRatio: 0,
        bonusRatio: 0,
        averageBonusPerPlayer: 0,
        averageTurnover: 0,
        averageWr: 0,
        grossRevenuePct: 0,
        ngrPerPlayer: 0,
        netPerPlayer: 0,
        retentionRate: null,
        ftdConversionRate: 0
      };

      let totalUnique = 0;
      let totalTurnover = 0;

      for (const brand of currencyObj.brands) {
        const m = brand.metrics;
        aggregated.totalDeposit += m.totalDeposit;
        aggregated.totalWithdraw += m.totalWithdraw;
        aggregated.bonus += m.bonus;
        aggregated.companyWinLoss += m.companyWinLoss;
        aggregated.uniquePlayer += m.uniquePlayer;
        aggregated.ftdPlayer += m.ftdPlayer;
        aggregated.signUpPlayer += m.signUpPlayer;
        aggregated.turnover += m.turnover;
        aggregated.netDeposit += m.netDeposit;
        aggregated.netWinLoss += m.netWinLoss;
        totalUnique += m.uniquePlayer;
        totalTurnover += m.turnover;
      }

      // Recalculate percentages
      if (aggregated.totalDeposit > 0) {
        aggregated.netRatio = (aggregated.netWinLoss / aggregated.totalDeposit) * 100;
        aggregated.bonusRatio = (aggregated.bonus / aggregated.totalDeposit) * 100;
        aggregated.grossRevenuePct = aggregated.netRatio;
        aggregated.averageDeposit = aggregated.totalDeposit / totalUnique;
      }
      if (totalUnique > 0) {
        aggregated.averageBonusPerPlayer = aggregated.bonus / totalUnique;
        aggregated.ngrPerPlayer = aggregated.netWinLoss / totalUnique;
        aggregated.netPerPlayer = aggregated.netDeposit / totalUnique;
      }
      if (totalTurnover > 0) {
        aggregated.averageTurnover = totalTurnover / totalUnique;
        aggregated.averageWr = (aggregated.companyWinLoss / totalTurnover) * 100;
      }
      if (aggregated.signUpPlayer > 0) {
        aggregated.ftdConversionRate = (aggregated.ftdPlayer / aggregated.signUpPlayer) * 100;
      }

      // Calculate retention rate for currency
      const prevCurrencyKey = `CX::${currencyCode}`;
      const prevCurrencyMetrics = prevMetricsMap.get(prevCurrencyKey)?.metrics;
      aggregated.retentionRate = calculateRetentionRate(aggregated, prevCurrencyMetrics);

      currencyObj.metrics = aggregated;
    }
  }

  // Recalculate group-level metrics
  if (cxGroup.currencies.length > 0) {
    const aggregated = {
      totalDeposit: 0,
      totalWithdraw: 0,
      bonus: 0,
      companyWinLoss: 0,
      uniquePlayer: 0,
      ftdPlayer: 0,
      signUpPlayer: 0,
      turnover: 0,
      netDeposit: 0,
      netWinLoss: 0,
      averageDeposit: 0,
      netRatio: 0,
      bonusRatio: 0,
      averageBonusPerPlayer: 0,
      averageTurnover: 0,
      averageWr: 0,
      grossRevenuePct: 0,
      ngrPerPlayer: 0,
      netPerPlayer: 0,
      retentionRate: null,
      ftdConversionRate: 0
    };

    let totalUnique = 0;
    let totalTurnover = 0;

    for (const currency of cxGroup.currencies) {
      const m = currency.metrics;
      aggregated.totalDeposit += m.totalDeposit;
      aggregated.totalWithdraw += m.totalWithdraw;
      aggregated.bonus += m.bonus;
      aggregated.companyWinLoss += m.companyWinLoss;
      aggregated.uniquePlayer += m.uniquePlayer;
      aggregated.ftdPlayer += m.ftdPlayer;
      aggregated.signUpPlayer += m.signUpPlayer;
      aggregated.turnover += m.turnover;
      aggregated.netDeposit += m.netDeposit;
      aggregated.netWinLoss += m.netWinLoss;
      totalUnique += m.uniquePlayer;
      totalTurnover += m.turnover;
    }

    if (aggregated.totalDeposit > 0) {
      aggregated.netRatio = (aggregated.netWinLoss / aggregated.totalDeposit) * 100;
      aggregated.bonusRatio = (aggregated.bonus / aggregated.totalDeposit) * 100;
      aggregated.grossRevenuePct = aggregated.netRatio;
      aggregated.averageDeposit = aggregated.totalDeposit / totalUnique;
    }
    if (totalUnique > 0) {
      aggregated.averageBonusPerPlayer = aggregated.bonus / totalUnique;
      aggregated.ngrPerPlayer = aggregated.netWinLoss / totalUnique;
      aggregated.netPerPlayer = aggregated.netDeposit / totalUnique;
    }
    if (totalTurnover > 0) {
      aggregated.averageTurnover = totalTurnover / totalUnique;
      aggregated.averageWr = (aggregated.companyWinLoss / totalTurnover) * 100;
    }
    if (aggregated.signUpPlayer > 0) {
      aggregated.ftdConversionRate = (aggregated.ftdPlayer / aggregated.signUpPlayer) * 100;
    }

    // Calculate retention rate for group
    const prevGroupKey = 'CX';
    const prevGroupMetrics = prevMetricsMap.get(prevGroupKey)?.metrics;
    aggregated.retentionRate = calculateRetentionRate(aggregated, prevGroupMetrics);

    cxGroup.metrics = aggregated;
  }

  // Update timestamp
  cacheData.timestamp = Date.now();

  // Write updated cache
  fs.writeFileSync(cacheFilePath, JSON.stringify(cacheData, null, 2));
  console.log(`✓ Updated ${month}: BVS & JWB data + retention rates calculated`);
}

console.log('\n✓ All cache files updated successfully');
