const VERSION = 1;
var self = this;

this.addEventListener('install', function(event) {
  event.waitUntil(
     caches.open(VERSION).then(function(cache) {
			// console.log(cache);
      return cache.addAll([
        '/',
        './index.html',
				'./sad-kitten.jpg',
        './script.js'
			]);
    })
  );
});

this.addEventListener('activate', function(event) {
	console.info("ServiceWorker: Service Worker claimed ownership of page");
  // Claim any clients immediately, so that the page will be under SW control without reloading.
  event.waitUntil(self.clients.claim());
});

this.addEventListener('fetch', function(event) {
  event.respondWith(
    caches.match(event.request)
      .then(function(response) {
				var isCatAPI = /getrandomcatpic/.test(event.request.url);
        if (response && !isCatAPI) {
					// Cache hit - return the response from the cached version
          return response;
				} else if(isCatAPI) {
					// API hit - return the 'real' api
					console.warn("ServiceWorker: Detected cat pic URL from front-end");
					return getCatPic();
				} else {
					// Not in cache - return the result from the live server
					// `fetch` is essentially a "fallback"
					return fetch(event.request);
				}
      }
    )
  );
});

function getCatPic() {
	return new Promise(function (resolve, reject) {
		var request = new Request('http://thecatapi.com/api/images/get?format=src', {method: 'GET'});
		caches.open(VERSION).then(function(cache) {
			caches.match(request).then(function (cached_pic) {
				if(cached_pic) {
			    console.log("We have a cached cat! Sending to front end.", cached_pic);
					cache.delete(request).then(function(s) {
						console.log("Clearing cached", s);
						resolve(cached_pic);
					});
				} else {
			    throw 'NOT_IN_CACHE';         
			  }
			}).catch(function (e) {
				console.log("No cache, loading next manually.", e);
			  fetchWithRetry(request).then(resolve);
			}).then(function() {
				console.log("Preloading next picture.");
				fetchWithRetry(request).then(function (response) {
					console.log("Preloading completed.");
					cache.put(request, response);
				});
			});
		});
	});  
}

function fetchWithRetry(request) {
	console.info("Fetching with retry", request.url);
	return new Promise(function(resolve, reject) {
		fetch(request).then(function(response) {
			console.info("ServiceWorker: Got a valid image", response);
			resolve(response);
		}).catch(function(error) {
			console.info("ServiceWorker: Got an error when requesting Cat API. Retrying...");
			fetchWithRetry(request).then(resolve);
		});
	});
}