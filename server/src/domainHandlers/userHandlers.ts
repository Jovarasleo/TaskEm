import { IUser } from "../entities/userEntity";
import { accessLayer } from "../respositories/accessLayer";

export async function getUserDataHandler(userId: IUser["uuid"]) {
  const user = await accessLayer.user.getUserById(userId);

  if (!user) {
    return { success: false, error: "Something went wrong", data: null };
  }

  return { success: true, error: null, data: user };
}
