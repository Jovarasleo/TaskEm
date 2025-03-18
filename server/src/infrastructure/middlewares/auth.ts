import { NextFunction, Request, Response } from "express";
import { ISession } from "../../server.js";
import jwt from "jsonwebtoken";

const verifyToken = (token: string) => {
  return jwt.verify(token, process.env.TOKEN_SECRET || "");
};

export const auth = (req: Request, res: Response, next: NextFunction) => {
  if (
    req.method === "POST" &&
    (req.originalUrl === "/user/login" || req.originalUrl === "/user")
  ) {
    return next();
  }

  const token = req.cookies.token;
  try {
    const verifiedUser = verifyToken(token);
    if (verifiedUser) {
      return next();
    }
  } catch (err) {
    console.log("Invalid token!");
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
