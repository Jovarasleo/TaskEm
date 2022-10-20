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
