import createUser from "../handlers/userHandler";
import AuthenticateUser from "../handlers/authHandler";
import { createUserGateway, findUserGateway } from "../gateways/user.gateway";
import generateId from "../infrastructure/utils/uuidGenerator";
import hashPassword from "../infrastructure/utils/passwordHash";
import { generateToken } from "../infrastructure/utils/jwtGenerator";
import { Request, Response, NextFunction } from "express";

export const getUserByUuid = async (req: Request, res: Response) => {
  try {
    const { uuid } = req.body;

    res.status(200).send("get user by uid");
  } catch (error) {
    res.status(500).send("Internal Server Error");
  }
};

export const setUser = async (req: Request, res: Response) => {
  try {
    const { username, password, email } = req.body;
    const user = createUser(
      { findUserGateway, createUserGateway },
      { generateId, hashPassword, generateToken },
      { username, password, email }
    );

    const response = await user;
    if (response.error) {
      return res.status(400).send({ success: false, error: response?.error });
    }

    res.status(201).send({
      success: true,
      message: `user ${username} has been created`,
      token: response.myToken,
      user: response.user,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({ success: false, error: "Internal Server Error" });
  }
};

export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;
  console.log({ email, password });

  try {
    const user = AuthenticateUser(
      { findUserGateway },
      { generateToken },
      { email, password }
    );
    const response = await user;
    if (response) {
      res
        .status(200)
        .send({ success: true, token: response.token, user: response.user });
    }
    if (!user) {
      res.send({ success: false, error: "User not found" });
      return;
    }
  } catch (e) {
    console.log(e);
    res.status(500).send({ success: false, error: "internal server error" });
    return;
  }
};
