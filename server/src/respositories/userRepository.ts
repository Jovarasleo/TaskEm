import db from "../interface/data.access.js";
import { IUser } from "../entities/userEntity.js";
import { RowDataPacket } from "mysql2";

export type IUserSql = IUser & RowDataPacket;

class UserRepository {
  async getUserById(uuid: string): Promise<IUser | null> {
    const sql = "SELECT * FROM users WHERE uuid = ? LIMIT 1";
    const values = [uuid];

    const [foundUser] = await db.execute<IUserSql[]>(sql, values);
    return foundUser.length > 0 ? foundUser[0] : null;
  }

  async getUserByEmail(email: string): Promise<IUser | null> {
    const sql = "SELECT * FROM users WHERE email = ? LIMIT 1";
    const values = [email];

    const [foundUser] = await db.execute<IUserSql[]>(sql, values);
    return foundUser.length > 0 ? foundUser[0] : null;
  }

  async createUser({ email, username, password, uuid }: IUser) {
    const sql = "INSERT INTO users (uuid, username, password, email) VALUES (?, ?, ?, ?)";
    const values = [uuid, username, password, email];

    const newUser = await db.execute(sql, values);

    if (!newUser) {
      return null;
    }

    return await this.getUserByEmail(email);
  }
}

export { UserRepository };
