import jwt from "jsonwebtoken";
import { IUser } from "../../entities/userEntity";

export const generateToken = (user: IUser) => {
  if (!process.env.TOKEN_SECRET) {
    throw new Error("missing token secret");
  }

  return jwt.sign(
    { id: user.uuid, email: user.email },
    process.env.TOKEN_SECRET,
    {
      expiresIn: "1h",
    }
  );
};
