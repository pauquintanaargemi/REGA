const sharp = require('sharp');
const path = require('path');

const assetsDir = path.join(__dirname, '..', 'assets');

// Plant paths reused from src/components/PlantIllustration.tsx (viewBox 0 0 64 64),
// centered with a bit of padding for icon safe zones.
const PLANT_PATHS = {
  stem: 'M32 46 L32 18',
  leafLeft: 'M32 34 C 20 30, 14 18, 20 10 C 28 14, 30 26, 32 34 Z',
  leafRight: 'M32 34 C 44 30, 50 18, 44 10 C 36 14, 34 26, 32 34 Z',
  leafTop: 'M32 26 C 30 16, 32 8, 32 4 C 34 8, 36 16, 32 26 Z',
  pot: 'M20 46 L44 46 L40 58 L24 58 Z',
  potRim: 'M18 42 L46 42 L44 47 L20 47 Z',
};

function plantGroup({ leafColor, stemColor, potColor, potRimColor, includePot }) {
  return `
    <path d="${PLANT_PATHS.stem}" stroke="${stemColor}" stroke-width="3" stroke-linecap="round" fill="none" />
    <path d="${PLANT_PATHS.leafLeft}" fill="${leafColor}" />
    <path d="${PLANT_PATHS.leafRight}" fill="${leafColor}" />
    <path d="${PLANT_PATHS.leafTop}" fill="${leafColor}" />
    ${includePot ? `<path d="${PLANT_PATHS.pot}" fill="${potColor}" />` : ''}
    ${includePot ? `<path d="${PLANT_PATHS.potRim}" fill="${potRimColor}" />` : ''}
  `;
}

function iconSvg(size) {
  // Plant viewBox is 64x64; scale+translate it into a centered, padded box.
  const scale = (size * 0.62) / 64;
  const offset = (size - 64 * scale) / 2;
  return `
    <svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" xmlns="http://www.w3.org/2000/svg">
      <rect width="${size}" height="${size}" fill="#4CAF50" />
      <g transform="translate(${offset}, ${offset}) scale(${scale})">
        ${plantGroup({
          leafColor: '#FFFFFF',
          stemColor: '#FFFFFF',
          potColor: '#F2C94C',
          potRimColor: '#F7DA80',
          includePot: true,
        })}
      </g>
    </svg>
  `;
}

function foregroundSvg(size) {
  const scale = (size * 0.5) / 64;
  const offset = (size - 64 * scale) / 2;
  return `
    <svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" xmlns="http://www.w3.org/2000/svg">
      <g transform="translate(${offset}, ${offset}) scale(${scale})">
        ${plantGroup({
          leafColor: '#FFFFFF',
          stemColor: '#FFFFFF',
          potColor: '#F2C94C',
          potRimColor: '#F7DA80',
          includePot: true,
        })}
      </g>
    </svg>
  `;
}

function monochromeSvg(size) {
  const scale = (size * 0.5) / 64;
  const offset = (size - 64 * scale) / 2;
  return `
    <svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" xmlns="http://www.w3.org/2000/svg">
      <g transform="translate(${offset}, ${offset}) scale(${scale})">
        ${plantGroup({
          leafColor: '#FFFFFF',
          stemColor: '#FFFFFF',
          potColor: '#FFFFFF',
          potRimColor: '#FFFFFF',
          includePot: true,
        })}
      </g>
    </svg>
  `;
}

function backgroundSvg(size) {
  return `
    <svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" xmlns="http://www.w3.org/2000/svg">
      <rect width="${size}" height="${size}" fill="#4CAF50" />
    </svg>
  `;
}

function splashSvg(size) {
  const scale = (size * 0.4) / 64;
  const offset = (size - 64 * scale) / 2;
  return `
    <svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" xmlns="http://www.w3.org/2000/svg">
      <g transform="translate(${offset}, ${offset}) scale(${scale})">
        ${plantGroup({
          leafColor: '#4CAF50',
          stemColor: '#2E7D32',
          potColor: '#B5651D',
          potRimColor: '#C97B3F',
          includePot: true,
        })}
      </g>
    </svg>
  `;
}

async function run() {
  const targets = [
    { file: 'icon.png', svg: iconSvg(1024) },
    { file: 'favicon.png', svg: iconSvg(256), resizeTo: 48 },
    { file: 'splash-icon.png', svg: splashSvg(1024) },
    { file: 'android-icon-foreground.png', svg: foregroundSvg(512) },
    { file: 'android-icon-background.png', svg: backgroundSvg(512) },
    { file: 'android-icon-monochrome.png', svg: monochromeSvg(432) },
  ];

  for (const target of targets) {
    const pipeline = sharp(Buffer.from(target.svg));
    if (target.resizeTo) pipeline.resize(target.resizeTo, target.resizeTo);
    await pipeline.png().toFile(path.join(assetsDir, target.file));
    console.log('Generated', target.file);
  }
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
