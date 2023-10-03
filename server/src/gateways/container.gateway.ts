import { IContainer } from "../entities/containerEntity";
import db from "../interface/data.access";

export async function setContainerGateway({
  containerId,
  containerName,
  position,
  projectId,
}: IContainer) {
  const sql =
    "INSERT INTO containers (containerId, containerName, position, projectId) VALUES (?, ?, ?, ?)";
  const values = [containerId, containerName, position, projectId];

  try {
    console.log(values);
    const result = await db.execute(sql, values);
    console.log("Container inserted successfully:", result);

    return containerId;
  } catch (error) {
    console.error("Error inserting container:", error);
    console.log({ values });
    throw new Error("Failed to insert container");
  }
}
