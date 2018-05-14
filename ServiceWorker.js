const VERSION = 1;
const log = (...msg) => console.info('ServiceWorker:', ...msg);

this.addEventListener('install', (event) => {
	log("Installing");
	event.waitUntil(async function () {
		// This opens the cache
		const cache = await caches.open(VERSION);
		// This adds the below urls to cache
		await cache.addAll([
			'/',
			'./index.html',
			'./sad-kitten.jpg',
			'./script.js'
		]);
		// This immediately calls activate method
		return self.skipWaiting();
	}());
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


this.addEventListener('push', (event) => {
	let data = {
		title: "New Pics Available!",
		body: "Over 9000+ new photos."
	};

	log("receivedNotification", data);
	event.waitUntil(self.registration.showNotification("New cat pics are up!", {
      body: "Are you kitten?"
    }));
});

async function getCatPic(isPreload = false) {
	// create new request
	const request = new Request('http://thecatapi.com/api/images/get?format=src', {method: 'GET'});
	// search cache for request
	if(!isPreload) {
		const cached_pic = await caches.match(request);
		if (cached_pic) {
			log("We have a cached cat! Sending to front end.", cached_pic);
			// clear cache
			const cache = await caches.open(VERSION);
			await cache.delete(request);
			// async cache next
			getCatPic(true);
			// return cache
			return cached_pic;
		}
	}

	// not in cache, fetch from server then resolve
	const response = await fetchWithRetry(request);
	// If its a preload, store in cache, return nothing
	if(isPreload) {
		const cache = await caches.open(VERSION);
		cache.put(request, response);
		return;
	}

	// Precache the next asset
	getCatPic(true);
	// Return fetch
	return response;
}

// function to fetch a url with retry logic if failed.
async function fetchWithRetry(request, attempt_no = 0) {
	log("Fetching with retry", request.url);
	try {
		const response = await fetch(request, { mode: 'no-cors' });
		log("Got a valid image", response);
		return response;
	} catch(error) {
		if(attempt_no < 5) {
			log("Got an error when requesting Cat API. Retrying...");
			return await fetchWithRetry(request, ++attempt_no);
		} else {
			log("Cat API isn't resolving.. maybe poor network. Throttling retry.");
			await sleep(attempt_no * 1000); // 5s, 6s, 7s, etc
			return await fetchWithRetry(request, ++attempt_no)
		}
	};
}

function sleep(time) {
	return new Promise(resolve => setTimeout(resolve, time));
}