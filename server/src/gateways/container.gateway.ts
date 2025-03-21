import { RowDataPacket } from "mysql2";
import { IContainer } from "../entities/containerEntity.js";
import db from "../interface/data.access.js";

export async function setContainerGateway({
  containerId,
  containerName,
  position,
  createdAt,
  modifiedAt,
  projectId,
}: IContainer) {
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

  try {
    const result = await db.execute(sql, values);
    console.log("Container inserted successfully:", result);

    return containerId;
  } catch (error) {
    console.error("Error inserting container:", error);
    throw new Error("Failed to insert container");
  }
}

export async function getContainersGateway(projectId: string) {
  const sql = "SELECT * FROM containers WHERE projectId = ?";
  const values = [projectId];

  try {
    const [result] = await db.execute<RowDataPacket[]>(sql, values);

    return result;
  } catch (error) {
    console.error("Error retrieving containers:", error);
    console.log({ values });
    throw new Error("Failed to retrieve containers");
  }
}
