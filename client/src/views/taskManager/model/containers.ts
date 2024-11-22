import { uid } from "../../../util/uid";
import { TaskContainer } from "./task";

export const defaultContainers = (projectId: string) => {
  const position = new Date().getTime();
  const currentTime = new Date().toISOString();
  const containers: TaskContainer[] = [
    {
      containerId: uid(),
      containerName: "Todo",
      position: position - 1000,
      createdAt: currentTime,
      modifiedAt: currentTime,
      projectId,
    },
    {
      containerId: uid(),
      containerName: "In Progress",
      position: position,
      createdAt: currentTime,
      modifiedAt: currentTime,
      projectId,
    },
    {
      containerId: uid(),
      containerName: "Done",
      position: position + 1000,
      createdAt: currentTime,
      modifiedAt: currentTime,
      projectId,
    },
  ];

  return containers;
};
