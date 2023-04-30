import jwt from "jsonwebtoken";
import * as bcrypt from "bcrypt";

interface Props {
  email: string;
  password: string;
}

async function AuthenticateUser(
  { findUserGateway }: any,
  { email, password }: Props
) {
  const validateEmail = email?.length > 2;
  if (!validateEmail) {
    return { error: "incorrect email or password" };
  }

  const foundUser = await findUserGateway(email);
  if (!foundUser) {
    return { error: "incorrect email or password" };
  }

  const userPassword = foundUser[0].password;
  const passwordMatch = await bcrypt.compare(password, userPassword);

  if (passwordMatch) {
    const myToken = process.env.TOKEN_SECRET as string;
    const getToken = jwt.sign(
      { userId: foundUser.id, name: foundUser.name },
      myToken,
      {
        expiresIn: 2000,
      }
    );

    return { token: getToken };
  }
}

export default AuthenticateUser;
