require("dotenv").config();

const express = require("express");
const app = express();

app.use(express.json());

app.use("/projects", require("./routes/projectsRoutes"));

app.listen(3000, () => {
  console.log("Server is running on port 3000");

  app.get("/", (req, res) => {
    res.send("Hello World!");
  });
});
