import express, { json } from "express";
// import { getProjectsRouter } from "./routes/projectRoutes";
import * as dotenv from "dotenv";
dotenv.config();

const app = express();

app.use(json());

// app.use("/", getProjectsRouter);
// app.use("/", setNewProjectRouter);
// app.use("/:id", getProjectByIdRouter);

app.listen(3000, () => {
  console.log("Server is running on port 3000");

  app.get("/", (req, res) => {
    res.send("Hellsso World!");
  });
});
