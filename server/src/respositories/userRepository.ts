import db from "../interface/data.access";
import { IUser } from "../entities/userEntity.js";
import { RowDataPacket } from "mysql2";

export type IUserFromDb = IUser & RowDataPacket;

class UserRepository {
  async getUserById(uuid: string): Promise<IUserFromDb | null> {
    const sql = "SELECT * FROM users WHERE uuid = ? LIMIT 1";
    const values = [uuid];

    const [foundUser] = await db.execute<IUserFromDb[]>(sql, values);
    return foundUser.length > 0 ? foundUser[0] : null;
  }

  async getUserByEmail(email: string): Promise<IUserFromDb | null> {
    const sql = "SELECT * FROM users WHERE email = ? LIMIT 1";
    const values = [email];

    const [foundUser] = await db.execute<IUserFromDb[]>(sql, values);
    return foundUser.length > 0 ? foundUser[0] : null;
  }

  async createUser({ email, username, password, uuid }: IUser) {
    const sql =
      "INSERT INTO users (uuid, name, password, email) VALUES (?, ?, ?, ?)";
    const values = [uuid, username, password, email];

    const newUser = await db.execute(sql, values);

    if (!newUser) {
      return null;
    }

    return await this.getUserByEmail(email);
  }

  async isUserAuthorized(userId: string, projectId: string) {
    const sql =
      "SELECT COUNT(*) AS accessCount FROM projectaccess WHERE accessibleProjectId = ? AND userId = ?";
    const values = [projectId, userId];

    const [result] = await db.execute<RowDataPacket[]>(sql, values);
    const accessCount = result[0].accessCount;

    return accessCount > 0;
  }
}

export { UserRepository };
