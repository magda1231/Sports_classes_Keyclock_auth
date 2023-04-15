require("dotenv").config();
const express = require("express");
const path = require("path");
const bodyParser = require("body-parser");
const cors = require("cors");
const neo4j = require("neo4j-driver");
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");
const mqtt = require("mqtt");
const pathl = require("dotenv").config({ path: "../../.env" });

const uri = process.env.URI;
const username = process.env.USERNAME;
const password = process.env.PASSWORD;
let driver;

async function initDriver(uri, username, password, res) {
  try {
    driver = neo4j.driver(uri, neo4j.auth.basic(username, password));
    console.log("Connected to Neo4j");
  } catch (error) {
    res.sendStatus(500);
  }
}
initDriver(uri, username, password);

module.exports = driver;

const app = express();
app.use(
  cors({
    credentials: true,
    origin: "http://localhost:3000",
    optionsSuccessStatus: 200,
  })
);
app.use(bodyParser.urlencoded({ extended: true }));

app.use(bodyParser.json());

app.use(require("./routes/classes"));
app.use(require("./routes/comments"));
app.use(require("./routes/user"));
app.use(require("./routes/classesregister"));
app.use(require("./routes/statistics"));

const client = require("./mqtt");

driver.close();

app.listen(3003, () => {
  console.log("Server is running on port 3003");
});
