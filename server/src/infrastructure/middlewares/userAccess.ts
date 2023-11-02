import dotenv from "dotenv";
import { NextFunction, Request, Response } from "express";
import { userHasProjectAccessGateway } from "../../gateways/access.gateway";
import { ISession } from "../../server";

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
  const parsedData = JSON.parse(data.toString());
  const { type, payload } = parsedData;

  console.log("access middleware", { ...parsedData });

  if (
    type === "project/createProject" ||
    type === "container/createContainer" ||
    type === "syncData"
  ) {
    return next(parsedData);
  }

  // console.log({ type, payload });
  const isPayloadArray = Array.isArray(payload);
  const projectId = isPayloadArray ? 0 : payload?.projectId;

  const userHasAccess = await userHasProjectAccessGateway(userId, projectId);
  if (!userHasAccess) {
    return console.error("User does not have access to the project.");
  }

  return next(parsedData);
}
