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
    const result = await db.execute(sql, values);
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
