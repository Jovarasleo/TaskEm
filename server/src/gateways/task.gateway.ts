import { RowDataPacket } from "mysql2";
import { ITask } from "../entities/taskEntity.js";
import db from "../interface/data.access.js";

export async function setTaskGateway({
  taskId,
  projectId,
  containerId,
  value,
  count,
  position,
}: ITask) {
  const sql =
    "INSERT INTO tasks (taskId, containerId, position, value, count, projectId) VALUES (?, ?, ?, ?, ?, ?)";
  const values = [taskId, containerId, position, value, count, projectId];

  try {
    const [result] = await db.execute(sql, values);
    console.log("Task inserted successfully:", result);

    return { success: true, message: ["Task inserted successfully"] };
  } catch (error) {
    console.error("Error inserting task:", error);
    throw new Error("Failed to insert task");
  }
}

interface ITaskSql extends ITask, RowDataPacket {}

export async function getTasksGateway(projectId: string) {
  const sql = "SELECT * FROM tasks WHERE projectId = ?";
  const values = [projectId];

  try {
    const [result] = await db.execute<ITaskSql[]>(sql, values);

    return {
      success: true,
      message: ["Tasks retrieved successfully"],
      data: result,
    };
  } catch (error) {
    console.error("Error retrieving tasks:", error);
    throw new Error("Failed to retrieve task");
  }
}

export async function getSingleTaskGateway(taskId: string) {
  const sql = "SELECT * FROM tasks WHERE taskId = ?";
  const values = [taskId];

  try {
    const [result] = await db.execute<RowDataPacket[]>(sql, values);

    return {
      success: true,
      message: ["Task retrieved successfully"],
      data: result,
    };
  } catch (error) {
    console.error("Error retrieving task:", error);
    throw new Error("Failed to retrieve task");
  }
}

export async function updateTaskPositionGateway({
  taskId,
  containerId,
  position,
}: {
  taskId: string;
  containerId: string;
  position: bigint;
}) {
  const sql = "UPDATE tasks SET position = ?, containerId = ? WHERE taskId = ?";
  const values = [position, containerId, taskId];

  try {
    const [result] = await db.execute<RowDataPacket[]>(sql, values);

    return {
      success: true,
      message: ["Task updated successfully"],
      data: result,
    };
  } catch (error) {
    console.error("Error updating task:", error);
    throw new Error("Failed to update task");
  }
}
export async function deleteTaskGateway(taskId: string) {
  const sql = "DELETE FROM tasks WHERE taskId = ?";
  const values = [taskId];

  try {
    const [result] = await db.execute<RowDataPacket[]>(sql, values);

    return {
      success: true,
      message: ["Task deleted successfully"],
      data: result,
    };
  } catch (error) {
    console.error("Error deleting task:", error);
    throw new Error("Failed to delete task");
  }
}

export async function deleteTasksByProjectGateway(projectId: string) {
  const sql = "DELETE FROM tasks WHERE projectId = ?";
  const values = [projectId];

  try {
    const [result] = await db.execute<RowDataPacket[]>(sql, values);

    return {
      success: true,
      message: ["Project tasks deleted successfully"],
      data: result,
    };
  } catch (error) {
    console.error("Error deleting tasks:", error);
    throw new Error("Failed to delete tasks");
  }
}
