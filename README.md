# Purrvice Workers

A micro-webapp that uses service workers to preload and cache pictures of cats. Works offline. Also uses push notifications (if available) to re-engage the user.

## Running

Running the front end:

```bash
npm install
npm start
```

Running the server:

```bash
npm run server
```

## Gotchas

Here's a list of gotchas I received while developing this. Hopefully these help
save you some time while developing.
- Service Worker is isolated to current folder structure (i.e. http://localhost:8080/ will not communicate with http://localhost:8080/webpack-dev-server)
- Service Workers can't easily be transpiled, however it is possible. Thankfully, most browsers Service Workers also support the main ES6 features you'd want to use.
- Service Workers can't connect directly to the webpage until they've registered and the user has refreshed. **I have found a solution** but it involves a lot of gross code to force claim the tabs. Hopefully this is simplified down the road.
- Service Worker Push Notifications require a server. No server-less code.
- Service Workers can only access your data through IndexedDB. No LocalStorage or likewise.