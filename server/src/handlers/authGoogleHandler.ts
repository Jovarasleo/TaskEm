import User, { IUser } from "../entities/userEntity.js";
import { IUserFromDb } from "../gateways/user.gateway.js";

interface Props {
  username: string;
  id: string;
  email: string;
}

interface createUserGateways {
  findUserGateway(email: string): Promise<IUserFromDb[]>;
  createUserGateway(user: IUser): Promise<IUserFromDb[]>;
}

export async function createGoogleUserHandler(
  { findUserGateway, createUserGateway }: createUserGateways,
  data: Props
) {
  if (!data || !data.username || !data.id || !data.email) {
    return { error: "missing user data" };
  }

  const { username, id, email } = data;
  const foundUser = findUserGateway(email);
  const isUserFound = await foundUser;

  if (isUserFound.length) {
    return { error: "Email is already in use" };
  }

  const user = new User({ username, uuid: id, email });
  const validatedUser = await user.validateGoogleUser();

  if (validatedUser.error) {
    return { error: validatedUser.error };
  } else {
    const newUser = await createUserGateway(validatedUser);

    return {
      user: { username: newUser[0].name, email: newUser[0].email },
    };
  }
}
