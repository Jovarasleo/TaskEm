import dotenv from "dotenv";
import { NextFunction, Request, Response } from "express";
import { userHasProjectAccessGateway } from "../../gateways/access.gateway.js";
import { ISession } from "../../server.js";

dotenv.config();

export async function authorizationMiddleware(
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

  const userId = (req.session as ISession).userId;
  const projectId = req.body.projectId;

  const userHasAccess = await userHasProjectAccessGateway(userId, projectId);
  if (!userHasAccess) {
    return res
      .status(403)
      .json({ message: "User does not have access to the project." });
  }

  next();
}

export async function authorizationSocketMiddleware(
  data: any,
  userId: string,
  next: NextFunction
) {
  const parsedData = JSON.parse(data);
  const { type, payload } = parsedData;

  if (
    type === "project/clientCreateProject" ||
    type === "container/clientCreateContainer" ||
    type === "syncData"
  ) {
    return next(parsedData);
  }

  const isPayloadArray = Array.isArray(payload);
  if (isPayloadArray) {
    for (const item of payload) {
      const userHasAccess = await userHasProjectAccessGateway(
        userId,
        item.projectId
      );

      if (!userHasAccess) {
        return console.error("User does not have access to the project.");
      }
    }
  } else if (payload) {
    const userHasAccess = await userHasProjectAccessGateway(
      userId,
      payload?.projectId
    );
    if (!userHasAccess) {
      return console.error("User does not have access to the project.");
    }
  }

  return next(parsedData);
}
