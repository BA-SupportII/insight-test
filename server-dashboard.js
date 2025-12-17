import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import fetch from 'node-fetch';
import path from 'path';
import fs from 'fs/promises';
import os from 'os';
import { fileURLToPath } from 'url';

// ====== CONFIG ======
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = Number(process.env.DASHBOARD_PORT || process.env.PORT || 4001);
const API_BASE = process.env.API_BASE || 'https://climax.consolehubs715.com';
const AUTH_URL = process.env.AUTH_URL || `${API_BASE}/api/auth/authenticate`;
const AUTH_USER = process.env.AUTH_USER || '';
const AUTH_PASS = process.env.AUTH_PASS || '';
const AUTH_TENANT = process.env.AUTH_TENANT || 'tenant_all_dimensions';
const CORS_ORIGIN = process.env.CORS_ORIGIN || '*';
const API_TZ_OFFSET_MINUTES = Number(process.env.API_TZ_OFFSET_MINUTES ?? 480);
const API_TZ_OFFSET_MS = API_TZ_OFFSET_MINUTES * 60_000;

const DEFAULT_BRANDS = 'jwb,bb,mp,bgw,ml,hb,mxw,c7,bw,bjd,bgb,bs,fw,pb,vb,jw,bjs,ccs,ga,g68,mpf,g8,bt,se,bvs,ht,dp,ua,pgo,jtb,d88,kv,ab,cf,tp,mb,iw,sb,dzo,v7,be,kg,slb,cx,mcw,oz,bh,cb,ctn,k9,ww,bju,bj8,e28,ic,wvn,wau,bj,s6,w6,jb,jw,c24,v9';
const DEFAULT_CURRENCY_SET = 'USD,INR,MXN,ZAR,AED,NGN,BDT,AUD,MMK,MMKK,IDR,TRY,CAD,MYR,PHP,LKR,NPR,KRW,GHS,PKR,CNY,THB,VND,HKD,NZD,BRL,SGD,JPY,KHR,SAR,OMR';
const HEX_COLOR_REGEX = /^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/;
const FX_CACHE_TTL_MS = 5 * 60 * 1000;

// ====== BETNAGA CONFIG ======
const BETNAGA_BASE_URL = process.env.BETNAGA_BASE_URL || 'https://59249300.com';
const BETNAGA_USERNAME = process.env.BETNAGA_USERNAME || '';
const BETNAGA_PASSWORD = process.env.BETNAGA_PASSWORD || '';
const BETNAGA_BRAND_NAME = process.env.BETNAGA_BRAND_NAME || 'BN88';
const BETNAGA_BRAND_GROUP = process.env.BETNAGA_BRAND_GROUP || 'CX';
const BETNAGA_CURRENCY = (process.env.BETNAGA_CURRENCY || 'BDT').toUpperCase();

// BetNaga token cache (in-memory)
let betnagaCache = { token: '', operatorId: '' };

// ====== HTTP APP ======
const app = express();
app.use(express.json({ limit: '2mb' }));
app.use(cors({ origin: CORS_ORIGIN === '*' ? true : CORS_ORIGIN }));

const PUBLIC_DIR = path.join(__dirname, 'public');
const DATA_DIR = path.join(__dirname, 'data');
const SETTINGS_FILE = path.join(DATA_DIR, 'dashboard-settings.json');
app.use(express.static(PUBLIC_DIR));

// Store server instance for graceful shutdown
let appServer = null;

// ====== AUTH ======
let accessToken = process.env.API_TOKEN || '';
let tokenExpMs = 0;
const fxCacheMap = new Map(); // Store caches per base currency

const AUTH_URLS = [
    AUTH_URL,
    `${API_BASE}/api/auth/authenticate`,
    `${API_BASE}/api/auth/login`,
    `${API_BASE}/api/authenticate`
];

const AUTH_SHAPES = [
    { ct: 'json', body: { userId: AUTH_USER, password: AUTH_PASS } },
    { ct: 'json', body: { username: AUTH_USER, password: AUTH_PASS } },
    { ct: 'json', body: { userId: AUTH_USER, password: AUTH_PASS, tenantId: AUTH_TENANT } },
    { ct: 'json', body: { username: AUTH_USER, password: AUTH_PASS, tenantId: AUTH_TENANT } },
    { ct: 'json', body: { userId: AUTH_USER, password: AUTH_PASS, tenant: AUTH_TENANT } },
    { ct: 'json', body: { username: AUTH_USER, password: AUTH_PASS, tenant: AUTH_TENANT } },
    { ct: 'json', body: { account: AUTH_USER, password: AUTH_PASS, tenantId: AUTH_TENANT } },
    { ct: 'json', body: { account: AUTH_USER, password: AUTH_PASS, tenant: AUTH_TENANT } },
    { ct: 'form', body: { userId: AUTH_USER, password: AUTH_PASS, tenantId: AUTH_TENANT } },
    { ct: 'form', body: { userId: AUTH_USER, password: AUTH_PASS } },
    { ct: 'form', body: { username: AUTH_USER, password: AUTH_PASS } }
];

function nowMs() {
    return Date.now();
}

function decodeJwtExpMs(jwt) {
    try {
        const parts = jwt.split('.');
        if (parts.length < 2) return 0;
        const json = JSON.parse(Buffer.from(parts[1], 'base64url').toString('utf8'));
        const expSec = Number(json.exp || 0);
        return expSec ? expSec * 1000 : 0;
    } catch {
        return 0;
    }
}

function tokenValid() {
    if (!accessToken) return false;
    if (!tokenExpMs) tokenExpMs = decodeJwtExpMs(accessToken);
    return tokenExpMs && nowMs() < (tokenExpMs - 60_000);
}

async function authenticate() {
    if (tokenValid()) return accessToken;
    for (const url of AUTH_URLS) {
        if (!url) continue;
        for (const shape of AUTH_SHAPES) {
            try {
                const headers = shape.ct === 'form'
                    ? { 'content-type': 'application/x-www-form-urlencoded' }
                    : { 'content-type': 'application/json' };
                const body = shape.ct === 'form'
                    ? new URLSearchParams(shape.body || {}).toString()
                    : JSON.stringify(shape.body || {});
                const resp = await fetch(url, { method: 'POST', headers, body, timeout: 15000 });
                if (!resp.ok) continue;
                const data = await resp.json();
                const token = data?.accessToken || data?.token;
                if (token) {
                    accessToken = token;
                    tokenExpMs = decodeJwtExpMs(accessToken);
                    return accessToken;
                }
            } catch {
                // try next shape
            }
        }
    }
    throw new Error('Authentication failed for dashboard server');
}

async function fetchUpstream(url, init = {}) {
    const finalInit = { ...init };
    finalInit.headers = { ...(finalInit.headers || {}) };
    if (!tokenValid()) {
        await authenticate();
    }
    finalInit.headers.Authorization = `Bearer ${accessToken}`;
    const resp = await fetch(url, finalInit);
    if (resp.status === 401 || resp.status === 403) {
        accessToken = '';
        tokenExpMs = 0;
        await authenticate();
        finalInit.headers.Authorization = `Bearer ${accessToken}`;
        return fetch(url, finalInit);
    }
    return resp;
}

// ====== DIMENSIONS ======
const dimCache = {
    loaded: false,
    lastLoad: 0,
    brandByKey: new Map(),
    groupByBrand: new Map(),
    projectByBrand: new Map(),
    list: []
};

const defaultSettings = {
    fontScale: 1,
    negativeColor: '#f87171',
    theme: 'midnight'
};

let persistedSettings = { ...defaultSettings };

const DIMENSION_PROJECTS = ['all', 'mcd', 'bkw', 'kp'];
const numberFormatter = new Intl.NumberFormat('en-US', { maximumFractionDigits: 2 });
const percentFormatter = new Intl.NumberFormat('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

function brandKey(name) {
    return String(name || '').trim().toLowerCase();
}

function normalizeFxRates(input) {
    const normalized = {};
    Object.entries(input || {}).forEach(([key, value]) => {
        const code = String(key || '').toUpperCase();
        const numValue = Number(value);
        if (code && Number.isFinite(numValue) && numValue > 0) {
            normalized[code] = numValue;
        }
    });
    if (!normalized.USD) normalized.USD = 1;
    const anchors = {
        VND: 20000,
        IDR: 10000,
        BDT: 50,
        PKR: 50,
        LKR: 150,
        MMK: 500,
        KRW: 800,
    };
    let observed = 0;
    let inverted = 0;
    Object.entries(anchors).forEach(([code, threshold]) => {
        if (normalized[code] != null) {
            observed += 1;
            if (normalized[code] < 1 || normalized[code] > threshold * 10) {
                inverted += 1;
            }
        }
    });
    if (observed && inverted / observed > 0.6) {
        const flipped = {};
        Object.entries(normalized).forEach(([code, rate]) => {
            flipped[code] = rate ? 1 / rate : rate;
        });
        flipped.USD = 1;
        return flipped;
    }
    return normalized;
}

async function fetchJson(url) {
    const response = await fetch(url, { redirect: 'follow', timeout: 15000 });
    if (!response.ok) {
        throw new Error(`HTTP ${response.status} for ${url}`);
    }
    return response.json();
}

async function fetchLatestFx(base = 'USD') {
    const now = Date.now();
    const normalizedBase = String(base || 'USD').toUpperCase();
    
    // Check cache for this specific base
    const cached = fxCacheMap.get(normalizedBase);
    if (
        cached &&
        cached.rates &&
        now - cached.fetchedAt < FX_CACHE_TTL_MS
    ) {
        return {
            base: cached.base,
            date: cached.date,
            rates: cached.rates,
            cached: true,
        };
    }

    const providers = [
        async () => {
            const data = await fetchJson(
                `https://cdn.jsdelivr.net/gh/fawazahmed0/currency-api@latest/v1/currencies/${normalizedBase.toLowerCase()}.json`
            );
            const inner = data?.[normalizedBase.toLowerCase()];
            if (!inner) throw new Error('Missing rates map');
            return { base: normalizedBase, date: data?.date || '', rates: normalizeFxRates(inner) };
        },
        async () => {
            const data = await fetchJson(
                `https://api.exchangerate.host/latest?base=${normalizedBase}`
            );
            return { base: normalizedBase, date: data?.date || '', rates: normalizeFxRates(data?.rates) };
        },
        async () => {
            const data = await fetchJson(`https://open.er-api.com/v6/latest/${normalizedBase}`);
            return { base: normalizedBase, date: data?.time_last_update_utc || '', rates: normalizeFxRates(data?.rates) };
        },
    ];

    for (const provider of providers) {
        try {
            const result = await provider();
            // Store in cache map by base
            fxCacheMap.set(normalizedBase, {
                base: result.base,
                date: result.date,
                rates: result.rates,
                fetchedAt: now
            });
            return { ...result, cached: false };
        } catch (err) {
            // try next provider
        }
    }

    throw new Error('Unable to fetch FX rates at this time.');
}

async function ensureDataDir() {
    try {
        await fs.mkdir(DATA_DIR, { recursive: true });
    } catch (err) {
        if (err.code !== 'EEXIST') throw err;
    }
}

async function ensureCacheDir(subdir = '') {
    const cacheDir = path.join(DATA_DIR, 'dashboard-cache', subdir);
    try {
        await fs.mkdir(cacheDir, { recursive: true });
    } catch (err) {
        if (err.code !== 'EEXIST') throw err;
    }
    return cacheDir;
}

function getCacheFilePath(year, month, brandGroup, brand, currency) {
    const yearMonth = `${year}-${String(month).padStart(2, '0')}`;
    const sanitize = (str) => String(str || 'all').replace(/[^a-z0-9-]/gi, '_').toLowerCase();
    const bg = sanitize(brandGroup);
    const b = sanitize(brand);
    const c = sanitize(currency);
    return path.join(yearMonth, `${bg}__${b}__${c}.json`);
}

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
    
    // If brandGroup is "All", set it to match the brand value
    if (normalized.brandGroup === 'All' && normalized.brand) {
        normalized.brandGroup = normalized.brand;
    }
    
    return normalized;
}

async function saveCacheData(year, month, brandGroup, brand, currency, data) {
    try {
        const cacheDir = await ensureCacheDir();
        const filePath = path.join(cacheDir, getCacheFilePath(year, month, brandGroup, brand, currency));
        const parentDir = path.dirname(filePath);
        try {
            await fs.mkdir(parentDir, { recursive: true });
        } catch (err) {
            if (err.code !== 'EEXIST') throw err;
        }
        const normalizedData = normalizeAllToBrand(data);
        await fs.writeFile(filePath, JSON.stringify(normalizedData, null, 2), 'utf8');
        return { success: true, path: filePath };
    } catch (err) {
        console.error('Failed to save cache data:', err);
        return { success: false, error: err?.message };
    }
}

async function loadCacheData(year, month, brandGroup, brand, currency) {
    try {
        const cacheDir = await ensureCacheDir();
        const filePath = path.join(cacheDir, getCacheFilePath(year, month, brandGroup, brand, currency));
        const data = await fs.readFile(filePath, 'utf8');
        return { success: true, data: JSON.parse(data) };
    } catch (err) {
        if (err.code === 'ENOENT') {
            return { success: true, data: [] };
        }
        return { success: false, error: err?.message };
    }
}

async function listCacheByMonth(year, month) {
    try {
        const cacheDir = await ensureCacheDir();
        const yearMonth = `${year}-${String(month).padStart(2, '0')}`;
        const monthDir = path.join(cacheDir, yearMonth);
        const files = await fs.readdir(monthDir, { recursive: false });
        const entries = files
            .filter((f) => f.endsWith('.json'))
            .map((f) => {
                const parts = f.replace('.json', '').split('__');
                return {
                    brandGroup: parts[0] === 'all' ? '' : parts[0],
                    brand: parts[1] === 'all' ? '' : parts[1],
                    currency: parts[2] === 'all' ? '' : parts[2],
                    file: f
                };
            });
        return { success: true, entries };
    } catch (err) {
        if (err.code === 'ENOENT') {
            return { success: true, entries: [] };
        }
        return { success: false, error: err?.message };
    }
}

async function loadSettingsFromDisk() {
    try {
        await ensureDataDir();
        const buf = await fs.readFile(SETTINGS_FILE, 'utf8');
        const json = JSON.parse(buf);
        persistedSettings = { ...defaultSettings, ...json };
    } catch (err) {
        if (err.code === 'ENOENT') {
            persistedSettings = { ...defaultSettings };
            await saveSettingsToDisk();
        } else {
            persistedSettings = { ...defaultSettings };
        }
    }
}

async function saveSettingsToDisk() {
    await ensureDataDir();
    await fs.writeFile(SETTINGS_FILE, JSON.stringify(persistedSettings, null, 2), 'utf8');
}

function hydrateDimensions(records = [], project) {
    for (const rec of records) {
        const name = rec?.name || rec?.websiteTypeName || rec?.unique || rec?.brandCode || rec?.websiteType;
        if (!name) continue;
        const key = brandKey(name);
        const display = rec?.displayName || rec?.brandName || rec?.websiteTypeName || rec?.name || rec?.unique || name;
        const groupName =
            cleanLabel(
                rec?.brandGroupName ||
                rec?.groupName ||
                rec?.businessType ||
                rec?.websiteGroupName ||
                rec?.brandGroup
            ) || '';
        dimCache.brandByKey.set(key, {
            key,
            name: display,
            unique: rec?.unique || name,
            group: groupName,
            project: project || rec?.projectId || rec?.project || 'all'
        });
        if (groupName) {
            dimCache.groupByBrand.set(key, groupName);
        }
        if (project) {
            dimCache.projectByBrand.set(key, project);
        }
    }
}

async function loadDimensions(force = false) {
    if (!force && dimCache.loaded && (nowMs() - dimCache.lastLoad) < 30 * 60 * 1000) {
        return;
    }
    const collected = [];
    for (const project of DIMENSION_PROJECTS) {
        const urls = [
            `${API_BASE}/api/dimensions/brand/list/${encodeURIComponent(project)}`,
            `${API_BASE}/api/dimensions/brand/list?project=${encodeURIComponent(project)}`
        ];
        for (const url of urls) {
            try {
                const resp = await fetchUpstream(url, { method: 'GET' });
                if (!resp.ok) continue;
                const text = await resp.text();
                let json;
                try {
                    json = JSON.parse(text);
                } catch {
                    json = null;
                }
                const records = Array.isArray(json?.records) ? json.records
                    : Array.isArray(json) ? json
                        : [];
                hydrateDimensions(records, project);
                collected.push(...records);
                break;
            } catch {
                // try next url
            }
        }
    }
    dimCache.list = Array.from(dimCache.brandByKey.values());
    dimCache.loaded = true;
    dimCache.lastLoad = nowMs();
}

function brandMetaFor(name) {
    const key = brandKey(name);
    return dimCache.brandByKey.get(key) || null;
}

function cleanLabel(value) {
    if (value === null || value === undefined) return '';
    const str = String(value).trim();
    return str.length ? str : '';
}

function normalizeGroup(value) {
    return cleanLabel(value).toLowerCase();
}

function brandGroupFromDimensions(websiteTypeName, fallbackBusinessType) {
    const meta = brandMetaFor(websiteTypeName);
    if (meta?.group) return meta.group;
    const key = brandKey(websiteTypeName);
    if (dimCache.groupByBrand.has(key)) return dimCache.groupByBrand.get(key);
    return fallbackBusinessType || 'All';
}

function parseBrandCsv(csv) {
    if (!csv) return [];
    return String(csv)
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean);
}

function buildBrandEntries(brandsCsv, projectFilter = 'all') {
    const list = parseBrandCsv(brandsCsv);
    if (!list.length) return [];
    const entries = [];
    const seen = new Set();
    for (const brand of list) {
        const key = brandKey(brand);
        if (!key) continue;
        const meta = brandMetaFor(brand);
        const defaultGroup = cleanLabel(meta?.group) || '';
        const metaProject = (meta?.project || 'all').toLowerCase();
        const normalizedFilter = (projectFilter || 'all').toLowerCase();
        const effectiveProject = normalizedFilter === 'all' ? 'all' : normalizedFilter;

        if (effectiveProject !== 'all' && metaProject !== effectiveProject) {
            continue;
        }

        const entryProject = effectiveProject === 'all' ? 'all' : effectiveProject;
        const entryKey = `${entryProject}::${key}`;
        if (!seen.has(entryKey)) {
            seen.add(entryKey);
            entries.push({ brand, key, project: entryProject, group: defaultGroup });
        }
    }
    return entries;
}

// ====== HELPERS ======
const num = (value) => {
    if (value == null || value === '') return 0;
    const n = Number(value);
    return Number.isFinite(n) ? n : 0;
};

function normalizeCsvParam(value) {
    if (!value) return [];
    if (Array.isArray(value)) return value.flatMap(normalizeCsvParam);
    return String(value)
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean);
}

function parseDateParts(dateStr) {
    if (!dateStr) return null;
    const [y, m, d] = dateStr.split('-').map(Number);
    if (!y || !m || !d) return null;
    return { y, m, d };
}

function toApiRange(startStr, endStr) {
    const defaultToday = new Date();
    defaultToday.setDate(1);
    const defaultStart = { y: defaultToday.getFullYear(), m: defaultToday.getMonth() + 1, d: 1 };
    const defaultEndDate = new Date(defaultToday);
    defaultEndDate.setMonth(defaultEndDate.getMonth() + 1);
    defaultEndDate.setDate(0);
    const defaultEnd = { y: defaultEndDate.getFullYear(), m: defaultEndDate.getMonth() + 1, d: defaultEndDate.getDate() };

    const startParts = parseDateParts(startStr) || defaultStart;
    const endParts = parseDateParts(endStr) || defaultEnd;

    const startTime = Date.UTC(startParts.y, startParts.m - 1, startParts.d, 0, 0, 0, 0) - API_TZ_OFFSET_MS;
    const endTime = Date.UTC(endParts.y, endParts.m - 1, endParts.d, 23, 59, 59, 999) - API_TZ_OFFSET_MS;
    return { startTime, endTime, startParts, endParts };
}

function previousMonthRange(startParts) {
    const base = Date.UTC(startParts.y, startParts.m - 1, 1, 0, 0, 0, 0);
    const baseDate = new Date(base);
    baseDate.setUTCMonth(baseDate.getUTCMonth() - 1);
    const prevStart = { y: baseDate.getUTCFullYear(), m: baseDate.getUTCMonth() + 1, d: 1 };
    const prevEndDate = new Date(Date.UTC(prevStart.y, prevStart.m, 0, 0, 0, 0, 0));
    const prevEnd = { y: prevEndDate.getUTCFullYear(), m: prevEndDate.getUTCMonth() + 1, d: prevEndDate.getUTCDate() };
    const startTime = Date.UTC(prevStart.y, prevStart.m - 1, prevStart.d, 0, 0, 0, 0) - API_TZ_OFFSET_MS;
    const endTime = Date.UTC(prevEnd.y, prevEnd.m - 1, prevEnd.d, 23, 59, 59, 999) - API_TZ_OFFSET_MS;
    return { startTime, endTime };
}

async function mapWithConcurrency(items, limit, mapper) {
    if (!Array.isArray(items) || !items.length) return [];
    const results = new Array(items.length);
    let cursor = 0;
    const workerCount = Math.min(limit || 1, items.length);
    async function worker() {
        while (true) {
            const current = cursor++;
            if (current >= items.length) break;
            try {
                results[current] = await mapper(items[current], current);
            } catch (err) {
                results[current] = { error: err };
            }
        }
    }
    const workers = Array.from({ length: workerCount }, () => worker());
    await Promise.all(workers);
    return results;
}

async function brandReport(kind, query) {
    const url = new URL(`${API_BASE}/api/report/brand/${kind}`);
    Object.entries(query || {}).forEach(([k, v]) => {
        if (v != null) url.searchParams.set(k, String(v));
    });
    const resp = await fetchUpstream(url.toString(), { method: 'GET' });
    if (!resp.ok) {
        const text = await resp.text().catch(() => '');
        throw new Error(`Upstream ${resp.status}: ${text}`);
    }
    return resp.json();
}

function computeMetrics(record, prevStats, currency = '') {
    const currencyCode = String(currency || '').toUpperCase();
    const multiplier = (currencyCode === 'VND' || currencyCode === 'IDR') ? 1000 : 1;

    const totalDeposit = num(record.depositAmount) * multiplier;
    const totalWithdraw = num(record.withdrawalAmount) * multiplier;
    const bonus = num(record.bonus) * multiplier;
    const companyWinLoss = num(record.profitLoss) * multiplier;
    const uniquePlayer = num(record.uniquePlayer);
    const ftdPlayer = num(record.firstDeposit);
    const signUpPlayer = num(record.registerCount);
    const turnover = num(record.turnover) * multiplier;

    const netDeposit = totalDeposit - totalWithdraw;
    const netWinLoss = companyWinLoss - bonus;
    const averageDeposit = uniquePlayer ? totalDeposit / uniquePlayer : 0;
    const netRatio = totalDeposit ? (netDeposit / totalDeposit) * 100 : 0;
    const bonusRatio = companyWinLoss ? (bonus / companyWinLoss) * 100 : 0;
    const averageBonusPerPlayer = uniquePlayer ? bonus / uniquePlayer : 0;
    const averageTurnover = uniquePlayer ? turnover / uniquePlayer : 0;
    const averageWr = totalDeposit ? turnover / totalDeposit : 0;
    const grossRevenuePct = totalDeposit ? (netDeposit / totalDeposit) * 100 : 0;
    const ngrPerPlayer = uniquePlayer ? (netWinLoss / uniquePlayer) : 0;
    const netPerPlayer = uniquePlayer ? (netDeposit / uniquePlayer) : 0;

    const prevUnique = prevStats ? num(prevStats.uniquePlayer) : 0;
    const retentionRate = prevUnique > 0
        ? ((uniquePlayer - ftdPlayer) / prevUnique) * 100
        : null;
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
        retentionRate,
        ftdConversionRate
    };
}

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
    const retentionRate = prevTotals.uniquePlayer > 0
        ? ((base.uniquePlayer - base.ftdPlayer) / prevTotals.uniquePlayer) * 100
        : null;
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
        retentionRate,
        ftdConversionRate
    };
}

function formatNumber(value) {
    if (value === null || value === undefined || Number.isNaN(value)) return '--';
    return numberFormatter.format(Number(value));
}

function formatPercent(value) {
    if (value === null || value === undefined || !Number.isFinite(value)) return '--';
    return `${percentFormatter.format(Number(value))}%`;
}

// ====== BETNAGA HELPERS ======
function pad2(n) {
    return String(n).padStart(2, '0');
}

function toDateString(parts) {
    return `${parts.y}-${pad2(parts.m)}-${pad2(parts.d)}`;
}

async function betNagaLogin() {
    console.log('[dashboard] BN88: Login attempt...');
    if (!BETNAGA_BASE_URL || !BETNAGA_USERNAME || !BETNAGA_PASSWORD) {
        console.warn('[dashboard] BN88: Skipped - missing credentials. Set BETNAGA_USERNAME and BETNAGA_PASSWORD in .env');
        return null;
    }

    const url = `${BETNAGA_BASE_URL.replace(/\/+$/, '')}/tac/api/login/password`;
    console.log('[dashboard] BN88: Login URL:', url);
    
    const body = {
        operatorName: BETNAGA_USERNAME,
        password: BETNAGA_PASSWORD
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
                'origin': BETNAGA_BASE_URL.replace(/\/+$/, ''),
                'referer': BETNAGA_BASE_URL.replace(/\/+$/, '') + '/',
                'x-requested-with': 'XMLHttpRequest',
                'sec-fetch-site': 'same-origin',
                'sec-fetch-mode': 'cors',
                'sec-fetch-dest': 'empty'
            },
            body: JSON.stringify(body),
            timeout: 15000
        });

        console.log('[dashboard] BN88: Login response status:', resp.status);
        
        if (!resp.ok) {
            const text = await resp.text();
            console.warn('[dashboard] BN88: Login failed - HTTP', resp.status, '- Response:', text);
            return null;
        }

        const json = await resp.json();
        console.log('[dashboard] BN88: Login response body:', json);
        
        const token = json?.token;
        const operatorId = json?.operatorId;
        if (!token || !operatorId) {
            console.warn('[dashboard] BN88: Login response missing token or operatorId. Got:', { token: !!token, operatorId: !!operatorId });
            return null;
        }

        console.log('[dashboard] BN88: Login successful - operatorId:', operatorId);
        return { token, operatorId };
    } catch (err) {
        console.warn('[dashboard] BN88: Login error:', err?.message || err);
        return null;
    }
}

async function fetchBetNagaRecords(range, filters) {
    console.log('[dashboard] BN88: Fetch called - filters:', { brands: filters.brands, currencies: filters.currencies });
    
    const requestedBrands = (filters.brands || []).map((b) => String(b).toLowerCase());
    const requestedCurrencies = (filters.currencies || []).map((c) => String(c).toUpperCase());

    const betNagaKey = BETNAGA_BRAND_NAME.toLowerCase();
    const betNagaCurrency = BETNAGA_CURRENCY.toUpperCase();

    console.log('[dashboard] BN88: Keys - betNagaKey:', betNagaKey, 'betNagaCurrency:', betNagaCurrency);
    console.log('[dashboard] BN88: Requested - brands:', requestedBrands, 'currencies:', requestedCurrencies);

    if (requestedBrands.length && !requestedBrands.includes(betNagaKey)) {
        console.log('[dashboard] BN88: Filtered out by brand');
        return [];
    }
    if (requestedCurrencies.length && !requestedCurrencies.includes(betNagaCurrency)) {
        console.log('[dashboard] BN88: Filtered out by currency');
        return [];
    }

    // Use cached token (should be pre-loaded on startup)
    const token = betnagaCache.token;
    const operatorId = betnagaCache.operatorId;

    if (!token || !operatorId) {
        console.warn('[dashboard] BN88: No cached token - did server startup login fail?');
        return [];
    }

    const baseParts = range.startParts || range.endParts;
    const startParts = range.startParts || range.endParts;
    const endParts = range.endParts || range.startParts;
    const startDate = startParts ? toDateString(startParts) : '';
    const endDate = endParts ? toDateString(endParts) : startDate;
    console.log('[dashboard] BN88: Using custom PnL range', {
        startDate,
        endDate,
        requestedRange: range.startParts || range.endParts
    });

    try {
        const url = new URL(
            `${BETNAGA_BASE_URL.replace(/\/+$/, '')}/tac/api/relay/get/ods-v2-report-platform-sum-pnlv2`
        );
        url.searchParams.set('dateOption', 'CUSTOM');
        url.searchParams.set('startDate', startDate);
        url.searchParams.set('endDate', endDate);
        url.searchParams.set('page', '1');
        url.searchParams.set('size', '10');
        url.searchParams.set('operatorId', String(operatorId));

        const resp = await fetch(url.toString(), {
            method: 'GET',
            headers: {
                'accept': 'application/json, text/plain, */*',
                'accept-encoding': 'gzip, deflate, br',
                'accept-language': 'en-US,en;q=0.9',
                'authorization': token,
                'cache-control': 'no-cache',
                'pragma': 'no-cache',
                'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko)',
                'origin': BETNAGA_BASE_URL.replace(/\/+$/, ''),
                'referer': BETNAGA_BASE_URL.replace(/\/+$/, '') + '/',
                'x-requested-with': 'XMLHttpRequest',
                'sec-fetch-site': 'same-origin',
                'sec-fetch-mode': 'cors',
                'sec-fetch-dest': 'empty'
            },
            timeout: 15000
        });

        const respText = await resp.text().catch(() => '');
        if (!resp.ok) {
            console.warn('[dashboard] BetNaga PnL fetch failed', {
                status: resp.status,
                body: respText || '<empty body>',
                url: url.toString()
            });
            return [];
        }

        let json;
        try {
            json = respText ? JSON.parse(respText) : {};
        } catch (parseErr) {
            console.warn('[dashboard] BN88: Invalid JSON payload from PnL endpoint', {
                error: parseErr?.message || parseErr,
                body: respText
            });
            return [];
        }

        const list = json?.value?.list;
        if (!Array.isArray(list) || !list.length) {
            console.warn('[dashboard] BN88: PnL payload missing list rows', { payload: json, body: respText });
            return [];
        }

        const row = list[0];
        if (!row) {
            console.warn('[dashboard] BN88: PnL payload row was empty', { payload: json, body: respText });
            return [];
        }

        console.log('[dashboard] BN88: PnL payload received', {
            rows: list.length,
            currency: (row.currency || betNagaCurrency).toUpperCase(),
            range: { startDate, endDate }
        });

        const rec = {
            websiteTypeName: BETNAGA_BRAND_NAME,
            brandGroupName: BETNAGA_BRAND_GROUP,
            currency: (row.currency || betNagaCurrency).toUpperCase(),
            depositAmount: row.deposit,
            withdrawalAmount: row.withdraw,
            bonus: row.promotion,
            profitLoss: row.grossProfit,
            turnover: row.validGameBetting,
            uniquePlayer: row.depositMemberCount,
            firstDeposit: row.firstDepositMemberCount,
            registerCount: row.registerMemberCount,
            __brand: BETNAGA_BRAND_NAME
        };

        console.log(`[dashboard] BN88: Fetched data - Deposit: ${row.deposit}, Players: ${row.depositMemberCount}`);
        return [rec];
    } catch (err) {
        console.warn('[dashboard] BetNaga records fetch failed:', err?.message || err);
        return [];
    }
}

async function fetchBrandRecords(range, filters) {
    await loadDimensions();
    const brandsCsv = filters.brands?.length ? filters.brands.join(',') : DEFAULT_BRANDS;
    let brandEntries = buildBrandEntries(brandsCsv, 'all');
    if (filters.brandGroups?.length) {
        brandEntries = brandEntries.filter((entry) => {
            const group =
                entry.group ||
                brandGroupFromDimensions(entry.brand, entry.project === 'all' ? 'All' : '');
            return filters.brandGroups.includes(normalizeGroup(group));
        });
    }
    if (!brandEntries.length) return [];

    const baseQuery = {
        startTime: range.startTime,
        endTime: range.endTime,
        project: filters.project || 'all',
        currencySet: DEFAULT_CURRENCY_SET,
        sortName: 'websiteType',
        sortOrder: 'asc'
    };

    const batches = await mapWithConcurrency(
        brandEntries,
        Math.min(6, brandEntries.length),
        async (entry) => {
            try {
                const query = { ...baseQuery, brands: entry.brand };
                if (entry.project && entry.project !== 'all') query.project = entry.project;
                const json = await brandReport('summary', query);
                const records = Array.isArray(json?.records) ? json.records : [];
                return records.map((rec) => ({
                    ...rec,
                    __brand: entry.brand
                }));
            } catch (err) {
                console.warn('[dashboard] brand summary failed', entry.brand, err?.message || err);
                return [];
            }
        }
    );

    return batches.flat().filter(Boolean);
}

function buildPrevStatsMap(prevRecords) {
    const map = new Map();
    for (const rec of prevRecords || []) {
        const brand = brandKey(rec.websiteTypeName || rec.websiteType || rec.__brand || '');
        const currency = (rec.currency || '').toUpperCase();
        if (!brand || !currency) continue;
        const key = `${brand}::${currency}`;
        map.set(key, {
            uniquePlayer: num(rec.uniquePlayer),
            firstDeposit: num(rec.firstDeposit)
        });
    }
    return map;
}

function recordFingerprint(rec, brandId, currency, groupKey) {
    const scale = (value) => Math.round(num(value) * 1000);
    return [
        brandId,
        currency,
        groupKey,
        scale(rec.depositAmount),
        scale(rec.withdrawalAmount),
        scale(rec.bonus),
        scale(rec.profitLoss),
        scale(rec.turnover),
        scale(rec.betAmount),
        scale(rec.betCount),
        scale(rec.progressBetAmount),
        scale(rec.progressProfitLoss),
        scale(rec.progressDiff),
        num(rec.uniquePlayer),
        num(rec.firstDeposit),
        num(rec.registerCount),
        cleanLabel(rec.brandGroupName || ''),
        cleanLabel(rec.brandGroup || ''),
        cleanLabel(rec.businessType || '')
    ].join('|');
}

async function buildDashboardMetrics(query) {
    const filters = {
        brandGroups: normalizeCsvParam(query.brandGroups).map(normalizeGroup).filter(Boolean),
        brands: normalizeCsvParam(query.brands),
        currencies: normalizeCsvParam(query.currencies).map((s) => s.toUpperCase())
    };

    const betNagaBrandKey = brandKey(BETNAGA_BRAND_NAME);
    const betNagaGroupKey = normalizeGroup(BETNAGA_BRAND_GROUP);
    const betNagaCurrency = BETNAGA_CURRENCY;
    const wantsBetNagaGroup = !filters.brandGroups.length || filters.brandGroups.includes(betNagaGroupKey);
    const wantsBetNagaBrand =
        !filters.brands.length || filters.brands.some((name) => brandKey(name) === betNagaBrandKey);
    const wantsBetNagaCurrency =
        !filters.currencies.length || filters.currencies.includes(betNagaCurrency);
    const expectsBetNagaData = wantsBetNagaGroup && wantsBetNagaBrand && wantsBetNagaCurrency;

    const range = toApiRange(query.startDate, query.endDate);
    const prevRange = previousMonthRange(range.startParts);

    const [records, prevRecords, betNagaRecords] = await Promise.all([
        fetchBrandRecords(range, filters),
        fetchBrandRecords(prevRange, filters),
        fetchBetNagaRecords(range, filters)
    ]);

    if (expectsBetNagaData && !betNagaRecords.length) {
        console.warn('[dashboard] BN88: Filters request CX data but BetNaga fetch returned nothing', {
            range: { start: range.startParts, end: range.endParts },
            filters,
            hasToken: !!betnagaCache.token,
            operatorId: betnagaCache.operatorId
        });
    } else if (betNagaRecords.length) {
        console.log('[dashboard] BN88: BetNaga records merged', betNagaRecords.length, 'rows');
    }

    const allRecords = [...records, ...betNagaRecords];
    const prevMap = buildPrevStatsMap(prevRecords);

    const initTotals = () => ({
        totalDeposit: 0,
        totalWithdraw: 0,
        bonus: 0,
        companyWinLoss: 0,
        uniquePlayer: 0,
        ftdPlayer: 0,
        signUpPlayer: 0,
        turnover: 0
    });

    const groupMap = new Map();

    for (const rec of allRecords) {
        const brandName = rec.websiteTypeName || rec.websiteType || rec.__brand || '';
        const currency = (rec.currency || '').toUpperCase();
        if (!brandName || !currency) continue;
        const brandId = brandKey(brandName);
        const displayBrandName = brandName.toUpperCase();

        const rawGroup =
            rec.brandGroupName ||
            rec.brandGroup ||
            rec.businessType ||
            brandGroupFromDimensions(brandName, rec.businessType || 'All');
        const brandGroupLabel = cleanLabel(rawGroup) || 'Unmapped';
        const brandGroupKey = normalizeGroup(brandGroupLabel) || 'unmapped';

        if (filters.brandGroups.length && !filters.brandGroups.includes(brandGroupKey)) continue;
        if (filters.currencies.length && !filters.currencies.includes(currency)) continue;

        const prevStatsKey = `${brandKey(brandName)}::${currency}`;
        const prevStats = prevMap.get(prevStatsKey);
        const metrics = computeMetrics(rec, prevStats, currency);

        if (!groupMap.has(brandGroupKey)) {
            groupMap.set(brandGroupKey, {
                brandGroup: brandGroupLabel,
                totals: initTotals(),
                prevTotals: { uniquePlayer: 0, ftdPlayer: 0 },
                currencies: new Map()
            });
        }
        const groupEntry = groupMap.get(brandGroupKey);

        if (!groupEntry.currencies.has(currency)) {
            groupEntry.currencies.set(currency, {
                currency,
                totals: initTotals(),
                prevTotals: { uniquePlayer: 0, ftdPlayer: 0 },
                brands: new Map()
            });
        }

        const currencyEntry = groupEntry.currencies.get(currency);
        const brandCurrencyKey = `${brandId}::${currency}`;
        if (!currencyEntry.brands.has(brandCurrencyKey)) {
            currencyEntry.brands.set(brandCurrencyKey, {
                brand: displayBrandName,
                brandGroup: brandGroupLabel,
                currency,
                totals: initTotals(),
                prevTotals: { uniquePlayer: 0, ftdPlayer: 0 },
                fingerprints: new Set()
            });
        }
        const brandEntry = currencyEntry.brands.get(brandCurrencyKey);
        if (!brandEntry.fingerprints) {
            brandEntry.fingerprints = new Set();
        }
        const fingerprint = recordFingerprint(rec, brandId, currency, brandGroupKey);
        if (brandEntry.fingerprints.has(fingerprint)) {
            continue;
        }
        brandEntry.fingerprints.add(fingerprint);

        const fields = ['totalDeposit', 'totalWithdraw', 'bonus', 'companyWinLoss', 'uniquePlayer', 'ftdPlayer', 'signUpPlayer', 'turnover'];
        fields.forEach((field) => {
            currencyEntry.totals[field] += metrics[field] || 0;
            groupEntry.totals[field] += metrics[field] || 0;
            brandEntry.totals[field] += metrics[field] || 0;
        });

        const prevUnique = Number(prevStats?.uniquePlayer) || 0;
        const prevFtd = Number(prevStats?.firstDeposit) || 0;
        currencyEntry.prevTotals.uniquePlayer += prevUnique;
        currencyEntry.prevTotals.ftdPlayer += prevFtd;
        groupEntry.prevTotals.uniquePlayer += prevUnique;
        groupEntry.prevTotals.ftdPlayer += prevFtd;
        brandEntry.prevTotals.uniquePlayer += prevUnique;
        brandEntry.prevTotals.ftdPlayer += prevFtd;
    }

    const result = Array.from(groupMap.values()).map((groupEntry) => {
        const currencies = Array.from(groupEntry.currencies.values()).map((currencyEntry) => {
            const brands = Array.from(currencyEntry.brands.values()).map((brandEntry) => ({
                brand: brandEntry.brand,
                brandGroup: brandEntry.brandGroup,
                currency: brandEntry.currency,
                metrics: finalizeGroupMetrics(brandEntry.totals, brandEntry.prevTotals)
            })).sort((a, b) => (b.metrics.totalDeposit || 0) - (a.metrics.totalDeposit || 0));

            return {
                currency: currencyEntry.currency,
                metrics: finalizeGroupMetrics(currencyEntry.totals, currencyEntry.prevTotals),
                brands
            };
        }).sort((a, b) => (b.metrics.totalDeposit || 0) - (a.metrics.totalDeposit || 0));

        return {
            brandGroup: groupEntry.brandGroup,
            metrics: finalizeGroupMetrics(groupEntry.totals, groupEntry.prevTotals),
            currencies
        };
    }).sort((a, b) => (b.metrics.totalDeposit || 0) - (a.metrics.totalDeposit || 0));

    return result;
}

function flattenCurrencies(groups) {
    const list = [];
    for (const group of groups || []) {
        for (const currency of group.currencies || []) {
            list.push({
                group: group.brandGroup,
                currency: currency.currency,
                metrics: currency.metrics,
                brands: currency.brands || []
            });
        }
    }
    return list;
}

function flattenBrands(groups) {
    const list = [];
    for (const group of groups || []) {
        for (const currency of group.currencies || []) {
            for (const brand of currency.brands || []) {
                list.push({
                    group: group.brandGroup,
                    currency: currency.currency,
                    brand: brand.brand,
                    metrics: brand.metrics
                });
            }
        }
    }
    return list;
}

function generateInsightAnswer(question, groups) {
    const q = String(question || '').trim().toLowerCase();
    if (!q.length) return { message: 'Please enter a question to analyse.' };
    if (!Array.isArray(groups) || !groups.length) return { message: 'Load data before asking for insights.' };

    const allBrands = flattenBrands(groups);
    const allCurrencies = flattenCurrencies(groups);
    const totalDeposit = groups.reduce((sum, g) => sum + (Number(g.metrics.totalDeposit) || 0), 0);
    const totalNet = groups.reduce((sum, g) => sum + (Number(g.metrics.netDeposit) || 0), 0);
    const totalTurnover = groups.reduce((sum, g) => sum + (Number(g.metrics.turnover) || 0), 0);

    const topBrandByNet = allBrands.reduce(
        (best, current) => (Number(current.metrics?.netDeposit) > Number(best?.metrics?.netDeposit || -Infinity) ? current : best),
        null
    );

    const topGroupsByDeposit = [...groups]
        .sort((a, b) => (Number(b.metrics.totalDeposit) || 0) - (Number(a.metrics.totalDeposit) || 0))
        .slice(0, 3);

    const topGroupsByTurnover = [...groups]
        .sort((a, b) => (Number(b.metrics.turnover) || 0) - (Number(a.metrics.turnover) || 0))
        .slice(0, 3);

    const topCurrencyByTurnover = allCurrencies.reduce(
        (best, current) => (Number(current.metrics?.turnover) > Number(best?.metrics?.turnover || -Infinity) ? current : best),
        null
    );

    const topRetentionGroup = groups.reduce((best, current) => {
        const value = Number(current.metrics.retentionRate);
        if (!Number.isFinite(value)) return best;
        if (!best) return current;
        return value > Number(best.metrics.retentionRate || -Infinity) ? current : best;
    }, null);

    const buildList = (items, formatter) =>
        `<ul>${items.map((item, idx) => `<li>${idx + 1}. ${formatter(item)}</li>`).join('')}</ul>`;

    if (q.includes('highest') && q.includes('net') && q.includes('deposit')) {
        if (!topBrandByNet) return { message: 'Unable to identify the top brand right now.' };
        return {
            message: `<p><strong>${topBrandByNet.brand}</strong> in ${topBrandByNet.currency} leads net deposit at <span class="text-emerald-400">${formatNumber(topBrandByNet.metrics.netDeposit)}</span>.</p>`
        };
    }

    if (q.includes('total deposit') && q.includes('net')) {
        return {
            message: `<ul>
        <li>Total deposit: <strong>${formatNumber(totalDeposit)}</strong></li>
        <li>Net deposit: <strong>${formatNumber(totalNet)}</strong></li>
        <li>Turnover: <strong>${formatNumber(totalTurnover)}</strong></li>
      </ul>`
        };
    }

    if (q.includes('top') && q.includes('group') && q.includes('turnover')) {
        return {
            message: `<p>Top groups by turnover:</p>${buildList(
                topGroupsByTurnover,
                (group) => `${group.brandGroup}: ${formatNumber(group.metrics.turnover)}`
            )}`
        };
    }

    if (q.includes('top') && q.includes('group') && q.includes('deposit')) {
        return {
            message: `<p>Top groups by total deposit:</p>${buildList(
                topGroupsByDeposit,
                (group) => `${group.brandGroup}: ${formatNumber(group.metrics.totalDeposit)}`
            )}`
        };
    }

    if (q.includes('currency') && q.includes('turnover') && topCurrencyByTurnover) {
        return {
            message: `<p>${topCurrencyByTurnover.group} in ${topCurrencyByTurnover.currency} leads turnover at <strong>${formatNumber(topCurrencyByTurnover.metrics.turnover)}</strong>.</p>`
        };
    }

    if (q.includes('retention')) {
        if (!topRetentionGroup || !Number.isFinite(topRetentionGroup.metrics.retentionRate)) {
            return { message: 'Retention rates are not available for this selection.' };
        }
        return {
            message: `<p><strong>${topRetentionGroup.brandGroup}</strong> holds the highest retention at <span class="text-emerald-400">${formatPercent(topRetentionGroup.metrics.retentionRate)}</span>.</p>`
        };
    }

    if (q.includes('summary') || q.includes('overview')) {
        return {
            message: `<p>Summary: ${groups.length} brand group${groups.length === 1 ? '' : 's'}, ${allCurrencies.length} currency slice${allCurrencies.length === 1 ? '' : 's'}, ${allBrands.length} brand row${allBrands.length === 1 ? '' : 's'}. Total deposit <strong>${formatNumber(totalDeposit)}</strong>, net deposit <strong>${formatNumber(totalNet)}</strong>, turnover <strong>${formatNumber(totalTurnover)}</strong>.</p>`
        };
    }

    return {
        message: `<p>Loaded ${groups.length} group${groups.length === 1 ? '' : 's'} with total deposit <strong>${formatNumber(totalDeposit)}</strong> and net deposit <strong>${formatNumber(totalNet)}</strong>.</p>`
    };
}

// ====== ROUTES ======
app.get('/', (_req, res) => {
    res.redirect('/dashboard-pro');
});

app.get('/classic', (_req, res) => {
    res.sendFile(path.join(__dirname, 'Index.html'));
});

app.get('/dashboard-pro', (_req, res) => {
    res.sendFile(path.join(PUBLIC_DIR, 'dashboard-pro.html'));
});

app.get('/dailystate', (_req, res) => {
    res.sendFile(path.join(__dirname, 'cxgroup.html'));
});

app.get('/api/dashboard/settings', (_req, res) => {
    res.json({ ok: true, settings: persistedSettings });
});

app.post('/api/dashboard/settings', async (req, res) => {
    try {
        const body = req.body || {};
        const next = { ...persistedSettings };

        if (typeof body.fontScale === 'number' && Number.isFinite(body.fontScale)) {
            const clamped = Math.max(0.7, Math.min(1.6, Number(body.fontScale)));
            next.fontScale = parseFloat(clamped.toFixed(2));
        }

        if (typeof body.negativeColor === 'string' && HEX_COLOR_REGEX.test(body.negativeColor.trim())) {
            next.negativeColor = body.negativeColor.trim();
        }

        if (typeof body.theme === 'string' && body.theme.trim().length) {
            next.theme = body.theme.trim();
        }

        persistedSettings = next;
        await saveSettingsToDisk();
        res.json({ ok: true, settings: persistedSettings });
    } catch (err) {
        res.status(500).json({ ok: false, error: err?.message || String(err) });
    }
});

app.get('/api/dashboard/options', async (_req, res) => {
    try {
        await loadDimensions();
        const brandGroups = Array.from(new Set(dimCache.list.map((item) => cleanLabel(item.group)).filter(Boolean))).sort();
        const brands = dimCache.list
            .map((item) => ({
                label: item.name || item.unique || item.key,
                value: item.key,
                group: cleanLabel(item.group) || 'Unmapped',
                groupKey: normalizeGroup(item.group) || 'unmapped',
                project: item.project || 'all'
            }))
            .sort((a, b) => a.label.localeCompare(b.label));

        // Ensure BetNaga group and brand are included
        const cxLabel = BETNAGA_BRAND_GROUP;
        if (!brandGroups.includes(cxLabel)) {
            brandGroups.push(cxLabel);
            brandGroups.sort();
        }

        const betNagaKey = BETNAGA_BRAND_NAME.toLowerCase();
        const hasBetNaga = brands.some((b) => b.value === betNagaKey);
        if (!hasBetNaga) {
            brands.push({
                label: BETNAGA_BRAND_NAME,
                value: betNagaKey,
                group: cxLabel,
                groupKey: normalizeGroup(cxLabel),
                project: 'all'
            });
            brands.sort((a, b) => a.label.localeCompare(b.label));
        }

        const currencies = DEFAULT_CURRENCY_SET.split(',').map((c) => c.trim()).filter(Boolean);
        res.json({
            brandGroups: brandGroups.map((g) => ({ value: g, label: g, key: normalizeGroup(g) || 'unmapped' })),
            brands,
            currencies
        });
    } catch (err) {
        res.status(500).json({ ok: false, error: err?.message || String(err) });
    }
});

app.get('/api/dashboard/fx', async (req, res) => {
    try {
        const base = String(req.query.base || 'USD').toUpperCase();
        const result = await fetchLatestFx(base);
        const rates = { ...result.rates };
        
        // Fill missing currencies with fallback providers (only if base is USD)
        if (base === 'USD') {
            const ALL_CCYS = [
                'USD', 'AED', 'AUD', 'BDT', 'BRL', 'CAD', 'CNY', 'EUR', 'HKD', 'IDR', 'INR', 'KRW', 'LKR', 'MMK', 'MYR', 'NPR',
                'OMR', 'PHP', 'PKR', 'SAR', 'SGD', 'THB', 'TRY', 'VND'
            ];
            const PEGGED_CCYS = ['AED', 'OMR', 'SAR'];
            
            // Collect all missing currencies
            const missing = ALL_CCYS.filter(ccy => rates[ccy] == null);
            
            if (missing.length > 0) {
                // Try CurrencyFreaks first (good for pegged currencies)
                try {
                    const url = `https://api.currencyfreaks.com/v2.0/rates/latest?apikey=free&symbols=${missing.join(',')}`;
                    const data = await fetchJson(url);
                    if (data?.rates) {
                        Object.entries(data.rates).forEach(([ccy, rate]) => {
                            if (rates[ccy] == null) rates[ccy] = +rate;
                        });
                    }
                } catch (e) { }
                
                // Try ExchangeRate-API for remaining missing
                const stillMissing = missing.filter(ccy => rates[ccy] == null);
                if (stillMissing.length > 0) {
                    try {
                        const url = 'https://api.exchangerate-api.com/v4/latest/USD';
                        const data = await fetchJson(url);
                        if (data?.rates) {
                            stillMissing.forEach(ccy => {
                                const rate = data.rates[ccy];
                                if (rate != null) rates[ccy] = +rate;
                            });
                        }
                    } catch (e) { }
                }
                
                // Try exchangerate.host for remaining missing
                const stillMissing2 = missing.filter(ccy => rates[ccy] == null);
                if (stillMissing2.length > 0) {
                    try {
                        const url = 'https://api.exchangerate.host/latest?base=USD';
                        const data = await fetchJson(url);
                        if (data?.rates) {
                            stillMissing2.forEach(ccy => {
                                const rate = data.rates[ccy];
                                if (rate != null) rates[ccy] = +rate;
                            });
                        }
                    } catch (e) { }
                }
                
                // Final fallback: try individual currency from fawaz API
                const stillMissing3 = missing.filter(ccy => rates[ccy] == null);
                for (const ccy of stillMissing3) {
                    try {
                        const url = `https://cdn.jsdelivr.net/gh/fawazahmed0/currency-api@latest/v1/currencies/usd.min.json`;
                        const data = await fetchJson(url);
                        const rate = data?.usd?.[ccy.toLowerCase()];
                        if (rate != null) rates[ccy] = +rate;
                    } catch (e) { }
                }
            }
        }
        
        res.json({ ok: true, base: result.base, date: result.date, rates, cached: result.cached });
    } catch (err) {
        res.status(500).json({ ok: false, error: err?.message || String(err) });
    }
});

app.get('/api/dashboard/fx/monthly', async (req, res) => {
    try {
        const monthsCsv = String(req.query.months || '').trim();
        const months = monthsCsv ? monthsCsv.split(',').map(m => m.trim()).filter(Boolean) : [];
        const base = String(req.query.base || 'USD').toUpperCase();
        const result = {};
        
        const PEGGED_CCYS = ['AED', 'OMR', 'SAR'];
        
        // EOM (End of Month) rates fetcher
        async function fetchEOMMRates(ym, baseCode) {
            const [y, m] = ym.split('-').map(Number);
            const start = `${y}-${String(m).padStart(2, '0')}-01`;
            const end = new Date(Date.UTC(y, m, 0));
            const endStr = end.toISOString().split('T')[0];
            const url = `https://api.frankfurter.dev/v1/${start}..${endStr}?base=${baseCode}`;
            
            try {
                const data = await fetchJson(url);
                const dates = Object.keys(data.rates || {}).sort();
                const last = dates[dates.length - 1];
                const rates = (data.rates && data.rates[last]) ? data.rates[last] : {};
                rates[baseCode] = 1;
                return { ym, date: last, rates, source: 'ecb' };
            } catch (e) {
                return { ym, date: null, rates: {}, source: 'ecb' };
            }
        }
        
        // Fallback for missing currencies
        async function fetchAlternative(targetCcy, ymDate) {
            // 1) Try fawaz dated USD map
            let url = `https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@${ymDate}/v1/currencies/usd.min.json`;
            try {
                const data = await fetchJson(url);
                const v = data?.usd?.[targetCcy.toLowerCase()];
                if (v != null) return { rate: +v, src: 'fallback' };
            } catch (e) { }
            
            // 2) For pegged currencies, try CurrencyFreaks
            if (PEGGED_CCYS.includes(targetCcy)) {
                url = `https://api.currencyfreaks.com/v2.0/rates/latest?apikey=free&symbols=${targetCcy}`;
                try {
                    const data = await fetchJson(url);
                    const v = data?.rates?.[targetCcy];
                    if (v != null) return { rate: +v, src: 'fallback' };
                } catch (e) { }
            }
            
            // 3) ExchangeRate-API (latest)
            url = 'https://api.exchangerate-api.com/v4/latest/USD';
            try {
                const data = await fetchJson(url);
                const v = data?.rates?.[targetCcy];
                if (v != null) return { rate: +v, src: 'fallback' };
            } catch (e) { }
            
            return { rate: null, src: 'fallback' };
        }
        
        const MISSING_CCYS = ['AED', 'BDT', 'LKR', 'MMK', 'NPR', 'OMR', 'PKR', 'SAR', 'VND'];
        const ALL_CCYS = ['USD', 'AED', 'AUD', 'BDT', 'BRL', 'CAD', 'CNY', 'EUR', 'HKD', 'IDR', 'INR', 'KRW', 'LKR', 'MMK', 'MYR', 'NPR',
                         'OMR', 'PHP', 'PKR', 'SAR', 'SGD', 'THB', 'TRY', 'VND'];
        
        for (const ym of months) {
            if (!/^\d{4}-\d{2}$/.test(ym)) continue;
            
            try {
                // Fetch EOM rates from Frankfurter
                const frank = await fetchEOMMRates(ym, base);
                const rates = { ...frank.rates };
                const sourceMap = {};
                Object.keys(rates).forEach(k => sourceMap[k] = 'ecb');
                
                // Fill missing currencies
                const [y, m] = ym.split('-').map(Number);
                const end = new Date(Date.UTC(y, m, 0));
                const ymDate = end.toISOString().split('T')[0];
                
                for (const ccy of MISSING_CCYS) {
                    if (rates[ccy] == null) {
                        const alt = await fetchAlternative(ccy, ymDate);
                        rates[ccy] = alt.rate;
                        sourceMap[ccy] = (alt.rate == null) ? 'na' : 'fallback';
                    }
                }
                
                if (rates[base] == null) rates[base] = 1;
                
                result[ym] = { base, month: ym, date: frank.date || ymDate, rates, sourceMap };
            } catch (e) {
                result[ym] = { base, month: ym, date: null, rates: { [base]: 1 }, sourceMap: { [base]: 'error' } };
            }
        }
        
        res.json(result);
    } catch (err) {
        res.status(500).json({ ok: false, error: err?.message || String(err) });
    }
});

app.get('/api/dashboard/metrics', async (req, res) => {
    try {
        const groups = await buildDashboardMetrics(req.query || {});
        res.json({ ok: true, groups });
    } catch (err) {
        res.status(500).json({ ok: false, error: err?.message || String(err) });
    }
});

app.post('/api/dashboard/insights', async (req, res) => {
    try {
        const { question, startDate, endDate, brandGroups, brands, currencies } = req.body || {};
        if (!question) {
            res.status(400).json({ ok: false, error: 'Question is required.' });
            return;
        }
        const groups = await buildDashboardMetrics({ startDate, endDate, brandGroups, brands, currencies });
        const insight = generateInsightAnswer(question, groups);
        res.json({ ok: true, answer: insight.message, groupsCount: groups.length });
    } catch (err) {
        res.status(500).json({ ok: false, error: err?.message || String(err) });
    }
});

app.post('/api/dashboard/cache/save', async (req, res) => {
    try {
        const { year, month, brandGroup, brand, currency, data } = req.body || {};
        if (!year || !month || !data) {
            res.status(400).json({ ok: false, error: 'year, month, and data are required' });
            return;
        }
        const result = await saveCacheData(year, month, brandGroup || '', brand || '', currency || '', data);
        res.json({ ok: result.success, ...result });
    } catch (err) {
        res.status(500).json({ ok: false, error: err?.message || String(err) });
    }
});

app.get('/api/dashboard/cache/load', async (req, res) => {
    try {
        const { year, month, brandGroup, brand, currency } = req.query || {};
        if (!year || !month) {
            res.status(400).json({ ok: false, error: 'year and month are required' });
            return;
        }
        const result = await loadCacheData(year, month, brandGroup || '', brand || '', currency || '');
        res.json({ ok: result.success, ...result });
    } catch (err) {
        res.status(500).json({ ok: false, error: err?.message || String(err) });
    }
});

app.get('/api/dashboard/cache/list', async (req, res) => {
    try {
        const { year, month } = req.query || {};
        if (!year || !month) {
            res.status(400).json({ ok: false, error: 'year and month are required' });
            return;
        }
        const result = await listCacheByMonth(year, month);
        res.json({ ok: result.success, ...result });
    } catch (err) {
        res.status(500).json({ ok: false, error: err?.message || String(err) });
    }
});

app.get('/api/dashboard/cache/months', async (_req, res) => {
    try {
        const cacheDir = await ensureCacheDir();
        const entries = await fs.readdir(cacheDir, { recursive: false });
        const months = entries
            .filter(f => /^\d{4}-\d{2}$/.test(f)) // matches YYYY-MM pattern
            .sort()
            .reverse(); // most recent first
        res.json({ ok: true, months });
    } catch (err) {
        if (err.code === 'ENOENT') {
            res.json({ ok: true, months: [] });
        } else {
            res.status(500).json({ ok: false, error: err?.message || String(err) });
        }
    }
});

app.get('/api/dashboard/ping', async (_req, res) => {
    try {
        await loadDimensions();
        res.json({
            ok: true,
            apiBase: API_BASE,
            tzOffsetMinutes: API_TZ_OFFSET_MINUTES,
            hasToken: !!accessToken,
            tokenExpires: tokenExpMs ? new Date(tokenExpMs).toISOString() : null
        });
    } catch (err) {
        res.status(500).json({ ok: false, error: err?.message || String(err) });
    }
});

// ====== START SERVER ======
async function start(port, triesLeft = 6) {
    try {
        await loadSettingsFromDisk().catch((err) => {
            console.warn('Failed to load persisted settings', err?.message || err);
        });
        await loadDimensions().catch(() => { });
        
        // Auto-login BN88 on startup if credentials available
        if (BETNAGA_USERNAME && BETNAGA_PASSWORD) {
            console.log('[Dashboard] BN88: Attempting auto-login...');
            const login = await betNagaLogin();
            if (login) {
                betnagaCache.token = login.token;
                betnagaCache.operatorId = login.operatorId;
                console.log('[Dashboard] BN88: Auto-login successful - ready to fetch data');
            } else {
                console.warn('[Dashboard] BN88: Auto-login failed - BN88 will not work');
            }
        } else {
            console.warn('[Dashboard] BN88: No credentials set - will not fetch data');
        }
        
        appServer = app.listen(port, '0.0.0.0', () => {
            const addr = appServer.address();
            const actualPort = addr.port;
            console.log('[Dashboard] Local URL:  http://localhost:' + actualPort + '/dashboard-pro');
            console.log('[Dashboard] LAN URL:    http://' + os.hostname() + ':' + actualPort + '/dashboard-pro');
        });
        appServer.on('error', (err) => {
            if (err && err.code === 'EADDRINUSE' && triesLeft > 0) {
                const next = port + 1;
                console.warn(`Port ${port} in use, trying ${next}...`);
                setTimeout(() => start(next, triesLeft - 1), 250);
            } else {
                console.error('Failed to start dashboard server', err);
                process.exit(1);
            }
        });
    } catch (err) {
        console.error('Dashboard server failed during init:', err);
        process.exit(1);
    }
}

start(PORT);
