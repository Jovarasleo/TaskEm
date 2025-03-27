import { ThunkDispatch } from "@reduxjs/toolkit";
import { Action, AnyAction, Dispatch, MiddlewareAPI } from "redux";
import { clientLoadContainers } from "../slices/containerReducer";
import { clientLoadProjects, clientSelectProject } from "../slices/projectReducer";
import { clientLoadTasks } from "../slices/taskReducer";

let firstload = true;

type AppDispatch = ThunkDispatch<Dispatch, unknown, AnyAction>;

export const onLoadMiddleware =
  (store: MiddlewareAPI<AppDispatch>) => (next: Dispatch) => (action: Action) => {
    if (firstload) {
      firstload = false;
      store.dispatch(clientLoadProjects());
      store.dispatch(clientLoadContainers());
      store.dispatch(clientLoadTasks());
      store.dispatch(clientSelectProject(store.getState().project.data[0]));
    }

    next(action);
  };
