import jwt from "jsonwebtoken";
import { IUser } from "../../entities/userEntity";

export const generateToken = (user: IUser) => {
  const myToken = process.env.TOKEN_SECRET as string;
  const getToken = jwt.sign(
    { userId: user.uuid, username: user.username },
    myToken,
    {
      expiresIn: 2000,
    }
  );
  return getToken;
};
