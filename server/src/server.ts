import express, { json } from "express";
import usersRouters from "./routes/user";
import * as dotenv from "dotenv";
dotenv.config();

const app = express();
app.use(json());

app.use("/user", usersRouters);

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
