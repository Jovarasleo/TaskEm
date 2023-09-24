import { configureStore } from "@reduxjs/toolkit";
import projectReducer from "./slices/projectReducer";
import taskReducer from "./slices/taskReducer";
import containerReducer from "./slices/containerReducer";
import { userApi } from "../api/user";

const store = configureStore({
  reducer: {
    task: taskReducer,
    container: containerReducer,
    project: projectReducer,
    [userApi.reducerPath]: userApi.reducer,
  },
  middleware: (gDM) => gDM().concat(userApi.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;

export default store;
