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
      const { projectId, containerId, value, taskId } = action.payload;

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
            count: state.data.length + 1,
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
      const { toContainerId, fromContainerId, toIndex, fromIndex, taskId } =
        action.payload;

      if (!toContainerId || !fromContainerId) return state;
      if (toContainerId === fromContainerId && toIndex === fromIndex)
        return state;

      const tasksInContainer = state.data.filter(
        (task) => task.containerId === toContainerId
      );

      console.log(toIndex);

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
        console.log({ taskAbove, taskBelow, taskAtIndex });
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
