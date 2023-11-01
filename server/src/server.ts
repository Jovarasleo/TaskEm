import cors from "cors";
import * as dotenv from "dotenv";
import express, { json } from "express";
import session, { Session } from "express-session";
import http from "http";
import { WebSocketServer } from "ws";
import {
  getContainersSocketController,
  setContainerSocketHandler,
} from "./controllers/container.controller";
import {
  deleteProjectSocketController,
  getProjectsSocketController,
  setProjectSocketController,
} from "./controllers/project.controller";
import {
  deleteTaskSocketController,
  getTasks,
  getTasksSocketController,
  setTaskSocketController,
  updateTaskPositionSocketController,
} from "./controllers/task.controller";
import { auth } from "./infrastructure/middlewares/auth";
import {
  userAccess,
  userAccessSocketMiddleware,
} from "./infrastructure/middlewares/userAccess";
import containerRouters from "./routes/container";
import projectRouters from "./routes/project";
import taskRouters from "./routes/task";
import usersRouters from "./routes/user";

export interface ISession extends Session {
  userId: string;
  authorized: boolean;
}

const map = new Map();

const app = express();
const server = http.createServer(app);
dotenv.config();

const store = new session.MemoryStore();

const sessionParser = session({
  saveUninitialized: false,
  secret: process.env.SESSION_SECRET as string,
  resave: false,
  store: store,

  cookie: {
    sameSite: false,
    secure: false,
    httpOnly: true,
    maxAge: 60000000,
  },
});

app.use(
  cors({
    origin: "https://localhost:8080",
    methods: ["POST", "GET"],
    credentials: true,
  }),
  json()
);

app.use((req, res, next) => sessionParser(req, res, next));

app.use("/user", auth, usersRouters);
app.use("/task", auth, userAccess, taskRouters);
app.use("/project", auth, userAccess, projectRouters);
app.use("/container", auth, userAccess, containerRouters);

server.listen(3000, () => {
  console.log("Server is running on port 3000");
});

function onSocketError(err: any) {
  console.error(err);
}

const wss = new WebSocketServer({ clientTracking: true, noServer: true });

server.on("upgrade", function upgrade(request: any, socket, head) {
  // console.log(request);
  socket.on("error", onSocketError as any);
  sessionParser(request, {} as any, () => {
    console.log({ request: request.session });
    if (!(request.session as ISession).authorized) {
      socket.write("HTTP/1.1 401 Unauthorized\r\n\r\n");
      socket.destroy();
      return;
    }
    // This function is not defined on purpose. Implement it with your own logic.

    wss.handleUpgrade(request, socket, head, function (ws) {
      wss.emit("connection", ws, request);
    });
  });
});

wss.on("connection", function connection(ws, request: any) {
  const userId = (request.session as ISession).userId;
  console.log("user connects");
  map.set(userId, ws);
  ws.on("error", console.error);

  ws.on("open", async function syncData() {
    ws.send("syncing data");
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
          const containers = await getContainersSocketController(payload);
          console.log({ containers });
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
          await setContainerSocketHandler(payload);
          break;
        case "container/deleteContainers":
          // implement container deletion
          break;
        case "task/createTask":
          await setTaskSocketController(payload);
          break;
        case "task/deleteTask":
          {
            for (const task of payload) {
              const response = await deleteTaskSocketController(task);
            }
          }
          break;
        case "task/moveTask":
          // implement task deletion
          console.log({ payload });
          const response = await updateTaskPositionSocketController(payload);
          console.log({ response });
          break;
        case "syncData":
          const projects = await getProjectsSocketController(userId);

          const message = {
            type: "project/getProjects",
            payload: projects,
          };

          ws.send(JSON.stringify(message));
        default:
          break;
      }
    });
  });

  ws.on("close", () => {
    console.log("disconnected");
  });
});
