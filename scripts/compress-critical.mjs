#!/usr/bin/env node
import sharp from 'sharp';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.resolve(__dirname, '..');
const assetsDir = path.join(projectRoot, 'public', 'assets');

// Critical files that failed in first pass
const criticalFiles = [
  'sold/sheridan.webp',      // 1.1 MB → 300-350 KB
  'sold/pellisier.webp',     // 702 KB → 250-300 KB
  'sold/woodshawn.webp',     // 446 KB → 250-300 KB
  'sold/alsab.webp',
  'sold/crestline.webp',
  'sold/mendiburu.webp',
  'sold/windsong.webp'
];

async function compressFile(relativePath, quality) {
  try {
    const inputPath = path.join(assetsDir, relativePath);
    const inputSize = fs.statSync(inputPath).size;

    console.log(`\n🔄 Recompressing: ${relativePath} (${(inputSize / 1024).toFixed(1)} KB, quality ${quality})`);

    // Read with buffer
    const buffer = fs.readFileSync(inputPath);
    const outputBuffer = await sharp(buffer)
      .webp({ quality, effort: 6 })
      .toBuffer();

    const outputSize = outputBuffer.length;
    const savings = ((1 - outputSize / inputSize) * 100).toFixed(1);

    fs.writeFileSync(inputPath, outputBuffer);

    console.log(`✅ ${relativePath}: ${(inputSize / 1024).toFixed(1)} KB → ${(outputSize / 1024).toFixed(1)} KB (${savings}% saved)`);

    return { success: true, inputSize, outputSize };
  } catch (error) {
    console.log(`❌ ${relativePath}: ${error.message}`);
    return { success: false, error: error.message };
  }
}

async function main() {
  console.log('🎯 RECOMPRESSING CRITICAL FILES\n');

  let totalBefore = 0;
  let totalAfter = 0;
  let successCount = 0;

  // Compress each critical file
  for (const file of criticalFiles) {
    // Quality settings per file
    let quality = 72;
    if (file.includes('sheridan')) quality = 70;     // Was 1.1 MB
    if (file.includes('pellisier')) quality = 72;    // Was 702 KB
    if (file.includes('woodshawn')) quality = 75;    // Was 446 KB

    const result = await compressFile(file, quality);

    if (result.success) {
      totalBefore += result.inputSize;
      totalAfter += result.outputSize;
      successCount++;
    }
  }

  console.log('\n' + '='.repeat(60));
  console.log('✅ CRITICAL FILES RECOMPRESSED');
  console.log('='.repeat(60));
  console.log(`Success: ${successCount}/${criticalFiles.length}`);
  console.log(`Total before: ${(totalBefore / 1024).toFixed(1)} KB`);
  console.log(`Total after: ${(totalAfter / 1024).toFixed(1)} KB`);
  console.log(`Total saved: ${((totalBefore - totalAfter) / 1024).toFixed(1)} KB`);
  console.log(`Reduction: ${((1 - totalAfter / totalBefore) * 100).toFixed(1)}%`);
  console.log('='.repeat(60) + '\n');
}

main().catch(err => {
  console.error('Error:', err);
  process.exit(1);
});
