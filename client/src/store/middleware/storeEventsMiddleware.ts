import { Dispatch, MiddlewareAPI } from "redux";
import {
  removeProject,
  setContainers,
  setProject,
  setTask,
  storeEvents,
  deleteContainers,
} from "../../db";
import { userOnline } from "../..";

export const storeEventsMiddleware =
  (subscribers: any) => (store: MiddlewareAPI<Dispatch>) => (next: Dispatch) => {
    return (action: any) => {
      if (action) {
        Object.keys(subscribers).forEach((key: any) => {
          const event = subscribers[key];
          if (event.type === action.type) {
            console.log(action.type);

            // if (!userOnline) {
            storeEvents(action);
            // }

            switch (action.type) {
              case "task/createTask":
              case "task/moveTask":
                setTask(action.payload);
                break;
              case "container/createContainer":
                setContainers(action.payload);
                break;
              case "project/createProject":
              case "project/renameProject":
                setProject(action.payload);
                break;
              case "project/deleteProject":
                removeProject(action.payload);
                break;
              case "container/deleteContainers":
                deleteContainers(action.payload);
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
