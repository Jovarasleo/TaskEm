import * as bcrypt from "bcrypt";
import { IUserFromDb } from "../gateway/user.gateway";
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

async function AuthenticateUser(
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

    return { token: myToken, user: { username: foundUser[0].username } };
  } else {
    return { error: "incorrect email or password" };
  }
}

export default AuthenticateUser;
