import { Response } from "express";
import http from "http";
import jwt from "jsonwebtoken";
import { WebSocketServer } from "ws";
import { createContainerSocketController } from "./controllers/container.controller.js";
import { createProjectSocketController, deleteProjectSocketController, syncUserProjectData } from "./controllers/project.controller.js";
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

type EventType = "project" | "container" | "task";

interface Event {
  payload: {};
  value: {
    type: EventType;
    payload: any;
    id: string;
  };
}

const getUserJwtToken = (headers: string[]) => headers.find((header) => header.includes("token="))?.split("token=")[1];

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

wss.on("connection", function connection(client, request: WebSocketRequest) {
  const userId = request.user.id;

  client.on("error", console.error);
  client.on("open", async function syncData() {
    client.send("syncData");
  });

  client.on("message", async (data) => {
    const parsedData = JSON.parse(data.toString());
    const { type, payload } = parsedData;

    console.log({ payload, userId });

    switch (type) {
      case "project/clientCreateProject":
        await createProjectSocketController({ ...payload, userId }, client);
        break;
      case "project/clientDeleteProject":
        await deleteProjectSocketController({ ...payload, userId }, client);
        break;
      case "project/clientEditProject":
        // TODO: implement project rename
        break;
      case "container/clientCreateContainer":
        await createContainerSocketController({ ...payload, userId }, client);
        break;
      case "task/clientCreateTask":
        await createTaskSocketController({ ...payload, userId }, client);
        break;
      case "task/clientDeleteTask":
        await deleteTaskSocketController({ ...payload, userId }, client);
        break;
      case "task/clientMoveTask":
        await updateTaskPositionSocketController({ ...payload, userId }, client);
        break;
      case "task/clientEditTask":
        await updateTaskValueSocketController({ ...payload, userId }, client);
        break;
      case "syncData":
        await syncUserProjectData(userId, client);
        break;

      default:
        break;
    }
  });

  client.on("close", () => {
    console.log("disconnected");
  });
});
