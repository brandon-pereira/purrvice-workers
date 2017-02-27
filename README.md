# Purrvice Workers
A micro-webapp that uses service workers to preload and cache pictures of cats. Works offline.

## Running
Run 
```
npm install
npm start
```

Note: You may need to refresh once in order to force the service worker to activate.

## WebWorkers vs ServiceWorkers
Slide 5 has some pretty good points on this. Basically, Web Workers can have many per
tab while Service Workers are shared. Web Workers live for life of span, SW live on.
Lastly... SW good for Offline, while WW good for parallelism. 

## Gotchas
Here's a list of gotchas I received while developing this. Hopefully these help
save you some time while developing.
- Service Worker is isolated to current folder structure (i.e. http://localhost:8080/
	will not communicate with http://localhost:8080/webpack-dev-server)
- Service Workers don't work with ES6/ES7 code. You are limited to using only ES5 and 
	any ES6 code that has the same browser support as service workers.
- Service Workers can't connect directly to the webpage until they've registered and the user has refreshed. This is only a problem if you're using a client-side proxy (can't garuntee service worker is ready). 
- Service Worker may not claim browser tab until refresh. Active Chrome Bug. https://bugs.chromium.org/p/chromium/issues/detail?id=462529
- Service Workers sometimes won't execute if other service workers are active. You 
	can find and kill active service workers in Chrome Dev Tools through Application >
	Check 'Show All' > Hit unregister on all.
- Service Worker Push Notifications require a server. No server-less code.
- Service Workers can only access your data through IndexedDB. No LocalStorage or 	 likewise.

## Next Steps
- Webpack exporting as a WebWorker (potentially allowing transpiling).
- Web Workers & Service Workers and how they work together.
- Web Workers (more research)