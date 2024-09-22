function init() {
  console.log("Welcome to FlexTrack");
  let script = document.createElement('script');
    script.setAttribute('src', 'js/dynamic.js');
    let app = document.getElementById('app');
    app.appendChild(script);
}
document.addEventListener('deviceready', function () {
  init();
}, false);