import { Dispatch } from "redux";
import {
  deleteContainers,
  deleteProject,
  deleteTask,
  setContainers,
  setProject,
  setTask,
  storeEvents,
} from "../../db";
import { uid } from "../../util/uid";
import { Project, Task } from "../../views/taskManager/model/task";
import { ws } from "./socketMiddleware";

export const storeEventsMiddleware = (subscribers: any) => () => (next: Dispatch) => {
  return async (action: any) => {
    if (action) {
      for (const key of Object.keys(subscribers)) {
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
            case "project/setProjects":
              action.payload.forEach((project: Project) => setProject(project));
              break;
            case "container/getContainers":
              setContainers(action.payload);
              break;
            case "task/getSocketTasks":
              action.payload.data.forEach((task: Task) => setTask(task));
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
