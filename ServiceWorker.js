const VERSION = 1;
const log = (...msg) => console.info('ServiceWorker:', ...msg);

this.addEventListener('install', (event) => {
	log("Installing");
	event.waitUntil(async function () {
		const cache = await caches.open(VERSION)
		return await cache.addAll([
			'/',
			'./index.html',
			'./sad-kitten.jpg',
			'./script.js'
		]);
	});
});

this.addEventListener('activate', (event) => {
	log("Activated");
	// immediately control activating sw
	return event.waitUntil(self.clients.claim());
});


this.addEventListener('fetch', event => {
	// log("Fetching", event.request);
	event.respondWith(async function () {
		const cachedResponse = await self.caches.match(event.request);
		const isCatAPI = /getrandomcatpic/.test(event.request.url);
		// Return cached response
		if (cachedResponse && !isCatAPI) {
      // Cache hit - return the response from the cached version
			return cachedResponse;
    } else if (isCatAPI) {
      log("Detected cat pic URL from front-end");
      return getCatPic();
    } else {
      // Not in cache - return the result from the live server
      // `fetch` is essentially a "fallback"
      return fetch(event.request);
    }
	}());
});

async function getCatPic() {
	// create new request
	const request = new Request('http://thecatapi.com/api/images/get?format=src', {method: 'GET'});
	// search cache for request
	const cached_pic = await caches.match(request);
	if(cached_pic) {
		log("We have a cached cat! Sending to front end.", cached_pic);
		const cache = await caches.open(VERSION);
		await cache.delete(request)
		// getCatPic();
		// clear cache and resolve with cached image 
		return cached_pic;
	}
	
	// not in cache
	log("No cache, loading next manually.");
	// not in cache, fetch from server then resolve
	const response = await fetchWithRetry(request);
	const cache = await caches.open(VERSION);
	cache.put(request, response);
	return response;
		// 	}).then(function() {
		// 		// equivilant to jquery .always. Will preload next asset and add to cache
		// 		console.log("Preloading next picture.");
		// 		fetchWithRetry(request).then(function (response) {
		// 			console.log("Preloading completed.");
		// 			cache.put(request, response);
		// 		});
		// 	});
		// });
	// });  
}

// function to fetch a url with retry logic if failed.
function fetchWithRetry(request, attempt_no = 0) {
	console.info("Fetching with retry", request.url);
	return new Promise(function(resolve, reject) {
		fetch(request, { mode: 'no-cors' }).then(function(response) {
			console.info("ServiceWorker: Got a valid image", response);
			resolve(response);
		}).catch(function(error) {
			if(attempt_no < 5) {
				console.info("ServiceWorker: Got an error when requesting Cat API. Retrying...");
				fetchWithRetry(request, ++attempt_no).then(resolve);	
			} else {
				console.info("ServiceWorker: Cat API isn't resolving.. maybe poor network. Throttling retry.");
				setTimeout(function() {
					fetchWithRetry(request, ++attempt_no).then(resolve);	
				}, attempt_no * 1000); // 5s, 6s, 7s, etc
			}
		});
	});
}