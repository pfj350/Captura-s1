import sharp from 'sharp';
import { mkdir, copyFile, readFile } from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, '..');
const outDir = path.join(root, 'public', 'images');
const tempDir = path.join(__dirname, 'temp-input');

const source =
  'C:/Users/paulo/.cursor/projects/c-Users-paulo-Desktop-conecta-storywork-pg-captura-xxx-Captura-s1/assets/c__Users_paulo_AppData_Roaming_Cursor_User_workspaceStorage_empty-window_images_png_Simbolo_Loredo_SW__1_-428228a0-a821-442b-b4b2-b98dd1492a13.png';

function removeDarkBackground(buffer) {
  const pixels = new Uint8Array(buffer);
  for (let i = 0; i < pixels.length; i += 4) {
    const r = pixels[i];
    const g = pixels[i + 1];
    const b = pixels[i + 2];
    if (r < 45 && g < 45 && b < 45) {
      pixels[i + 3] = 0;
    }
  }
  return pixels;
}

await mkdir(outDir, { recursive: true });
await mkdir(tempDir, { recursive: true });

const input = path.join(tempDir, 'symbol-source.png');
await copyFile(source, input);

const resized = await sharp(await readFile(input))
  .resize({ width: 256, height: 256, fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
  .ensureAlpha()
  .raw()
  .toBuffer({ resolveWithObject: true });

const transparent = removeDarkBackground(resized.data);

const outPath = path.join(outDir, 'loredo-symbol.png');
const info = await sharp(transparent, {
  raw: {
    width: resized.info.width,
    height: resized.info.height,
    channels: 4,
  },
})
  .png({ compressionLevel: 9, effort: 10 })
  .toFile(outPath);

console.log(`Output: ${resized.info.width}x${resized.info.height} — ${(info.size / 1024).toFixed(1)} KB`);
console.log(`Saved: ${outPath}`);
