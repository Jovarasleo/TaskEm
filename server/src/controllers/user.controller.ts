import createUser from "../user-cases/createUserInteractor";
import { createUserGateway } from "../gateway/user.gateway";
import { Request, Response, NextFunction } from "express";

export const getUserByUuid = async (req: Request, res: Response) => {
  try {
    const { uuid } = req.body;

    res.status(200).send("projects");
  } catch (error) {
    res.status(500).send("Internal Server Error");
  }
};

export const setUser = async (req: Request, res: Response) => {
  try {
    const { username, password, email } = req.body;
    const user = createUser(
      { createUserGateway },
      { username, password, email }
    );

    const response = await user;
    console.log(response);

    res.status(201).send({ message: `user ${username} has been created` });
  } catch (error) {
    console.log(error);
    res.status(500).send("Internal Server Error");
  }
};
