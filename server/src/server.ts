import cookieParser from "cookie-parser";
import cors from "cors";
import * as dotenv from "dotenv";
import express, { json } from "express";
import { Session } from "express-session";
import http from "http";
import { auth } from "./infrastructure/middlewares/auth.js";
import { userAccessMiddleware } from "./infrastructure/middlewares/userAccess.js";
import authRouters from "./routes/auth.js";
import containerRouters from "./routes/container.js";
import projectRouters from "./routes/project.js";
import taskRouters from "./routes/task.js";
import usersRouters from "./routes/user.js";
import { initializeWebSocketServer } from "./webSocketServer.js";

export interface ISession extends Session {
  userId: string;
  authorized: boolean;
}

dotenv.config();

const app = express();
export const server = http.createServer(app);
initializeWebSocketServer(server);

app.use(
  cors({
    origin: process.env.FRONT_END_ADDRESS,
    credentials: true,
  }),
  cookieParser(),
  json()
);

app.use("/auth", authRouters);
app.use("/user", auth, usersRouters);
app.use("/task", auth, userAccessMiddleware, taskRouters);
app.use("/project", auth, userAccessMiddleware, projectRouters);
app.use("/container", auth, userAccessMiddleware, containerRouters);

server.listen(3000, () => {
  console.log("Server is running on port 3000");
});
