import sharp from 'sharp';
import { readdir, stat } from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const imagesDir = path.join(__dirname, '..', 'public', 'images');

async function walk(dir) {
  const entries = await readdir(dir, { withFileTypes: true });
  const files = [];

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      files.push(...await walk(fullPath));
    } else if (/\.webp$/i.test(entry.name)) {
      files.push(fullPath);
    }
  }

  return files;
}

const files = await walk(imagesDir);

for (const file of files) {
  const before = (await stat(file)).size;
  const image = sharp(file);
  const meta = await image.metadata();

  await image
    .webp({
      quality: 78,
      effort: 6,
      smartSubsample: true,
    })
    .toFile(`${file}.tmp`);

  const { rename, unlink } = await import('fs/promises');
  await unlink(file);
  await rename(`${file}.tmp`, file);

  const after = (await stat(file)).size;
  const saved = before - after;
  console.log(
    `${path.relative(imagesDir, file)}: ${(before / 1024).toFixed(1)} KB → ${(after / 1024).toFixed(1)} KB (${saved > 0 ? '-' : '+'}${Math.abs(saved / 1024).toFixed(1)} KB) [${meta.width}x${meta.height}]`
  );
}
