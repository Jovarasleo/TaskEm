import {
  createUserHandler,
  getUserDataHandler,
} from "../handlers/userHandler.js";
import { authenticateUserHandler } from "../handlers/authHandler.js";
import {
  createUserGateway,
  findUserGateway,
  getUserDataGateway,
} from "../gateways/user.gateway.js";
import generateId from "../infrastructure/utils/uuidGenerator.js";
import hashPassword from "../infrastructure/utils/passwordHash.js";
import { Request, Response } from "express";
import { ISession } from "../server.js";

export const getUserData = async (req: Request, res: Response) => {
  try {
    const { userId } = req.session as ISession;

    const data = getUserDataHandler(getUserDataGateway, userId);
    const response = await data;

    if (!response.success) {
      return res.status(400).send({ success: false, error: response.error });
    }

    return res.status(200).send({ success: true, user: response.user });
  } catch (error) {
    res.status(500).send("Internal Server Error");
  }
};

export const setUser = async (req: Request, res: Response) => {
  try {
    const { username, password, email } = req.body;
    const response = await createUserHandler(
      { findUserGateway, createUserGateway },
      { generateId, hashPassword },
      { username, password, email }
    );

    if (response.error) {
      return res.status(400).send({ success: false, error: response?.error });
    }

    return res.status(201).send({
      success: true,
      message: `user ${username} has been created`,
      user: response.user,
    });
  } catch (error) {
    console.log({ error });
    res.status(500).send({ success: false, error: "Internal Server Error" });
  }
};

export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  try {
    const response = await authenticateUserHandler(
      { findUserGateway },
      { email, password }
    );

    if (response.success && response.user) {
      let session = req.session as ISession;
      session.userId = response.user.userId;
      session.authorized = true;

      console.log(req.session);

      req.session.save();

      return res.status(200).send({ success: true, user: response.user });
    }

    return res
      .status(401)
      .send({ success: false, error: "incorrect credentials" });
  } catch (e) {
    console.log(e);
    res.status(500).send({ success: false, error: "internal server error" });
    return;
  }
};

export const logout = async (req: Request, res: Response) => {
  try {
    req.session.destroy(() => {
      return res.status(200).send({ success: true, message: "Logged Out" });
    });
  } catch (e) {
    return res
      .status(500)
      .send({ success: false, error: "internal server error" });
  }
};
