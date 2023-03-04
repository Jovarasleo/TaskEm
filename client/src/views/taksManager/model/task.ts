import { RefObject } from "react";

export type Actions =
  | {
      type: "ADD_TASK";
      payload: {
        projectId: string;
        containerName: string;
        value: string;
        taskId: string;
      };
    }
  | {
      type: "DELETE_TASK";
      payload: {
        projectId: string;
        containerName: string;
        taskId: string;
      };
    }
  | {
      type: "SAVE_TASK";
      payload: {
        projectId: string;
        containerName: string;
        taskId: string;
        taskValue: string;
      };
    }
  | {
      type: "MOVE_TASK";
      payload: {
        projectId: string;
        taskId: string;
        fromContainer: string | undefined;
        toContainer: string;
        fromIndex: number | undefined;
        toIndex: number;
      };
    }
  | {
      type: "ADD_PROJECT";
      payload: Project;
    }
  | {
      type: "DELETE_PROJECT";
      payload: { projectId: string };
    }
  | {
      type: "RENAME_PROJECT";
      payload: { projectId: string; projectName: string };
    };

export interface Task {
  value: string;
  taskId: string;
  count: number;
}

export interface TaskContainer {
  containerName: string;
  tasks: Task[];
}

export interface Project {
  projectName: string;
  projectId: string;
  containers: TaskContainer[];
  count: number;
}

export interface DragItem {
  container: string;
  index: number;
}

export type MoveTask = (
  fromContainer: string | undefined,
  toContainer: string,
  fromIndex: number | undefined,
  toIndex: number
) => void;

export type SaveTask = (
  container: string,
  id: string,
  name: string,
  description: string
) => void;

export type DeleteTask = (id: string, container: string) => void;

export type handleDragStart = (
  e: React.DragEvent<HTMLElement>,
  container: string,
  index: number,
  taskId: string
) => void;

export type handleDragOver = (
  e: React.DragEvent<HTMLElement>,
  container: string,
  index: number
) => void;

export type handleDrag = (
  e: React.DragEvent<HTMLElement>,
  ref: RefObject<HTMLDivElement>,
  container: string
) => void;

export type handleDragLeave = () => void;
