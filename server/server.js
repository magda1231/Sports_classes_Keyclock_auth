require("dotenv").config();
const express = require("express");
const path = require("path");
const bodyParser = require("body-parser");
const cors = require("cors");
const neo4j = require("neo4j-driver");
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");
const mqtt = require("mqtt");

const {
  getClasses,
  createClass,
  updateClass,
  findPerson,
  getAllClasses,
  deleteClass,
  RegisterToClass,
  UnSignFromClass,
} = require("./neo4jfunctions");

const { v4: uuidv4 } = require("uuid");
const { isObject } = require("util");
let driver = neo4j.driver(
  "neo4j+s://08b226e6.databases.neo4j.io",
  neo4j.auth.basic("neo4j", "cg2rKSbSzfAUnZ0_JzEMR6e_Fs46qvQty3cUeK1ynPA")
);

module.exports = {
  driver,
};

const app = express();
app.use(
  cors({
    credentials: true,
    origin: "http://localhost:3000",
    optionsSuccessStatus: 200,
  })
);
// app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(bodyParser.json());
app.use(cookieParser());

//const client = mqtt.connect("ws://127.0.0.1:8000/mqtt");
const clientId = "mqttjs_" + Math.random().toString(16).substr(2, 8);
const host = "ws://127.0.0.1:8000/mqtt";
const options = {
  keepalive: 60,
  clientId: clientId,
  protocolId: "MQTT",
  protocolVersion: 4,
  clean: true,
  reconnectPeriod: 1000,
  connectTimeout: 30 * 1000,
  will: {
    topic: "WillMsg",
    payload: "Connection Closed abnormally..!",
    id: clientId,
    qos: 0,
    retain: false,
  },
};
const client = mqtt.connect(host, options);

client.on("connect", function () {
  client.subscribe("chat/lol");
  console.log("connected");
  //display message
  client.on("message", function (topic, message) {
    //console.log(message.toString());
    console.log(message.toString());
  });

  setInterval(function () {
    client.publish(
      "chat/lol",
      JSON.stringify({ username: "server", message: "hello" })
    );
  }, 5000);
});
client.subscribe("/time");
setInterval(function () {
  client.publish("/time", new Date().toLocaleTimeString());
}, 1000);

app.listen(3003, () => {
  console.log("Server is running on port 3003");
});

app.post("/login", (req, res) => {
  findPerson(req.body, res);
});

app.post("/logout", (req, res) => {
  res.sendStatus(204);
});

app.post("/register", async (req, res) => {
  let session = driver.session();

  const user = {
    email: req.body.email,
    role: req.body.role,
    username: req.body.username,
    password: req.body.password,
  };
  console.log("body", req.body);

  try {
    const checkUsername = `MATCH (p:User {username:'${user.username}'}) RETURN p`;
    const usernameCheckResult = await session.executeRead((tx) =>
      tx.run(checkUsername)
    );
    const checkEmail = `MATCH (p:User {email:'${user.email}'}) RETURN p`;
    const userEmailCheck = await session.executeRead((tx) =>
      tx.run(checkUsername)
    );
    if (
      usernameCheckResult.records.length > 0 ||
      userEmailCheck.records.length > 0
    ) {
      res.sendStatus(400);
      return;
    }
    const id = uuidv4();
    const readQuery = `CREATE (p:User{username:'${user.username}',password:'${user.password}', role:"${user.role}", id:'${id}', email:'${user.email}' }) RETURN p`;
    const readResult = await session.executeWrite((tx) => tx.run(readQuery));

    const isok = await session.executeRead((tx) =>
      tx.run("MATCH (n) RETURN n")
    );

    const usertokendata = {
      username: user.username,
      password: user.password,
      role: user.role,
    };

    const accessToken = jwt.sign(
      usertokendata,
      process.env.ACCESS_TOKEN_SECRET
    );
    const decodedAccessToken = jwt.decode(accessToken);
    console.log("dec", decodedAccessToken);
    console.log("acc", accessToken);

    res.status(201).send({ accessToken: accessToken });
  } catch (error) {
    console.error(`Something went wrong: ${error}`);
    return false;
  } finally {
    await session.close();
  }
});

app.get("/userpage", authenticateToken, (req, res) => {
  // console.log(res);
  getAllClasses(res);
});

app.get("/myclasses", authenticateToken, (req, res) => {
  getClasses(req.user, res);
});

app.put("/myclasses/:id", authenticateToken, (req, res) => {
  console.log(req.body);
  const id = req.params.id;
  updateClass(req.user, id, req.body, res);
});

app.post("/myclasses/register/:id", authenticateToken, (req, res) => {
  const id = req.params.id;
  RegisterToClass(req.user.username, id, res);
});

app.delete("/myclasses", authenticateToken, (req, res) => {
  console.log(req.user.username, req.body.id);
  deleteClass(req.user.username, req.body.id, res);
});

app.delete("/myclasses/unsign/:id", authenticateToken, (req, res) => {
  const id = req.params.id;
  UnSignFromClass(req.user.username, id, res);
});

app.put("/myclasses", authenticateToken, (req, res) => {
  getClasses(req.user.username, res);
});

app.post("/createclass", authenticateToken, (req, res) => {
  createClass(req.user.username, req.body, res);
});

app.all("*", (req, res) => {
  res.status(404).send("Page not found");
});

function authenticateToken(req, res, next) {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  if (token == null) return res.sendStatus(401); //if there isn't any token
  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
    if (err) return res.sendStatus(403); //if token is not valid
    req.user = user;

    next();
  });
}
