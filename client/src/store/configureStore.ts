import { configureStore } from "@reduxjs/toolkit";
import { localStorageMiddleware } from "./middleware/localStorageMiddleware";
import { onLoadMiddleware } from "./middleware/onLoadMiddleware";
import { socketMiddleware } from "./middleware/socketMiddleware";
import authReducer from "./slices/authSlice";
import containerReducer, {
  createContainer,
  deleteContainer,
  deleteContainersByProject,
} from "./slices/containerReducer";
import projectReducer, {
  createProject,
  deleteProject,
  renameProject,
  selectProject,
} from "./slices/projectReducer";
import taskReducer, { createTask, deleteTask, editTask, moveTask } from "./slices/taskReducer";

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
      localStorageMiddleware({
        "task/createTask": createTask,
        "task/editTask": editTask,
        "task/deleteTask": deleteTask,
        "task/moveTask": moveTask,
        "container/createContainer": createContainer,
        "container/deleteContainer": deleteContainer,
        "project/createProject": createProject,
        "project/renameProject": renameProject,
        "project/deleteProject": deleteProject,
        "container/deleteContainersByProject": deleteContainersByProject,
      }),
      socketMiddleware({
        "task/createTask": createTask,
        "task/editTask": editTask,
        "task/deleteTask": deleteTask,
        "task/moveTask": moveTask,
        "container/createContainer": createContainer,
        "container/deleteContainer": deleteContainer,
        "project/selectProject": selectProject,
        "project/createProject": createProject,
        "project/renameProject": renameProject,
        "project/deleteProject": deleteProject,
      })
    ),
});

store.dispatch({ type: "INITIAL_LOAD_ACTION" });

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
