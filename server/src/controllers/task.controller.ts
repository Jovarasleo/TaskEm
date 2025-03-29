import { WebSocket } from "ws";
import { ITask } from "../entities/taskEntity.js";
import {
  createTaskHandler,
  updateTaskPositionHandler,
  getSingleTaskHandler,
  updateTaskValueHandler,
  deleteTaskHandler,
} from "../domainHandlers/taskHandlers.js";
import { IUser } from "../entities/userEntity.js";

interface createTaskRequestData {
  taskId: ITask["taskId"];
  projectId: ITask["projectId"];
  containerId: ITask["containerId"];
  value: ITask["value"];
  count: ITask["count"];
  position: ITask["position"];
  userId: IUser["uuid"];
}

export async function createTaskSocketController(
  requestData: createTaskRequestData,
  client: WebSocket
) {
  const { taskId, projectId, containerId, value, count, position, userId } =
    requestData;

  try {
    const response = await createTaskHandler(
      taskId,
      projectId,
      containerId,
      value,
      count,
      position,
      userId
    );

    if (!response.success) {
      return client.send(
        JSON.stringify({
          type: "error/serverError",
          payload: response.error,
        })
      );
    }
  } catch (error) {
    console.error(error);

    client.send(
      JSON.stringify({
        type: "error/serverError",
        payload: "Internal Server Error",
      })
    );
  }
}

interface updateTaskPositionRequestData {
  taskId: ITask["projectId"];
  containerId: ITask["containerId"];
  position: ITask["position"];
  projectId: ITask["projectId"];
  userId: IUser["uuid"];
}

export const updateTaskPositionSocketController = async (
  requestData: updateTaskPositionRequestData,
  client: WebSocket
) => {
  try {
    const response = await updateTaskPositionHandler(
      requestData.taskId,
      requestData.containerId,
      requestData.position,
      requestData.projectId,
      requestData.userId
    );

    if (!response.success || !response.data) {
      return client.send(
        JSON.stringify({
          type: "error/serverError",
          payload: response.error,
        })
      );
    }

    const updatedTask = await getSingleTaskHandler(response.data);
    if (updatedTask.data) {
      client.send(
        JSON.stringify({
          type: "task/serverMoveTask",
          payload: updatedTask.data,
        })
      );
    }
  } catch (error) {
    console.error(error);

    client.send(
      JSON.stringify({
        type: "error/serverError",
        payload: "Internal Server Error",
      })
    );
  }
};

interface UpdateTaskValueRequestData {
  taskId: ITask["projectId"];
  value: ITask["value"];
  projectId: ITask["projectId"];
  userId: IUser["uuid"];
}

export const updateTaskValueSocketController = async (
  requestData: UpdateTaskValueRequestData,
  client: WebSocket
) => {
  try {
    const response = await updateTaskValueHandler(
      requestData.taskId,
      requestData.value,
      requestData.projectId,
      requestData.userId
    );

    if (!response.success || !response.data) {
      return client.send(
        JSON.stringify({
          type: "error/serverError",
          payload: response.error,
        })
      );
    }

    const updatedTask = await getSingleTaskHandler(response.data);
    if (updatedTask.data) {
      client.send(
        JSON.stringify({
          type: "task/serverEditTask",
          payload: updatedTask.data,
        })
      );
    }
  } catch (error) {
    console.error(error);

    client.send(
      JSON.stringify({
        type: "error/serverError",
        payload: "Internal Server Error",
      })
    );
  }
};

interface DeleteTaskRequestData {
  projectId: ITask["projectId"];
  taskId: ITask["taskId"];
  userId: IUser["uuid"];
}

export const deleteTaskSocketController = async (
  requestData: DeleteTaskRequestData,
  client: WebSocket
) => {
  try {
    const response = await deleteTaskHandler(
      requestData.projectId,
      requestData.taskId,
      requestData.userId
    );

    if (!response.success || !response.data) {
      return client.send(
        JSON.stringify({
          type: "error/serverError",
          payload: response.error,
        })
      );
    }

    client.send(
      JSON.stringify({
        type: "task/serverDeleteTask",
        payload: response.data,
      })
    );
  } catch (error) {
    console.error(error);

    client.send(
      JSON.stringify({
        type: "error/serverError",
        payload: "Internal Server Error",
      })
    );
  }
};
