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

  test("MOVE_TASK_MISSING_CONTAINER", () => {
    const initialState: TaskContainers = {
      todo: [{ value: "test1", id: "1" }],
      progress: [],
      done: [],
    };

    const updatedActionMissingContainer = {
      type: "MOVE_TASK",
      toContainer: "",
      fromContainer: "",
      toIndex: 0,
      fromIndex: 0,
    };

    const updatedState = taskReducer(
      initialState,
      updatedActionMissingContainer
    );

    expect(updatedState).toStrictEqual({
      todo: [{ value: "test1", id: "1" }],
      progress: [],
      done: [],
    });
  });

  test("MOVE_TASK_TARGETS_SAME_TASK", () => {
    const initialState: TaskContainers = {
      todo: [{ value: "test1", id: "1" }],
      progress: [],
      done: [],
    };

    const updatedActionMissingContainer = {
      type: "MOVE_TASK",
      toContainer: "todo",
      fromContainer: "todo",
      toIndex: 0,
      fromIndex: 0,
    };

    const updatedState = taskReducer(
      initialState,
      updatedActionMissingContainer
    );

    expect(updatedState).toStrictEqual({
      todo: [{ value: "test1", id: "1" }],
      progress: [],
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

  test("SWITCH_PROJECT", () => {
    const initialState: TaskContainers = {
      todo: [],
      progress: [{ value: "test1", id: "1" }],
      done: [],
    };
    const switchProject = {
      type: "SWITCH_PROJECT",
      payload: {
        todo: [],
        progress: [{ value: "test2", id: "2" }],
        done: [{ value: "test2", id: "3" }],
      },
    };
    const updatedState = taskReducer(initialState, switchProject);

    expect(updatedState).toStrictEqual({
      todo: [],
      progress: [{ value: "test2", id: "2" }],
      done: [{ value: "test2", id: "3" }],
    });
  });

  test("DEFAULT", () => {
    const initialState: TaskContainers = {
      todo: [],
      progress: [{ value: "test1", id: "1" }],
      done: [],
    };
    const testDefault = {
      type: "",
    };
    const updatedState = taskReducer(initialState, testDefault);

    expect(updatedState).toStrictEqual({
      todo: [],
      progress: [{ value: "test1", id: "1" }],
      done: [],
    });
  });
});
