import { Actions, TaskContainers, Task, TaskManager } from "../model/task";

export const taskReducer = (state: TaskManager, action: Actions) => {
  switch (action.type) {
    case "ADD_TASK": {
      return {
        ...state,
        tasks: {
          ...state.tasks,
          todo: [
            ...state.tasks.todo,
            { value: action.value, id: action.id, count: state.count },
          ],
        },
        count: state.count++,
      };
    }

    case "DELETE_TASK": {
      const newArray = [
        ...state.tasks[action.container as keyof TaskContainers],
      ].filter((task) => task.id !== action.id);
      return {
        ...state,
        tasks: {
          ...state.tasks,
          [action.container as keyof TaskContainers]: [...newArray],
        },
      };
    }

    case "MOVE_TASK": {
      const { toContainer, fromContainer, toIndex, fromIndex } = action;
      if (!fromContainer || !toContainer) return state;
      if (toContainer === fromContainer && toIndex === fromIndex) return state;

      const tasksCopy = JSON.parse(JSON.stringify(state));

      const getTask = tasksCopy.tasks[fromContainer].splice(fromIndex, 1)[0];
      tasksCopy.tasks[toContainer].splice(toIndex, 0, getTask);
      return {
        ...state,
        ...tasksCopy,
      };
    }

    case "SAVE_TASK": {
      const tasksCopy = JSON.parse(JSON.stringify(state));
      tasksCopy.tasks[action.container as keyof TaskContainers]
        .map((task: Task) => {
          if (task.id === action.id) {
            task.value = action.value || "";
          }
          return task;
        })
        .filter((task: Task) => task.value);
      return {
        ...state,
        ...tasksCopy,
      };
    }

    case "SWITCH_PROJECT": {
      if (!state) {
        return { ...action.payload };
      } else {
        return { ...state, ...action.payload };
      }
    }

    case "DELETE_PROJECT": {
      console.log(state, action.project);
      {
        return {};
      }
    }

    default:
      return state;
  }
};
