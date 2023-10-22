import { createUserHandler, getUserDataHandler } from "../handlers/userHandler";
import { authenticateUserHandler } from "../handlers/authHandler";
import {
  createUserGateway,
  findUserGateway,
  getUserDataGateway,
} from "../gateways/user.gateway";
import generateId from "../infrastructure/utils/uuidGenerator";
import hashPassword from "../infrastructure/utils/passwordHash";
import { generateToken } from "../infrastructure/utils/jwtGenerator";
import { Request, Response, NextFunction } from "express";
import { ISession } from "../server";
import { randomUUID } from "crypto";

export const getUserData = async (req: Request, res: Response) => {
  // console.log({ req });
  try {
    const { userId } = req.session as ISession;
    const { session, sessionID, sessionStore } = req;
    console.log({ session });
    // console.log((sessionStore as any).sessions);

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
      { generateId, hashPassword, generateToken },
      { username, password, email }
    );

    if (response.error) {
      return res.status(400).send({ success: false, error: response?.error });
    }

    return res.status(201).send({
      success: true,
      message: `user ${username} has been created`,
      token: response.myToken,
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
      { generateToken },
      { email, password }
    );

    if (response.success && response.user) {
      let session = req.session as ISession;
      session.userId = response.user.userId;
      session.authorized = true;

      return res
        .status(200)
        .send({ success: true, token: response.token, user: response.user });
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
