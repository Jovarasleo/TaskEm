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
  const newUser = await createUserGateway(user);

  return newUser;
}

export default createUser;
