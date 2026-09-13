#!/usr/bin/env node

import fs from 'fs';
import path from 'path';

const SITE_URL = 'https://www.harbisonstandard.com';
const WORD_COUNT_MIN = 300;

// Routes to validate
const routes = [
  { path: '/', name: 'Home' },
  { path: '/about', name: 'About' },
  { path: '/properties', name: 'Properties' },
  { path: '/past-sales', name: 'Past Sales' },
  { path: '/open-houses', name: 'Open Houses' },
  { path: '/moving-from-los-angeles-to-bakersfield', name: 'LA to Bakersfield' },
  { path: '/contact', name: 'Contact' },
  { path: '/home-value', name: 'Home Value' },
  { path: '/why-tehachapi', name: 'Why Tehachapi' },
  { path: '/cheap-land-kern-county', name: 'Cheap Land' },
  { path: '/bakersfield-home-prices', name: 'Bakersfield Prices' },
  { path: '/tehachapi-home-prices', name: 'Tehachapi Prices' },
  { path: '/real-estate', name: 'Real Estate Service' },
  { path: '/investing', name: 'Investing Service' },
];

function countWords(text) {
  // Remove HTML tags and extra whitespace
  const clean = text.replace(/<[^>]*>/g, ' ').trim();
  return clean.split(/\s+/).filter(w => w.length > 0).length;
}

function validate(filePath, route) {
  const html = fs.readFileSync(filePath, 'utf-8');
  const errors = [];
  const warnings = [];

  // 1. Count words
  const wordCount = countWords(html);
  if (wordCount < WORD_COUNT_MIN) {
    errors.push(`Word count: ${wordCount} (need ≥${WORD_COUNT_MIN})`);
  }

  // 2. Count h1 tags
  const h1Matches = html.match(/<h1[^>]*>/gi) || [];
  const h1Count = h1Matches.length;
  if (h1Count === 0) {
    errors.push('Missing h1 tag');
  } else if (h1Count > 1) {
    errors.push(`Too many h1 tags: ${h1Count} (need exactly 1)`);
  }

  // 3. Check canonical
  const canonicalMatch = html.match(/<link[^>]*rel="canonical"[^>]*href="([^"]*)"[^>]*>/i);
  if (!canonicalMatch) {
    errors.push('Missing canonical link');
  } else {
    const canonicalUrl = canonicalMatch[1];
    const expectedUrl = SITE_URL + route;
    if (canonicalUrl !== expectedUrl) {
      errors.push(`Canonical mismatch: ${canonicalUrl} (expected ${expectedUrl})`);
    }
  }

  // 4. Check for agent schema (RealEstateAgent or Person) with sameAs
  const jsonldMatches = html.match(/<script[^>]*type="application\/ld\+json"[^>]*>([^<]*)<\/script>/gi) || [];
  let hasAgentWithSameAs = false;

  for (const match of jsonldMatches) {
    try {
      const jsonContent = match.replace(/<script[^>]*type="application\/ld\+json"[^>]*>/, '').replace(/<\/script>/, '');
      const schema = JSON.parse(jsonContent);

      // Check for RealEstateAgent or Person with sameAs
      if (schema.sameAs && (schema['@type'] === 'RealEstateAgent' || schema['@type'] === 'Person' ||
          (Array.isArray(schema['@type']) && (schema['@type'].includes('Person') || schema['@type'].includes('RealEstateAgent'))))) {
        hasAgentWithSameAs = true;
      }

      // Check in graph
      if (Array.isArray(schema['@graph'])) {
        for (const item of schema['@graph']) {
          if (item.sameAs && (item['@type'] === 'RealEstateAgent' || item['@type'] === 'Person')) {
            hasAgentWithSameAs = true;
          }
        }
      }
    } catch (e) {
      // Invalid JSON, skip
    }
  }

  if (!hasAgentWithSameAs) {
    warnings.push('No agent schema (RealEstateAgent/Person) with sameAs found');
  }

  return { wordCount, h1Count, errors, warnings };
}

// Main validation
async function main() {
  console.log('Phase 1 Validation Report\n');
  console.log('Checking', routes.length, 'routes...\n');

  let passCount = 0;
  let totalErrors = 0;
  let totalWarnings = 0;
  const results = {};

  for (const route of routes) {
    const htmlPath = route.path === '/'
      ? '/home/user/harbison-standard2/dist/client/index.html'
      : `/home/user/harbison-standard2/dist/client${route.path}/index.html`;

    try {
      if (!fs.existsSync(htmlPath)) {
        console.log(`❌ ${route.path} (${route.name})`);
        console.log(`   Error: File not found at ${htmlPath}\n`);
        totalErrors++;
        continue;
      }

      const result = validate(htmlPath, route.path);
      results[route.path] = result;

      const hasErrors = result.errors.length > 0;
      const hasWarnings = result.warnings.length > 0;

      if (!hasErrors && !hasWarnings) {
        console.log(`✅ ${route.path} (${route.name})`);
        console.log(`   Words: ${result.wordCount}, H1 tags: ${result.h1Count}\n`);
        passCount++;
      } else {
        console.log(`⚠️  ${route.path} (${route.name})`);
        console.log(`   Words: ${result.wordCount}, H1 tags: ${result.h1Count}`);
        if (result.errors.length > 0) {
          result.errors.forEach(e => {
            console.log(`   ❌ ${e}`);
            totalErrors++;
          });
        }
        if (result.warnings.length > 0) {
          result.warnings.forEach(w => {
            console.log(`   ⚠️  ${w}`);
            totalWarnings++;
          });
        }
        console.log('');
      }
    } catch (error) {
      console.log(`❌ ${route.path} (${route.name})`);
      console.log(`   Error: ${error.message}\n`);
      totalErrors++;
    }
  }

  // Summary
  console.log('\n=== SUMMARY ===');
  console.log(`Passed: ${passCount}/${routes.length}`);
  console.log(`Total critical issues: ${totalErrors}`);
  console.log(`Total warnings: ${totalWarnings}`);

  if (totalErrors === 0) {
    console.log('\n✅ Phase 1 core requirements PASSED');
  } else {
    console.log('\n⚠️  Phase 1 has issues to resolve');
  }
}

main().catch(console.error);
