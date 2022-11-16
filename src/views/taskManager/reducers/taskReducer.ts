import { Actions, TaskContainers, Task } from "../model/task";

export const taskReducer = (state: TaskContainers, action: Actions) => {
  switch (action.type) {
    case "ADD_TASK": {
      return {
        ...state,
        todo: [...state.todo, { value: action.value, id: action.id }],
      };
    }
    case "DELETE_TASK": {
      const newArray = [
        ...state[action.container as keyof TaskContainers],
      ].filter((task) => task.id !== action.id);
      return {
        ...state,
        [action.container as keyof TaskContainers]: [...newArray],
      };
    }
    case "MOVE_TASK": {
      const { toContainer, fromContainer, toIndex, fromIndex } = action;
      if (!fromContainer || !toContainer) return state;
      if (toContainer === fromContainer && toIndex === fromIndex) return state;

      const tasksCopy = JSON.parse(JSON.stringify(state));

      const getTask = tasksCopy[fromContainer].splice(fromIndex, 1)[0];
      tasksCopy[toContainer].splice(toIndex, 0, getTask);
      return {
        ...state,
        ...tasksCopy,
      };
    }
    case "SAVE_TASK": {
      const tasksCopy = JSON.parse(JSON.stringify(state));
      tasksCopy[action.container as keyof TaskContainers]
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

    default:
      return state;
  }
};
