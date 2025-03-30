import User, { IUser } from "../entities/userEntity.js";
import hashPassword from "../infrastructure/utils/passwordHash.js";
import generateId from "../infrastructure/utils/uuidGenerator.js";
import { accessLayer } from "../respositories/accessLayer.js";
import * as bcrypt from "bcrypt";

export async function registrationHandler(username: string, password: string, email: string) {
  const foundUser = await accessLayer.user.getUserByEmail(email);
  if (foundUser) {
    return { success: false, error: "Email is already taken", data: null };
  }

  const user = new User({ username, password, email, uuid: "" });
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

export async function loginHandler(email: IUser["email"], password: IUser["password"]) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const validateEmail = emailRegex.test(email);

  if (!validateEmail) {
    return { success: false, error: "Invalid email or password", data: null };
  }

  const foundUser = await accessLayer.user.getUserByEmail(email);

  if (!foundUser || !foundUser.password || !password) {
    return { success: false, error: "Incorrect email or password", data: null };
  }

  const passwordMatch = await bcrypt.compare(password, foundUser.password);
  if (passwordMatch) {
    return {
      success: true,
      data: foundUser,
      error: null,
    };
  } else {
    return { success: false, error: "Incorrect email or password", data: null };
  }
}
