import dotenv from "dotenv";
import { NextFunction, Request, Response } from "express";
import { userHasProjectAccessGateway } from "../../gateways/access.gateway";
dotenv.config();

export async function userAccess(
  req: Request,
  res: Response,
  next: NextFunction
) {
  if (
    (req.method === "POST" || req.method === "GET") &&
    req.baseUrl === "/project"
  ) {
    return next();
  }

  const userId = req.body.uuid;
  const projectId = req.body.projectId;

  const userHasAccess = await userHasProjectAccessGateway(userId, projectId);
  if (!userHasAccess) {
    return res
      .status(403)
      .json({ message: "User does not have access to the project." });
  }

  next();
}
