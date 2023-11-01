import { Dispatch, MiddlewareAPI } from "redux";
import {
  deleteProject,
  setContainers,
  setProject,
  setTask,
  storeEvents,
  deleteContainers,
  deleteTask,
} from "../../db";
import { userOnline } from "../..";
import { uid } from "../../util/uid";
import { ws } from "./socketMiddleware";

export const storeEventsMiddleware =
  (subscribers: any) => (store: MiddlewareAPI<Dispatch>) => (next: Dispatch) => {
    return (action: any) => {
      if (action) {
        Object.keys(subscribers).forEach((key: any) => {
          const event = subscribers[key];
          if (event.type === action.type) {
            const eventId = uid();

            if (ws?.readyState !== WebSocket.OPEN) {
              storeEvents({ ...action, id: eventId });
            }

            //save data
            console.log(action);
            switch (action.type) {
              case "task/createTask":
              case "task/editTask":
              case "task/moveTask":
                setTask(action.payload);
                break;

              case "task/deleteTask":
                deleteTask(action.payload);
                break;

              case "container/createContainer":
                setContainers(action.payload);
                break;

              case "container/deleteContainers":
                deleteContainers(action.payload);
                break;

              case "project/createProject":
              case "project/renameProject":
                setProject(action.payload);
                break;

              case "project/deleteProject":
                deleteProject(action.payload);
                break;

              default:
                break;
            }
          }
        });
      }

      next(action);
    };
  };
