express = require("express");
const mysql = require("mysql2");

const app = express();

app.listen(3000, () => {
  console.log("Server is running on port 3000");

  //access mySQL database
  const connection = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "Aksomelis123!",
    database: "sqlmydb",
  });

  connection.query("INSERT INTO test VALUES ('Hello World!')", (err) => {
    if (err) console.log(err);
    console.log("Inserted into database");
  });
  connection.connect((err) => {
    if (err) console.log(err);
    console.log("Connected to database");
  });

  app.get("/", (req, res) => {
    res.send("Hello World!");
  });
});
