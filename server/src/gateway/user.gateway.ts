import db from "../interface/data.access";

export async function createUserGateway(user: any) {
  const sql =
    "INSERT INTO users (uuid, name, password, email) VALUES (?, ?, ?, ?)";
  const { email, username, password, uuid } = user;
  const values = [uuid, username, password, email];
  console.log(values);

  try {
    const [newUser] = await db.execute(sql, values);

    return newUser;
  } catch (error) {
    console.log(error);
  }
}

export async function findUserGateway(email: string) {
  const sql = "SELECT * FROM users WHERE email = ? LIMIT 1";
  const values = [email];
  try {
    const [foundUser] = await db.execute(sql, values);
    return foundUser;
  } catch (error) {
    console.log(error);
  }
}
