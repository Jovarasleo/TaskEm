import { Request, Response } from "express";
import { getUserDataHandler } from "../domainHandlers/userHandlers.js";

export const getUserData = async (req: Request, res: Response) => {
  try {
    const userId = req.user.id;
    const response = await getUserDataHandler(userId);

    if (!response.success) {
      return res.status(400).send({ success: false, error: response.error });
    }

    return res.status(200).send({ success: true, user: response.data });
  } catch (error) {
    res.status(500).send("Internal Server Error");
  }
};
