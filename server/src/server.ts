import express, { json } from "express";
import * as dotenv from "dotenv";
dotenv.config();

const app = express();
app.use(json());

app.post("/user", (req, res) => {
  const { username, password, email } = req.body;

  try {
  } catch (err) {
    res.status(500).send("Internal Server Error");
  }
});
// console.log(getProjectsRouter);
// app.use("/", getProjectsRouter);
// app.use("/", setNewProjectRouter);
// app.use("/:id", getProjectByIdRouter);

app.listen(3000, () => {
  console.log("Server is running on port 3000");

  app.get("/", (req, res) => {
    res.send("Hellsso World!");
  });
});
