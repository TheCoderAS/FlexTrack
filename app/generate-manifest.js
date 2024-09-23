const fs = require('fs');
const path = require('path');

const outputDir = path.join(__dirname, 'dist/app/browser');
const manifestPath = path.join(outputDir, 'manifest.json');

function generateManifest() {
  const files = fs.readdirSync(outputDir);
  const manifest = {};

  files.forEach(file => {
    if (file.endsWith('.ico') || file.endsWith('.js') || file.endsWith('.css') || file === 'index.html') {
      const originalName = file.replace(/(-[a-z0-9]+)\.(js|css)$/, '.$2');
      manifest[originalName] = file;
    }
  });

  fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2));
  console.log('Manifest generated:', manifestPath);
}
generateManifest();
