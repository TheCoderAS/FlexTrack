async function init() {
  console.log("Welcome to FlexTrack");
  const parser = new DOMParser();
  try {
    let response = await fetch('https://flextrack-vibx.onrender.com');
    let remote = await response.text();

    let remoteDoc = parser.parseFromString(remote, 'text/html');

    let scripts = remoteDoc.getElementsByTagName('script');

    console.log(scripts);
  } catch (error) {
    console.log("Cannot load remote UI.", error)
  }
  // let app = document.getElementById('app');

  // let script1 = document.createElement("script");
  // script1.setAttribute('src', 'https://flextrack-vibx.onrender.com/polyfills-Q763KACN.js');
  // script1.setAttribute('type', 'module');

  // let script2 = document.createElement("script");
  // script2.setAttribute('src', 'https://flextrack-vibx.onrender.com/main-FRSVORSD.js');
  // script2.setAttribute('type', 'module');

  // app.appendChild(script1);
  // app.appendChild(script2);
}
document.addEventListener('deviceready', function () {
  init();
}, false);