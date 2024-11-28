import { RowDataPacket } from "mysql2";
import { IProject } from "../entities/projectEntity.js";
import db from "../interface/data.access.js";

export async function getUserProjectsGateway(userId: string) {
  const sql =
    "SELECT P.* FROM projects P JOIN projectaccess PA ON P.projectId = PA.accessibleProjectId WHERE PA.userId = ?";
  const values = [userId];
  try {
    const [projects] = await db.execute<RowDataPacket[]>(sql, values);
    return projects;
  } catch (error) {
    console.log(error);
  }
}

export async function setProjectGateway({
  projectId,
  projectName,
  userId,
}: IProject) {
  const sql =
    "INSERT INTO projects (projectId, projectName, ownerId) VALUES (?, ?, ?)";
  const values = [projectId, projectName, userId];

  const projectAccess =
    "INSERT INTO projectaccess (accessibleProjectId, userId) VALUES (?, ?);";
  const values2 = [projectId, userId];

  try {
    console.log(values);
    const result = await db.execute<RowDataPacket[]>(sql, values);
    console.log("Project inserted successfully:", result);
    const result1 = await db.execute<RowDataPacket[]>(projectAccess, values2);
    console.log("Access granted:", result1);

    return projectId; // Return the generated project ID if needed
  } catch (error) {
    console.error("Error inserting project:", error);
    throw new Error("Failed to insert project");
  }
}

export async function deleteProjectGateway(projectId: string) {
  const deleteProjectAccess =
    "DELETE FROM projectaccess WHERE accessibleProjectId = ?";
  const deleteProject = "DELETE FROM projects WHERE projectId = ?";

  const values = [projectId];

  try {
    await db.execute(deleteProjectAccess, values);
    const [result] = await db.execute<RowDataPacket[]>(deleteProject, values);

    return {
      success: true,
      message: ["Project deleted successfully"],
      data: result,
    };
  } catch (error) {
    console.error("Error deleting project:", error);
    throw new Error("Failed to delete project");
  }
}
