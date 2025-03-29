import db from "../interface/data.access";
import { IUser } from "../entities/userEntity.js";
import { RowDataPacket } from "mysql2";
import { ITask } from "../entities/taskEntity";
import { IProject } from "../entities/projectEntity";

export type IUserFromDb = IUser & RowDataPacket;
type ITaskSql = ITask & RowDataPacket;

class TaskRepository {
  async createTask({ projectId, containerId, taskId, position, value, count }: ITask): Promise<string | null> {
    const sql = "INSERT INTO tasks (taskId, containerId, position, value, count, projectId) VALUES (?, ?, ?, ?, ?, ?)";
    const values = [taskId, containerId, position, value, count, projectId];

    const [taskInserted] = await db.execute(sql, values);
    return taskInserted ? taskId : null;
  }

  async getProjectTasks(projectId: string): Promise<ITask[]> {
    const sql = "SELECT * FROM tasks WHERE projectId = ?";
    const values = [projectId];

    const [tasks] = await db.execute<ITaskSql[]>(sql, values);
    return tasks;
  }

  async getSingleProjectTask(taskId: ITask["taskId"]): Promise<ITask | null> {
    const sql = "SELECT * FROM tasks WHERE taskId = ?";
    const values = [taskId];

    const [tasks] = await db.execute<ITaskSql[]>(sql, values);
    return tasks ? tasks[0] : null;
  }

  async updateTaskPosition({
    taskId,
    containerId,
    position,
  }: {
    taskId: string;
    containerId: string;
    position: bigint;
  }): Promise<ITask["taskId"] | null> {
    const sql = "UPDATE tasks SET position = ?, containerId = ? WHERE taskId = ?";
    const values = [position, containerId, taskId];

    const [result] = await db.execute<RowDataPacket[]>(sql, values);
    return result ? taskId : null;
  }

  async updateTaskValue({ taskId, value }: { taskId: ITask["taskId"]; value: ITask["value"] }): Promise<ITask["taskId"] | null> {
    const sql = "UPDATE tasks SET value = ? WHERE taskId = ?";
    const values = [value, taskId];

    const [result] = await db.execute<RowDataPacket[]>(sql, values);
    return result ? taskId : null;
  }

  async deleteTask(taskId: ITask["taskId"]): Promise<ITask["taskId"] | null> {
    const sql = "DELETE FROM tasks WHERE taskId = ?";
    const values = [taskId];

    const [result] = await db.execute<RowDataPacket[]>(sql, values);
    return result ? taskId : null;
  }

  async deleteProjectTasks(projectId: IProject["projectId"]): Promise<IProject["projectId"] | null> {
    const sql = "DELETE FROM tasks WHERE projectId = ?";
    const values = [projectId];

    const [result] = await db.execute<RowDataPacket[]>(sql, values);
    return result ? projectId : null;
  }
}

export { TaskRepository };
