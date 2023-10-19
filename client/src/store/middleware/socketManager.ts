import { Socket, io } from "socket.io-client";

let socket: Socket | null = null;

export function initializeSocket(authToken: string) {
  if (!socket) {
    socket = io("http://127.0.0.1:3000", {
      auth: {
        token: authToken,
      },
    });

    // Define event listeners here
    socket.on("connect", () => {
      console.log("WebSocket connected");
    });

    // Other event listeners...

    return socket;
  }
  return socket;
}
