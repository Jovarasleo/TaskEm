import { ThunkDispatch } from "@reduxjs/toolkit";
import { Action, AnyAction, Dispatch, MiddlewareAPI } from "redux";
import { clientLoadProjects } from "../slices/projectReducer";

let firstload = true;

type AppDispatch = ThunkDispatch<Dispatch, unknown, AnyAction>;

export const onLoadMiddleware =
  (store: MiddlewareAPI<AppDispatch>) => (next: Dispatch) => (action: Action) => {
    if (firstload) {
      firstload = false;
      store.dispatch(clientLoadProjects());
    }

    next(action);
  };
