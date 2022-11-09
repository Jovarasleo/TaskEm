const uid = () => {
  return Date.now().toString(36) + Math.random().toString(36).slice(2);
};
const initialState = {
  todo: [],
  progress: [],
  done: [],
};
const localStorage = window.localStorage.getItem("tasks");
const DEFAULT_STATE = localStorage ? JSON.parse(localStorage) : initialState;

export const taskReducer = (state = DEFAULT_STATE, action: any) => {
  switch (action.type) {
    case "ADD_TASK":
      return {
        ...state,
        todo: [...state.todo, { value: action.value, id: uid() }],
      };

    case "DELETE_TASK":
      const newArray = [...state[action.container]].filter(
        (task) => task.id !== action.id
      );
      return {
        ...state,
        [action.container]: [...newArray],
      };

    case "MOVE_TASK":
      const { toContainer, fromContainer, toIndex, fromIndex } = action;
      if (!fromContainer || !toContainer) return state;
      if (toContainer === fromContainer && toIndex === fromIndex) return state;

      const tasksCopy = JSON.parse(JSON.stringify(state));

      const getTask = tasksCopy[fromContainer].splice(fromIndex, 1)[0];
      tasksCopy[toContainer].splice(toIndex, 0, getTask);

      //   const insert = (arr: any, index: any, newItem: any) => [
      //     ...arr.slice(0, index),
      //     newItem,
      //     ...arr.slice(index),
      //   ];

      //   const fromArray = [...state[fromContainer]];
      //   const selectedTask = fromArray.splice(fromIndex, 1)[0];
      //   const toArray = [...state[toContainer]];
      //   const modifiedToArray = insert(toArray, toIndex, selectedTask);

      return {
        ...state,
        ...tasksCopy,
        // [toContainer]: modifiedToArray,
        // [fromContainer]: fromArray,
      };

    case "SAVE_TASK": {
      const tasksCopy = JSON.parse(JSON.stringify(state));
      tasksCopy[action.container]
        .map((task: any) => {
          if (task.id === action.id) {
            task.value = action.value;
          }
          return task;
        })
        .filter((task: any) => task.value);
      return {
        ...state,
        ...tasksCopy,
      };
    }

    default:
      console.log("error");
      return state;
  }
};
