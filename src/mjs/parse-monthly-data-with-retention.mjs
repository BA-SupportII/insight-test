import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Parse TSV data from the input
function parseCSVData(tsvText) {
  const lines = tsvText.trim().split('\n');
  const headers = lines[0].split('\t');
  
  const records = [];
  for (let i = 1; i < lines.length; i++) {
    const values = lines[i].split('\t');
    const record = {};
    headers.forEach((header, idx) => {
      record[header.trim()] = values[idx] ? values[idx].trim() : '';
    });
    records.push(record);
  }
  
  return records;
}

// Helper to convert values to numbers
function num(val) {
  if (!val || val === '' || val === '--') return 0;
  const parsed = parseFloat(String(val).replace(/,/g, ''));
  return isNaN(parsed) ? 0 : parsed;
}

// Compute metrics for each record with previous month stats
function computeMetrics(record, prevStats = null, currency = '') {
  const currencyCode = String(currency || '').toUpperCase();
  const multiplier = (currencyCode === 'VND' || currencyCode === 'IDR') ? 1000 : 1;

  const totalDeposit = num(record['Total Deposit']) * multiplier;
  const totalWithdraw = num(record['Total Withdraw']) * multiplier;
  const bonus = num(record['Bonus']) * multiplier;
  const companyWinLoss = num(record['Company Win/Loss']) * multiplier;
  const uniquePlayer = num(record['Unique Player']);
  const ftdPlayer = num(record['First Depositors']);
  const signUpPlayer = num(record['Registered Users']);
  const turnover = num(record['Stake Ex. Draw']) * multiplier;

  const netDeposit = totalDeposit - totalWithdraw;
  const netWinLoss = companyWinLoss - bonus;
  const averageDeposit = uniquePlayer ? totalDeposit / uniquePlayer : 0;
  const netRatio = totalDeposit ? (netDeposit / totalDeposit) * 100 : 0;
  const bonusRatio = companyWinLoss ? (bonus / companyWinLoss) * 100 : 0;
  const averageBonusPerPlayer = uniquePlayer ? bonus / uniquePlayer : 0;
  const averageTurnover = uniquePlayer ? turnover / uniquePlayer : 0;
  const averageWr = totalDeposit ? turnover / totalDeposit : 0;
  const grossRevenuePct = totalDeposit ? (netDeposit / totalDeposit) * 100 : 0;
  const ngrPerPlayer = uniquePlayer ? netWinLoss / uniquePlayer : 0;
  const netPerPlayer = uniquePlayer ? netDeposit / uniquePlayer : 0;
  const ftdConversionRate = signUpPlayer ? (ftdPlayer / signUpPlayer) * 100 : null;

  // RETENTION RATE CALCULATION - matching server-dashboard.js formula
  let retentionRate = null;
  if (prevStats) {
    const prevUnique = num(prevStats.uniquePlayer);
    if (prevUnique > 0) {
      retentionRate = ((uniquePlayer - ftdPlayer) / prevUnique) * 100;
    }
  }

  return {
    totalDeposit,
    totalWithdraw,
    bonus,
    companyWinLoss,
    uniquePlayer,
    ftdPlayer,
    signUpPlayer,
    turnover,
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
    retentionRate,
    ftdConversionRate
  };
}

// Finalize metrics with derived fields and previous month data
function finalizeGroupMetrics(base, prevTotals = { uniquePlayer: 0, ftdPlayer: 0 }) {
  const netDeposit = base.totalDeposit - base.totalWithdraw;
  const netWinLoss = base.companyWinLoss - base.bonus;
  const averageDeposit = base.uniquePlayer ? base.totalDeposit / base.uniquePlayer : 0;
  const netRatio = base.totalDeposit ? (netDeposit / base.totalDeposit) * 100 : 0;
  const bonusRatio = base.companyWinLoss ? (base.bonus / base.companyWinLoss) * 100 : 0;
  const averageBonusPerPlayer = base.uniquePlayer ? base.bonus / base.uniquePlayer : 0;
  const averageTurnover = base.uniquePlayer ? base.turnover / base.uniquePlayer : 0;
  const averageWr = base.totalDeposit ? base.turnover / base.totalDeposit : 0;
  const grossRevenuePct = base.totalDeposit ? (netDeposit / base.totalDeposit) * 100 : 0;
  const ngrPerPlayer = base.uniquePlayer ? netWinLoss / base.uniquePlayer : 0;
  const netPerPlayer = base.uniquePlayer ? netDeposit / base.uniquePlayer : 0;
  const ftdConversionRate = base.signUpPlayer ? (base.ftdPlayer / base.signUpPlayer) * 100 : null;

  // RETENTION RATE - uses previous month's unique players and current month's new players
  let retentionRate = null;
  const prevUnique = num(prevTotals.uniquePlayer);
  if (prevUnique > 0) {
    retentionRate = ((base.uniquePlayer - base.ftdPlayer) / prevUnique) * 100;
  }

  return {
    totalDeposit: base.totalDeposit,
    totalWithdraw: base.totalWithdraw,
    bonus: base.bonus,
    companyWinLoss: base.companyWinLoss,
    uniquePlayer: base.uniquePlayer,
    ftdPlayer: base.ftdPlayer,
    signUpPlayer: base.signUpPlayer,
    turnover: base.turnover,
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
    retentionRate,
    ftdConversionRate
  };
}

// Build previous stats map from records
function buildPrevStatsMap(prevRecords) {
  const map = new Map();
  for (const rec of prevRecords || []) {
    const side = rec['Side'];
    const brand = rec['Brand'];
    const currency = rec['Currency'];
    const key = `${side}::${brand}::${currency}`;
    
    map.set(key, {
      uniquePlayer: num(rec['Unique Player']),
      ftdPlayer: num(rec['First Depositors'])
    });
  }
  return map;
}

// Build dashboard structure from records
function buildDashboardStructure(records, prevMap = new Map()) {
  const groups = {};
  
  // Group by brandGroup -> currency -> brand
  records.forEach(record => {
    const brandGroup = record['Side'];
    const brand = record['Brand'];
    const currency = record['Currency'];
    
    if (!groups[brandGroup]) {
      groups[brandGroup] = {};
    }
    if (!groups[brandGroup][currency]) {
      groups[brandGroup][currency] = {};
    }
    
    groups[brandGroup][currency][brand] = record;
  });

  // Build hierarchical structure
  const result = [];
  
  for (const [brandGroup, currencyMap] of Object.entries(groups)) {
    const currencies = [];
    let brandGroupBaseMetrics = {
      totalDeposit: 0,
      totalWithdraw: 0,
      bonus: 0,
      companyWinLoss: 0,
      uniquePlayer: 0,
      ftdPlayer: 0,
      signUpPlayer: 0,
      turnover: 0
    };
    let brandGroupPrevTotals = {
      uniquePlayer: 0,
      ftdPlayer: 0
    };

    for (const [currency, brandMap] of Object.entries(currencyMap)) {
      const brands = [];
      let currencyMetrics = {
        totalDeposit: 0,
        totalWithdraw: 0,
        bonus: 0,
        companyWinLoss: 0,
        uniquePlayer: 0,
        ftdPlayer: 0,
        signUpPlayer: 0,
        turnover: 0
      };
      let currencyPrevTotals = {
        uniquePlayer: 0,
        ftdPlayer: 0
      };

      for (const [brand, record] of Object.entries(brandMap)) {
        // Get previous stats for this brand/currency combo
        const prevStatsKey = `${brandGroup}::${brand}::${currency}`;
        const prevStats = prevMap.get(prevStatsKey);
        
        const metrics = computeMetrics(record, prevStats, currency);
        
        brands.push({
          brand,
          brandGroup,
          currency,
          metrics
        });

        // Accumulate for currency level
        currencyMetrics.totalDeposit += metrics.totalDeposit;
        currencyMetrics.totalWithdraw += metrics.totalWithdraw;
        currencyMetrics.bonus += metrics.bonus;
        currencyMetrics.companyWinLoss += metrics.companyWinLoss;
        currencyMetrics.uniquePlayer += metrics.uniquePlayer;
        currencyMetrics.ftdPlayer += metrics.ftdPlayer;
        currencyMetrics.signUpPlayer += metrics.signUpPlayer;
        currencyMetrics.turnover += metrics.turnover;

        // Accumulate previous stats
        if (prevStats) {
          currencyPrevTotals.uniquePlayer += prevStats.uniquePlayer;
          currencyPrevTotals.ftdPlayer += prevStats.ftdPlayer;
        }
      }

      const currencyFinalMetrics = finalizeGroupMetrics(currencyMetrics, currencyPrevTotals);
      
      currencies.push({
        currency,
        metrics: currencyFinalMetrics,
        brands
      });

      // Accumulate for brand group level
      brandGroupBaseMetrics.totalDeposit += currencyMetrics.totalDeposit;
      brandGroupBaseMetrics.totalWithdraw += currencyMetrics.totalWithdraw;
      brandGroupBaseMetrics.bonus += currencyMetrics.bonus;
      brandGroupBaseMetrics.companyWinLoss += currencyMetrics.companyWinLoss;
      brandGroupBaseMetrics.uniquePlayer += currencyMetrics.uniquePlayer;
      brandGroupBaseMetrics.ftdPlayer += currencyMetrics.ftdPlayer;
      brandGroupBaseMetrics.signUpPlayer += currencyMetrics.signUpPlayer;
      brandGroupBaseMetrics.turnover += currencyMetrics.turnover;

      brandGroupPrevTotals.uniquePlayer += currencyPrevTotals.uniquePlayer;
      brandGroupPrevTotals.ftdPlayer += currencyPrevTotals.ftdPlayer;
    }

    const brandGroupFinalMetrics = finalizeGroupMetrics(brandGroupBaseMetrics, brandGroupPrevTotals);
    
    result.push({
      brandGroup,
      metrics: brandGroupFinalMetrics,
      currencies
    });
  }

  return result;
}

// Main function
function processData(tsvText) {
  const records = parseCSVData(tsvText);
  
  // Group by month
  const byMonth = {};
  
  records.forEach(record => {
    const dateRange = record['Month'];
    const month = dateRange.substring(0, 7); // Extract YYYY-MM
    
    if (!byMonth[month]) {
      byMonth[month] = [];
    }
    byMonth[month].push(record);
  });

  // Sort months chronologically
  const sortedMonths = Array.from(Object.keys(byMonth)).sort();

  // Generate dashboard JSON for each month (with previous month data for retention rate)
  for (let i = 0; i < sortedMonths.length; i++) {
    const month = sortedMonths[i];
    const monthRecords = byMonth[month];
    
    // Get previous month's data if it exists
    let prevMap = new Map();
    if (i > 0) {
      const prevMonth = sortedMonths[i - 1];
      const prevRecords = byMonth[prevMonth];
      prevMap = buildPrevStatsMap(prevRecords);
    }

    const groups = buildDashboardStructure(monthRecords, prevMap);
    
    // Calculate proper end date
    const [year, monthNum] = month.split('-');
    const lastDay = new Date(year, monthNum, 0).getDate();
    
    const dashboardData = {
      timestamp: Date.now(),
      filters: {
        startDate: `${month}-01`,
        endDate: `${month}-${String(lastDay).padStart(2, '0')}`,
        brandGroups: [],
        brands: [],
        currencies: []
      },
      groups
    };

    // Create directory if not exists
    const monthDir = path.join(__dirname, 'data', 'dashboard-cache', month);
    if (!fs.existsSync(monthDir)) {
      fs.mkdirSync(monthDir, { recursive: true });
    }

    // Write JSON file
    const filePath = path.join(monthDir, 'all__all__all.json');
    fs.writeFileSync(filePath, JSON.stringify(dashboardData, null, 2));
    console.log(`✓ Created ${filePath}`);
    if (i > 0) {
      console.log(`  └─ Retention rate calculated from ${sortedMonths[i - 1]} data`);
    }
  }
}

// Read TSV file
const tsvPath = process.argv[2];
if (tsvPath && fs.existsSync(tsvPath)) {
  const tsvText = fs.readFileSync(tsvPath, 'utf-8');
  processData(tsvText);
  console.log('\n✓ All monthly dashboard caches created with retention rates');
} else {
  console.log('Usage: node parse-monthly-data-with-retention.mjs <path-to-tsv-file>');
  console.log('Example: node parse-monthly-data-with-retention.mjs data/monthly-data.tsv');
}
