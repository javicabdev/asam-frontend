#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

const localesDir = path.join(__dirname, '..', 'src', 'lib', 'i18n', 'locales');
const languages = ['es', 'fr', 'wo'];
const namespaces = ['auth', 'cashflow', 'common', 'dashboard', 'fees', 'members', 'navigation', 'payments', 'reports', 'users'];

console.log('🌍 Checking i18n completeness...\n');

// Function to get all keys from an object recursively
function getAllKeys(obj, prefix = '') {
  let keys = [];
  for (const [key, value] of Object.entries(obj)) {
    const fullKey = prefix ? `${prefix}.${key}` : key;
    if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
      keys = keys.concat(getAllKeys(value, fullKey));
    } else {
      keys.push(fullKey);
    }
  }
  return keys;
}

// Check each namespace
let hasIssues = false;

for (const namespace of namespaces) {
  console.log(`\n📁 Checking namespace: ${namespace}`);
  
  const translations = {};
  const allKeys = new Set();
  
  // Load translations for each language
  for (const lang of languages) {
    const filePath = path.join(localesDir, lang, `${namespace}.json`);
    try {
      const content = fs.readFileSync(filePath, 'utf8');
      translations[lang] = JSON.parse(content);
      const keys = getAllKeys(translations[lang]);
      keys.forEach(k => allKeys.add(k));
    } catch (err) {
      console.error(`   ❌ Error reading ${lang}/${namespace}.json:`, err.message);
      hasIssues = true;
    }
  }
  
  // Check for missing keys in each language
  for (const lang of languages) {
    const langKeys = getAllKeys(translations[lang] || {});
    const missing = [...allKeys].filter(k => !langKeys.includes(k));
    
    if (missing.length > 0) {
      console.log(`   ⚠️  Missing in ${lang.toUpperCase()}: ${missing.length} keys`);
      missing.forEach(key => console.log(`      - ${key}`));
      hasIssues = true;
    } else {
      console.log(`   ✅ ${lang.toUpperCase()}: All keys present (${langKeys.length} keys)`);
    }
  }
  
  // Check for extra keys
  for (const lang of languages) {
    const langKeys = getAllKeys(translations[lang] || {});
    const otherLangs = languages.filter(l => l !== lang);
    const otherKeys = new Set();
    otherLangs.forEach(l => {
      getAllKeys(translations[l] || {}).forEach(k => otherKeys.add(k));
    });
    
    const extra = langKeys.filter(k => !otherKeys.has(k));
    if (extra.length > 0) {
      console.log(`   ℹ️  Extra in ${lang.toUpperCase()}: ${extra.length} keys`);
      extra.forEach(key => console.log(`      + ${key}`));
    }
  }
}

console.log('\n' + '='.repeat(50));
if (hasIssues) {
  console.log('❌ Issues found in translation files!');
  process.exit(1);
} else {
  console.log('✅ All translations are complete and consistent!');
  process.exit(0);
}
