import * as bcrypt from "bcrypt";

async function hashPassword(password: string) {
  console.log("before hasing password:", password);
  const hashedPassword = await bcrypt.hash(password, 10);
  return hashedPassword;
}

export default hashPassword;
