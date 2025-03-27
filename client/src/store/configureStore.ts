import { configureStore } from "@reduxjs/toolkit";
import { updateIdbMiddleware } from "./middleware/updateIdbMiddleware";
import { onLoadMiddleware } from "./middleware/onLoadMiddleware";
import { socketMiddleware } from "./middleware/socketMiddleware";
import authReducer from "./slices/authSlice";
import containerReducer, {
  clientCreateContainer,
  clientDeleteContainer,
  clientDeleteProjectContainers,
} from "./slices/containerReducer";
import projectReducer, {
  clientCreateProject,
  clientDeleteProject,
  clientEditProject,
} from "./slices/projectReducer";
import taskReducer, {
  clientCreateTask,
  clientEditTask,
  clientDeleteTask,
  clientMoveTask,
  clientDeleteProjectTasks,
} from "./slices/taskReducer";

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
      }),
      socketMiddleware({
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
      })
    ),
});

store.dispatch({ type: "INITIAL_LOAD_ACTION" });

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
