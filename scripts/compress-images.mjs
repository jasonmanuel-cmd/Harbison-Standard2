#!/usr/bin/env node
import sharp from 'sharp';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.resolve(__dirname, '..');
const assetsDir = path.join(projectRoot, 'public', 'assets');

// Quality settings by category
const qualitySettings = {
  hero: 75,
  property: 72,
  sold: 70,
  apollo: 75,
  default: 72
};

// Target sizes (KB)
const targetSizes = {
  hero: { min: 120, max: 150 },
  property: { min: 150, max: 200 },
  sold: { min: 250, max: 350 },
  apollo: { min: 150, max: 200 }
};

// Get quality setting based on file path
function getQuality(filePath) {
  if (filePath.includes('hero')) return qualitySettings.hero;
  if (filePath.includes('/sold/')) return qualitySettings.sold;
  if (filePath.includes('/apollo/')) return qualitySettings.apollo;
  if (filePath.includes('/property/')) return qualitySettings.property;
  return qualitySettings.default;
}

// Get target size based on file path
function getTargetSize(filePath) {
  if (filePath.includes('hero')) return targetSizes.hero;
  if (filePath.includes('/sold/')) return targetSizes.sold;
  if (filePath.includes('/apollo/')) return targetSizes.apollo;
  if (filePath.includes('/property/')) return targetSizes.property;
  return targetSizes.property;
}

// Format bytes to KB
function formatSize(bytes) {
  return (bytes / 1024).toFixed(1);
}

// Get all image files
function getAllImages(dir, fileList = []) {
  const files = fs.readdirSync(dir);

  files.forEach(file => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);

    if (stat.isDirectory()) {
      getAllImages(filePath, fileList);
    } else if (/\.(jpg|jpeg|png|webp)$/i.test(file)) {
      fileList.push(filePath);
    }
  });

  return fileList;
}

// Compress single image
async function compressImage(inputPath, outputPath, quality) {
  try {
    // Read input file
    let image = sharp(inputPath);
    const metadata = await image.metadata();

    // Determine output format (prefer WebP, keep PNG for PNGs if they're small)
    const isWebP = inputPath.toLowerCase().endsWith('.webp');
    const isPNG = inputPath.toLowerCase().endsWith('.png');

    // For PNG files, convert to WebP for better compression
    let outputBuffer;
    if (isPNG || isWebP) {
      outputBuffer = await image
        .webp({ quality })
        .toBuffer();
      outputPath = outputPath.replace(/\.[^/.]+$/, '.webp');
    } else {
      // For JPG, convert to WebP
      outputBuffer = await image
        .webp({ quality })
        .toBuffer();
      outputPath = outputPath.replace(/\.[^/.]+$/, '.webp');
    }

    // Write output file
    fs.writeFileSync(outputPath, outputBuffer);

    const inputSize = fs.statSync(inputPath).size;
    const outputSize = outputBuffer.length;
    const savings = ((1 - outputSize / inputSize) * 100).toFixed(1);

    return {
      success: true,
      inputPath,
      outputPath,
      inputSize,
      outputSize,
      savings,
      width: metadata.width,
      height: metadata.height
    };
  } catch (error) {
    return {
      success: false,
      inputPath,
      error: error.message
    };
  }
}

// Main compression function
async function compressAllImages() {
  console.log('🖼️  Starting image compression...\n');

  const allImages = getAllImages(assetsDir);
  console.log(`Found ${allImages.length} images to compress\n`);

  let totalBefore = 0;
  let totalAfter = 0;
  let successCount = 0;
  let failCount = 0;

  // Priority batches
  const priorityFiles = [
    'apollo/mapview.png',
    'sold/sheridan.webp',
    'sold/pellisier.webp',
    'sold/woodshawn.webp'
  ];

  // Sort: priority first, then sold, then property, then others
  allImages.sort((a, b) => {
    const aName = a.replace(assetsDir, '').toLowerCase();
    const bName = b.replace(assetsDir, '').toLowerCase();

    // Priority files first
    const aPriority = priorityFiles.some(p => aName.includes(p.toLowerCase())) ? 0 : 1;
    const bPriority = priorityFiles.some(p => bName.includes(p.toLowerCase())) ? 0 : 1;
    if (aPriority !== bPriority) return aPriority - bPriority;

    // Then sold
    if (aName.includes('/sold/') && !bName.includes('/sold/')) return -1;
    if (!aName.includes('/sold/') && bName.includes('/sold/')) return 1;

    // Then apollo
    if (aName.includes('/apollo/') && !bName.includes('/apollo/')) return -1;
    if (!aName.includes('/apollo/') && bName.includes('/apollo/')) return 1;

    // Then property
    if (aName.includes('/property/') && !bName.includes('/property/')) return -1;
    if (!aName.includes('/property/') && bName.includes('/property/')) return 1;

    return aName.localeCompare(bName);
  });

  // Process images
  for (let i = 0; i < allImages.length; i++) {
    const inputPath = allImages[i];
    const outputPath = inputPath;
    const quality = getQuality(inputPath);

    process.stdout.write(`\r[${i + 1}/${allImages.length}] Compressing...`);

    const result = await compressImage(inputPath, outputPath, quality);

    if (result.success) {
      totalBefore += result.inputSize;
      totalAfter += result.outputSize;
      successCount++;

      // Log progress every 10 files or on success
      if ((i + 1) % 10 === 0 || i === 0) {
        const relativePath = result.inputPath.replace(assetsDir + path.sep, '');
        console.log(`\n✅ ${relativePath}: ${formatSize(result.inputSize)} KB → ${formatSize(result.outputSize)} KB (${result.savings}% saved)`);
      }

      // Delete original if it was JPG/PNG
      if (inputPath !== result.outputPath && fs.existsSync(inputPath)) {
        fs.unlinkSync(inputPath);
      }
    } else {
      failCount++;
      const relativePath = result.inputPath.replace(assetsDir + path.sep, '');
      console.log(`\n❌ ${relativePath}: ${result.error}`);
    }
  }

  // Summary
  console.log('\n\n' + '='.repeat(60));
  console.log('📊 COMPRESSION COMPLETE');
  console.log('='.repeat(60));
  console.log(`Total images processed: ${successCount + failCount}`);
  console.log(`✅ Success: ${successCount}`);
  console.log(`❌ Failed: ${failCount}`);
  console.log(`\nTotal size before: ${formatSize(totalBefore)} KB`);
  console.log(`Total size after: ${formatSize(totalAfter)} KB`);
  console.log(`Total saved: ${formatSize(totalBefore - totalAfter)} KB`);
  console.log(`Total reduction: ${((1 - totalAfter / totalBefore) * 100).toFixed(1)}%`);
  console.log('='.repeat(60) + '\n');

  return { successCount, failCount, totalBefore, totalAfter };
}

// Run
compressAllImages().catch(err => {
  console.error('Error during compression:', err);
  process.exit(1);
});
