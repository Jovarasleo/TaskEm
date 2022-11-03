import { RefObject } from "react";
export interface Task {
  name: string;
  description: string;
  id: string;
}
export interface TaskContainers {
  todo: Task[];
  progress: Task[];
  done: Task[];
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

export type handleDragStart = (
  e: React.DragEvent<HTMLElement>,
  container: string,
  index: number
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
