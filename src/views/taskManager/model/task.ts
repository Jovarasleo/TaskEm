import { RefObject } from "react";

export interface Actions {
  type?: string;
  value?: string;
  container?: string;
  id?: string;
  toContainer?: string;
  fromContainer?: string;
  toIndex?: number;
  fromIndex?: number;
}

export interface Task {
  value: string;
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

export type DeleteTask = (id: string, container: string) => void;

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
