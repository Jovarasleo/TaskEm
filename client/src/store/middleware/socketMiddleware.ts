import { Dispatch, MiddlewareAPI } from "redux";
import { getSocketTasks } from "../slices/taskReducer";
import { deleteEvent, getEvents } from "../../db";
import { setSocketContainers } from "../slices/containerReducer";
import { setProjects } from "../slices/projectReducer";

const eventCallbacks: { [eventName: string]: (data: any) => void } = {
  "task/createTask": (data) => {
    // Handle the "task/CreateTask" event here
    console.log("Received task/CreateTask event:", data);
  },
  // Add more event callbacks as needed
};

export let ws: WebSocket | null = null;
export const socketMiddleware =
  (subscribers: any) => (store: MiddlewareAPI<Dispatch>) => (next: Dispatch) => {
    if (!!ws) {
      ws.onerror = ws.onopen = ws.onclose = null;
      ws.close();
    }

    ws = new WebSocket("ws://127.0.0.1:3000");

    ws.addEventListener("open", async () => {
      console.log("connection is open");
      if (ws && ws.readyState === WebSocket.OPEN) {
        const allEvents: any = await getEvents();

        for (const userEvent of allEvents) {
          ws?.send(JSON.stringify(userEvent));
          deleteEvent(userEvent.id);
        }

        ws.send(JSON.stringify({ type: "syncData" }));
      }
    });

    ws.addEventListener("message", (event) => {
      const parsedData = JSON.parse(event.data);
      // console.log({ data });
      const { type, payload } = parsedData;
      try {
        if (type === "tasks/getTasks") {
          store.dispatch(getSocketTasks(payload));
        }
        if (type === "container/getContainers") {
          store.dispatch(setSocketContainers(payload));
        }
        if (type === "project/getProjects") {
          store.dispatch(setProjects(payload));
        }
      } catch (error) {
        console.error("Error parsing message:", error);
      }
    });

    const sendToBackend = (eventType: string, eventPayload: any) => {
      if (ws && ws.readyState === WebSocket.OPEN) {
        console.log("event sent");
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
          if (event.type === action.type && action.payload) {
            sendToBackend(action.type, action.payload);
          }
        });

        //connect after login
        if (action.type === "auth/login/fulfilled") {
          console.log("try relogin");
          ws = new WebSocket("ws://127.0.0.1:3000");
        }
      }

      console.log({ action });

      next(action);
    };
  };
