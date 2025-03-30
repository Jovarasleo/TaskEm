import http from "http";
import jwt from "jsonwebtoken";
import { WebSocketServer } from "ws";
import { createContainerSocketController } from "./controllers/container.controller.js";
import {
  createProjectSocketController,
  deleteProjectSocketController,
  syncUserProjectData,
  updateProjectController,
} from "./controllers/project.controller.js";
import {
  createTaskSocketController,
  deleteTaskSocketController,
  updateTaskPositionSocketController,
  updateTaskValueSocketController,
} from "./controllers/task.controller.js";
import { TokenData } from "./server.js";
import { parse } from "cookie";

type WebSocketRequest = http.IncomingMessage & {
  user: TokenData;
};

const wss = new WebSocketServer({ clientTracking: true, noServer: true });

export const initializeWebSocketServer = (server: http.Server<typeof http.IncomingMessage, typeof http.ServerResponse>) => {
  server.on("upgrade", function upgrade(req: WebSocketRequest, socket, head) {
    socket.on("error", (err) => console.error("Socket Error:", err));

    const cookies = parse(req.headers.cookie || "");
    const token = cookies.token; // Read token from cookies

    if (!token) {
      socket.write("HTTP/1.1 401 Unauthorized\r\n\r\n");
      socket.destroy();
      return;
    }

    try {
      const user = jwt.verify(token, process.env.TOKEN_SECRET || "") as TokenData;

      wss.handleUpgrade(req, socket, head, (ws) => {
        req.user = user;
        wss.emit("connection", ws, req);
      });
    } catch (err) {
      socket.write("HTTP/1.1 401 Unauthorized\r\n\r\n");
      socket.destroy();
    }
  });
};

//TODO: implement emitting events to multiple clients

let lastPromise = Promise.resolve();
wss.on("connection", async function connection(client, request: WebSocketRequest) {
  const userId = request.user.id;

  client.on("error", console.error);
  client.on("open", () => {
    client.send("syncData");
  });

  client.on("message", async function message(data) {
    lastPromise = lastPromise.then(async () => {
      const parsedData = await JSON.parse(data.toString());
      const { type, payload } = parsedData;

      console.log(type);

      switch (type) {
        case "project/clientCreateProject":
          await createProjectSocketController({ ...payload, userId }, client);
          return;
        case "project/clientDeleteProject":
          await deleteProjectSocketController({ ...payload, userId }, client);
          return;
        case "project/clientEditProject":
          await updateProjectController({ ...payload, userId }, client);
          return;
        case "container/clientCreateContainer":
          await createContainerSocketController({ ...payload, userId }, client);
          return;
        case "task/clientCreateTask":
          await createTaskSocketController({ ...payload, userId }, client);
          return;
        case "task/clientDeleteTask":
          await deleteTaskSocketController({ ...payload, userId }, client);
          return;
        case "task/clientMoveTask":
          await updateTaskPositionSocketController({ ...payload, userId }, client);
          return;
        case "task/clientEditTask":
          await updateTaskValueSocketController({ ...payload, userId }, client);
          return;
        case "syncData":
          await syncUserProjectData(userId, client);
          return;

        default:
          return;
      }
    });
  });

  client.on("close", () => {
    console.log("disconnected");
  });
});
