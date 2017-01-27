import ServiceWorkerRegister from './sw-register';
import Style from '../styles/style.scss';

var sw = new ServiceWorkerRegister().sw;
var button = document.querySelector('button');
var imgContainer = document.querySelector(".body");

sw.ready.then(function() {
	// Service Worker Installed and ready!
	console.log("Client: Service Worker is ready");
	loadImage();
	button.addEventListener('click', () => {
		button.setAttribute('disabled', true);
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