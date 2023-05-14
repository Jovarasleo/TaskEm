import createUser from "../user-cases/createUserInteractor";
import AuthenticateUser from "../user-cases/authUserInteractor";
import { createUserGateway, findUserGateway } from "../gateway/user.gateway";
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
      { generateId, hashPassword },
      { username, password, email }
    );

    const response = await user;
    if (response.error) {
      return res.status(400).send({ error: response?.error });
    }

    res.status(201).send({ message: `user ${username} has been created` });
  } catch (error) {
    console.log(error);
    res.status(500).send("Internal Server Error");
  }
};

export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  try {
    const user = AuthenticateUser(
      { findUserGateway },
      { generateToken },
      { email, password }
    );
    const response = await user;
    if (response) {
      res.status(200).send({ success: true, response: response });
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
