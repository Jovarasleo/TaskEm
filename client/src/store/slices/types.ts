import { Project, Task, TaskContainer } from "../../views/taskManager/model/task";

type IdbClientTaskActionType =
  | "task/clientCreateTask"
  | "task/clientEditTask"
  | "task/clientDeleteTask"
  | "task/clientMoveTask"
  | "task/clientDeleteProjectTasks";

type IdbClientContainerActionType =
  | "container/clientCreateContainer"
  | "container/clientDeleteContainer"
  | "container/clientDeleteProjectContainers";

type IdbClientProjectActionType =
  | "project/clientCreateProject"
  | "project/clientEditProject"
  | "project/clientDeleteProject";

type IdbServerTaskActionType =
  | "task/serverCreateTask"
  | "task/serverEditTask"
  | "task/serverDeleteTask"
  | "task/serverMoveTask"
  | "task/serverDeleteProjectTasks";

type IdbServerContainerActionType =
  | "container/serverCreateContainer"
  | "container/serverDeleteContainer"
  | "container/serverDeleteProjectContainers";

type IdbServerProjectActionType =
  | "project/serverCreateProject"
  | "project/serverEditProject"
  | "project/serverDeleteProject";

export type IdbActionType =
  | IdbClientTaskActionType
  | IdbClientContainerActionType
  | IdbClientProjectActionType
  | IdbServerTaskActionType
  | IdbServerContainerActionType
  | IdbServerProjectActionType;

type IdbTaskActionType = IdbClientTaskActionType | IdbServerTaskActionType;
type IdbContainerActionType = IdbClientContainerActionType | IdbServerContainerActionType;
type IdbProjectActionType = IdbClientProjectActionType | IdbServerProjectActionType;

type IdbTaskAction =
  | {
      type: Exclude<
        IdbTaskActionType,
        "task/clientDeleteProjectTasks" | "task/serverDeleteProjectTasks"
      >;
      payload: Task;
    }
  | {
      type: Extract<
        IdbTaskActionType,
        "task/clientDeleteProjectTasks" | "task/serverDeleteProjectTasks"
      >;
      payload: { projectId: string };
    };

type IdbContainerAction =
  | {
      type: Exclude<
        IdbContainerActionType,
        "container/clientDeleteProjectContainers" | "container/serverDeleteProjectContainers"
      >;
      payload: TaskContainer;
    }
  | {
      type: Extract<
        IdbContainerActionType,
        "container/clientDeleteProjectContainers" | "container/serverDeleteProjectContainers"
      >;
      payload: { projectId: string };
    };

type IdbProjectAction = {
  type: IdbProjectActionType;
  payload: Project;
};

export type IdbAction = IdbTaskAction | IdbContainerAction | IdbProjectAction;

type SocketClientTaskActionType =
  | "task/clientCreateTask"
  | "task/clientEditTask"
  | "task/clientDeleteTask"
  | "task/clientMoveTask";

type SocketClientContainerActionType =
  | "container/clientCreateContainer"
  | "container/clientDeleteContainer";

type SocketClientProjectActionType =
  | "project/clientCreateProject"
  | "project/clientEditProject"
  | "project/clientDeleteProject";

type SocketClientTaskAction = {
  type: SocketClientTaskActionType;
  payload: Task;
};
type SocketClientContainerAction = {
  type: SocketClientContainerActionType;
  payload: TaskContainer;
};

type SocketClientProjectAction = {
  type: SocketClientProjectActionType;
  payload: Project;
};

export type SocketActionType =
  | SocketClientTaskActionType
  | SocketClientContainerActionType
  | SocketClientProjectActionType;

export type SocketAction =
  | SocketClientTaskAction
  | SocketClientContainerAction
  | SocketClientProjectAction;

type SocketServerTaskActionType =
  | "task/serverCreateTask"
  | "task/serverEditTask"
  | "task/serverDeleteTask"
  | "task/serverMoveTask"
  | "task/serverDeleteProjectTasks";

type SocketServerContainerActionType =
  | "container/serverCreateContainer"
  | "container/serverDeleteContainer"
  | "container/serverDeleteProjectContainers";

type SocketServerProjectActionType =
  | "project/serverCreateProject"
  | "project/serverEditProject"
  | "project/serverDeleteProject";

type SocketServerTaskAction =
  | {
      type: Exclude<SocketServerTaskActionType, "task/serverDeleteProjectTasks">;
      payload: Task;
    }
  | {
      type: Extract<SocketServerTaskActionType, "task/serverDeleteProjectTasks">;
      payload: { projectId: string };
    };

type SocketServerContainerAction =
  | {
      type: Exclude<SocketServerContainerActionType, "task/serverDeleteProjectContainers">;
      payload: TaskContainer;
    }
  | {
      type: Extract<SocketServerContainerActionType, "task/serverDeleteProjectContainers">;
      payload: { projectId: string };
    };

type SocketServerProjectAction = {
  type: SocketServerProjectActionType;
  payload: Project;
};

export type SocketServerAction =
  | SocketServerTaskAction
  | SocketServerContainerAction
  | SocketServerProjectAction;
