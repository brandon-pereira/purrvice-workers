import Style from "./index.scss";

// This will initialize the service worker
import Registrar from './Registrar';

// Define DOM elements
const $button = document.querySelector("button");

Registrar.ready.then(() => {
  // Service Worker Installed and ready!
  console.log("Client: Service Worker is ready");
  // Update status bar to indicate ready
  document.querySelector(".sw-enabled").classList.add('true');
  // Initially load an asset
  loadImage();
  // Add an event listener for loading another asset
  $button.addEventListener("click", () => {
    loadImage();
    requestNotificationAccess();
  });
});

/**
 * Simple method to request/register service worker, ask for permission to send push notifications,
 * and then send the "subscription" to server.
 */
async function requestNotificationAccess() {
  console.info("Requesting Notifications");
  const subscription = await Registrar.requestNotificationAccess();
  await fetch(`http://localhost:8082/register?key=${subscription}`, {
    method: 'POST'
  })
}

// Loads new image from our middleware API (also disabled button till complete)
function loadImage() {
  // Disable button
  $button.setAttribute("disabled", true);
  // Async load the image
	const img = new Image();
	img.onload = function() {
    // Once the image is loaded, update the real image path.
    document.querySelector(".body").replaceChild(img, document.querySelector('img'));
    // Enable the buttons
		$button.removeAttribute('disabled');
  }
  img.onerror = function() {
    $button.removeAttribute('disabled');
  }
  // Note that /getrandomcatpic isn't a real URL, our service worker resolves it.
  img.src = "/getrandomcatpic?" + Date.now();
}