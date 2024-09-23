const fs = require('fs');
const path = require('path');

// Specify the output directory and manifest file name
const outputDir = path.join(__dirname, 'dist/app/browser'); // Adjust according to your app's name
const manifestPath = path.join(outputDir, 'manifest.json');

// Function to remove hash from filename and return the original name
function getOriginalFileName(file) {
  return file
    .replace(/-[a-zA-Z0-9]{8,}\.(js|css|html)$/, '.$1')  // Adjust hash length as needed
    .replace(/^chunk-[a-zA-Z0-9]{8,}\.js$/, 'chunk.js');  // Handle chunk files
}

// Function to generate the manifest
function generateManifest() {
  const files = fs.readdirSync(outputDir);
  const manifest = {};

  files.forEach(file => {
    // Only consider files with specific extensions
    if (file.match(/\.(js|css|html)$/)) {
      const originalName = getOriginalFileName(file);

      // Initialize the array for this file if it doesn't exist
      if (!manifest[originalName]) {
        manifest[originalName] = [];
      }

      // Add the hashed file to the array
      manifest[originalName].push(file);
    }
  });

  // Write the manifest to a file
  fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2));
  console.log('Manifest generated:', manifestPath);
}

// Run the function to generate the manifest
generateManifest();
