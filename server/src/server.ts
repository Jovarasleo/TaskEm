import express, { json } from "express";
import usersRouters from "./routes/user";
import { auth } from "./infrastructure/middlewares/auth";
import projectRouters from "./routes/project";
import * as dotenv from "dotenv";
import cors from "cors";
dotenv.config();

const app = express();
app.use(json(), cors());

app.use("/user", auth, usersRouters);
app.use("/project", auth, projectRouters);

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
