import cors from "cors";
import * as dotenv from "dotenv";
import express, { json } from "express";
import { Session } from "express-session";
import http from "http";
import { WebSocketServer } from "ws";
import cookieParser from "cookie-parser";
import jwt from "jsonwebtoken";
import {
  getContainersSocketController,
  setContainerSocketHandler,
} from "./controllers/container.controller.js";
import {
  deleteProjectSocketController,
  getProjectsSocketController,
  setProjectSocketController,
} from "./controllers/project.controller.js";
import {
  deleteTaskSocketController,
  getSingleTaskSocketController,
  getTasksSocketController,
  setTaskSocketController,
  updateTaskPositionSocketController,
} from "./controllers/task.controller.js";
import { auth } from "./infrastructure/middlewares/auth.js";
import {
  userAccess,
  userAccessSocketMiddleware,
} from "./infrastructure/middlewares/userAccess.js";
import containerRouters from "./routes/container.js";
import projectRouters from "./routes/project.js";
import taskRouters from "./routes/task.js";
import usersRouters from "./routes/user.js";
import authRouters from "./routes/auth.js";

export interface ISession extends Session {
  userId: string;
  authorized: boolean;
}
type WebSocketRequest = http.IncomingMessage & {
  session: ISession;
};

const app = express();
const server = http.createServer(app);
dotenv.config();

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
app.use("/task", auth, userAccess, taskRouters);
app.use("/project", auth, userAccess, projectRouters);
app.use("/container", auth, userAccess, containerRouters);

server.listen(3000, () => {
  console.log("Server is running on port 3000");
});

function onSocketError(err: Error) {
  console.error(err);
}

const wss = new WebSocketServer({ clientTracking: true, noServer: true });

server.on("upgrade", function upgrade(request, socket, head) {
  socket.on("error", (err) => console.error("Socket Error:", err));

  // Extract JWT from request headers
  const authHeader = request.headers["sec-websocket-protocol"];
  if (!authHeader) {
    socket.write("HTTP/1.1 401 Unauthorized\r\n\r\n");
    socket.destroy();
    return;
  }

  // The token should be sent as "Bearer <token>"
  const token = authHeader.split(" ")[1];
  if (!token) {
    socket.write("HTTP/1.1 401 Unauthorized\r\n\r\n");
    socket.destroy();
    return;
  }

  try {
    // Verify JWT
    const user = jwt.verify(token, process.env.JWT_SECRET as string);
    // request.user = user; // Attach user info to the request

    // Upgrade WebSocket connection if valid
    wss.handleUpgrade(request, socket, head, function (ws) {
      // ws.user = user; // Attach user info to WebSocket instance
      // wss.emit("connection", ws, request);
    });
  } catch (err) {
    console.error("JWT Verification Failed:", err);
    socket.write("HTTP/1.1 401 Unauthorized\r\n\r\n");
    socket.destroy();
  }
});

wss.on("connection", function connection(ws, request: WebSocketRequest) {
  const userId = request.session.userId;
  console.log("user connected!");

  ws.on("error", console.error);
  ws.on("open", async function syncData() {
    ws.send("syncData");
  });

  ws.on("message", async function message(data) {
    userAccessSocketMiddleware(data, userId, async ({ type, payload }) => {
      switch (type) {
        case "project/createProject":
          await setProjectSocketController(payload, userId);
          break;
        case "project/deleteProject":
          await deleteProjectSocketController(payload);
          break;
        case "project/renameProject":
          // implement project rename
          break;
        case "project/selectProject":
          const containers = await getContainersSocketController(
            payload.projectId
          );
          ws.send(
            JSON.stringify({
              type: "container/getContainers",
              payload: containers,
            })
          );
          const tasks = await getTasksSocketController(payload.projectId);
          ws.send(
            JSON.stringify({
              type: "tasks/getTasks",
              payload: tasks,
            })
          );
          break;
        case "container/createContainer":
          for (const container of payload) {
            await setContainerSocketHandler(container);
          }

          break;
        case "container/deleteContainers":
          // implement container deletion
          break;
        case "task/createTask":
          await setTaskSocketController(payload);
          break;
        case "task/deleteTask":
          {
            console.log({ payload });
            if (!payload.length) {
              return;
            }

            for (const task of payload) {
              await deleteTaskSocketController(task);
            }
          }
          break;
        case "task/moveTask": {
          await updateTaskPositionSocketController(payload);
          const response = await getSingleTaskSocketController(payload.taskId);

          if (response?.success) {
            const message = {
              type: "task/moveTask",
              payload: response.data,
            };

            ws.send(JSON.stringify(message));
          }

          break;
        }

        case "syncData": {
          const projects = await getProjectsSocketController(userId);
          console.log("syncData called");
          ws.send(
            JSON.stringify({
              type: "project/getProjects",
              payload: projects ?? [],
            })
          );

          if (projects?.length) {
            const projectId = projects[0].projectId;
            const containers = await getContainersSocketController(projectId);
            const tasks = await getTasksSocketController(projectId);

            ws.send(
              JSON.stringify({
                type: "container/getContainers",
                payload: containers,
              })
            );

            ws.send(
              JSON.stringify({
                type: "tasks/getTasks",
                payload: tasks,
              })
            );
          }
        }

        default:
          break;
      }
    });
  });

  ws.on("close", () => {
    console.log("disconnected");
  });
});
