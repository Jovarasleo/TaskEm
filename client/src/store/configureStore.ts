import { configureStore } from "@reduxjs/toolkit";
import projectReducer from "./slices/projectReducer";
import taskReducer from "./slices/taskReducer";
import containerReducer from "./slices/containerReducer";
import authReducer from "./slices/authSlice";
import { userApi } from "../api/user";
import { projectsApi } from "../api/project";

const store = configureStore({
  reducer: {
    auth: authReducer,
    task: taskReducer,
    container: containerReducer,
    project: projectReducer,
    [userApi.reducerPath]: userApi.reducer,
    [projectsApi.reducerPath]: projectsApi.reducer,
  },
  middleware: (gDM) => gDM().concat(userApi.middleware, projectsApi.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;

export default store;
