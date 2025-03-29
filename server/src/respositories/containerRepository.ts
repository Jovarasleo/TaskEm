import db from "../interface/data.access.js";
import { RowDataPacket } from "mysql2";
import { IContainer } from "../entities/containerEntity.js";
import { IProject } from "../entities/projectEntity.js";

type IContainerSql = IContainer & RowDataPacket;

class ContainerRepository {
  async createContainer({
    containerId,
    containerName,
    position,
    createdAt,
    modifiedAt,
    projectId,
  }: IContainer): Promise<string | null> {
    const sql =
      "INSERT INTO containers (containerId, containerName, position, createdAt, modifiedAt, projectId) VALUES (?, ?, ?, ?, ?, ?)";

    const values = [
      containerId,
      containerName,
      position,
      createdAt,
      modifiedAt,
      projectId,
    ];

    const [result] = await db.execute(sql, values);
    return result ? containerId : null;
  }

  async getProjectContainers(
    projectId: IProject["projectId"]
  ): Promise<IContainer[]> {
    const sql = "SELECT * FROM containers WHERE projectId = ?";
    const values = [projectId];

    const [result] = await db.execute<IContainerSql[]>(sql, values);
    return result;
  }

  async deleteContainer(containerId: IContainer["containerId"]) {
    const sql = "DELETE FROM containers WHERE containerId = ?";
    const values = [containerId];

    const [result] = await db.execute(sql, values);
    return result ? containerId : null;
  }

  async deleteProjectContainers(projectId: IProject["projectId"]) {
    const sql = "DELETE FROM containers WHERE projectId = ?";
    const values = [projectId];

    const [result] = await db.execute<RowDataPacket[]>(sql, values);
    return result ? projectId : null;
  }
}

export { ContainerRepository };
