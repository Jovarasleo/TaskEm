import { configureStore } from "@reduxjs/toolkit";
import { onLoadMiddleware } from "./middleware/onLoadMiddleware";
import { socketMiddleware } from "./middleware/socketMiddleware";
import { updateIdbMiddleware } from "./middleware/updateIdbMiddleware";
import authReducer from "./slices/authSlice";
import containerReducer, {
  clientCreateContainer,
  clientDeleteContainer,
  clientDeleteProjectContainers,
  serverCreateContainer,
  serverDeleteContainer,
  serverDeleteProjectContainers,
} from "./slices/containerReducer";
import projectReducer, {
  clientCreateProject,
  clientDeleteProject,
  clientEditProject,
  serverCreateProject,
  serverDeleteProject,
  serverEditProject,
} from "./slices/projectReducer";
import taskReducer, {
  clientCreateTask,
  clientDeleteProjectTasks,
  clientDeleteTask,
  clientEditTask,
  clientMoveTask,
  serverCreateTask,
  serverDeleteProjectTasks,
  serverDeleteTask,
  serverEditTask,
  serverMoveTask,
} from "./slices/taskReducer";

//updateIdbMiddleware takes client and server actions
//socketMiddleware only subscribes to client actions and dispatches server actions

const store = configureStore({
  reducer: {
    auth: authReducer,
    task: taskReducer,
    container: containerReducer,
    project: projectReducer,
  },
  middleware: (gDM) =>
    gDM().concat(
      onLoadMiddleware,
      updateIdbMiddleware({
        "task/clientCreateTask": clientCreateTask,
        "task/clientEditTask": clientEditTask,
        "task/clientDeleteTask": clientDeleteTask,
        "task/clientMoveTask": clientMoveTask,
        "task/clientDeleteProjectTasks": clientDeleteProjectTasks,
        "container/clientCreateContainer": clientCreateContainer,
        "container/clientDeleteContainer": clientDeleteContainer,
        "container/clientDeleteProjectContainers": clientDeleteProjectContainers,
        "project/clientCreateProject": clientCreateProject,
        "project/clientEditProject": clientEditProject,
        "project/clientDeleteProject": clientDeleteProject,

        "task/serverCreateTask": serverCreateTask,
        "task/serverEditTask": serverEditTask,
        "task/serverDeleteTask": serverDeleteTask,
        "task/serverMoveTask": serverMoveTask,
        "task/serverDeleteProjectTasks": serverDeleteProjectTasks,
        "container/serverCreateContainer": serverCreateContainer,
        "container/serverDeleteContainer": serverDeleteContainer,
        "container/serverDeleteProjectContainers": serverDeleteProjectContainers,
        "project/serverCreateProject": serverCreateProject,
        "project/serverEditProject": serverEditProject,
        "project/serverDeleteProject": serverDeleteProject,
      }),
      socketMiddleware({
        "task/clientCreateTask": clientCreateTask,
        "task/clientEditTask": clientEditTask,
        "task/clientDeleteTask": clientDeleteTask,
        "task/clientMoveTask": clientMoveTask,
        "container/clientCreateContainer": clientCreateContainer,
        "container/clientDeleteContainer": clientDeleteContainer,
        "project/clientCreateProject": clientCreateProject,
        "project/clientEditProject": clientEditProject,
        "project/clientDeleteProject": clientDeleteProject,
      })
    ),
});

store.dispatch({ type: "INITIAL_LOAD_ACTION" });

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
