const fs = require('fs');
const path = require('path');

// Parse CSV data from the input
function parseCSVData(csvText) {
  const lines = csvText.trim().split('\n');
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

// Compute metrics for each record
function computeMetrics(record, currency = '') {
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
    retentionRate: null,
    ftdConversionRate
  };
}

// Aggregate metrics
function aggregateMetrics(rows) {
  return rows.reduce((acc, row) => {
    acc.totalDeposit += num(row.metrics.totalDeposit);
    acc.totalWithdraw += num(row.metrics.totalWithdraw);
    acc.bonus += num(row.metrics.bonus);
    acc.companyWinLoss += num(row.metrics.companyWinLoss);
    acc.uniquePlayer += num(row.metrics.uniquePlayer);
    acc.ftdPlayer += num(row.metrics.ftdPlayer);
    acc.signUpPlayer += num(row.metrics.signUpPlayer);
    acc.turnover += num(row.metrics.turnover);
    return acc;
  }, {
    totalDeposit: 0,
    totalWithdraw: 0,
    bonus: 0,
    companyWinLoss: 0,
    uniquePlayer: 0,
    ftdPlayer: 0,
    signUpPlayer: 0,
    turnover: 0
  });
}

// Finalize metrics with derived fields
function finalizeGroupMetrics(base) {
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
    retentionRate: null,
    ftdConversionRate
  };
}

// Build dashboard structure from records
function buildDashboardStructure(records) {
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

      for (const [brand, record] of Object.entries(brandMap)) {
        const metrics = computeMetrics(record, currency);
        
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
      }

      const currencyFinalMetrics = finalizeGroupMetrics(currencyMetrics);
      
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
    }

    const brandGroupFinalMetrics = finalizeGroupMetrics(brandGroupBaseMetrics);
    
    result.push({
      brandGroup,
      metrics: brandGroupFinalMetrics,
      currencies
    });
  }

  return result;
}

// Main function
function processData(csvText) {
  const records = parseCSVData(csvText);
  
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

  // Generate dashboard JSON for each month
  for (const [month, monthRecords] of Object.entries(byMonth)) {
    const groups = buildDashboardStructure(monthRecords);
    
    const dashboardData = {
      timestamp: Date.now(),
      filters: {
        startDate: `${month}-01`,
        endDate: `${month}-31`, // Simplified, could calculate actual end date
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
  }
}

// Read CSV from file if path provided as argument, otherwise read from stdin
const csvPath = process.argv[2];
if (csvPath && fs.existsSync(csvPath)) {
  const csvText = fs.readFileSync(csvPath, 'utf-8');
  processData(csvText);
} else {
  console.log('Usage: node parse-monthly-data.js <path-to-csv-file>');
  console.log('Example: node parse-monthly-data.js data.tsv');
}
