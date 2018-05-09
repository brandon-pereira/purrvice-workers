class Registrar {

	constructor() {
		this.register();
	}

	async register() {
		if (navigator.serviceWorker) {
			try {
				const reg = await navigator.serviceWorker.register('ServiceWorker.js');
				console.log("ServiceWorker: Registered");
				return reg;
			} catch (err) {
				this.notificationStatus = 'DISABLED';
				console.error("ServiceWorker: Failed to register", err);
			}
		} else {
			this.notificationStatus = 'UNSUPPORTED';
			console.warn("ServiceWorker: Unsupported Browser");
		}
	}

	get ready() {
		return navigator.serviceWorker.register('ServiceWorker.js');
	}
}

export default new Registrar();