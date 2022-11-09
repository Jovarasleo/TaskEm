import { useEffect } from "react";
import { TaskContainers } from "../model/task";
const initialState: TaskContainers = {
  todo: [],
  progress: [],
  done: [],
};
const useLocalStorage = (tasks: TaskContainers) => {
  const localStorage = window.localStorage.getItem("tasks");
  const loadState = localStorage ? JSON.parse(localStorage) : initialState;

  useEffect(() => {
    window.localStorage.setItem("tasks", JSON.stringify(tasks));
  }, [tasks]);
  return [loadState];
};

export default useLocalStorage;
