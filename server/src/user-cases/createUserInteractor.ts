import User from "../entities/userEntity";

interface Props {
  username: string;
  password: string;
  email: string;
}

async function createUser(
  { findUserGateway, createUserGateway }: any,
  { generateId, hashPassword }: any,
  { username, password, email }: Props
) {
  if (!username || !password || !email) {
    return { error: "missing data" };
  }

  const foundUser = findUserGateway(email);
  const isUserFound = await foundUser;

  if (isUserFound.length) {
    return { error: "Email is already being used" };
  }

  const user = new User(username, password, email);
  const validatedUser = await user.validateUser(generateId, hashPassword);

  if (validatedUser.error) {
    return { error: validatedUser.error };
  } else {
    const newUser = await createUserGateway(validatedUser);
    return newUser;
  }
}

export default createUser;
