import cookieParser from "cookie-parser";
import cors from "cors";
import * as dotenv from "dotenv";
import express, { json } from "express";
import { Session } from "express-session";
import http from "http";
import { authMiddleware } from "./infrastructure/middlewares/authentication.js";
import { authorizationMiddleware } from "./infrastructure/middlewares/authorization.js";
import authRouters from "./routes/auth.js";
import usersRouter from "./routes/user.js";
import taskRouter from "./routes/task.js";
import containerRouter from "./routes/container.js";
import projectRouter from "./routes/project.js";
import { initializeWebSocketServer } from "./webSocketServer.js";

export interface ISession extends Session {
  userId: string;
  authorized: boolean;
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
app.use("/task", authMiddleware, authorizationMiddleware, taskRouter);
app.use("/project", authMiddleware, authorizationMiddleware, projectRouter);
app.use("/container", authMiddleware, authorizationMiddleware, containerRouter);

server.listen(3000, () => {
  console.log("Server is running on port 3000");
});
