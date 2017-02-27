export default class ServiceWorkerRegister {
  constructor() {
		if ('serviceWorker' in navigator) {
			// Register the service worker
  		navigator.serviceWorker.register('/sw.js')
			  .then(function(reg) {
			    // registration worked
			    console.log('Registrar: Registration succeeded. Scope is ' + reg.scope);
			  }).catch(function(error) {
			    // registration failed
			    console.log('Registrar: Registration failed with ' + error);
			  });
				
				
				navigator.serviceWorker.ready.then(function(scope) {
					console.log("Registrar: Service Worker Ready");
					// Update dom to reflect status
					document.querySelector('.sw-enabled').classList.add('true');
				});
		}
	}
	
	get sw() {
		return navigator.serviceWorker;
	}
} 