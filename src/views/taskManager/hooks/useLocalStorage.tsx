import { useState, useEffect } from "react";
import { TaskContainers } from "../model/task";

const useLocalStorage = (state: TaskContainers) => {
  const localStorage = window.localStorage.getItem("tasks");
  const loadState = localStorage ? JSON.parse(localStorage) : state;
  const [value, setValue] = useState(loadState);

  useEffect(() => {
    window.localStorage.setItem("tasks", JSON.stringify(value));
  }, [value]);
  return [value, setValue];
};

export default useLocalStorage;
