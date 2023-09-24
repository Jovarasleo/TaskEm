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
      const { projectId, containerId, value, taskId, count } = action.payload;

      const positionValuesList = state.data.map((item) => item.position);
      const smallestValue = positionValuesList.length
        ? Math.min(...positionValuesList) - 1000
        : new Date().getTime();

      return {
        ...state,
        data: [
          ...state.data,
          {
            value,
            taskId,
            projectId,
            containerId,
            position: smallestValue,
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
      const { toContainerId, fromContainerId, toIndex, fromIndex, taskId } = action.payload;

      if (!toContainerId || !fromContainerId) return state;
      if (toContainerId === fromContainerId && toIndex === fromIndex) return state;

      const tasksInContainer = state.data.filter((task) => task.containerId === toContainerId);

      const taskAbove = tasksInContainer[toIndex - 1]?.position;
      const taskBelow = tasksInContainer[toIndex + 1]?.position;
      const taskAtIndex = tasksInContainer[toIndex]?.position;

      const moveUp = toIndex < fromIndex;
      const moveDn = toIndex > fromIndex;

      // console.log({ taskAbove, taskBelow, tasksInContainer });
      const sameContainer = toContainerId === fromContainerId;

      const newPosition = (position: number) => {
        if (!tasksInContainer.length) {
          return position;
        }
        //first task in container
        if (!taskAbove && taskAtIndex) {
          console.log("IF 3");
          return taskAtIndex - 1000;
        }
        //insert in between
        if (sameContainer && moveUp && taskAbove && taskAtIndex) {
          console.log("IF 4");
          return (taskAtIndex + taskAbove) / 2;
        }
        //insert in between
        if (sameContainer && moveDn && taskAtIndex && taskBelow) {
          console.log("IF 5");
          return (taskAtIndex + taskBelow) / 2;
        }
        //last task in another container
        if (taskAbove && !taskBelow && !taskAtIndex) {
          console.log("IF 1");
          return taskAbove + 1000;
        }
        //last task in current container
        if (!sameContainer && taskAbove && !taskBelow && taskAtIndex) {
          console.log("IF 2");
          return (taskAtIndex + taskAbove) / 2;
        }
        //last task in current container
        if (sameContainer && taskAbove && !taskBelow && taskAtIndex) {
          console.log("IF 2.5");
          return taskAtIndex + 1000;
        }
        //insert between tasks in another container
        if (!sameContainer && taskAbove && taskBelow && taskAtIndex) {
          console.log("IF 3.5");
          return (taskAtIndex + taskAbove) / 2;
        }

        return position;
      };

      const currentTask = state.data.find((task) => task.taskId === taskId);
      const newTasksArray = state.data.filter((task) => task.taskId !== taskId);

      if (!currentTask) {
        return state;
      }

      const newTask = {
        ...currentTask,
        position: Math.floor(newPosition(currentTask.position)),
        containerId: toContainerId as string,
      };

      return {
        ...state,
        data: [...newTasksArray, newTask].sort((a, b) => a.position - b.position),
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

export const { createTask, removeTask, editTask, moveTask } = taskSlice.actions;
export default taskSlice.reducer;
