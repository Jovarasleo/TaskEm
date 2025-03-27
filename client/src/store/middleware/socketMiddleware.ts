import { ActionCreatorWithPayload, ThunkDispatch } from "@reduxjs/toolkit";
import { AnyAction, Dispatch, MiddlewareAPI } from "redux";
import {
  deleteEvent,
  EventData,
  getEvents,
  syncAllContainers,
  syncAllProjects,
  syncAllTasks,
} from "../../db";
import { userLoggedIn } from "../slices/authSlice";
import { serverCreateTask, serverEditTask, serverMoveTask } from "../slices/taskReducer";
import { SocketAction, SocketActionType, SocketServerAction } from "../slices/types";
import { clientLoadLocalProjects } from "../slices/projectReducer";

export type Subscribers = {
  [K in SocketActionType]: ActionCreatorWithPayload<() => void, SocketActionType>;
};

const WEB_SOCKET_ENDPOINT = process.env.BACKEND_WS_ADDRESS as string;

const sendUserAction = (
  ws: WebSocket | null,
  actionType: SocketActionType,
  actionPayload: SocketAction["payload"]
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

type AppDispatch = ThunkDispatch<Dispatch, unknown, AnyAction>;

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

    return (action: SocketAction) => {
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
