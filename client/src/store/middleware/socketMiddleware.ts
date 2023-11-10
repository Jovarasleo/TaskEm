import { Dispatch, MiddlewareAPI } from "redux";
import { getSocketTasks, moveSocketTask, moveTask } from "../slices/taskReducer";
import { deleteEvent, getEvents } from "../../db";
import { setSocketContainers } from "../slices/containerReducer";
import { setProjects } from "../slices/projectReducer";
import { userLoggedIn } from "../slices/authSlice";

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

    const synchroniseData = async (ws: WebSocket) => {
      const allEvents: any = await getEvents();

      for (const userEvent of allEvents) {
        ws.send(JSON.stringify(userEvent));
        deleteEvent(userEvent.id);
      }

      ws.send(JSON.stringify({ type: "syncData" }));
    };

    ws = new WebSocket("ws://127.0.0.1:3000");

    ws.addEventListener("open", async () => {
      if (ws && ws.readyState === WebSocket.OPEN) {
        synchroniseData(ws);
        store.dispatch(userLoggedIn());
      }
    });

    ws.addEventListener("message", (event) => {
      const parsedData = JSON.parse(event.data);
      console.log({ parsedData });
      const { type, payload } = parsedData;
      try {
        if (type === "tasks/getTasks") {
          store.dispatch(getSocketTasks(payload));
        }
        if (type === "task/moveTask") {
          store.dispatch(moveSocketTask(payload[0]));
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
        const message = {
          type: eventType,
          payload: eventPayload,
        };
        const stingifiedMessage = JSON.stringify(message);
        ws.send(stingifiedMessage);
      } else {
        console.error("WebSocket not open. Cannot send message.");
      }
    };

    return (action: any) => {
      if (action) {
        Object.keys(subscribers).forEach((key: string) => {
          const event = subscribers[key];
          if (event.type === action.type && action.payload) {
            sendToBackend(action.type, action.payload);
          }
        });

        //connect after login
        if (action.type === "auth/login/fulfilled") {
          console.log("try relogin");
          ws = new WebSocket("ws://127.0.0.1:3000");
          ws.addEventListener("open", async () => {
            if (ws && ws.readyState === WebSocket.OPEN) {
              synchroniseData(ws);
            }
          });
        }
      }

      next(action);
    };
  };
