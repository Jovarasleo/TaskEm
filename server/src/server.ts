import express, { NextFunction, json } from "express";
import usersRouters from "./routes/user";
import taskRouters from "./routes/task";
import projectRouters from "./routes/project";
import containerRouters from "./routes/container";
import { auth, authorizeSocket } from "./infrastructure/middlewares/auth";
import * as dotenv from "dotenv";
import cors from "cors";
import { userAccess } from "./infrastructure/middlewares/userAccess";
import { Server, Socket } from "socket.io";
import http from "http";
import {
  getTasksSocketController,
  setTaskSocketController,
} from "./controllers/task.controller";
import {
  getProjectsSocketController,
  setProjectSocketController,
} from "./controllers/project.controller";
import { getContainersSocketController } from "./controllers/container.controller";
import WebSocket, { WebSocketServer } from "ws";
import session, { Session } from "express-session";
import User from "./entities/userEntity";

export interface ISession extends Session {
  userId: string;
  authorized: boolean;
}

const map = new Map();

const app = express();
const server = http.createServer(app);

const store = new session.MemoryStore();

const sessionParser = session({
  saveUninitialized: false,
  secret: "LaputisForever",
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

dotenv.config();

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
    const parsedData = JSON.parse(data.toString());
    console.log(parsedData);
    if (parsedData.type === "task/createTask") {
      await setTaskSocketController(parsedData.payload);
      const response = await getTasksSocketController(
        parsedData.payload.projectId
      );
      ws.send(JSON.stringify(response));
    }

    // console.log("received: %s", event.event, event.data);
    // ws.send("what");
  });
});

// wss.on("message", async (payload) => {
//   // Broadcast the message to all connected clients
//   console.log({ payload });
//   // await setTaskSocketController(payload);
//   // const response = await getTasksSocketController(payload.projectId);
//   wss.emit("tasks", JSON.stringify(payload));
// });

// wss.on("close", () => {
//   console.log("disconnected");
// });

// const io = new Server(server, {
//   cors: {
//     // origin: "https://127.0.0.1:8080/",
//     origin: "*",
//     methods: ["GET", "POST"],
//   },
// });

// io.use((socket: Socket, next: any) => {
//   const auth = authorizeSocket(socket, next);
//   next(auth);
// });

// io.on("connection", async (socket) => {
//   console.log("user connected, id:", socket.id);

//   // const uuid = socket.token.userId;
//   // const response = await getProjectsSocketController({ uuid });
//   // io.emit("projects/syncProjects", response);

//   // Define your socket.io event handlers here
//   // For example, you can handle events like "chat message" or custom events

//   socket.on("task/createTask", async (payload) => {
//     // Broadcast the message to all connected clients
//     console.log({ payload });
//     await setTaskSocketController(payload);
//     const response = await getTasksSocketController(payload.projectId);
//     io.emit("tasks", response);
//   });

//   socket.on("project/syncProjects", async (payload) => {
//     const uuid = socket.token.userId;
//     const response = await getProjectsSocketController({ uuid });
//     io.emit("project/syncProjects", response);
//   });

//   socket.on("task/moveTask", (payload) => {
//     // Broadcast the message to all connected clients
//     io.emit("chat message", "whats up?");
//   });

//   socket.on("task/removeTask", (payload) => {
//     // Broadcast the message to all connected clients
//     io.emit("chat message", "whats up?");
//   });

//   socket.on("task/editTask", (payload) => {
//     // Broadcast the message to all connected clients
//     io.emit("chat message", "whats up?");
//   });

//   socket.on("project/createProject", async (payload) => {
//     // console.log({ socket });
//     const uuid = socket.token.userId;
//     await setProjectSocketController({ ...payload, uuid });
//     const response = await getProjectsSocketController({ uuid });
//     // Broadcast the message to all connected clients
//     io.emit("projects", response);
//   });

//   socket.on("project/selectProject", async (payload) => {
//     const uuid = socket.token.userId;
//     const tasks = await getTasksSocketController({ ...payload, uuid });
//     const containers = await getContainersSocketController({
//       ...payload,
//       uuid,
//     });

//     console.log({ tasks, containers });

//     io.emit("project/selectProject", { tasks, containers });
//   });

//   // Handle disconnect event
//   socket.on("disconnect", () => {
//     console.log("A user disconnected");
//   });
// });
