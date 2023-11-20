import User, { IUser } from "../entities/userEntity.js";
import { IUserFromDb } from "../gateways/user.gateway.js";

interface Props {
  username: string;
  password: string;
  email: string;
}

interface createUserGateways {
  findUserGateway(email: string): Promise<IUserFromDb[]>;
  createUserGateway(user: IUser): Promise<IUserFromDb[]>;
}
interface propFunctions {
  generateId: () => string;
  hashPassword: (password: string) => Promise<string>;
}

type GetUserDataGateway = (uuid: string) => Promise<IUserFromDb[]>;

export async function createUserHandler(
  { findUserGateway, createUserGateway }: createUserGateways,
  { generateId, hashPassword }: propFunctions,
  data: Props
) {
  if (!data) {
    return { error: "Email is already in use" };
  }

  const { username, password, email } = data;
  if (!username || !password || !email) {
    return { error: "missing data" };
  }

  const foundUser = findUserGateway(email);
  const isUserFound = await foundUser;

  if (isUserFound.length) {
    return { error: "Email is already in use" };
  }

  const user = new User(username, password, email);
  const validatedUser = await user.validateUser(generateId, hashPassword);

  if (validatedUser.error) {
    return { error: validatedUser.error };
  } else {
    const newUser = await createUserGateway(validatedUser);

    return {
      user: { username: newUser[0].name, email: newUser[0].email },
    };
  }
}

export async function getUserDataHandler(
  getUserDataGateway: GetUserDataGateway,
  uuid: string
) {
  if (!uuid) {
    return { success: false, error: "missing uuid" };
  }

  const userData = await getUserDataGateway(uuid);

  if (!userData.length) {
    return { error: "User Not Found" };
  }

  return {
    success: true,
    user: { username: userData[0].name, email: userData[0].email },
  };
}
