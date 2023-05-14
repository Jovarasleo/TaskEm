import * as bcrypt from "bcrypt";
import { IUserFromDb } from "../gateway/user.gateway";
import { IUser } from "../entities/userEntity";
interface Props {
  uuid: string;
}
interface IGateways {
  findUserGateway: (email: string) => Promise<IUserFromDb[] | undefined>;
}
interface IUtils {
  generateToken: (user: IUser) => string;
}

async function UserProjects({ getUserProjectsGateway }: any, { uuid }: Props) {
  const project = getUserProjectsGateway(uuid);
  console.log(uuid);
  return project;
}

export default UserProjects;
