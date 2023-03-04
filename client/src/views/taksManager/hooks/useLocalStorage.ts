import { useEffect } from "react";
import { Project } from "../model/task";
import { PROJECT_MANAGER } from "../../../context/taskContext";

const useLocalStorage = (state: Project[]) => {
  useEffect(() => {
    if (!state) {
      return;
    }

    window.localStorage.setItem(PROJECT_MANAGER, JSON.stringify(state));
  }, [state]);
};

export default useLocalStorage;
