import User from "../entities/userEntity";

interface Props {
  username: string;
  password: string;
  email: string;
}

async function createUser(
  { createUserGateway }: any,
  { username, password, email }: Props
) {
  const user = new User(username, password, email);
  const validatedUser = user.getUser();

  const newUser = await createUserGateway(validatedUser);
  return newUser;
}

export default createUser;
