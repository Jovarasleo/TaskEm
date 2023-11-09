import dotenv from "dotenv";
import { NextFunction, Request, Response } from "express";
import { ISession } from "../../server";
dotenv.config();

export const auth = (req: Request, res: Response, next: NextFunction) => {
  if (
    req.method === "POST" &&
    (req.originalUrl === "/user/login" || req.originalUrl === "/user")
  ) {
    return next();
  }

  if ((req.session as ISession).authorized) {
    return next();
  }

  return res
    .status(401)
    .send({ success: false, error: "Please provide authorization header" });
};

export const authorizeSocket = (
  req: Request,
  res: Response,
  socket: WebSocket,
  next: NextFunction
) => {
  // You can access the request object from the socket handshake

  if ((req.session as ISession).authorized) {
    return next();
  }

  if (socket) {
    return next(new Error("Authentication failed. No token provided."));
  }

  // You can use your existing auth middleware to check if the user is authorized
  const err = new Error("Authentication failed. Invalid token.");
  return next(err);
};
