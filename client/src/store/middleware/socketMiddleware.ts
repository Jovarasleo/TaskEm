import { Dispatch, MiddlewareAPI } from "redux";
import { deleteEvent, EventData, getEvents } from "../../db";
import { userLoggedIn } from "../slices/authSlice";
import { getContainers } from "../slices/containerReducer";
import { getProjects } from "../slices/projectReducer";
import { getTasks, moveSocketTask } from "../slices/taskReducer";
import { AppAction, KnownActionTypes, Subscribers } from "./localStorageMiddleware";

const WEB_SOCKET_ENDPOINT = process.env.BACKEND_WS_ADDRESS as string;

const sendUserAction = (
  ws: WebSocket | null,
  actionType: KnownActionTypes,
  actionPayload: AppAction["payload"]
) => {
  if (ws && ws.readyState === WebSocket.OPEN) {
    const message = {
      type: actionType,
      payload: actionPayload,
    };

    const stingifiedMessage = JSON.stringify(message);
    ws.send(stingifiedMessage);
  } else {
    console.error("WebSocket not open. Cannot send message.");
  }
};

const synchroniseData = async (
  ws: WebSocket,
  deleteEventFromIdb: (eventId: string) => Promise<void>
) => {
  const allEvents: EventData[] = await getEvents();

  for (const userEvent of allEvents) {
    ws.send(JSON.stringify(userEvent));
    deleteEventFromIdb(userEvent.key.toString());
  }

  ws.send(JSON.stringify({ type: "syncData" }));
};

export let ws: WebSocket | null = null;
export const socketMiddleware =
  (subscribers: Subscribers) => (store: MiddlewareAPI<Dispatch>) => (next: Dispatch) => {
    const handleReceivedSocketEvents = (action: MessageEvent) => {
      const parsedData = JSON.parse(action.data);
      const { type, payload } = parsedData;

      try {
        if (type === "tasks/getTasks") {
          store.dispatch(getTasks(payload));
        }
        if (type === "container/getContainers") {
          store.dispatch(getContainers(payload));
        }
        if (type === "project/getProjects") {
          store.dispatch(getProjects(payload));
        }
        if (type === "task/moveTask") {
          store.dispatch(moveSocketTask(payload));
        }
      } catch (error) {
        console.error("Error parsing message:", error);
      }
    };

    const onWebSocketOpen = async () => {
      console.log("WebSocket connected");
      if (ws && ws.readyState === WebSocket.OPEN) {
        await synchroniseData(ws, deleteEvent);
        store.dispatch(userLoggedIn());
      }
    };

    const onWebSocketClosed = () => {
      console.warn("WebSocket closed");
    };

    if (ws) {
      ws.onerror = ws.onopen = ws.onclose = null;

      ws.removeEventListener("message", handleReceivedSocketEvents);
      ws.removeEventListener("open", onWebSocketOpen);
      ws.removeEventListener("close", onWebSocketClosed);
      ws.close();
    }

    ws = new WebSocket(WEB_SOCKET_ENDPOINT);

    ws.addEventListener("message", handleReceivedSocketEvents);
    ws.addEventListener("open", onWebSocketOpen);
    ws.addEventListener("close", onWebSocketClosed);

    return (action: AppAction) => {
      console.log(document.cookie);
      if (!store.getState().auth.loggedIn) {
        console.log({ loggedIn: store.getState().auth.loggedIn });
        return next(action);
      }

      next(userLoggedIn(false));

      console.log({ loggedIn: store.getState().auth.loggedIn });

      if (action) {
        for (const key of Object.keys(subscribers) as Array<keyof typeof subscribers>) {
          const event = subscribers[key];
          if (event.type === action.type && action.payload) {
            sendUserAction(ws, action.type, action.payload);
          }
        }

        // if (action.type === "auth/login/fulfilled") {
        //   socketMiddleware(subscribers)(store)(next);
        // }
      }

      next(action);
    };
  };
