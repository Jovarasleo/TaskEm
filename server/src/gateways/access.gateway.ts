import { RowDataPacket } from "mysql2";
import db from "../interface/data.access.js";

export async function userHasProjectAccessGateway(
  userId: string,
  projectId: string
) {
  const sql =
    "SELECT COUNT(*) AS accessCount FROM projectaccess WHERE accessibleProjectId = ? AND userId = ?";
  const values = [projectId, userId];
  try {
    const [result] = await db.execute<RowDataPacket[]>(sql, values);
    const accessCount = result[0].accessCount;
    return accessCount > 0; // Return true if the count is greater than 0 (user has access)
  } catch (error) {
    console.error("Error checking user project access:", error);
    throw new Error("Failed to check user project access");
  }
}
