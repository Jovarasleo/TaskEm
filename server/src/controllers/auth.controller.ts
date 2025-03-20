import { Request, Response } from "express";
import {
  createUserGateway,
  findUserGateway,
} from "../gateways/user.gateway.js";
import { authenticateUserHandler } from "../handlers/authHandler.js";
import { createUserHandler } from "../handlers/userHandler.js";
import hashPassword from "../infrastructure/utils/passwordHash.js";
import generateId from "../infrastructure/utils/uuidGenerator.js";
import { generateToken } from "../infrastructure/utils/jwtGenerator.js";

export const register = async (req: Request, res: Response) => {
  try {
    const { username, password, email } = req.body;
    const response = await createUserHandler(
      { findUserGateway, createUserGateway },
      { generateId, hashPassword },
      { username, password, email }
    );

    if (response.error || !response.user) {
      return res.status(400).send({ success: false, error: response?.error });
    }

    const jwtToken = generateToken(response.user);

    res.cookie("token", jwtToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
    });

    return res.status(201).send({
      success: true,
      message: `user ${username} has been created`,
      user: response.user,
    });
  } catch (ex) {
    console.error(ex);
    res.status(500).send({ success: false, error: ["Internal Server Error"] });
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
      const jwtToken = generateToken(response.user);

      res.cookie("token", jwtToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
      });

      return res.status(201).send({
        success: true,
        user: response.user,
      });
    }

    return res
      .status(401)
      .send({ success: false, error: ["incorrect credentials"] });
  } catch (e) {
    console.log(e);
    res.status(500).send({ success: false, error: ["internal server error"] });
    return;
  }
};

export const logout = async (_: Request, res: Response) => {
  try {
    res
      .clearCookie("token")
      .status(200)
      .send({ success: true, message: "Logged Out" });
  } catch (e) {
    return res
      .status(500)
      .send({ success: false, error: "internal server error" });
  }
};
