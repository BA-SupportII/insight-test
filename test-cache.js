import 'dotenv/config';
import fetch from 'node-fetch';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const BASE_URL = 'http://localhost:4001';

async function test() {
  console.log('Testing Dashboard Cache System\n');
  
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth() + 1;
  
  console.log(`📅 Test Date: ${year}-${String(month).padStart(2, '0')}\n`);

  try {
    // Test 1: Save cache
    console.log('📝 Test 1: Save cache data...');
    const testData = {
      timestamp: Date.now(),
      filters: {
        startDate: `${year}-${String(month).padStart(2, '0')}-01`,
        endDate: `${year}-${String(month).padStart(2, '0')}-28`,
        brandGroups: ['Test Group'],
        brands: ['Test Brand'],
        currencies: ['USD']
      },
      groups: [
        {
          brandGroup: 'Test Group',
          metrics: { totalDeposit: 1000 },
          currencies: []
        }
      ]
    };

    const saveRes = await fetch(`${BASE_URL}/api/dashboard/cache/save`, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({
        year,
        month,
        brandGroup: 'test_group',
        brand: 'test_brand',
        currency: 'usd',
        data: testData
      })
    });

    const saveResult = await saveRes.json();
    if (saveResult.ok) {
      console.log('✅ Save successful');
      console.log(`   Path: ${saveResult.path}\n`);
    } else {
      console.log('❌ Save failed:', saveResult.error);
      return;
    }

    // Test 2: Load cache
    console.log('📖 Test 2: Load cache data...');
    const loadRes = await fetch(
      `${BASE_URL}/api/dashboard/cache/load?year=${year}&month=${month}&brandGroup=test_group&brand=test_brand&currency=usd`
    );

    const loadResult = await loadRes.json();
    if (loadResult.success && loadResult.data) {
      console.log('✅ Load successful');
      console.log(`   Loaded timestamp: ${new Date(loadResult.data.timestamp).toISOString()}`);
      console.log(`   Brands: ${loadResult.data.groups.map(g => g.brandGroup).join(', ')}\n`);
    } else {
      console.log('❌ Load failed:', loadResult.error);
      return;
    }

    // Test 3: List cache
    console.log('📋 Test 3: List cache for month...');
    const listRes = await fetch(
      `${BASE_URL}/api/dashboard/cache/list?year=${year}&month=${month}`
    );

    const listResult = await listRes.json();
    if (listResult.success) {
      console.log('✅ List successful');
      console.log(`   Found ${listResult.entries.length} cached item(s)`);
      listResult.entries.forEach(entry => {
        console.log(`   - ${entry.file}`);
      });
      console.log();
    } else {
      console.log('❌ List failed:', listResult.error);
      return;
    }

    // Test 4: Verify file exists on disk
    console.log('💾 Test 4: Verify disk storage...');
    const cachePath = path.join(
      __dirname,
      'data',
      'dashboard-cache',
      `${year}-${String(month).padStart(2, '0')}`,
      'test_group__test_brand__usd.json'
    );

    try {
      const stats = await fs.stat(cachePath);
      console.log('✅ File exists on disk');
      console.log(`   Path: ${cachePath}`);
      console.log(`   Size: ${stats.size} bytes`);
      console.log(`   Modified: ${new Date(stats.mtimeMs).toISOString()}\n`);
    } catch (err) {
      console.log('❌ File not found:', err.message);
      return;
    }

    // Test 5: Read and validate file content
    console.log('📄 Test 5: Validate file content...');
    try {
      const content = await fs.readFile(cachePath, 'utf8');
      const parsed = JSON.parse(content);
      console.log('✅ File is valid JSON');
      console.log(`   Groups: ${parsed.groups.length}`);
      console.log(`   Filters: ${JSON.stringify(parsed.filters.currencies)}\n`);
    } catch (err) {
      console.log('❌ Content validation failed:', err.message);
      return;
    }

    console.log('✨ All tests passed!\n');
    console.log('Next steps:');
    console.log('1. Open http://localhost:4001/dashboard-pro');
    console.log('2. Select filters and click Search');
    console.log('3. Data will be cached to: data/dashboard-cache/YYYY-MM/');
    console.log('4. Subsequent loads will show "(cached)" in status');

  } catch (err) {
    console.error('❌ Test error:', err);
  }
}

test();
