import { Actions, Project } from "../model/task";
import deepCopy from "../../../util/deepCopy";
import { Reducer } from "react";
import { createTask } from "../../../db";

export const taskReducer: Reducer<Project[], Actions> = (state, action) => {
  switch (action.type) {
    case "ADD_TASK": {
      const { projectId, containerName, value, taskId } = action.payload;
      return state.map((project) => {
        if (project.projectId === projectId) {
          return {
            ...project,
            containers: project.containers.map((container) => {
              if (container.containerName === containerName) {
                return {
                  ...container,
                  tasks: [
                    ...container.tasks,
                    {
                      value: value,
                      taskId: taskId,
                      count: project.count,
                    },
                  ],
                };
              }
              return container;
            }),
            count: project.count++,
          };
        }
        return project;
      });
    }

    case "DELETE_TASK": {
      const { projectId, containerName, taskId } = action.payload;
      return state.map((project) => {
        if (project.projectId === projectId) {
          return {
            ...project,
            containers: project.containers.map((container) => {
              if (container.containerName === containerName) {
                return {
                  ...container,
                  tasks: container.tasks.filter((task) => task.taskId !== taskId),
                };
              }
              return container;
            }),
          };
        }
        return project;
      });
    }

    case "MOVE_TASK": {
      const { projectId, toContainer, fromContainer, toIndex, fromIndex } =
        action.payload;

      if (!fromContainer || !toContainer) return state;
      if (toContainer === fromContainer && toIndex === fromIndex) return state;

      return state.map((project) => {
        if (project.projectId === projectId) {
          const containersCopy = deepCopy(project.containers);
          const fromContainerIndex = containersCopy.findIndex(
            (container) => container.containerName === fromContainer
          );
          const toContainerIndex = containersCopy.findIndex(
            (container) => container.containerName === toContainer
          );

          const fromContainerCopy = { ...containersCopy[fromContainerIndex] };
          const taskToMove = { ...fromContainerCopy.tasks[fromIndex as number] };

          if (Object.values(taskToMove).length !== 0) {
            fromContainerCopy.tasks.splice(fromIndex as number, 1);
            containersCopy[fromContainerIndex] = fromContainerCopy;

            const toContainerCopy = { ...containersCopy[toContainerIndex] };
            toContainerCopy.tasks.splice(toIndex, 0, taskToMove);
            containersCopy[toContainerIndex] = toContainerCopy;
          }

          return {
            ...project,
            containers: containersCopy,
          };
        }

        return project;
      });
    }

    case "SAVE_TASK": {
      const { projectId, containerName, taskValue, taskId } = action.payload;

      const projectIndex = state.findIndex(
        (project) => project.projectId === projectId
      );
      if (projectIndex === -1) {
        return state;
      }

      const containerIndex = state[projectIndex].containers.findIndex(
        (container) => container.containerName === containerName
      );
      if (containerIndex === -1) {
        return state;
      }

      const taskIndex = state[projectIndex].containers[
        containerIndex
      ].tasks.findIndex((task) => task.taskId === taskId);
      if (taskIndex === -1) {
        return state;
      }

      const newState = [...state];
      newState[projectIndex] = {
        ...newState[projectIndex],
        containers: [...newState[projectIndex].containers],
      };
      newState[projectIndex].containers[containerIndex] = {
        ...newState[projectIndex].containers[containerIndex],
        tasks: [...newState[projectIndex].containers[containerIndex].tasks],
      };
      newState[projectIndex].containers[containerIndex].tasks[taskIndex] = {
        ...newState[projectIndex].containers[containerIndex].tasks[taskIndex],
        value: taskValue || "",
      };

      return newState;
    }

    case "ADD_PROJECT": {
      return [...state, action.payload];
    }

    case "SET_DATA": {
      return [...action.payload];
    }

    case "DELETE_PROJECT": {
      const { projectId } = action.payload;
      {
        return [...state.filter((project) => project.projectId !== projectId)];
      }
    }

    case "RENAME_PROJECT": {
      const { projectName, projectId } = action.payload;

      const projectIndex = state.findIndex(
        (project) => project.projectId === projectId
      );
      if (projectIndex === -1) {
        return state;
      }

      const newState = [...state];
      newState[projectIndex] = {
        ...newState[projectIndex],
        projectName: projectName,
      };

      return newState;
    }

    default:
      return state;
  }
};
