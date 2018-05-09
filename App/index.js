import "babel-polyfill"; // wanted to use async/await.
import Style from "./index.scss";

// This will initialize the service worker
import Registrar from './Registrar';
// This will initialize the service worker

// Define DOM elements
const $button = document.querySelector("button");
const $imgContainer = document.querySelector(".body");

Registrar.ready.then(function() {
  // Service Worker Installed and ready!
  console.log("Client: Service Worker is ready");
  loadImage();
  button.addEventListener("click", () => {
    button.setAttribute("disabled", true);
    loadImage();
  });
});

// Loads new image from our middleware API (also disabled button till complete)
function loadImage() {
	var img = new Image();
	img.onload = function() {
		imgContainer.replaceChild(img, document.querySelector('img'));
		button.removeAttribute('disabled');
	}
	img.src = "/getrandomcatpic?" + Date.now();
}