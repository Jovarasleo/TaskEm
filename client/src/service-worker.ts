const CACHE_NAME = "cache_sample";
const urlsToCache = ["index.html", "app.js"];
const version = "v0.0.1"; //install sw at first time
//place to cache assets to speed up the loading time of web page
self.addEventListener("install", (event: any) => {
  console.log("sw install event");
  event.waitUntil(
    caches.open(version + CACHE_NAME).then((cache) => {
      console.log("opened cache");
      return cache.addAll(urlsToCache);
    })
  );
}); //Activate the sw after install
//Place where old caches are cleared
self.addEventListener("activate", (event: any) => {
  console.log("sw activate event");
  event.waitUntil(
    caches.keys().then((cacheNames) =>
      Promise.all(
        cacheNames
          .filter((cacheName) => {
            return cacheName.indexOf(version) !== 0;
          })
          .map(function (cachName) {
            return caches.delete(cachName);
          })
      )
    )
  );
}); //listen for requests
self.addEventListener("fetch", (event: any) => {
  event.respondWith(
    caches
      .match(event.request)
      .then((response) => {
        return response || fetch(event.request);
      })
      .catch(() => caches.match("index.html"))
  );
});
