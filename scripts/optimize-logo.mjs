import sharp from 'sharp';
import { mkdir, copyFile, readFile } from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, '..');
const outDir = path.join(root, 'public', 'images');
const tempDir = path.join(__dirname, 'temp-input');

const source =
  'C:/Users/paulo/.cursor/projects/c-Users-paulo-Desktop-conecta-storywork-pg-captura-xxx-Captura-s1/assets/c__Users_paulo_AppData_Roaming_Cursor_User_workspaceStorage_empty-window_images_PNG._Logo_marca_Conxe_o_al_m_da_tela__png_-7fc3927b-e310-4e3b-ae47-906c4791e933.png';

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

const input = path.join(tempDir, 'logo-source.png');
await copyFile(source, input);

const meta = await sharp(await readFile(input)).metadata();
const targetWidth = 520;

const resized = await sharp(await readFile(input))
  .resize({ width: targetWidth, withoutEnlargement: true })
  .ensureAlpha()
  .raw()
  .toBuffer({ resolveWithObject: true });

const transparent = removeDarkBackground(resized.data);

const outPath = path.join(outDir, 'conexao-alem-da-tela-logo.png');
const info = await sharp(transparent, {
  raw: {
    width: resized.info.width,
    height: resized.info.height,
    channels: 4,
  },
})
  .png({ compressionLevel: 9, effort: 10 })
  .toFile(outPath);

console.log(`Original: ${meta.width}x${meta.height}`);
console.log(`Output: ${resized.info.width}x${resized.info.height} — ${(info.size / 1024).toFixed(1)} KB`);
console.log(`Saved: ${outPath}`);
