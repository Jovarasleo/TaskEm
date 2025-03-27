import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { getTasksIdb } from "../../db";
import { Task } from "../../views/taskManager/model/task";

export const clientLoadLocalTasks = createAsyncThunk(
  "task/clientLoadLocalTasks",
  async (projectId: string) => await getTasksIdb(projectId)
);

const filteredData = (tasks: Task[]) => {
  return tasks.sort((a, b) => {
    // Compare by containerId first
    if (a.containerId < b.containerId) return -1;
    if (a.containerId > b.containerId) return 1;

    // If containerIds are equal, compare by position
    if (a.position < b.position) return -1;
    if (a.position > b.position) return 1;

    // If both containerId and position are equal, no change in order
    return 0;
  });
};

interface InitialTaskState {
  data: Task[];
  status: "loading" | "succeeded" | "idle" | "failed";
  error: null | string;
}

const moveTask = (
  state: InitialTaskState,
  action: {
    payload: Task;
    type: string;
  }
) => {
  const newTask = action.payload;
  if (!newTask) {
    return state;
  }

  const newTasksArray = state.data.filter((task) => task.taskId !== newTask.taskId);

  return {
    ...state,
    data: [...newTasksArray, newTask].sort((a, b) => a.position - b.position),
  };
};

const createTask = (
  state: InitialTaskState,
  action: {
    payload: Task;
    type: string;
  }
) => {
  const { projectId, containerId, value, taskId, count, position } = action.payload;

  return {
    ...state,
    data: [
      ...state.data,
      {
        value,
        taskId,
        projectId,
        containerId,
        position,
        count,
      },
    ].sort((a, b) => a.position - b.position),
  };
};

const deleteTask = (
  state: InitialTaskState,
  action: {
    payload: Task;
    type: string;
  }
) => {
  const filteredData = state.data.filter((task) => task.taskId !== action.payload.taskId);

  return {
    ...state,
    data: filteredData,
  };
};

const deleteProjectTasks = (
  state: InitialTaskState,
  action: {
    payload: { projectId: string };
    type: string;
  }
) => {
  const filteredData = state.data.filter((task) => {
    action.payload.projectId !== task.projectId;
  });

  return {
    ...state,
    data: filteredData,
  };
};

const editTask = (state: InitialTaskState, action: { payload: Task; type: string }) => {
  const { taskId, value } = action.payload;
  const newState = state.data.map((task) => {
    if (task.taskId === taskId) {
      return { ...task, value };
    }

    return task;
  });

  return {
    ...state,
    data: newState,
  };
};

const loadTasks = (state: InitialTaskState, action: { payload: Task[]; type: string }) => {
  return {
    ...state,
    data: action.payload,
  };
};

const taskSlice = createSlice({
  name: "task",
  initialState: {
    data: [],
    status: "idle",
    error: "",
  } as InitialTaskState,
  reducers: {
    clientLoadTasks: (state, action) => loadTasks(state, action),
    serverLoadTasks: (state, action) => loadTasks(state, action),
    clientCreateTask: (state, action) => createTask(state, action),
    serverCreateTask: (state, action) => createTask(state, action),
    clientDeleteTask: (state, action) => deleteTask(state, action),
    serverDeleteTask: (state, action) => deleteTask(state, action),
    clientDeleteProjectTasks: (state, action) => deleteProjectTasks(state, action),
    serverDeleteProjectTasks: (state, action) => deleteProjectTasks(state, action),
    clientEditTask: (state, action) => editTask(state, action),
    serverEditTask: (state, action) => editTask(state, action),
    clientMoveTask: (state, action) => moveTask(state, action),
    serverMoveTask: (state, action) => moveTask(state, action),
  },
  extraReducers: (builder) => {
    builder
      .addCase(clientLoadLocalTasks.pending, (state) => {
        state.status = "loading";
      })
      .addCase(clientLoadLocalTasks.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.data = filteredData(action.payload);
      })
      .addCase(clientLoadLocalTasks.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message ?? "";
      });
  },
});

export const {
  clientLoadTasks,
  serverLoadTasks,
  clientCreateTask,
  serverCreateTask,
  clientDeleteTask,
  serverDeleteTask,
  clientDeleteProjectTasks,
  serverDeleteProjectTasks,
  clientEditTask,
  serverEditTask,
  clientMoveTask,
  serverMoveTask,
} = taskSlice.actions;
export default taskSlice.reducer;
