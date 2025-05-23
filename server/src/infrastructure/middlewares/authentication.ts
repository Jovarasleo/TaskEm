import jwt from "jsonwebtoken";
import { NextFunction, Request, Response } from "express";
import { TokenData } from "../../server";
import { parse } from "cookie";

export const verifyToken = (token: string) => jwt.verify(token, process.env.TOKEN_SECRET || "") as TokenData;

export const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
  if (req.method === "POST" && (req.originalUrl === "/auth/login" || req.originalUrl === "/auth")) {
    return next();
  }

  const cookies = parse(req.headers.cookie ?? "");
  const token = cookies.token ?? "";

  try {
    const verifiedUser = verifyToken(token);
    req.user = verifiedUser;

    if (verifiedUser) {
      return next();
    }
  } catch (err) {
    console.log("Invalid token!");
  }

  return res.status(401).send({ success: false, error: "Please provide authorization header" });
};

export const authenticationSocketMiddleware = (req: Request, socket: WebSocket, next: NextFunction) => {
  const token = req.cookies.token;
  try {
    const verifiedUser = verifyToken(token);
    if (verifiedUser) {
      return next();
    }
  } catch (err) {
    console.log("Invalid token!");
  }

  if (socket) {
    return next(new Error("Authentication failed. No token provided."));
  }

  // You can use your existing auth middleware to check if the user is authorized
  const err = new Error("Authentication failed. Invalid token.");
  return next(err);
};
