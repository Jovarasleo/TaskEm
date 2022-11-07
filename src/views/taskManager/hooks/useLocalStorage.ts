import { useEffect } from "react";
import { TaskContainers } from "../model/task";

const useLocalStorage = (tasks: TaskContainers) => {
  const localStorage = window.localStorage.getItem("tasks");
  const loadState = localStorage ? JSON.parse(localStorage) : tasks;

  useEffect(() => {
    window.localStorage.setItem("tasks", JSON.stringify(tasks));
  }, [tasks]);
  return [loadState];
};

export default useLocalStorage;
