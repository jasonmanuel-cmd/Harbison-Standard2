import sharp from 'sharp';
import fs from 'fs';
import path from 'path';

const headshot4kPath = 'C:\\Users\\blunt\\AppData\\Local\\Temp\\claude\\C--Users-blunt-Desktop-realestate-Harbison-Standard2-main\\fbff2ef6-1c8c-4d5d-8aff-3b03e8ce2601\\images\\1.webp';
const hero4kPath = 'C:\\Users\\blunt\\Downloads\\hero-4k.webp';
const assetsDir = 'public/assets';
const optimizedDir = 'public/assets/optimized';

console.log('🖼️  Optimizing upscaled images...\n');

// Ensure directories exist
if (!fs.existsSync(optimizedDir)) fs.mkdirSync(optimizedDir, { recursive: true });

async function optimizeImage(inputPath, name, sizes) {
  try {
    const image = sharp(inputPath);
    const metadata = await image.metadata();
    console.log(`📍 ${name}: ${metadata.width}x${metadata.height}px`);

    // Main high-quality version
    const mainPath = path.join(assetsDir, name === 'headshot' ? 'headshot.webp' : 'hero.webp');
    await image.webp({ quality: 85, effort: 6 }).toFile(mainPath);
    const mainSize = fs.statSync(mainPath).size;
    console.log(`  ✅ Main: ${mainPath} (${(mainSize / 1024).toFixed(1)}KB)`);

    // Responsive sizes
    for (const size of sizes) {
      const filename = `${name}-${size}.webp`;
      const filePath = path.join(optimizedDir, filename);
      await sharp(inputPath)
        .resize(size, null, { withoutEnlargement: true })
        .webp({ quality: 82, effort: 6 })
        .toFile(filePath);
      const fileSize = fs.statSync(filePath).size;
      console.log(`  ✅ ${filename} (${(fileSize / 1024).toFixed(1)}KB)`);
    }
    console.log();
  } catch (err) {
    console.error(`❌ Error optimizing ${name}:`, err.message);
  }
}

// Optimize both images
await optimizeImage(headshot4kPath, 'headshot', [300, 600, 1200]);
await optimizeImage(hero4kPath, 'hero', [768, 1600, 2400]);

console.log('✨ Done! Images optimized and ready.');
