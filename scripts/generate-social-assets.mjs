import sharp from 'sharp';
import { mkdir, readFile } from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, '..');
const publicDir = path.join(root, 'public');
const imagesDir = path.join(publicDir, 'images');

const symbolSource =
  'C:/Users/paulo/.cursor/projects/c-Users-paulo-Desktop-conecta-storywork-pg-captura-xxx-Captura-s1/assets/c__Users_paulo_AppData_Roaming_Cursor_User_workspaceStorage_empty-window_images_png_Simbolo_Loredo_SW__1___1_-2ea997ea-4f3d-4d03-95d3-d77c7008bbf8.png';

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

async function makeTransparentSymbol(size) {
  const resized = await sharp(await readFile(symbolSource))
    .resize({ width: size, height: size, fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });

  const transparent = removeDarkBackground(resized.data);

  return sharp(transparent, {
    raw: {
      width: resized.info.width,
      height: resized.info.height,
      channels: 4,
    },
  }).png();
}

await mkdir(publicDir, { recursive: true });
await mkdir(imagesDir, { recursive: true });

const symbol256 = await makeTransparentSymbol(256);
const symbol256Buffer = await symbol256.png().toBuffer();

const favicon32 = await makeTransparentSymbol(32);
await favicon32.toFile(path.join(publicDir, 'favicon-32x32.png'));

const favicon16 = await makeTransparentSymbol(16);
await favicon16.toFile(path.join(publicDir, 'favicon-16x16.png'));

const appleTouch = await makeTransparentSymbol(180);
await appleTouch.toFile(path.join(publicDir, 'apple-touch-icon.png'));

try {
  await sharp(symbol256Buffer).toFile(path.join(imagesDir, 'loredo-symbol.png'));
} catch {
  await sharp(symbol256Buffer).toFile(path.join(imagesDir, 'loredo-symbol-new.png'));
  console.warn('loredo-symbol.png em uso — salvo como loredo-symbol-new.png');
}

const logoPath = path.join(imagesDir, 'conexao-alem-da-tela-logo.png');
const logoMeta = await sharp(logoPath).metadata();
const logoMaxWidth = 720;
const logoBuffer = await sharp(logoPath)
  .resize({ width: logoMaxWidth, withoutEnlargement: true })
  .toBuffer();

const symbolOg = await makeTransparentSymbol(140);
const symbolOgBuffer = await symbolOg.toBuffer();

const ogWidth = 1200;
const ogHeight = 630;
const logoResized = await sharp(logoBuffer).metadata();
const logoLeft = Math.round((ogWidth - logoResized.width) / 2);
const logoTop = 150;

const ogSvg = Buffer.from(`<svg width="${ogWidth}" height="${ogHeight}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#0d1b3d"/>
      <stop offset="100%" stop-color="#132247"/>
    </linearGradient>
  </defs>
  <rect width="${ogWidth}" height="${ogHeight}" fill="url(#bg)"/>
  <rect x="0" y="0" width="${ogWidth}" height="5" fill="#b8964c"/>
  <rect x="0" y="${ogHeight - 5}" width="${ogWidth}" height="5" fill="#b8964c"/>
  <text x="600" y="390" text-anchor="middle" fill="#d9c8a9" font-family="Georgia, serif" font-size="34" font-style="italic">Evento online gratuito</text>
  <text x="600" y="440" text-anchor="middle" fill="#f3ede2" font-family="Arial, sans-serif" font-size="28" font-weight="700">8 de Julho (quarta) às 20h30</text>
  <text x="600" y="490" text-anchor="middle" fill="#f3ede2" font-family="Arial, sans-serif" font-size="22" opacity="0.85">com Sthefanny Loredo</text>
</svg>`);

await sharp(ogSvg)
  .composite([
    { input: logoBuffer, top: logoTop, left: logoLeft },
    { input: symbolOgBuffer, top: 36, left: ogWidth - 180 },
  ])
  .jpeg({ quality: 88, mozjpeg: true })
  .toFile(path.join(publicDir, 'og-image.jpg'));

console.log('Generated:');
console.log('  public/favicon-16x16.png');
console.log('  public/favicon-32x32.png');
console.log('  public/apple-touch-icon.png');
console.log('  public/og-image.jpg');
console.log('  public/images/loredo-symbol.png');
