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

type IdbClientProjectActionType = "project/clientEditProject" | "project/clientDeleteProject";

type IdbClientCreateProjectActionType = "project/clientCreateProject";

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
  | IdbClientCreateProjectActionType
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

type IdbCreateProjectAction = {
  type: IdbClientCreateProjectActionType;
  payload: { project: Project; containers: TaskContainer[] };
};

export type IdbAction =
  | IdbTaskAction
  | IdbContainerAction
  | IdbProjectAction
  | IdbCreateProjectAction;

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

type SocketClientCreateProjectActionType = "project/clientCreateProject";

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

type SocketClientCreateProjectAction = {
  type: SocketClientProjectActionType;
  payload: { project: Project; containers: TaskContainer[] };
};

type SocketConnectAction =
  | {
      type: "auth/isAuth/fulfilled";
      payload: boolean;
    }
  | {
      type: "auth/login/fulfilled";
      payload: {
        success: boolean;
      };
    };

type SocketDisconnectAction = {
  type: "auth/logout/fulfilled";
  payload: undefined;
};

export type SocketActionType =
  | SocketClientTaskActionType
  | SocketClientContainerActionType
  | SocketClientProjectActionType
  | SocketClientCreateProjectActionType;

export type SocketAction =
  | SocketClientTaskAction
  | SocketClientContainerAction
  | SocketClientProjectAction
  | SocketClientCreateProjectAction
  | SocketConnectAction
  | SocketDisconnectAction;

type SocketServerTaskActionType =
  | "task/serverLoadTasks"
  | "task/serverCreateTask"
  | "task/serverEditTask"
  | "task/serverDeleteTask"
  | "task/serverMoveTask"
  | "task/serverDeleteProjectTasks";

type SocketServerContainerActionType =
  | "container/serverLoadContainers"
  | "container/serverCreateContainer"
  | "container/serverDeleteContainer"
  | "container/serverDeleteProjectContainers";

type SocketServerProjectActionType =
  | "project/serverLoadProjects"
  | "project/serverCreateProject"
  | "project/serverEditProject"
  | "project/serverDeleteProject";

type SocketServerTaskAction =
  | {
      type: Exclude<
        SocketServerTaskActionType,
        "task/serverDeleteProjectTasks" | "task/serverLoadTasks"
      >;
      payload: Task;
    }
  | {
      type: Extract<SocketServerTaskActionType, "task/serverLoadTasks">;
      payload: Task[];
    }
  | {
      type: Extract<SocketServerTaskActionType, "task/serverDeleteProjectTasks">;
      payload: { projectId: string };
    };

type SocketServerContainerAction =
  | {
      type: Exclude<
        SocketServerContainerActionType,
        "task/serverDeleteProjectContainers" | "container/serverLoadContainers"
      >;
      payload: TaskContainer;
    }
  | {
      type: Extract<SocketServerContainerActionType, "container/serverLoadContainers">;
      payload: TaskContainer[];
    }
  | {
      type: Extract<SocketServerContainerActionType, "task/serverDeleteProjectContainers">;
      payload: { projectId: string };
    };

type SocketServerProjectAction =
  | {
      type: Exclude<SocketServerProjectActionType, "project/serverLoadProjects">;
      payload: Project;
    }
  | {
      type: Extract<SocketServerProjectActionType, "project/serverLoadProjects">;
      payload: Project[];
    };

export type SocketServerAction =
  | SocketServerTaskAction
  | SocketServerContainerAction
  | SocketServerProjectAction;
