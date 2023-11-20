import cors from "cors";
import * as dotenv from "dotenv";
import express, { json } from "express";
import session, { Session } from "express-session";
import http from "http";
import { WebSocketServer } from "ws";
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

export interface ISession extends Session {
  userId: string;
  authorized: boolean;
}
type WebSocketRequest = http.IncomingMessage & {
  session: ISession;
};

const projectRooms = new Map();

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
    sameSite: "none",
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
  json(),
  sessionParser
);

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

server.on("upgrade", function upgrade(request: WebSocketRequest, socket, head) {
  socket.on("error", onSocketError);

  sessionParser(request as any, {} as any, () => {
    console.log({ request: request.session });
    if (!request.session.authorized) {
      socket.write("HTTP/1.1 401 Unauthorized\r\n\r\n");
      socket.destroy();
      return;
    }

    wss.handleUpgrade(request, socket, head, function (ws) {
      wss.emit("connection", ws, request);
    });
  });
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
          const containers = await getContainersSocketController(payload);
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

          const roomId = payload.projectId; // Use the project ID as the room name
          if (!projectRooms.has(roomId)) {
            projectRooms.set(roomId, { [userId]: ws });
          }
          const currentRoom = projectRooms.get(roomId);
          if (currentRoom) {
            projectRooms.set(roomId, { ...currentRoom, [userId]: ws });
          }
          console.log({ projectRooms });
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
            if (!payload.length) {
              return;
            }

            for (const task of payload) {
              const response = await deleteTaskSocketController(task);
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

            const currentRoom = projectRooms.get(payload.projectId);
            if (currentRoom) {
              Object.keys(currentRoom).forEach((key) => {
                const webSocket = currentRoom[key];
                webSocket.send(JSON.stringify(message));
              });
            }
          }

          break;
        }

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
