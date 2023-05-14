import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { Request, Response, NextFunction } from "express";
dotenv.config();

interface Token {
  userId: string;
  iat: number;
  exp: number;
}

export const auth = (req: Request, res: Response, next: NextFunction) => {
  if (req.method === "POST" && req.baseUrl === "/user") {
    return next();
  }

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
      req.body = { uuid: tokenData.userId };
      next();
      return;
    }
  } catch (e) {
    res.status(401).send({ success: false, error: "invalid token" });
  }
};
