import { Request, Response } from "express";
import { getUserDataGateway } from "../gateways/user.gateway.js";
import { getUserDataHandler } from "../handlers/userHandler.js";
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
