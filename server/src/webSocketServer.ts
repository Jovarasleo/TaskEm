import http from "http";
import jwt from "jsonwebtoken";
import { WebSocketServer } from "ws";
import {
  deleteContainerSocketController,
  getContainersSocketController,
  setContainerSocketHandler,
} from "./controllers/container.controller.js";
import {
  createProjectSocketController,
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
import { authorizationSocketMiddleware } from "./infrastructure/middlewares/authorization.js";
import { Response } from "express";
import Container from "./entities/containerEntity.js";
import Task from "./entities/taskEntity.js";

interface TokenData {
  id: string;
  email: string;
  iat: number;
  exp: number;
}

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

const getUserJwtToken = (headers: string[]) =>
  headers.find((header) => header.includes("token="))?.split("token=")[1];

const wss = new WebSocketServer({ clientTracking: true, noServer: true });

export const initializeWebSocketServer = (
  server: http.Server<typeof http.IncomingMessage, typeof http.ServerResponse>,
  clearCookie: () => Response<string>
) => {
  server.on("upgrade", function upgrade(req: WebSocketRequest, socket, head) {
    socket.on("error", (err) => console.error("Socket Error:", err));

    const token = getUserJwtToken(req.rawHeaders);

    if (!token) {
      socket.write("HTTP/1.1 401 Unauthorized\r\n\r\n");
      socket.destroy();
      return;
    }

    try {
      const user = jwt.verify(
        token,
        process.env.TOKEN_SECRET || ""
      ) as TokenData;

      wss.handleUpgrade(req, socket, head, (ws) => {
        req.user = user;
        wss.emit("connection", ws, req);
      });
    } catch (err) {
      console.error("JWT Verification Failed:", err);
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
    await authorizationSocketMiddleware(
      data,
      userId,
      async ({ type, payload }) => {
        console.log(type);
        switch (type) {
          case "project/clientCreateProject":
            // await setProjectSocketController(payload, userId);
            await createProjectSocketController({ ...payload, userId }, client);
            break;
          case "project/clientDeleteProject":
            await deleteProjectSocketController(payload);
            break;
          case "project/clientEditProject":
            // TODO: implement project rename
            break;
          case "project/clientSelectProject":
            const containers = await getContainersSocketController(
              payload.projectId
            );
            client.send(
              JSON.stringify({
                type: "container/serverLoadContainers",
                payload: containers,
              })
            );

            const tasks = await getTasksSocketController(payload.projectId);
            client.send(
              JSON.stringify({
                type: "tasks/serverLoadTasks",
                payload: tasks,
              })
            );
            break;
          case "container/clientCreateContainer":
            await setContainerSocketHandler(payload);

            break;
          case "container/clientDeleteContainer":
            await deleteContainerSocketController(payload);
            break;
          case "task/clientCreateTask":
            await setTaskSocketController(payload);
            break;
          case "task/clientDeleteTask":
            await deleteTaskSocketController(payload);

            break;
          case "task/clientMoveTask": {
            await updateTaskPositionSocketController(payload);
            const response = await getSingleTaskSocketController(
              payload.taskId
            );
            if (response?.success) {
              const message = {
                type: "task/serverMoveTask",
                payload: response.data,
              };

              client.send(JSON.stringify(message));
            }

            break;
          }

          case "syncData": {
            const projects = await getProjectsSocketController(userId);
            console.log("syncData called");
            client.send(
              JSON.stringify({
                type: "project/serverLoadProjects",
                payload: projects ?? [],
              })
            );

            if (projects?.length) {
              const allContainers: Container[] = [];
              const allTasks: Task[] = [];

              for (const project of projects) {
                const containers = await getContainersSocketController(
                  project.projectId
                );
                if (containers) {
                  allContainers.push(...(containers as Container[]));
                }
                const tasks = await getTasksSocketController(project.projectId);
                if (tasks) {
                  allTasks.push(...(tasks.data as Task[]));
                }
              }

              client.send(
                JSON.stringify({
                  type: "container/serverLoadContainers",
                  payload: allContainers,
                })
              );

              client.send(
                JSON.stringify({
                  type: "task/serverLoadTasks",
                  payload: allTasks,
                })
              );
            }
          }

          default:
            break;
        }
      }
    );
  });

  client.on("close", () => {
    console.log("disconnected");
  });
});
