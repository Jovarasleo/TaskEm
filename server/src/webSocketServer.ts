import http from "http";
import jwt from "jsonwebtoken";
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
import { userAccessSocketMiddleware } from "./infrastructure/middlewares/userAccess.js";

interface TokenData {
  id: string;
  email: string;
  iat: number;
  exp: number;
}

type WebSocketRequest = http.IncomingMessage & {
  user: TokenData;
};

const wss = new WebSocketServer({ clientTracking: true, noServer: true });

export const initializeWebSocketServer = (
  server: http.Server<typeof http.IncomingMessage, typeof http.ServerResponse>
) => {
  server.on(
    "upgrade",
    function upgrade(request: WebSocketRequest, socket, head) {
      socket.on("error", (err) => console.error("Socket Error:", err));

      const token = request.rawHeaders
        .find((header) => header.includes("token="))
        ?.split("token=")[1];

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
        wss.handleUpgrade(request, socket, head, function (ws) {
          request.user = user;
          wss.emit("connection", ws, request);
        });
      } catch (err) {
        console.error("JWT Verification Failed:", err);
        socket.write("HTTP/1.1 401 Unauthorized\r\n\r\n");
        socket.destroy();
      }
    }
  );
};

//TODO: implement emitting events to multiple clients

wss.on("connection", function connection(client, request: WebSocketRequest) {
  const userId = request.user.id;

  client.on("error", console.error);
  client.on("open", async function syncData() {
    client.send("syncData");
  });

  client.on("message", async function message(data) {
    userAccessSocketMiddleware(data, userId, async ({ type, payload }) => {
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
          for (const container of payload) {
            await setContainerSocketHandler(container);
          }

          break;
        case "container/deleteContainers":
          // TODO: implement container deletion
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
    });
  });

  client.on("close", () => {
    console.log("disconnected");
  });
});
