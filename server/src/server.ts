import cookieParser from "cookie-parser";
import cors from "cors";
import * as dotenv from "dotenv";
import express, { json } from "express";
import http from "http";
import { authMiddleware } from "./infrastructure/middlewares/authentication.js";
import authRouters from "./routes/auth.js";
import usersRouter from "./routes/user.js";
import { initializeWebSocketServer } from "./webSocketServer.js";

export interface TokenData {
  id: string;
  email: string;
  iat: number;
  exp: number;
}

declare global {
  namespace Express {
    interface Request {
      user: TokenData;
    }
  }
}

dotenv.config();

const app = express();
export const server = http.createServer(app);

const clearCookie = () => app.response.clearCookie("token");
initializeWebSocketServer(server, clearCookie);

app.use(
  cors({
    origin: process.env.FRONT_END_ADDRESS,
    credentials: true,
  }),
  cookieParser(),
  json()
);

app.use("/auth", authRouters);
app.use("/user", authMiddleware, usersRouter);

server.listen(3000, () => {
  console.log("Server is running on port 3000");
});
