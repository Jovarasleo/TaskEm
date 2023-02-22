import { cleanup } from "@testing-library/react";
import { taskReducer } from "../taskReducer";
import { TaskContainers, TaskManager } from "../../model/task";
import "@testing-library/jest-dom";

afterEach(() => {
  cleanup();
});

describe("Test taskReducer", () => {
  test("ADD_TASK", () => {
    const initialState: TaskManager = {
      tasks: {
        todo: [],
        progress: [],
        done: [],
      },
      count: 1,
    };
    const updateAction = {
      type: "ADD_TASK",
      value: "test1",
      id: "1",
    };
    const updatedState = taskReducer(initialState, updateAction);
    expect(updatedState).toStrictEqual({
      tasks: {
        todo: [{ value: "test1", id: "1", count: 1 }],
        progress: [],
        done: [],
      },
      count: 1,
    });
  });

  test("DELETE_TASK", () => {
    const initialState: TaskManager = {
      tasks: {
        todo: [],
        progress: [{ value: "test1", id: "1", count: 1 }],
        done: [],
      },
      count: 1,
    };
    const updateAction = {
      type: "DELETE_TASK",
      id: "1",
      container: "progress",
    };
    const updatedState = taskReducer(initialState, updateAction);

    expect(updatedState).toStrictEqual({
      tasks: {
        todo: [],
        progress: [],
        done: [],
      },
      count: 1,
    });
  });

  test("MOVE_TASK", () => {
    const initialState: TaskManager = {
      tasks: {
        todo: [{ value: "test1", id: "1", count: 1 }],
        progress: [],
        done: [],
      },
      count: 1,
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
      tasks: {
        todo: [],
        progress: [{ value: "test1", id: "1", count: 1 }],
        done: [],
      },
      count: 1,
    });

    //task missing container values and silently fails
    const updatedActionMissingContainer = {
      type: "MOVE_TASK",
      toContainer: "",
      fromContainer: "",
      toIndex: 0,
      fromIndex: 0,
    };

    const updatedState2 = taskReducer(
      initialState,
      updatedActionMissingContainer
    );
    expect(updatedState2).toStrictEqual({
      tasks: {
        todo: [{ value: "test1", id: "1", count: 1 }],
        progress: [],
        done: [],
      },
      count: 1,
    });

    //target same tasks does nothing, returns same state
    const updatedActionSameTask = {
      type: "MOVE_TASK",
      toContainer: "todo",
      fromContainer: "todo",
      toIndex: 0,
      fromIndex: 0,
    };

    const updatedState3 = taskReducer(initialState, updatedActionSameTask);
    expect(updatedState3).toStrictEqual({
      tasks: {
        todo: [{ value: "test1", id: "1", count: 1 }],
        progress: [],
        done: [],
      },
      count: 1,
    });
  });

  test("SAVE_TASK", () => {
    const initialState: TaskManager = {
      tasks: {
        todo: [],
        progress: [{ value: "test1", id: "1", count: 1 }],
        done: [],
      },
      count: 1,
    };
    const updateAction = {
      type: "SAVE_TASK",
      container: "progress",
      value: "test1 modified",
      id: "1",
    };
    const updatedState = taskReducer(initialState, updateAction);

    expect(updatedState).toStrictEqual({
      tasks: {
        todo: [],
        progress: [{ value: "test1 modified", id: "1", count: 1 }],
        done: [],
      },
      count: 1,
    });
  });

  test("SWITCH_PROJECT", () => {
    const initialState: TaskManager = {
      tasks: {
        todo: [],
        progress: [{ value: "test1", id: "1", count: 1 }],
        done: [],
      },
      count: 1,
    };
    const switchProject = {
      type: "SWITCH_PROJECT",
      payload: {
        tasks: {
          todo: [],
          progress: [{ value: "test2", id: "2", count: 2 }],
          done: [{ value: "test2", id: "3", count: 3 }],
        },
        count: 3,
      },
    };
    const updatedState = taskReducer(initialState, switchProject);

    expect(updatedState).toStrictEqual({
      tasks: {
        todo: [],
        progress: [{ value: "test2", id: "2", count: 2 }],
        done: [{ value: "test2", id: "3", count: 3 }],
      },
      count: 3,
    });
  });

  test("DEFAULT", () => {
    const initialState: TaskManager = {
      tasks: {
        todo: [],
        progress: [{ value: "test1", id: "1", count: 1 }],
        done: [],
      },
      count: 1,
    };
    const testDefault = {
      type: "",
    };
    const updatedState = taskReducer(initialState, testDefault);

    expect(updatedState).toStrictEqual({
      tasks: {
        todo: [],
        progress: [{ value: "test1", id: "1", count: 1 }],
        done: [],
      },
      count: 1,
    });
  });
});
