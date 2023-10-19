import { Action, Dispatch, MiddlewareAPI } from "redux";
import { getSocketTasks } from "../slices/taskReducer";

interface ActionWithPayload<T> extends Action {
  payload: T;
}

const eventCallbacks: { [eventName: string]: (data: any) => void } = {
  "task/createTask": (data) => {
    // Handle the "task/CreateTask" event here
    console.log("Received task/CreateTask event:", data);
  },
  // Add more event callbacks as needed
};

let ws: WebSocket | null = null;
export const socketMiddleware =
  (subscribers: any) => (store: MiddlewareAPI<Dispatch>) => (next: Dispatch) => {
    if (!!ws) {
      ws.onerror = ws.onopen = ws.onclose = null;
      ws.close();
    }

    ws = new WebSocket("ws://127.0.0.1:3000");

    ws.addEventListener("open", (event) => {
      console.log("connection is open");
    });

    ws.addEventListener("message", (event) => {
      try {
        const data = JSON.parse(event.data);
        if (data.data) {
          console.log("tasks", data.data);
          store.dispatch(getSocketTasks(data.data));
        }
      } catch (error) {
        console.error("Error parsing message:", error);
      }
    });

    const sendToBackend = (eventType: string, eventPayload: any) => {
      if (ws && ws.readyState === WebSocket.OPEN) {
        const message = {
          type: eventType,
          payload: eventPayload,
        };

        ws.send(JSON.stringify(message));
      } else {
        console.error("WebSocket not open. Cannot send message.");
      }
    };

    return (action: any) => {
      if (action) {
        Object.keys(subscribers).forEach((key: any) => {
          const event = subscribers[key];
          if (event.type === action.type) {
            sendToBackend(action.type, action.payload);
          }
        });
      }

      next(action);
    };
  };

// if (!listenersAreMapped && socket) {
//   config.listeners.map((listener) => {
//     socket.on(listener.message, (message) => store.dispatch(listener.action(message)));
//   });

//   listenersAreapped = true;
// }

// import { Action, Dispatch, MiddlewareAPI } from "redux";
// import { Socket, io } from "socket.io-client";
// import { createProject, setProjects } from "../slices/projectReducer";
// import { Project } from "../../views/taksManager/model/task";
// import { setContainers } from "../../db";
// import { setContainersToIdb, setSocketContainers } from "../slices/containerReducer";
// import { getSocketTasks } from "../slices/taskReducer";
// import { initializeSocket } from "./socketManager";

// interface ActionWithPayload<T> extends Action {
//   payload: T;
// }

// // const authToken = store.getState().auth.userToken;
// const socket = initializeSocket("cat");

// export const socketMiddleware =
//   // ({ subscribers }: any) =>
//   (store: MiddlewareAPI<Dispatch>) => (next: Dispatch) => (action: any) => {
//     // Establish a WebSocket connection

//     // socket = io("http://127.0.0.1:3000", {
//     //   auth: {
//     //     token: store.getState().auth.userToken,
//     //   },
//     // });

//     socket.on("connect", () => {
//       console.log("this runs twice?", socket);
//       console.log(socket?.id);
//     });

//     socket.on("connect_error", (err) => {
//       console.log(err instanceof Error); // true
//       console.log(err.message); // not authorized
//       console.log({ err }); // { content: "Please retry later" }
//     });

//     socket.on("project/syncProjects", (data) => {
//       console.log("socketListner", { data });
//       store.dispatch(setProjects(data));
//     });

//     socket.on("project/selectProject", (data) => {
//       socket?.emit(action.payload);
//       console.log({ data });
//       store.dispatch(setSocketContainers(data.containers));
//       store.dispatch(getSocketTasks(data.tasks));
//     });

//     // if (subscribers) {
//     socket?.emit(action.type, action.payload);
//     console.log(action);
//     // subscribers.map((listener) => {
//     //   console.log({ listener });
//     //   socket.on(listener.type, (message) => {
//     //     console.log(message);
//     //     store.dispatch(listener.type(message));
//     //   });
//     // });
//     // }

//     next(action);
//   };

// if (!listenersAreMapped && socket) {
//   config.listeners.map((listener) => {
//     socket.on(listener.message, (message) => store.dispatch(listener.action(message)));
//   });

//   listenersAreMapped = true;
// }

// import { Action, Dispatch, MiddlewareAPI } from "redux";
// import { Socket, io } from "socket.io-client";
// import { createProject, setProjects } from "../slices/projectReducer";
// import { Project } from "../../views/taksManager/model/task";
// import { setContainers } from "../../db";
// import { setContainersToIdb, setSocketContainers } from "../slices/containerReducer";
// import { getSocketTasks } from "../slices/taskReducer";
// import { initializeSocket } from "./socketManager";

// interface ActionWithPayload<T> extends Action {
//   payload: T;
// }

// const authToken = store.getState().auth.userToken;
// const socket = initializeSocket("cat");

// export const socketMiddleware =
//   // ({ subscribers }: any) =>
//   (store: MiddlewareAPI<Dispatch>) => (next: Dispatch) => (action: any) => {
//     // Establish a WebSocket connection

//     // socket = io("http://127.0.0.1:3000", {
//     //   auth: {
//     //     token: store.getState().auth.userToken,
//     //   },
//     // });

//     socket.on("connect", () => {
//       console.log("this runs twice?", socket);
//       console.log(socket?.id);
//     });

//     socket.on("connect_error", (err) => {
//       console.log(err instanceof Error); // true
//       console.log(err.message); // not authorized
//       console.log({ err }); // { content: "Please retry later" }
//     });

//     socket.on("project/syncProjects", (data) => {
//       console.log("socketListner", { data });
//       store.dispatch(setProjects(data));
//     });

//     socket.on("project/selectProject", (data) => {
//       socket?.emit(action.payload);
//       console.log({ data });
//       store.dispatch(setSocketContainers(data.containers));
//       store.dispatch(getSocketTasks(data.tasks));
//     });

//     // if (subscribers) {
//     socket?.emit(action.type, action.payload);
//     console.log(action);
//     // subscribers.map((listener) => {
//     //   console.log({ listener });
//     //   socket.on(listener.type, (message) => {
//     //     console.log(message);
//     //     store.dispatch(listener.type(message));
//     //   });
//     // });
//     // }

//     next(action);
//   };

// // if (!listenersAreMapped && socket) {
// //   config.listeners.map((listener) => {
// //     socket.on(listener.message, (message) => store.dispatch(listener.action(message)));
// //   });

// //   listenersAreMapped = true;
// // }
