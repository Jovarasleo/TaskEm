import { configureStore } from "@reduxjs/toolkit";
import { projectsApi } from "../api/project";
import { userApi } from "../api/user";
import { socketMiddleware } from "./middleware/socketMiddleware";
import { onLoadMiddleware } from "./middleware/onLoadMiddleware";
import authReducer from "./slices/authSlice";
import containerReducer from "./slices/containerReducer";
import projectReducer from "./slices/projectReducer";
import taskReducer, { createTask, editTask, moveTask, removeTask } from "./slices/taskReducer";
import { createProject, renameProject, deleteProject } from "./slices/projectReducer";
import { createContainer, deleteContainers } from "./slices/containerReducer";
import { storeEventsMiddleware } from "./middleware/storeEventsMiddleware";

const store = configureStore({
  reducer: {
    auth: authReducer,
    task: taskReducer,
    container: containerReducer,
    project: projectReducer,
    [userApi.reducerPath]: userApi.reducer,
    [projectsApi.reducerPath]: projectsApi.reducer,
  },
  middleware: (gDM) =>
    gDM().concat(
      userApi.middleware,
      projectsApi.middleware,
      onLoadMiddleware,
      storeEventsMiddleware({
        createTask,
        editTask,
        removeTask,
        moveTask,
        createProject,
        createContainer,
        deleteContainers,
        renameProject,
        deleteProject,
      }),
      socketMiddleware({ createTask, editTask, removeTask, moveTask })
    ),
});

export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;

export default store;

//         The naming can clearly be challenged, but in short, "listeners" are
//         what's going to be dispatched in your Redux store when the server sends
//         mapped message. In this case, when the server sends a "onCardPlayed"
//         message, we dispatch the cardPlayedActionCreator action.
//         listeners: [],
//         Simple and dumb way to say, when I dispatch this action type, send the
//         action's payload to the server.
//         subscribers: [moveTask, createTask],
