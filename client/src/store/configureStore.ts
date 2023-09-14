import { configureStore } from "@reduxjs/toolkit";
import projectReducer from "./slices/projectReducer";
import taskReducer from "./slices/taskReducer";
import containerReducer from "./slices/containerReducer";

const store = configureStore({
  reducer: {
    task: taskReducer,
    container: containerReducer,
    project: projectReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;

export default store;
