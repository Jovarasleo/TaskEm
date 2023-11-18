import * as React from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import "./styles/global.scss";
import { Provider } from "react-redux";
import store from "./store/configureStore";

const container = document.getElementById("app");
const root = createRoot(container!);

export let userOnline = "onLine" in navigator ? navigator.onLine : true;

function ready() {
  if (!userOnline) {
    console.log("user is", { userOnline });
  } else {
    console.log("user is", { userOnline });
  }

  window.addEventListener("online", function online() {
    userOnline = true;
    console.log("user is online", { userOnline });
  });

  window.addEventListener("offline", function offline() {
    userOnline = false;
    console.log("user is offline", { userOnline });
  });
}

ready();

async function initServiceWorker() {
  const swRegistration = await navigator.serviceWorker.register("./sw.js");
  const { installing, waiting, active } = swRegistration;
  let svcworker = installing || waiting || active;

  console.log({ svcworker });
  navigator.serviceWorker.addEventListener("controllerchange", async function onControllerChange() {
    svcworker = navigator.serviceWorker.controller;
  });
}

initServiceWorker().catch(console.error);

root.render(
  <React.StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </React.StrictMode>
);
