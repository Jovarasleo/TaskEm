const version = 1;
const CACHE_NAME = "version-1";
const cacheFiles = ["index.html"];

// self.addEventListener("install", onInstall);
// self.addEventListener("active", onActivate);
// // window.onload;

// main().catch(console.error);

// async function main() {
//   console.log(`Service worker version: ${version} is starting...`);
// }

// async function onInstall(e) {
//   console.log(`Service worker version: ${version} is installed.`);
//   e.waitUntil(
//     // Open the cache
//     caches.open(CACHE_NAME).then(function (cache) {
//       // Add all the default files to the cache
//       console.log("[ServiceWorker] Caching cacheFiles");
//       return cache.addAll(cacheFiles);
//     })
//   ); //
// }

// function onActivate(e) {
//   e.waitUntil(handleActivation());
// }

// async function handleActivation() {
//   console.log(`Service worker version: ${version} is activated.`);
// }

export async function LocalRegister() {
  const swPath = `./serviceWorker.js`;
  if ("serviceWorker" in navigator) {
    window.onload = async () => {
      // console.log(navigator.serviceWorker.getRegistration())
      await navigator.serviceWorker.getRegistrations().then((regs) => {
        regs?.forEach((r) => r.unregister());
        console.log("unregister");
      });

      navigator.serviceWorker
        .register(swPath)
        .then((registration) => {
          if (registration.active) {
            console.log(
              `%cserviceWorker ${registration.active.state}`,
              "font-size: 1.4rem; color: white; font-weight: bolder"
            );
          }
          registration.onupdatefound = () => {
            const installation = registration.installing;
            if (installation == null) {
              return;
            }
            installation.onstatechange = () => {
              if (installation?.state === "activated") {
                console.log(
                  "%cSW Activated",
                  "font-size: 1.2rem; color: green; font-weight: bolder"
                );
              }
            };
          };
        })
        .catch((error) => {
          console.log(
            "%cError while registering SW:",
            "font-size: 1.2rem; color: red; font-weight: bolder"
          );
          console.log(error);
        });

      async function cacheThenNetwork(request) {
        const cachedResponse = await caches.match(request);
        if (cachedResponse) {
          console.log("Found response in cache:", cachedResponse);
          return cachedResponse;
        }
        console.log("Falling back to network");
        return fetch(request);
      }

      document.addEventListener("fetch", (event) => {
        console.log(`Handling fetch event for ${event.request.url}`);
        event.respondWith(cacheThenNetwork(event.request));
      });
    };
  }
}

// Listen for requests
document.addEventListener("fetch", (event) => {
  event.respondWith(
    caches.match(event.request).then(async () => {
      return fetch(event.request).catch(() => caches.match("offline.html"));
    })
  );
});
