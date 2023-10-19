import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { Request, Response, NextFunction } from "express";
import { Socket } from "socket.io";
dotenv.config();

interface Token {
  userId: string;
  iat: number;
  exp: number;
}

declare module "socket.io" {
  interface Socket {
    token: Token; // Replace 'any' with the type of your decoded token
  }
}

export const auth = (req: Request, res: Response, next: NextFunction) => {
  if (req.method === "POST" && req.baseUrl === "/user") {
    return next();
  }

  //Missing token decoder

  if (!req.headers.authorization) {
    res
      .status(401)
      .send({ success: false, error: "Please provide authorization header" });
    return;
  }

  const token = req.headers.authorization.split(" ")[1];

  try {
    const myToken = process.env.TOKEN_SECRET as string;
    const isTokenValid = jwt.verify(token, myToken);
    if (isTokenValid) {
      const tokenData = <Token>jwt.decode(token);
      console.log({ tokenData });
      req.body = { ...req.body, uuid: tokenData.userId };

      return next();
    }
  } catch (e) {
    res.status(401).send({ success: false, error: "invalid token" });
  }
};

export const authorizeSocket = (socket: Socket, next: NextFunction) => {
  // You can access the request object from the socket handshake
  const token = socket.handshake?.auth.token as string;
  console.log({ token });

  if (!token) {
    return next(new Error("Authentication failed. No token provided."));
  }

  // You can use your existing auth middleware to check if the user is authorized
  try {
    // Verify and decode the token
    const myToken = process.env.TOKEN_SECRET as string;
    console.log({ myToken });
    const isTokenValid = jwt.verify(token, myToken);

    if (isTokenValid) {
      const tokenData = <Token>jwt.decode(token);
      socket.token = tokenData;

      return next();
    }
  } catch (e) {
    const err = new Error("Authentication failed. Invalid token.");
    return next(err);
  }
};
