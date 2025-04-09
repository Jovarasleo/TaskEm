import { ActionCreatorWithPayload, ThunkDispatch } from "@reduxjs/toolkit";
import { AnyAction, Dispatch, MiddlewareAPI } from "redux";
import { deleteEvent, getEvents, syncAllContainers, syncAllProjects, syncAllTasks } from "../../db";
import { clientLoadLocalProjects } from "../slices/projectReducer";
import { serverCreateTask, serverEditTask, serverMoveTask } from "../slices/taskReducer";
import { SocketAction, SocketActionType, SocketServerAction } from "../slices/types";

export type Subscribers = {
  [K in SocketActionType]: ActionCreatorWithPayload<() => void, SocketActionType>;
};
type AppDispatch = ThunkDispatch<Dispatch, unknown, AnyAction>;

const WEB_SOCKET_ENDPOINT = process.env.BACKEND_WS_ADDRESS as string;

const sendUserAction = (
  ws: WebSocket,
  actionType: SocketActionType,
  actionPayload: SocketAction["payload"]
) => {
  const message = {
    type: actionType,
    payload: actionPayload,
  };

  ws.send(JSON.stringify(message));
};

const syncAllData = async (ws: WebSocket) => {
  const allEvents = await getEvents();

  for (const userEvent of allEvents) {
    console.log({ userEvent });
    ws.send(JSON.stringify(userEvent.value));
    deleteEvent(userEvent.key);
  }

  ws.send(JSON.stringify({ type: "syncData" }));
};

export let ws: WebSocket | null = null;
export const socketMiddleware =
  (subscribers: Subscribers) => (store: MiddlewareAPI<AppDispatch>) => (next: Dispatch) => {
    const handleReceivedSocketEvents = (event: MessageEvent<string>) => {
      const parsedData: SocketServerAction = JSON.parse(event.data);
      const { type, payload } = parsedData;

      // "task/serverCreateTask"
      // "task/serverEditTask"
      // "task/serverDeleteTask"
      // "task/serverDeleteProjectTasks"
      // "container/serverCreateContainer"
      // "container/serverDeleteContainer"
      // "container/serverDeleteProjectContainers"
      // "project/serverCreateProject"
      // "project/serverEditProject"
      // "project/serverDeleteProject"

      //TODO Think of a better ALL around sync strategy
      try {
        switch (type) {
          case "task/serverCreateTask":
            store.dispatch(serverCreateTask(payload));
            break;
          case "task/serverEditTask":
            store.dispatch(serverEditTask(payload));
            break;
          case "task/serverMoveTask":
            store.dispatch(serverMoveTask(payload));
            break;
          case "project/serverLoadProjects":
            syncAllProjects(payload);
            break;
          case "container/serverLoadContainers":
            syncAllContainers(payload);
            break;
          case "task/serverLoadTasks":
            syncAllTasks(payload);
            store.dispatch(clientLoadLocalProjects());
            break;
        }
      } catch (error) {
        console.error("Error parsing message:", error);
      }
    };

    const onWebSocketOpen = async () => {
      console.log("WebSocket connected");
      if (ws && ws.readyState === WebSocket.OPEN) {
        await syncAllData(ws);
      }
    };

    const onWebSocketClosed = () => {
      console.warn("WebSocket closed");
    };

    const connectWebSocket = async () => {
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
    };

    return (action: SocketAction) => {
      if (action.type === "auth/isAuth/fulfilled" && action.payload) {
        console.log(action);
        connectWebSocket();
      }

      if (ws?.readyState !== WebSocket.OPEN) {
        return next(action);
      }

      if (action) {
        for (const key of Object.keys(subscribers) as Array<keyof typeof subscribers>) {
          const event = subscribers[key];
          if (event.type === action.type && action.payload) {
            sendUserAction(ws, action.type, action.payload);
          }
        }
      }

      return next(action);
    };
  };
