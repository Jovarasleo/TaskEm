import { combineReducers, configureStore, createListenerMiddleware } from "@reduxjs/toolkit";
import projectReducer, {
  createProject,
  selectProject,
  setProjects,
  syncProjects,
} from "./slices/projectReducer";
import taskReducer, { createTask, editTask, removeTask, moveTask } from "./slices/taskReducer";
import containerReducer from "./slices/containerReducer";
import authReducer, { loginUser } from "./slices/authSlice";
import { userApi } from "../api/user";
import { projectsApi } from "../api/project";
import { socketMiddleware } from "./middleware/socketMiddleware";
import { initializeSocket } from "./middleware/socketManager";

// const rootReducer = combineReducers({
//   auth: authReducer,
//   task: taskReducer,
//   container: containerReducer,
//   project: projectReducer,
// });

// const listenerMiddleware = createListenerMiddleware();

// listenerMiddleware.startListening({
//   actionCreator: createTask,
//   effect: async (action, listenerApi) => {
//     // Run whatever additional side-effect-y logic you want here
//     const socket = initializeSocket("cat");
//     socket.on("connect", () => {
//       console.log("this runs twice?", socket);
//       console.log(socket?.id);
//     });
//   },
// });

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
