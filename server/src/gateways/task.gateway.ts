import { RowDataPacket } from "mysql2";
import { ITask } from "../entities/taskEntity";
import db from "../interface/data.access";

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

export async function getTasksGateway(projectId: string) {
  const sql = "SELECT * FROM tasks WHERE projectId = ?";
  const values = [projectId];

  try {
    const [result] = await db.execute<RowDataPacket[]>(sql, values);

    return {
      success: true,
      message: ["Tasks retrieved successfully"],
      data: result,
    };
  } catch (error) {
    console.error("Error inserting task:", error);
    throw new Error("Failed to insert task");
  }
}

export async function updateTaskPositionGateway({
  taskId,
  position,
}: {
  taskId: string;
  position: bigint;
}) {
  const sql = "UPDATE tasks SET position = ? WHERE taskId = ?";
  const values = [position, taskId];

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
