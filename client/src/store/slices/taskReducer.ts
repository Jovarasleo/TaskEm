import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { getTasks, putTask, setTask } from "../../db";
import { Task } from "../../views/taksManager/model/task";
import { RootState } from "../configureStore";

export const updateDataToIndexedDb = createAsyncThunk(
  "task/updateData",
  async (taskId: string, { getState }) => {
    const currentState = getState() as RootState;
    const foundTask = currentState.task.data.find((task) => task.taskId === taskId);
    if (!foundTask) {
      return;
    }

    try {
      const data = await putTask(foundTask);
      return data;
    } catch (error) {
      throw error;
    }
  }
);

export const setDataToIndexedDB = createAsyncThunk("task/setData", async (task: Task) => {
  // Implement your logic to fetch data from IndexedDB here
  try {
    const data = await setTask(task);
    return data;
  } catch (error) {
    throw error;
  }
});

export const fetchDataFromIndexedDB = createAsyncThunk("task/getData", async () => {
  // Implement your logic to fetch data from IndexedDB here
  try {
    const data = (await getTasks()) as Task[];
    return data;
  } catch (error) {
    throw error;
  }
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
  status: string; // 'idle', 'loading', 'succeeded', or 'failed'
  error: null | string;
}

// export const fetchUserAsync = createAsyncThunk("user/fetchUser", async () => {
//   return fetchUserFromAPI();
// });

const taskSlice = createSlice({
  name: "task",
  initialState: {
    data: [],
    status: "idle",
    error: "",
  } as InitialTaskState,
  reducers: {
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

    removeTask: (state, action) => {
      const { taskId } = action.payload;
      const newState = state.data.filter((task) => task.taskId !== taskId);

      return {
        ...state,
        data: newState,
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

    getSocketTasks: (state, action) => {
      console.log({ action });
      return {
        ...state,
        data: [...state.data, ...action.payload].sort((a, b) => a.position - b.position),
      };
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchDataFromIndexedDB.pending, (state) => {
        console.log("pending");
        state.status = "loading";
      })
      .addCase(fetchDataFromIndexedDB.fulfilled, (state, action) => {
        state.status = "succeeded";
        console.log("payload", action.payload);
        state.data = filteredData(action.payload);
      })
      .addCase(fetchDataFromIndexedDB.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message ?? "";
      });
  },
});

export const { createTask, removeTask, editTask, moveTask, getSocketTasks } = taskSlice.actions;
export default taskSlice.reducer;
