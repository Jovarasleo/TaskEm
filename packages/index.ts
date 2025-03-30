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

export type ServerActionType =
  | ServerTaskActionType
  | ServerContainerActionType
  | ServerProjectActionType;
