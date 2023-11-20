import { RowDataPacket } from "mysql2";
import db from "../interface/data.access.js";
import { IUser } from "../entities/userEntity.js";

export type IUserFromDb = IUser & RowDataPacket;

export async function createUserGateway(user: IUser) {
  const sql =
    "INSERT INTO users (uuid, name, password, email) VALUES (?, ?, ?, ?)";
  const { email, username, password, uuid } = user;
  const values = [uuid, username, password, email];
  console.log(values);

  try {
    const newUser = await db.execute(sql, values);

    if (!newUser) {
      console.error("Error creating a user:");
      throw new Error("Failed to insert a user");
    }

    return await findUserGateway(email);
  } catch (error) {
    console.error("Error creating a user:", error);
    throw new Error("Failed to insert a user");
  }
}

export async function findUserGateway(email: string) {
  const sql = "SELECT * FROM users WHERE email = ? LIMIT 1";
  const values = [email];
  try {
    const [foundUser] = await db.execute<IUserFromDb[]>(sql, values);
    return foundUser;
  } catch (error) {
    console.error("Error finding a user:", error);
    throw new Error("Failed to find a user");
  }
}

export async function getUserDataGateway(uuid: string) {
  const sql = "SELECT * FROM users WHERE uuid = ? LIMIT 1";
  const values = [uuid];
  try {
    const [foundUser] = await db.execute<IUserFromDb[]>(sql, values);
    return foundUser;
  } catch (error) {
    console.error("Error finding user data:", error);
    throw new Error("Failed to find user data");
  }
}
