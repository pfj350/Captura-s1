import { mkdir, writeFile } from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const outDir = path.join(__dirname, '..', 'public', 'images', 'logos');

const logos = [
  {
    name: 'globo.svg',
    url: 'https://upload.wikimedia.org/wikipedia/commons/9/92/Globo_TV_logo.svg',
  },
  {
    name: 'sbt.svg',
    url: 'https://upload.wikimedia.org/wikipedia/commons/3/3a/SBT_logo.svg',
  },
  {
    name: 'band.svg',
    url: 'https://upload.wikimedia.org/wikipedia/commons/0/0d/Band_Marca.svg',
  },
];

await mkdir(outDir, { recursive: true });

for (const logo of logos) {
  const response = await fetch(logo.url, {
    headers: {
      'User-Agent': 'Captura-s1/1.0 (educational project; local dev)',
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to download ${logo.name}: ${response.status}`);
  }

  const svg = await response.text();
  await writeFile(path.join(outDir, logo.name), svg, 'utf8');
  console.log(`Saved ${logo.name} (${svg.length} bytes)`);
  await new Promise((resolve) => setTimeout(resolve, 2000));
}

console.log('Done');
