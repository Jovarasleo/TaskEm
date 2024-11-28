import dotenv from "dotenv";
import { NextFunction, Request, Response } from "express";
import { userHasProjectAccessGateway } from "../../gateways/access.gateway.js";
import { ISession } from "../../server.js";

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

  const userId = (req.session as ISession).userId;
  console.log(userId);
  const projectId = req.body.projectId;

  const userHasAccess = await userHasProjectAccessGateway(userId, projectId);
  if (!userHasAccess) {
    return res
      .status(403)
      .json({ message: "User does not have access to the project." });
  }

  next();
}

export async function userAccessSocketMiddleware(
  data: any,
  userId: string,
  next: NextFunction
) {
  const parsedData = JSON.parse(data);
  const { type, payload } = parsedData;

  console.log("access middleware", { ...parsedData });

  if (
    type === "project/createProject" ||
    type === "container/createContainer" ||
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
      console.log({ userHasAccess });
      if (!userHasAccess) {
        return console.error("User does not have access to the project.");
      }
    }
  } else {
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
