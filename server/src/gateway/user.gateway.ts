import db from "../interface/data.access";

export async function createUserGateway(user: any) {
  const sql =
    "INSERT INTO users (uuid, name, password, email) VALUES (?, ?, ?, ?)";
  const { username, password, email } = user;

  const values = ["112233", username, password, email];

  try {
    const newUser = await db.execute(sql, values);
    return newUser;
  } catch (error) {
    console.log(error);
  }
}
