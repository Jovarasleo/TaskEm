import { uid } from "../../../util/uid";
import { TaskContainer } from "./task";

export const defaultContainers = (projectId: string) => {
  const position = new Date().getTime();
  const containers: TaskContainer[] = [
    {
      containerId: uid(),
      containerName: "Todo",
      position: position - 1000,
      projectId,
    },
    {
      containerId: uid(),
      containerName: "In Progress",
      position: position,
      projectId,
    },
    {
      containerId: uid(),
      containerName: "Done",
      position: position + 1000,
      projectId,
    },
  ];

  return containers;
};
