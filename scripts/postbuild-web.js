const fs = require('fs');
const path = require('path');

const distDir = path.join(__dirname, '..', 'dist');
const indexPath = path.join(distDir, 'index.html');

fs.copyFileSync(
  path.join(__dirname, '..', 'assets', 'icon.png'),
  path.join(distDir, 'apple-touch-icon.png')
);

const iosTags = [
  '<meta name="apple-mobile-web-app-capable" content="yes">',
  '<meta name="apple-mobile-web-app-status-bar-style" content="default">',
  '<meta name="apple-mobile-web-app-title" content="Rega">',
  '<link rel="apple-touch-icon" href="/apple-touch-icon.png">',
].join('\n');

let html = fs.readFileSync(indexPath, 'utf8');
if (!html.includes('apple-mobile-web-app-capable')) {
  html = html.replace('</head>', `${iosTags}</head>`);
  fs.writeFileSync(indexPath, html);
}
