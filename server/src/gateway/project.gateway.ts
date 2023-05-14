import db from "../interface/data.access";

export async function getUserProjectsGateway(uuid: string) {
  const sql = "SELECT * FROM users WHERE projects = ?";
  const sql2 =
    "SELECT * FROM projects INNER JOIN user_projects ON user_projects.project_id = projects.id INNER JOIN (SELECT id FROM users WHERE uuid = ?) AS u ON u.id = user_projects.user_id";
  const values = [uuid];
  try {
    const [projects] = await db.execute(sql2, values);
    console.log(projects);
    return projects;
  } catch (error) {
    console.log(error);
  }
}
