import { configureStore } from "@reduxjs/toolkit";
import { socketMiddleware } from "./middleware/socketMiddleware";
import { onLoadMiddleware } from "./middleware/onLoadMiddleware";
import authReducer from "./slices/authSlice";
import containerReducer from "./slices/containerReducer";
import projectReducer from "./slices/projectReducer";
import taskReducer, { createTask, editTask, moveTask, deleteTask } from "./slices/taskReducer";
import {
  createProject,
  renameProject,
  deleteProject,
  selectProject,
  setProject,
} from "./slices/projectReducer";
import { createContainer, deleteContainer, getContainers } from "./slices/containerReducer";
import { storeEventsMiddleware } from "./middleware/storeEventsMiddleware";

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
      storeEventsMiddleware({
        "task/createTask": createTask,
        "task/editTask": editTask,
        "task/deleteTask": deleteTask,
        "task/moveTask": moveTask,
        "container/createContainer": createContainer,
        "container/getContainers": getContainers,
        "container/deleteContainer": deleteContainer,
        "project/createProject": createProject,
        "project/setProject": setProject,
        "project/renameProject": renameProject,
        "project/deleteProject": deleteProject,
      }),
      socketMiddleware({
        createTask,
        editTask,
        deleteTask,
        moveTask,
        createProject,
        createContainer,
        deleteContainer,
        selectProject,
        deleteProject,
      })
    ),
});

store.dispatch({ type: "INITIAL_LOAD_ACTION" });

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
