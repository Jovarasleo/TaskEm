import db from "../interface/data.access";
import { IUser } from "../entities/userEntity.js";
import { RowDataPacket } from "mysql2";
import { IProject } from "../entities/projectEntity";

export type IUserFromDb = IUser & RowDataPacket;
type IProjectSql = IProject & RowDataPacket;

class ProjectRepository {
  async hasAccessToProject(userId: string, projectId: string) {
    const values = [projectId, userId];
    const sql = "SELECT COUNT(*) AS accessCount FROM projectaccess WHERE accessibleProjectId = ? AND userId = ?";

    const [result] = await db.execute<RowDataPacket[]>(sql, values);
    const accessCount = result[0].accessCount;

    return accessCount > 0;
  }

  async getUserProjects(userId: IUser["uuid"]): Promise<IProject[]> {
    const values = [userId];
    const sql = "SELECT P.* FROM projects P JOIN projectaccess PA ON P.projectId = PA.accessibleProjectId WHERE PA.userId = ?";

    const [projects] = await db.execute<IProjectSql[]>(sql, values);
    return projects;
  }

  async createProject({ projectId, projectName, ownerId }: IProject): Promise<IProject["projectId"] | null> {
    const projectValues = [projectId, projectName, ownerId];
    const createProject = "INSERT INTO projects (projectId, projectName, ownerId) VALUES (?, ?, ?)";

    const authorizationValues = [projectId, ownerId];
    const authorizeAccess = "INSERT INTO projectaccess (accessibleProjectId, userId) VALUES (?, ?);";

    const [project] = await db.execute<RowDataPacket[]>(createProject, projectValues);
    const [access] = await db.execute<RowDataPacket[]>(authorizeAccess, authorizationValues);

    return project && access ? projectId : null;
  }

  async deleteProject(projectId: IProject["projectId"]): Promise<IProject["projectId"] | null> {
    const values = [projectId];

    const deleteProjectAccess = "DELETE FROM projectaccess WHERE accessibleProjectId = ?";
    const deleteProject = "DELETE FROM projects WHERE projectId = ?";

    await db.execute(deleteProjectAccess, values);
    const [result] = await db.execute<RowDataPacket[]>(deleteProject, values);

    return result ? projectId : null;
  }
}

export { ProjectRepository };
