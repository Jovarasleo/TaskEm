import { configureStore } from "@reduxjs/toolkit";
import { socketMiddleware } from "./middleware/socketMiddleware";
import { onLoadMiddleware } from "./middleware/onLoadMiddleware";
import authReducer from "./slices/authSlice";
import containerReducer from "./slices/containerReducer";
import projectReducer from "./slices/projectReducer";
import taskReducer, {
  createTask,
  editTask,
  moveTask,
  deleteTask,
  getSocketTasks,
} from "./slices/taskReducer";
import {
  createProject,
  renameProject,
  deleteProject,
  selectProject,
  setProjects,
} from "./slices/projectReducer";
import { createContainer, deleteContainers, setSocketContainers } from "./slices/containerReducer";
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
        createTask,
        editTask,
        deleteTask,
        moveTask,
        getSocketTasks,
        createProject,
        createContainer,
        deleteContainers,
        setProjects,
        renameProject,
        deleteProject,
        setSocketContainers,
      }),
      socketMiddleware({
        createTask,
        editTask,
        deleteTask,
        moveTask,
        createProject,
        createContainer,
        selectProject,
        deleteProject,
      })
    ),
});

store.dispatch({ type: "INITIAL_LOAD_ACTION" });

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
