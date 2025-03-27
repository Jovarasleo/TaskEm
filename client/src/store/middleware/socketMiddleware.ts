import { Dispatch, MiddlewareAPI } from "redux";
import { deleteEvent, EventData, getEvents } from "../../db";
import { userLoggedIn } from "../slices/authSlice";
import { ServerAction, UpdateDataClientAction, UpdateDataClientActionTypes } from "../slices/types";
import { Subscribers } from "./updateIdbMiddleware";
import { serverLoadTasks, serverMoveTask } from "../slices/taskReducer";
import { serverLoadContainers } from "../slices/containerReducer";
import { serverLoadProjects } from "../slices/projectReducer";

const WEB_SOCKET_ENDPOINT = process.env.BACKEND_WS_ADDRESS as string;

const sendUserAction = (
  ws: WebSocket | null,
  actionType: UpdateDataClientActionTypes,
  actionPayload: UpdateDataClientAction["payload"]
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

const synchroniseData = async (ws: WebSocket) => {
  const allEvents: EventData[] = await getEvents();

  for (const userEvent of allEvents) {
    console.log({ userEvent });
    ws.send(JSON.stringify(userEvent.value));
    deleteEvent(userEvent.key);
  }

  ws.send(JSON.stringify({ type: "syncData" }));
};

export let ws: WebSocket | null = null;
export const socketMiddleware =
  (subscribers: Subscribers) => (store: MiddlewareAPI<Dispatch>) => (next: Dispatch) => {
    const handleReceivedSocketEvents = (event: MessageEvent<string>) => {
      const parsedData: ServerAction = JSON.parse(event.data);
      const { type, payload } = parsedData;

      try {
        if (type === "task/serverLoadTasks") {
          store.dispatch(serverLoadTasks(payload));
        }
        if (type === "container/serverLoadContainers") {
          store.dispatch(serverLoadContainers(payload));
        }
        if (type === "project/serverLoadProjects") {
          store.dispatch(serverLoadProjects(payload));
        }
        if (type === "task/serverMoveTask") {
          store.dispatch(serverMoveTask(payload));
        }
      } catch (error) {
        console.error("Error parsing message:", error);
      }
    };

    const onWebSocketOpen = async () => {
      console.log("WebSocket connected");
      if (ws && ws.readyState === WebSocket.OPEN) {
        await synchroniseData(ws);
        store.dispatch(userLoggedIn(true));
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

    return (action: UpdateDataClientAction) => {
      if (!store.getState().auth.loggedIn) {
        return next(action);
      }

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
