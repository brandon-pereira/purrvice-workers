import "babel-polyfill"; // wanted to use async/await.
import Style from "./index.scss";

// This will initialize the service worker
import Registrar from './Registrar';
// This will initialize the service worker

// Define DOM elements
const $button = document.querySelector("button");
const $imgContainer = document.querySelector(".body");
const $swStatus = document.querySelector(".sw-enabled");

Registrar.ready.then(function() {
  // Service Worker Installed and ready!
  console.log("Client: Service Worker is ready");
  loadImage();
  $swStatus.classList.add('true');
  $button.addEventListener("click", () => {
    console.log("LAOD");
    loadImage();
  });
});

// Loads new image from our middleware API (also disabled button till complete)
function loadImage() {
  $button.setAttribute("disabled", true);
	const img = new Image();
	img.onload = function() {
    console.log("DONE");
		$imgContainer.replaceChild(img, document.querySelector('img'));
		$button.removeAttribute('disabled');
	}
  img.src = "/getrandomcatpic?" + Date.now();
}