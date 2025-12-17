import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const cacheDir = path.join(__dirname, 'data', 'dashboard-cache');

function normalizeAllToBrand(obj) {
    if (obj === null || obj === undefined) return obj;
    if (typeof obj !== 'object') return obj;
    
    if (Array.isArray(obj)) {
        return obj.map(item => normalizeAllToBrand(item));
    }
    
    const normalized = {};
    for (const [key, value] of Object.entries(obj)) {
        if (typeof value === 'object') {
            normalized[key] = normalizeAllToBrand(value);
        } else {
            normalized[key] = value;
        }
    }
    
    // For individual brand records, set brandGroup to match brand
    // This happens when both brand and brandGroup exist at the same level
    if (normalized.brand && normalized.brandGroup && 
        typeof normalized.brand === 'string' && 
        typeof normalized.brandGroup === 'string') {
        normalized.brandGroup = normalized.brand;
    }
    
    return normalized;
}

async function fixCacheFiles() {
    try {
        const files = await fs.readdir(cacheDir, { recursive: true });
        const jsonFiles = files.filter(f => f.endsWith('.json'));
        
        console.log(`Found ${jsonFiles.length} JSON files to process...`);
        
        let fixed = 0;
        for (const file of jsonFiles) {
            const filePath = path.join(cacheDir, file);
            try {
                const content = await fs.readFile(filePath, 'utf8');
                const data = JSON.parse(content);
                const normalized = normalizeAllToBrand(data);
                
                // Check if anything changed
                const newContent = JSON.stringify(normalized, null, 2);
                if (newContent !== content) {
                    await fs.writeFile(filePath, newContent, 'utf8');
                    fixed++;
                    console.log(`✓ Fixed: ${file}`);
                }
            } catch (err) {
                console.error(`✗ Error processing ${file}:`, err.message);
            }
        }
        
        console.log(`\n✓ Done! Fixed ${fixed} files.`);
    } catch (err) {
        console.error('Fatal error:', err);
        process.exit(1);
    }
}

fixCacheFiles();
