import { Project, Task, TaskContainer } from "../../views/taskManager/model/task";

type ClientTaskActionType =
  | "task/clientLoadTasks"
  | "task/clientCreateTask"
  | "task/clientEditTask"
  | "task/clientDeleteTask"
  | "task/clientMoveTask"
  | "task/clientDeleteProjectTasks";

type ClientContainerActionType =
  | "container/clientLoadContainers"
  | "container/clientCreateContainer"
  | "container/clientDeleteContainer"
  | "container/clientDeleteProjectContainers";

type ClientProjectActionType =
  | "project/clientLoadProjects"
  | "project/clientCreateProject"
  | "project/clientEditProject"
  | "project/clientSelectProject"
  | "project/clientDeleteProject";

type UpdateDataClientTaskActionType = Exclude<ClientTaskActionType, "task/clientLoadTasks">;
type UpdateDataClientContainerActionType = Exclude<
  ClientContainerActionType,
  "container/clientLoadContainers"
>;
type UpdateDataClientProjectActionType = Exclude<
  ClientProjectActionType,
  "project/clientLoadProjects" | "project/clientSelectProject"
>;

type UpdateDataClientTaskAction =
  | {
      type: Exclude<UpdateDataClientTaskActionType, "task/clientDeleteProjectTasks">;
      payload: Task;
    }
  | {
      type: Extract<ClientTaskActionType, "task/clientDeleteProjectTasks">;
      payload: { projectId: string };
    };

type UpdateDataClientContainerAction =
  | {
      type: Exclude<UpdateDataClientContainerActionType, "container/clientDeleteProjectContainers">;
      payload: TaskContainer;
    }
  | {
      type: Extract<UpdateDataClientContainerActionType, "container/clientDeleteProjectContainers">;
      payload: { projectId: string };
    };

type UpdateDataClientProjectAction = {
  type: UpdateDataClientProjectActionType;
  payload: Project;
};

export type UpdateDataClientAction =
  | UpdateDataClientTaskAction
  | UpdateDataClientContainerAction
  | UpdateDataClientProjectAction;

export type UpdateDataClientActionTypes =
  | UpdateDataClientTaskActionType
  | UpdateDataClientContainerActionType
  | UpdateDataClientProjectActionType;

export type ClientActionTypes =
  | ClientTaskActionType
  | ClientContainerActionType
  | ClientProjectActionType;

type ServerTaskActionType =
  | "task/serverLoadTasks"
  | "task/serverCreateTask"
  | "task/serverEditTask"
  | "task/serverDeleteTask"
  | "task/serverMoveTask"
  | "task/serverDeleteProjectTasks";

type ServerContainerActionType =
  | "container/serverLoadContainers"
  | "container/serverCreateContainer"
  | "container/serverDeleteContainer"
  | "container/serverDeleteProjectContainers";

type ServerProjectActionType =
  | "project/serverLoadProjects"
  | "project/serverCreateProject"
  | "project/serverEditProject"
  | "project/serverDeleteProject";

interface ServerTaskAction {
  type: ServerTaskActionType;
  payload: Task;
}

interface ServerContainerAction {
  type: ServerContainerActionType;
  payload: TaskContainer;
}

interface ServerProjectAction {
  type: ServerProjectActionType;
  payload: Project;
}

export type ServerAction = ServerTaskAction | ServerContainerAction | ServerProjectAction;
export type ServerActionTypes =
  | ServerTaskActionType
  | ServerContainerActionType
  | ServerProjectActionType;
