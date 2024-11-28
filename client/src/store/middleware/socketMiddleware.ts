import { Dispatch, MiddlewareAPI } from "redux";
import { deleteEvent, getEvents } from "../../db";
import { userLoggedIn } from "../slices/authSlice";
import { getContainers } from "../slices/containerReducer";
import { setProjects } from "../slices/projectReducer";
import { getSocketTasks, moveSocketTask } from "../slices/taskReducer";

const ENDPOINT_URL = process.env.BACKEND_WS_ADDRESS as string;

export let ws: WebSocket | null = null;
export const socketMiddleware =
  (subscribers: any) => (store: MiddlewareAPI<Dispatch>) => (next: Dispatch) => {
    const wsEventHandler = (event: MessageEvent<any>) => {
      const parsedData = JSON.parse(event.data);
      const { type, payload } = parsedData;
      console.log({ type, payload });
      try {
        if (type === "tasks/getTasks") {
          store.dispatch(getSocketTasks(payload));
        }
        if (type === "task/moveTask") {
          store.dispatch(moveSocketTask(payload[0]));
        }
        if (type === "container/getContainers") {
          store.dispatch(getContainers(payload));
        }
        if (type === "project/getProjects") {
          store.dispatch(setProjects(payload));
        }
      } catch (error) {
        console.error("Error parsing message:", error);
      }
    };

    const openHandler = async () => {
      console.log("WebSocket connected");
      if (ws && ws.readyState === WebSocket.OPEN) {
        await synchroniseData(ws);
        store.dispatch(userLoggedIn());
      }
    };

    const closeHandler = () => {
      console.warn("WebSocket closed");
    };

    if (ws) {
      ws.onerror = ws.onopen = ws.onclose = null;

      ws.removeEventListener("message", wsEventHandler);
      ws.removeEventListener("open", openHandler);
      ws.removeEventListener("close", closeHandler);
      ws.close();
    }

    const synchroniseData = async (ws: WebSocket) => {
      const allEvents: any = await getEvents();

      for (const userEvent of allEvents) {
        console.log({ userEvent });
        ws.send(JSON.stringify(userEvent));
        deleteEvent(userEvent.key);
      }

      ws.send(JSON.stringify({ type: "syncData" }));
    };

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

    ws = new WebSocket(ENDPOINT_URL);

    ws.addEventListener("message", wsEventHandler);
    ws.addEventListener("open", openHandler);
    ws.addEventListener("close", closeHandler);

    return (action: any) => {
      if (!document.cookie) {
        return next(action);
      }

      if (action) {
        Object.keys(subscribers).forEach((key: string) => {
          const event = subscribers[key];
          if (event.type === action.type && action.payload) {
            sendToBackend(action.type, action.payload);
          }
        });

        //connect after login
        if (action.type === "auth/login/fulfilled") {
          socketMiddleware(subscribers)(store)(next);
        }
      }

      next(action);
    };
  };
