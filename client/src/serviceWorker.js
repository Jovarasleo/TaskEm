const version = 1;
const CACHE_NAME = "version-1";
const urlsToCache = ["index.html", "offline.html"];

// self.addEventListener("install", onInstall);
// self.addEventListener("active", onActivate);
// window.onload

// main().catch(console.error);

// async function main() {
//   console.log(`Service worker version: ${version} is starting...`);
// }

// async function onInstall(e) {
//   console.log(`Service worker version: ${version} is installed.`);
//   self.skipwaiting();
// }

// function onActivate(e) {
//   e.waitUntil(handleActivation());
// }

// async function handleActivation() {
//   await clients.claim();
//   console.log(`Service worker version: ${version} is activated.`);
// }

// async function initServiceWorker() {
//   const swRegistration = await navigator.serviceWorker.register(
//     "./serviceWorker.js"
//   );

//   const { installing, waiting, active } = swRegistration;
//   let svcworker = installing || waiting || active;

//   navigator.serviceWorker.addEventListener(
//     "controllerchange",
//     async function onControllerChange() {
//       svcworker = navigator.serviceWorker.controller;
//     }
//   );
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

      // async function cacheThenNetwork(request) {
      //   const cachedResponse = await caches.match(request);
      //   if (cachedResponse) {
      //     console.log("Found response in cache:", cachedResponse);
      //     return cachedResponse;
      //   }
      //   console.log("Falling back to network");
      //   return fetch(request);
      // }

      // document.addEventListener("fetch", (event) => {
      //   console.log(`Handling fetch event for ${event.request.url}`);
      //   event.respondWith(cacheThenNetwork(event.request));
      // });
    };
  }
}

// // Listen for requests
// document.addEventListener("fetch", (event) => {
//   event.respondWith(
//     caches.match(event.request).then(() => {
//       return fetch(event.request).catch(() => caches.match("offline.html"));
//     })
//   );
// });
