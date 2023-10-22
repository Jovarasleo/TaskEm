import { Action, Dispatch, MiddlewareAPI } from "redux";
import { getDataFromIndexedDB } from "../slices/taskReducer";
import { getProjectFromIdb } from "../slices/projectReducer";
import { getContainersFromIdb } from "../slices/containerReducer";

let firstload = true;

export const onLoadMiddleware =
  (store: MiddlewareAPI<any>) => (next: Dispatch) => (action: Action) => {
    if (firstload) {
      firstload = false;

      store.dispatch(getDataFromIndexedDB());
      store.dispatch(getProjectFromIdb());
      store.dispatch(getContainersFromIdb());
    }
    next(action);
  };
