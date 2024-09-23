function init() {
  console.log("Welcome to FlexTrack");

  // const baseURL = 'https://flextrack-vibx.onrender.com';

  const baseURL = "https://raw.githubusercontent.com/TheCoderAS/FlexTrack/refs/heads/gh-pages/";

  async function fetchManifest() {
    const response = await fetch(`${baseURL}manifest.json`);
    if (!response.ok) {
      throw new Error('Error fetching manifest');
    }
    return response.json();
  }
  async function fetchAndRenderFiles() {
    try {
      const manifest = await fetchManifest();
      const filesToFetch = Object.keys(manifest);

      const fetchedFiles = {};

      // Fetch all files based on the manifest
      for (const files of filesToFetch) {
        for (const file of files) {
          const hashedFile = manifest[file];
          const response = await fetch(`${baseURL}${hashedFile}`);
          if (!response.ok) {
            throw new Error(`Error fetching ${hashedFile}`);
          }
          const content = await response.text();
          fetchedFiles[file] = content;
        }
      }

      console.log(fetchedFiles);
      // Render the fetched files
      // if (fetchedFiles['index.html']) {
      //   document.body.innerHTML = fetchedFiles['index.html'];
      // }

      // if (fetchedFiles['style.css']) {
      //   const style = document.createElement('style');
      //   style.textContent = fetchedFiles['style.css'];
      //   document.head.appendChild(style);
      // }

      // if (fetchedFiles['script.js']) {
      //   const script = document.createElement('script');
      //   script.textContent = fetchedFiles['script.js'];
      //   document.body.appendChild(script);
      // }

    } catch (error) {
      console.error('Error during fetching or rendering:', error);
    }
  }

  // Call the function to fetch and render files
  fetchAndRenderFiles();

}
// document.addEventListener('deviceready', function () {
//   init();
// }, false);

init();