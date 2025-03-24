import { ThunkDispatch } from "@reduxjs/toolkit";
import { Action, AnyAction, Dispatch, MiddlewareAPI } from "redux";
import { getContainersFromIdb } from "../slices/containerReducer";
import { getProjectFromIdb, selectProject } from "../slices/projectReducer";
import { getTasksFromIdb } from "../slices/taskReducer";

let firstload = true;

type AppDispatch = ThunkDispatch<Dispatch, unknown, AnyAction>;

export const onLoadMiddleware =
  (store: MiddlewareAPI<AppDispatch>) => (next: Dispatch) => (action: Action) => {
    if (firstload) {
      firstload = false;
      store.dispatch(getTasksFromIdb());
      store.dispatch(getContainersFromIdb());
      store.dispatch(getProjectFromIdb());
      store.dispatch(selectProject(store.getState().project.data[0]));
    }

    next(action);
  };
