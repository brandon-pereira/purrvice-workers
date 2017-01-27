import ServiceWorkerRegister from './sw-register';
import Style from '../styles/style.scss';

var sw = new ServiceWorkerRegister();
sw.sw.ready.then(function() {
	// Service Worker Installed and ready!
	console.log("Client: Service Worker is ready");
	var img = document.querySelector("img");
	img.setAttribute('src', '/getrandomcatpic'); // FIXME: first load breaks :(
	
	document.querySelector("button").addEventListener('click', () => {
		img.setAttribute('src', '/getrandomcatpic?' + Date.now());
	});
});