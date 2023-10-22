import * as bcrypt from "bcrypt";
import { IUserFromDb } from "../gateways/user.gateway";
import { IUser } from "../entities/userEntity";
interface Props {
  email: string;
  password: string;
}
interface IGateways {
  findUserGateway: (email: string) => Promise<IUserFromDb[] | undefined>;
}
interface IUtils {
  generateToken: (user: IUser) => string;
}

export async function authenticateUserHandler(
  { findUserGateway }: IGateways,
  { generateToken }: IUtils,
  { email, password }: Props
) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const validateEmail = emailRegex.test(email);

  if (!validateEmail) {
    return { error: "incorrect email or password" };
  }

  const foundUser = await findUserGateway(email);

  if (!foundUser?.length) {
    return { error: "incorrect email or password" };
  }

  const userPassword = foundUser[0].password;
  const passwordMatch = await bcrypt.compare(password, userPassword);

  if (passwordMatch) {
    const myToken = generateToken(foundUser[0]);

    return {
      success: true,
      token: myToken,
      user: {
        userId: foundUser[0].uuid,
        username: foundUser[0].name,
        email: foundUser[0].email,
      },
    };
  } else {
    return { success: false, error: "incorrect email or password" };
  }
}
