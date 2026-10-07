import sharp from 'sharp';
import fs from 'fs';
import path from 'path';

const propFolder = 'public/assets/property';
const optimizedDir = 'public/assets/optimized';

console.log('🖼️  Optimizing property images...\n');

if (!fs.existsSync(optimizedDir)) fs.mkdirSync(optimizedDir, { recursive: true });

async function optimizePropertyImage(inputPath) {
  try {
    const filename = path.basename(inputPath, '.webp');
    const image = sharp(inputPath);
    const metadata = await image.metadata();

    // Create responsive sizes: 800px, 1200px variants
    const sizes = [800, 1200];

    for (const size of sizes) {
      const outputName = `${filename}-${size}.webp`;
      const outputPath = path.join(optimizedDir, outputName);

      await sharp(inputPath)
        .resize(size, null, { withoutEnlargement: true })
        .webp({ quality: 82, effort: 6 })
        .toFile(outputPath);
    }

    console.log(`✅ ${filename} (${metadata.width}x${metadata.height}px)`);
  } catch (err) {
    console.error(`❌ Error: ${path.basename(inputPath)} - ${err.message}`);
  }
}

const files = fs.readdirSync(propFolder).filter(f => f.endsWith('.webp')).map(f => path.join(propFolder, f));
for (const file of files) {
  await optimizePropertyImage(file);
}

console.log('\n✨ Property images optimized!');
