import { ActionCreatorWithPayload } from "@reduxjs/toolkit";
import { Dispatch } from "redux";
import {
  deleteContainer,
  deleteProject,
  deleteTask,
  setContainer,
  setProject,
  setTask,
  storeEvents,
} from "../../db";
import { ws } from "./socketMiddleware";
import { IdbAction, IdbActionType } from "../slices/types";

export type Subscribers = {
  [K in IdbActionType]: ActionCreatorWithPayload<() => void, IdbActionType>;
};

export const updateIdbMiddleware = (subscribers: Subscribers) => () => (next: Dispatch) => {
  return async (action: IdbAction) => {
    for (const key of Object.keys(subscribers) as Array<keyof typeof subscribers>) {
      const event = subscribers[key];

      if (event.type !== action.type) {
        continue;
      }

      if (ws?.readyState !== WebSocket.OPEN) {
        await storeEvents(action);
      }

      switch (action.type) {
        case "task/clientCreateTask":
        case "task/clientEditTask":
        case "task/clientMoveTask":
          setTask(action.payload);
          break;
        case "task/clientDeleteTask":
          deleteTask(action.payload);
          break;
        case "container/clientCreateContainer":
          setContainer(action.payload);
          break;
        case "container/clientDeleteContainer":
          deleteContainer(action.payload);
          break;
        case "project/clientCreateProject":
          console.log(action.payload);
          setProject(action.payload.project);
          action.payload.containers.forEach((container) => setContainer(container));
          break;
        case "project/clientEditProject":
          setProject(action.payload);
          break;
        case "project/clientDeleteProject":
          deleteProject(action.payload);
          break;
        case "container/clientDeleteProjectContainers": {
          console.log({ action: action.payload.projectId });
          break;
        }
        default:
          break;
      }
    }
    next(action);
  };
};
