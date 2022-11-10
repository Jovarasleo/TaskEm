import { cleanup } from "@testing-library/react";
import { taskReducer } from "../taskReducer";
import { TaskContainers } from "../../model/task";
import "@testing-library/jest-dom";

afterEach(() => {
  cleanup();
});

describe("Test taskReducer", () => {
  test("ADD_TASK", () => {
    const initialState: TaskContainers = {
      todo: [],
      progress: [],
      done: [],
    };
    const updateAction = {
      type: "ADD_TASK",
      value: "test1",
      id: "1",
    };
    const updatedState = taskReducer(initialState, updateAction);
    expect(updatedState).toStrictEqual({
      todo: [{ value: "test1", id: "1" }],
      progress: [],
      done: [],
    });
  });

  test("DELETE_TASK", () => {
    const initialState: TaskContainers = {
      todo: [],
      progress: [{ value: "test1", id: "1" }],
      done: [],
    };
    const updateAction = {
      type: "DELETE_TASK",
      id: "1",
      container: "progress",
    };
    const updatedState = taskReducer(initialState, updateAction);

    expect(updatedState).toStrictEqual({
      todo: [],
      progress: [],
      done: [],
    });
  });

  test("MOVE_TASK", () => {
    const initialState: TaskContainers = {
      todo: [{ value: "test1", id: "1" }],
      progress: [],
      done: [],
    };
    const updateAction = {
      type: "MOVE_TASK",
      toContainer: "progress",
      fromContainer: "todo",
      toIndex: 0,
      fromIndex: 0,
    };
    const updatedState = taskReducer(initialState, updateAction);

    expect(updatedState).toStrictEqual({
      todo: [],
      progress: [{ value: "test1", id: "1" }],
      done: [],
    });
  });

  test("SAVE_TASK", () => {
    const initialState: TaskContainers = {
      todo: [],
      progress: [{ value: "test1", id: "1" }],
      done: [],
    };
    const updateAction = {
      type: "SAVE_TASK",
      container: "progress",
      value: "test1 modified",
      id: "1",
    };
    const updatedState = taskReducer(initialState, updateAction);

    expect(updatedState).toStrictEqual({
      todo: [],
      progress: [{ value: "test1 modified", id: "1" }],
      done: [],
    });
  });
});
