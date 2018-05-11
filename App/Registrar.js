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
}

export default new Registrar();