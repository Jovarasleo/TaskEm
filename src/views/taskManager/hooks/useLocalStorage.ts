import { useEffect } from "react";
import { TaskContainers } from "../model/task";

const useLocalStorage = (state: TaskContainers) => {
  useEffect(() => {
    window.localStorage.setItem("tasks", JSON.stringify(state));
  }, [state]);
};

export default useLocalStorage;
