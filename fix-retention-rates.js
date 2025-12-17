const fs = require('fs');
const path = require('path');

const months = ['2025-06', '2025-07', '2025-08', '2025-09', '2025-10', '2025-11'];
const cacheDir = path.join(__dirname, 'data', 'dashboard-cache');

// Load all monthly data
const monthlyData = {};
months.forEach(month => {
  const filePath = path.join(cacheDir, month, 'all__all__all.json');
  if (fs.existsSync(filePath)) {
    monthlyData[month] = JSON.parse(fs.readFileSync(filePath, 'utf8'));
  }
});

// Extract unique player counts by brand group, currency, brand for each month
function getPlayerData(data, month) {
  const players = {};
  
  data.groups.forEach(group => {
    const brandGroup = group.brandGroup;
    if (!players[brandGroup]) players[brandGroup] = {};
    
    // Store brandGroup level
    if (group.metrics.uniquePlayer) {
      players[brandGroup]['__total__'] = {
        uniquePlayer: group.metrics.uniquePlayer,
        ftdPlayer: group.metrics.ftdPlayer
      };
    }
    
    // Store currency level
    group.currencies.forEach(curr => {
      const currency = curr.currency;
      if (!players[brandGroup][currency]) players[brandGroup][currency] = {};
      
      if (curr.metrics.uniquePlayer) {
        players[brandGroup][currency]['__total__'] = {
          uniquePlayer: curr.metrics.uniquePlayer,
          ftdPlayer: curr.metrics.ftdPlayer
        };
      }
      
      // Store brand level
      curr.brands.forEach(brand => {
        const brandName = brand.brand;
        players[brandGroup][currency][brandName] = {
          uniquePlayer: brand.metrics.uniquePlayer,
          ftdPlayer: brand.metrics.ftdPlayer
        };
      });
    });
  });
  
  return players;
}

// Get player data for each month
const playersByMonth = {};
months.forEach(month => {
  if (monthlyData[month]) {
    playersByMonth[month] = getPlayerData(monthlyData[month], month);
  }
});

// Function to calculate retention rate
function calculateRetentionRate(currentMonth, prevMonth, brandGroup, currency = null, brand = null) {
  if (!playersByMonth[prevMonth] || !playersByMonth[currentMonth]) return null;
  
  const prevPlayers = playersByMonth[prevMonth];
  const currPlayers = playersByMonth[currentMonth];
  
  let prevUnique, currUnique, currFTD;
  
  try {
    if (!currency) {
      // Brand group level
      prevUnique = prevPlayers[brandGroup]?.__total__?.uniquePlayer;
      currUnique = currPlayers[brandGroup]?.__total__?.uniquePlayer;
      currFTD = currPlayers[brandGroup]?.__total__?.ftdPlayer;
    } else if (!brand) {
      // Currency level
      prevUnique = prevPlayers[brandGroup]?.[currency]?.__total__?.uniquePlayer;
      currUnique = currPlayers[brandGroup]?.[currency]?.__total__?.uniquePlayer;
      currFTD = currPlayers[brandGroup]?.[currency]?.__total__?.ftdPlayer;
    } else {
      // Brand level
      prevUnique = prevPlayers[brandGroup]?.[currency]?.[brand]?.uniquePlayer;
      currUnique = currPlayers[brandGroup]?.[currency]?.[brand]?.uniquePlayer;
      currFTD = currPlayers[brandGroup]?.[currency]?.[brand]?.ftdPlayer;
    }
  } catch (e) {
    return null;
  }
  
  if (!prevUnique || prevUnique === 0 || !currUnique || !currFTD) {
    return null;
  }
  
  const retained = currUnique - currFTD;
  const retentionRate = (retained / prevUnique) * 100;
  
  return isFinite(retentionRate) ? retentionRate : null;
}

// Update retention rates in each monthly file
months.forEach((month, idx) => {
  if (!monthlyData[month]) return;
  
  const prevMonth = idx > 0 ? months[idx - 1] : null;
  const data = monthlyData[month];
  
  data.groups.forEach(group => {
    const brandGroup = group.brandGroup;
    
    // Update brand group level
    if (prevMonth) {
      group.metrics.retentionRate = calculateRetentionRate(month, prevMonth, brandGroup);
    }
    
    // Update currency level
    group.currencies.forEach(curr => {
      const currency = curr.currency;
      
      if (prevMonth) {
        curr.metrics.retentionRate = calculateRetentionRate(month, prevMonth, brandGroup, currency);
      }
      
      // Update brand level
      curr.brands.forEach(brand => {
        const brandName = brand.brand;
        
        if (prevMonth) {
          brand.metrics.retentionRate = calculateRetentionRate(month, prevMonth, brandGroup, currency, brandName);
        }
      });
    });
  });
  
  // Write updated file
  const filePath = path.join(cacheDir, month, 'all__all__all.json');
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
  console.log(`✓ Updated ${month}`);
});

console.log('\nRetention rates recalculated for all months!');
