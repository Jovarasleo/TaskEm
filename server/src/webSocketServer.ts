import http from "http";
import jwt from "jsonwebtoken";
import { WebSocketServer } from "ws";
import {
  deleteContainerSocketController,
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
import { userAccessSocketMiddleware } from "./infrastructure/middlewares/userAccess.js";
import { Response } from "express";

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

// const eventProcessor = async (
//   event: any,
//   processEvent: (data: any) => Promise<void>
// ) => {
//   const sortedEvents: Event[] = [];

//   const getTypeCategory = (type: EventType) => {
//     if (type.includes("project")) return "project";
//     if (type.includes("container")) return "container";
//     if (type.includes("task")) return "task";
//     return "other"; // For any other types not matching
//   };

//   const priority = {
//     project: 1,
//     container: 2,
//     task: 3,
//     other: 4,
//   };
//   const parsedData = JSON.parse(event);
//   sortedEvents.push(parsedData);

//   sortedEvents.sort((a, b) => {
//     const priorityA = priority[getTypeCategory(a.value.type)];
//     const priorityB = priority[getTypeCategory(b.value.type)];

//     return priorityA - priorityB;
//   });

//   while (sortedEvents.length > 0) {
//     const nextEvent = sortedEvents.shift();
//     console.log("while loop");
//     await processEvent(nextEvent);
//   }
// };

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
    await userAccessSocketMiddleware(
      data,
      userId,
      async ({ type, payload }) => {
        switch (type) {
          case "project/createProject":
            await setProjectSocketController(payload, userId);
            break;
          case "project/deleteProject":
            await deleteProjectSocketController(payload);
            break;
          case "project/renameProject":
            // TODO: implement project rename
            break;
          case "project/selectProject":
            const containers = await getContainersSocketController(
              payload.projectId
            );
            client.send(
              JSON.stringify({
                type: "container/getContainers",
                payload: containers,
              })
            );

            const tasks = await getTasksSocketController(payload.projectId);
            client.send(
              JSON.stringify({
                type: "tasks/getTasks",
                payload: tasks,
              })
            );
            break;
          case "container/createContainer":
            await setContainerSocketHandler(payload);

            break;
          case "container/deleteContainer":
            await deleteContainerSocketController(payload);
            break;
          case "task/createTask":
            await setTaskSocketController(payload);
            break;
          case "task/deleteTask":
            await deleteTaskSocketController(payload);

            break;
          case "task/moveTask": {
            await updateTaskPositionSocketController(payload);
            const response = await getSingleTaskSocketController(
              payload.taskId
            );
            if (response?.success) {
              const message = {
                type: "task/moveTask",
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
                type: "project/getProjects",
                payload: projects ?? [],
              })
            );

            if (projects?.length) {
              const projectId = projects[0].projectId;
              const containers = await getContainersSocketController(projectId);
              const tasks = await getTasksSocketController(projectId);

              client.send(
                JSON.stringify({
                  type: "container/getContainers",
                  payload: containers,
                })
              );

              client.send(
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
      }
    );
  });

  client.on("close", () => {
    console.log("disconnected");
  });
});
