import { IProject } from "../entities/projectEntity";
import db from "../interface/data.access";

export async function getUserProjectsGateway(uuid: string) {
  // const sql = `SELECT projectId, projectName FROM projects WHERE projects.uuid = ?`;
  // const values = [uuid];
  const sql =
    "SELECT P.* FROM Projects P JOIN ProjectAccess PA ON P.projectId = PA.accessibleProjectId WHERE PA.userId = ?";
  const values = [uuid];
  try {
    const [projects] = await db.execute(sql, values);
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
    const result = await db.execute(sql, values);
    console.log("Project inserted successfully:", result);
    const result1 = await db.execute(projectAccess, values2);
    console.log("Access granted:", result1);

    return projectId; // Return the generated project ID if needed
  } catch (error) {
    console.error("Error inserting project:", error);
    throw new Error("Failed to insert project");
  }
}

export async function deleteProjectGateway(projectId: string) {
  const sql = "DELETE FROM projects WHERE projectId = ?";
  const values = [projectId];

  try {
    const [result] = await db.execute(sql, values);

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
