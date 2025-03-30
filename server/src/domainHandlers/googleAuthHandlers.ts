import User from "../entities/userEntity.js";
import hashPassword from "../infrastructure/utils/passwordHash.js";
import generateId from "../infrastructure/utils/uuidGenerator.js";
import { accessLayer } from "../respositories/accessLayer.js";

export async function googleUserRegistrationHandler(username: string, email: string, id: string) {
  const foundUser = await accessLayer.user.getUserByEmail(email);
  if (foundUser) {
    return { success: true, error: null, data: foundUser };
  }

  const user = new User({ username, email, uuid: id });
  const validatedUser = await user.validateUser(generateId, hashPassword);

  if (validatedUser.error) {
    return { success: false, error: validatedUser.error, data: null };
  }

  const createdUser = await accessLayer.user.createUser(validatedUser);
  if (!createdUser) {
    return { success: false, error: "Something went wrong", data: null };
  }

  return { success: true, error: null, data: createdUser };
}
