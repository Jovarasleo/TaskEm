import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { getTasksIdb } from "../../db";
import { Task } from "../../views/taskManager/model/task";

export const getTasksFromIdb = createAsyncThunk("task/getData", async () => {
  const data = (await getTasksIdb()) as Task[];
  return data;
});

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
  data: Task[] | [];
  status: "loading" | "succeeded" | "idle" | "failed";
  error: null | string;
}

const taskSlice = createSlice({
  name: "task",
  initialState: {
    data: [],
    status: "idle",
    error: "",
  } as InitialTaskState,
  reducers: {
    getTasks: (state, action) => {
      return {
        ...state,
        data: [...action.payload.data].sort((a, b) => a.position - b.position),
      };
    },
    createTask: (state, action) => {
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
    },

    deleteTask: (state, action) => {
      const filteredData = state.data.filter((task) => task.taskId !== action.payload.taskId);

      return {
        ...state,
        data: filteredData,
      };
    },

    deleteTasksByProject: (state, action) => {
      const filteredData = state.data.filter((task) => {
        action.payload.projectId !== task.projectId;
      });

      return {
        ...state,
        data: filteredData,
      };
    },

    editTask: (state, action) => {
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
    },

    moveTask: (state, action) => {
      const newTask = action.payload;
      if (!newTask) {
        return state;
      }

      const newTasksArray = state.data.filter((task) => task.taskId !== newTask.taskId);

      return {
        ...state,
        data: [...newTasksArray, newTask].sort((a, b) => a.position - b.position),
      };
    },

    moveSocketTask: (state, action) => {
      const newTask = action.payload;
      if (!newTask) {
        return state;
      }

      const newTasksArray = state.data.filter((task) => task.taskId !== newTask.taskId);

      return {
        ...state,
        data: [...newTasksArray, newTask].sort((a, b) => a.position - b.position),
      };
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getTasksFromIdb.pending, (state) => {
        state.status = "loading";
      })
      .addCase(getTasksFromIdb.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.data = filteredData(action.payload);
      })
      .addCase(getTasksFromIdb.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message ?? "";
      });
  },
});

export const {
  createTask,
  deleteTask,
  deleteTasksByProject,
  editTask,
  moveTask,
  getTasks,
  moveSocketTask,
} = taskSlice.actions;
export default taskSlice.reducer;
