import { RefObject } from "react";

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

export type SaveTask = (container: string, id: string, name: string, description: string) => void;

export type DeleteTask = (id: string, container: string) => void;

export type HandleDragStart = (container: string, index: number, taskId: string) => void;

export type HandleDragOver = (container: string, index: number, state: Task[]) => void;

export type HandleDrag = (
  e: React.MouseEvent<HTMLElement>,
  ref: RefObject<HTMLDivElement>,
  container: string
) => void;

export type HandleDragLeave = () => void;
