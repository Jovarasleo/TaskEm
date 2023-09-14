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
  projectId: string;
  containerId: string;
  position: number;
  count: number;
}

export interface TaskContainer {
  projectId: string;
  containerId: string;
  containerName: string;
}

export interface Project {
  projectId: string;
  projectName: string;
  containerOrder: string[];
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

export type HandleDragStart = (
  container: string,
  index: number,
  taskId: string
) => void;

export type HandleDragOver = (container: string, index: number) => void;

export type HandleDrag = (
  e: React.MouseEvent<HTMLElement>,
  ref: RefObject<HTMLDivElement>,
  container: string
) => void;

export type HandleDragLeave = () => void;
