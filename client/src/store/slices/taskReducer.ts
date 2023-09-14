import { createSlice, current, createAsyncThunk } from "@reduxjs/toolkit";
import { Actions, Project, Task } from "../../views/taksManager/model/task";
import { Reducer } from "react";

const fetchUserFromAPI = async () => {
  try {
    // Simulated async operation (replace with actual API call)
    const response = await fetch("/api/user");
    const userData = await response.json();
    return userData;
  } catch (error) {
    throw error;
  }
};

// const taskReducer: Reducer<Task[], Actions> = (state, action) => {
//   switch (action.type) {
//     case "CREATE_TASK": {
//       const { projectId, containerName, value, taskId } = action.payload;

//       return [
//         ...state,
//         {
//           value,
//           taskId,
//           projectId,
//           containerName,
//           count: state.length + 1,
//         },
//       ];
//     }

//     case "REMOVE_TASK": {
//       const { taskId } = action.payload;
//       const newState = state.filter((task) => task.taskId !== taskId);

//       return newState;
//     }

//     case "EDIT_TASK": {
//       const { taskId, value } = action.payload;

//       const newState = state.map((task) => {
//         if (task.taskId === taskId) {
//           return { ...task, value };
//         }

//         return task;
//       });

//       return newState;
//     }

//     case "MOVE_TASK": {
//       const { toContainer, fromContainer, toIndex, fromIndex } = action.payload;

//       if (!fromContainer || !toContainer) return state;
//       if (toContainer === fromContainer && toIndex === fromIndex) return state;

//       return {
//         ...state,
//         position: toIndex,
//         container: toContainer,
//       };
//     }

//     default:
//       return state;
//   }
// };

const testData = [
  {
    value: "ass",
    taskId: "123a",
    projectId: "123",
    containerId: "1234",
    position: 1694368555425,
    count: 1,
  },
  {
    value: "benis",
    taskId: "123b",
    projectId: "123",
    containerId: "1234",
    position: 1694368556915,
    count: 2,
  },
  {
    value: "hussy",
    taskId: "123c",
    projectId: "123",
    containerId: "1234",
    position: 1694368555892,
    count: 3,
  },
  {
    value: "Whatsup",
    taskId: "123c2",
    projectId: "123",
    containerId: "1",
    position: 1694368555900,
    count: 4,
  },
  {
    value: "Whatsdown",
    taskId: "123c3",
    projectId: "123",
    containerId: "1",
    position: 1694368455892,
    count: 5,
  },
];

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

export const fetchUserAsync = createAsyncThunk("user/fetchUser", async () => {
  return fetchUserFromAPI();
});

const taskSlice = createSlice({
  name: "task",
  initialState: {
    status: "",
    error: "",
    data: filteredData(testData),
  } as InitialTaskState,
  reducers: {
    createTask: (state, action) => {
      const { projectId, containerId, value, position, taskId } = action.payload;

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
            count: state.data.length + 1,
          },
        ],
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
      const { toContainerId, fromContainerId, toIndex, fromIndex, taskId } =
        action.payload;

      if (!toContainerId || !fromContainerId) return state;
      if (toContainerId === fromContainerId && toIndex === fromIndex)
        return state;

      const tasksInContainer = state.data
        .filter((task) => task.containerId === toContainerId)
        .sort((a, b) => a.position - b.position);

      console.log(toIndex);

      const taskAbove = tasksInContainer[toIndex - 1]?.position;
      const taskBelow = tasksInContainer[toIndex + 1]?.position;

      console.log({ taskAbove, taskBelow, tasksInContainer });

      const newPosition = () => {
        if (!tasksInContainer.length) {
          return;
        }

        if (tasksInContainer.length === toIndex) {
          return tasksInContainer[toIndex - 1].position + 1000;
        }

        if (tasksInContainer.length && toIndex === 0) {
          return tasksInContainer[toIndex].position - 1000;
        }

        if (taskBelow && taskAbove) {
          console.log("4 if");
          console.log(
            current(tasksInContainer[toIndex - 1]),
            current(tasksInContainer[toIndex + 1])
          );
          return (taskBelow + taskAbove) / 2;
        }
        if (taskBelow && !taskAbove) {
          console.log("5 if");
          return taskBelow - 1000;
        }

        if (!taskBelow && taskAbove) {
          console.log("6 if");
          return taskAbove + 1000;
        }
      };

      const currentTask = state.data.find((task) => task.taskId === taskId);
      const newTasksArray = state.data.filter((task) => task.taskId !== taskId);

      const newTask = {
        ...currentTask,
        position:
          newPosition() != undefined
            ? (Math.floor(newPosition()) as number)
            : (currentTask?.position as number),
        containerId: toContainerId as string,
      };

      return {
        ...state,
        data: [...newTasksArray, newTask],
      };
    },
  },
});

// extraReducers: (builder) => {
//   builder
//     .addCase(fetchUserAsync.pending, (state) => {
//       state.status = "loading";
//     })
//     .addCase(fetchUserAsync.fulfilled, (state, action) => {
//       state.status = "succeeded";
//       state.data = action.payload;
//     })
//     .addCase(fetchUserAsync.rejected, (state, action) => {
//       state.status = "failed";
//       state.error = action.error.message;
//     });
// },

export const { createTask, removeTask, editTask, moveTask } = taskSlice.actions;
export default taskSlice.reducer;
