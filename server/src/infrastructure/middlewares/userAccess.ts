import dotenv from "dotenv";
import { NextFunction, Request, Response } from "express";
import { userHasProjectAccessGateway } from "../../gateways/access.gateway";
import { ISession } from "../../server";
import { RawData, WebSocket } from "ws";
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

  if (type === "project/createProject" || type === "syncData") {
    return next(parsedData);
  }

  console.log(parsedData);

  // console.log({ type, payload });
  // const projectId = payload.projectId;

  const userHasAccess = await userHasProjectAccessGateway(
    userId,
    payload.projectId
  );
  if (!userHasAccess) {
    return console.error("User does not have access to the project.");
  }

  if (userHasAccess) {
    return next(parsedData);
  }
}
