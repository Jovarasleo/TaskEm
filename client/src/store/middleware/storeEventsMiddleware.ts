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
import { uid } from "../../util/uid";
import { Project, Task, TaskContainer } from "../../views/taskManager/model/task";
import { ws } from "./socketMiddleware";

type TaskAction =
  | { type: "task/createTask"; payload: Task }
  | { type: "task/editTask"; payload: Task }
  | { type: "task/moveTask"; payload: Task }
  | { type: "task/deleteTask"; payload: Task };

type ContainerAction =
  | { type: "container/createContainer"; payload: TaskContainer }
  | { type: "container/deleteContainer"; payload: TaskContainer }
  | { type: "container/getContainers"; payload: TaskContainer[] };

type ProjectAction =
  | { type: "project/createProject"; payload: Project }
  | { type: "project/renameProject"; payload: Project }
  | { type: "project/setProject"; payload: Project }
  | { type: "project/deleteProject"; payload: Project };

type AppAction = TaskAction | ContainerAction | ProjectAction;

type KnownActionTypes =
  | "task/createTask"
  | "task/editTask"
  | "task/deleteTask"
  | "task/moveTask"
  | "container/createContainer"
  | "container/deleteContainer"
  | "container/getContainers"
  | "project/createProject"
  | "project/renameProject"
  | "project/setProject"
  | "project/deleteProject";

type Subscribers = {
  [K in KnownActionTypes]: ActionCreatorWithPayload<() => void, KnownActionTypes>;
};

export const storeEventsMiddleware = (subscribers: Subscribers) => () => (next: Dispatch) => {
  return async (action: AppAction) => {
    if (action) {
      for (const key of Object.keys(subscribers) as Array<keyof typeof subscribers>) {
        const event = subscribers[key];

        if (event.type === action.type) {
          const eventId = uid();

          if (ws?.readyState !== WebSocket.OPEN) {
            await storeEvents({ ...action, id: eventId });
          }

          switch (action.type) {
            case "task/createTask":
            case "task/editTask":
            case "task/moveTask":
              console.log({ payload: action.payload });
              setTask(action.payload);
              break;
            case "task/deleteTask":
              deleteTask(action.payload);
              break;
            case "container/createContainer":
              setContainer(action.payload);
              break;
            case "container/deleteContainer":
              deleteContainer(action.payload);
              break;
            case "container/getContainers":
              () => console.log("what");
              break;
            case "project/createProject":
            case "project/renameProject":
              setProject(action.payload);
              break;
            case "project/setProject":
              setProject(action.payload);
              break;
            case "project/deleteProject":
              deleteProject(action.payload);
              break;

            default:
              break;
          }
        }
      }
    }

    next(action);
  };
};
