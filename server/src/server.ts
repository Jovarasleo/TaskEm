import express, { json } from "express";
import usersRouters from "./routes/user";
import taskRouters from "./routes/task";
import projectRouters from "./routes/project";
import containerRouters from "./routes/container";
import { auth } from "./infrastructure/middlewares/auth";
import * as dotenv from "dotenv";
import cors from "cors";
import { userAccess } from "./infrastructure/middlewares/userAccess";
dotenv.config();

const app = express();
app.use(json(), cors());

app.use("/user", auth, usersRouters);
app.use("/task", auth, userAccess, taskRouters);
app.use("/project", auth, userAccess, projectRouters);
app.use("/container", auth, userAccess, containerRouters);

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
