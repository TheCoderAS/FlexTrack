async function init() {
  console.log("Welcome to FlexTrack");

  const baseURL = 'https://flextrack-vibx.onrender.com';

  // const filesToFetch = [
  //   'index.html', // Main HTML file
  //   'script.js',   // JavaScript file (hashed name)
  //   'style.css',   // CSS file (hashed name)
  //   // Add more files as needed
  // ];

  // async function fetchFiles(urls) {
  //   const fetchedFiles = {};

  //   for (const file of urls) {
  //     try {
  //       const response = await fetch(`${baseURL}${file}`);
  //       if (!response.ok) {
  //         throw new Error(`Error fetching ${file}`);
  //       }
  //       const content = await response.text();
  //       fetchedFiles[file] = content; // Store the content
  //     } catch (error) {
  //       console.error(error);
  //     }
  //   }

  //   return fetchedFiles;
  // }


}
// document.addEventListener('deviceready', function () {
//   init();
// }, false);

init()