class Registrar {
  constructor() {
	this.url = "ServiceWorker.js";
    this.register();
  }

  log(...msgs) {
    console.info("Registrar:", ...msgs);
  }

  async register() {
    if (navigator.serviceWorker) {
      try {
        const reg = await navigator.serviceWorker.register(this.url);
        this.log("Registered");
        return reg;
      } catch (err) {
        this.log("Failed to register", err);
        throw "unexpected-error";
      }
    } else {
      throw "unsupported-browser";
    }
  }

  /**
   * This is very gross code, but basically the service worker by default
   * doesn't kick in till the next page load. However, our service worker is
   * immediately claiming the page via self.skipWaiting and clients.claim().
   * This code will return a promise which resolves when the service worker
   * has been ACTIVATED. Activated means it can intercept fetch requests,
   * ready means it is available to be activated on next load.
   *
   * Useful documentation:
   * https://davidwalsh.name/service-worker-claim
   * https://github.com/GoogleChrome/workbox/issues/1120
   * https://serviceworke.rs/request-deferrer_index_doc.html
   *
   * @return {Promise}
   */
  get ready() {
    return new Promise(resolve => {
      if (navigator.serviceWorker.controller) {
        return resolve();
      } else {
        navigator.serviceWorker.oncontrollerchange = function() {
          this.controller.onstatechange = function() {
            if (this.state === "activated") {
              resolve();
            }
          };
        };
      }
    });
  }

	async requestNotificationAccess() {
    // Get the private vapid key
		const vapidPublicKey = await this.getVapidPublicKey();
		if (navigator.serviceWorker && vapidPublicKey) {
			try {
        const reg = await navigator.serviceWorker.ready;
        // generate subscription config
        const subscribeOptions = { userVisibleOnly: true, applicationServerKey: this._urlBase64ToUint8Array(vapidPublicKey) };
        // Subscribe user to private key (which contains server details)
				const subscription = await reg.pushManager.subscribe(subscribeOptions)
				// Return subscription as JSON (for later consumption)
				return JSON.stringify(subscription)
			} catch (err) {
				throw err;
			}
		}
	}

	async getVapidPublicKey() {
		if (!this.VAPID_PUBLIC_KEY) {
			const request = await fetch('http://localhost:8081/vapidPublicKey');
			const key = await request.text();
			this.VAPID_PUBLIC_KEY = key;
			return key;
		} else {
			return this.VAPID_PUBLIC_KEY;
		}
	}

	// https://gist.github.com/malko/ff77f0af005f684c44639e4061fa8019
	_urlBase64ToUint8Array(base64String) {
		const padding = '='.repeat((4 - base64String.length % 4) % 4);
		const base64 = (base64String + padding)
			.replace(/-/g, '+')
			.replace(/_/g, '/')
			;
		const rawData = window.atob(base64);
		return Uint8Array.from([...rawData].map((char) => char.charCodeAt(0)));
	}
}

export default new Registrar();