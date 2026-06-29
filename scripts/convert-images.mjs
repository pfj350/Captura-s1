import sharp from 'sharp';
import convert from 'heic-convert';
import { mkdir, readFile, writeFile } from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, '..');
const outDir = path.join(root, 'public', 'images', 'speaker');

const assetsDir =
  'C:/Users/paulo/.cursor/projects/c-Users-paulo-Desktop-conecta-storywork-pg-captura-xxx-Captura-s1/assets';

async function toWebp(inputPath, outPath, width, quality) {
  let buffer = await readFile(inputPath);

  if (inputPath.toLowerCase().endsWith('.heic')) {
    buffer = Buffer.from(
      await convert({
        buffer,
        format: 'JPEG',
        quality: 0.85,
      })
    );
  }

  const info = await sharp(buffer)
    .rotate()
    .resize({ width, withoutEnlargement: true })
    .webp({ quality, effort: 6 })
    .toFile(outPath);

  return info;
}

const images = [
  {
    input: path.join(
      assetsDir,
      'c__Users_paulo_AppData_Roaming_Cursor_User_workspaceStorage_744078877e7d19a29e5bbd8d3277cc4a_images_DCFBDE58-6E5E-4977-A6EB-795BFF61D633-25657cc4-21aa-400c-9785-35e8da75d868.png'
    ),
    output: 'sthefanny-portrait.webp',
    width: 800,
    quality: 82,
  },
  {
    input: path.join(
      assetsDir,
      'c__Users_paulo_AppData_Roaming_Cursor_User_workspaceStorage_744078877e7d19a29e5bbd8d3277cc4a_images_WhatsApp_Image_2026-06-28_at_22.19.13-5ddb126e-7197-42c1-99ec-b0e9afe3eec7.png'
    ),
    output: 'sthefanny-studio.webp',
    width: 600,
    quality: 80,
  },
  {
    input: path.join(
      assetsDir,
      'c__Users_paulo_AppData_Roaming_Cursor_User_workspaceStorage_744078877e7d19a29e5bbd8d3277cc4a_images_WhatsApp_Image_2026-06-28_at_22.19.12-f43bd885-c495-476e-a36a-42d4569771fe.png'
    ),
    output: 'sthefanny-g1-reportagem.webp',
    width: 600,
    quality: 80,
  },
  {
    input: path.join(
      assetsDir,
      'c__Users_paulo_AppData_Roaming_Cursor_User_workspaceStorage_744078877e7d19a29e5bbd8d3277cc4a_images_WhatsApp_Image_2026-06-28_at_22.19.11-f2a6ea77-81ba-4c81-99fa-d0fc92f1ac72.png'
    ),
    output: 'sthefanny-jornal-nacional.webp',
    width: 600,
    quality: 80,
  },
  {
    input: 'C:/Users/paulo/Downloads/IMG_1472.HEIC',
    output: 'sthefanny-evento-1.webp',
    width: 600,
    quality: 80,
  },
  {
    input: 'C:/Users/paulo/Downloads/IMG_2654.HEIC',
    output: 'sthefanny-evento-2.webp',
    width: 600,
    quality: 80,
  },
  {
    input: 'C:/Users/paulo/Downloads/2F4C0C54-11A7-4554-AD34-224624690468.HEIC',
    output: 'sthefanny-evento-3.webp',
    width: 600,
    quality: 80,
  },
];

await mkdir(outDir, { recursive: true });

for (const img of images) {
  const outPath = path.join(outDir, img.output);
  const info = await toWebp(img.input, outPath, img.width, img.quality);
  console.log(`${img.output}: ${(info.size / 1024).toFixed(1)} KB`);
}

console.log('Done!');
