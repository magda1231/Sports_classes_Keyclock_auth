require("dotenv").config();
const express = require("express");
const path = require("path");
const bodyParser = require("body-parser");
const cors = require("cors");
const neo4j = require("neo4j-driver");
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");
let driver = neo4j.driver(
  "neo4j+s://08b226e6.databases.neo4j.io",
  neo4j.auth.basic("neo4j", "cg2rKSbSzfAUnZ0_JzEMR6e_Fs46qvQty3cUeK1ynPA")
);
const { v4: uuidv4 } = require("uuid");

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

app.post("/login", (req, res) => {
  const username = req.body.username;
  const password = req.body.password;
  findPerson(username, password, res);
});
async function findPerson(personName, personPassword, res) {
  let session = driver.session();
  try {
    const readQuery = `MATCH(p:User {username:'${personName}',password:'${personPassword}'}) RETURN p`;

    const readResult = await session.executeRead((tx) => tx.run(readQuery));
    if (readResult.records.length > 0) {
      const user = { username: personName, password: personPassword };
      const accessToken = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET);
      res.json({ accessToken: accessToken });
    } else {
      res.sendStatus(403);
    }
  } catch (error) {
    console.error(`Something went wrong: ${error}`);
    return false;
  } finally {
    await session.close();
  }
}

app.post("/logout", (req, res) => {
  res.sendStatus(204);
});

app.post("/register", async (req, res) => {
  let session = driver.session();
  const user = {
    name: req.body.name,
    surname: req.body.surname,
    email: req.body.email,
    role: req.body.role,
    username: req.body.username,
    password: req.body.password,
  };
  console.log(req.body);

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

    const readQuery = `CREATE (p:User{username:'${user.username}',password:'${user.password}', id:'${id}', name:'${user.name}', surname:'${user.surname}', email:'${user.email}' }) RETURN p`;
    const readResult = await session.executeWrite((tx) => tx.run(readQuery));

    const isok = await session.executeRead((tx) =>
      tx.run("MATCH (n) RETURN n")
    );

    const usertokendata = {
      username: user.username,
      password: user.password,
    };
    const accessToken = jwt.sign(
      usertokendata,
      process.env.ACCESS_TOKEN_SECRET
    );
    res.status(201).send({ accessToken: accessToken });
  } catch (error) {
    console.error(`Something went wrong: ${error}`);
    return false;
  } finally {
    await session.close();
  }
});

app.get("/userpage", authenticateToken, (req, res) => {
  getAllClasses(res);
});

app.get("/myclasses", authenticateToken, (req, res) => {
  getClasses(req.user.username, res);
});
app.put("/myclasses", authenticateToken, (req, res) => {
  getClasses(req.user.username, res);
});

app.post("/createclass", authenticateToken, (req, res) => {
  console.log(req.body);
  createClass(req.user.username, req.body, res);
});

app.listen(3003, () => {
  console.log("Server is running on port 3001");
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

async function getClasses(user, res) {
  let session = driver.session();
  try {
    const arr = [];
    const readQuery = `MATCH (u:User {username: "${user}"})-[:CREATED]->(c:Class)RETURN c`;
    const readResult = await session.executeRead((tx) => tx.run(readQuery));

    const result = readResult.records.forEach((record) =>
      arr.push(record.get(0).properties)
    );

    res.send(arr);
  } catch (error) {
    console.error(`Something went wrong: ${error}`);

    return false;
  } finally {
    await session.close();
  }
}
async function createClass(user, classcreated, res) {
  let session = driver.session();
  try {
    const readcclass = `MATCH (u:Class {name: "${classcreated.name}"}) RETURN u`;
    const checkclass = await session.executeRead((tx) => tx.run(readcclass));
    if (checkclass.records.length > 0) {
      res.sendStatus(400);
      return false;
    }
    const id = uuidv4();

    const readQuery = `MATCH (u:User {username: "${user}"}) CREATE (u)-[:CREATED]->(c:Class {name: "${classcreated.name}",id:"${id}" ,city: "${classcreated.city}", place: "${classcreated.place}", time: "${classcreated.time}",date:"${classcreated.date}", description: "${classcreated.description}", price:"${classcreated.price}", image:"${classcreated.image}"}) RETURN c`;
    const readResult = await session.executeWrite((tx) => tx.run(readQuery));
    res.sendStatus(201);
  } catch (error) {
    console.error(`Something went wrong: ${error}`);
    return false;
  } finally {
    await session.close();
  }
}

async function updateClass(user, classcreated, res) {
  let session = driver.session();
  try {
    const readcclass = `MATCH (u:Class {name: "${classcreated.name}"}) RETURN u`;
    const checkclass = await session.executeRead((tx) => tx.run(readcclass));
    if (checkclass.records.length === 0) {
      console.log("class does not exists");
      res.sendStatus(400);
      return false;
    }

    const readQuery = `MATCH (u:User)-[:CREATED]->(c:Class {name: "${classcreated.name}"}) SET c.place = "${classcreated.place}", c.time = "${classcreated.time}", c.description = "${classcreated.description}" RETURN c`;
    const readResult = await session.executeWrite((tx) => tx.run(readQuery));

    res.sendStatus(200);
  } catch (error) {
    console.error(`Something went wrong: ${error}`);
    return false;
  } finally {
    await session.close();
  }
}

async function getAllClasses(res) {
  let session = driver.session();
  try {
    const arr = [];

    const readQuery = `MATCH (c:Class) RETURN c`;
    const readResult = await session.executeRead((tx) => tx.run(readQuery));

    const result = readResult.records.forEach((record) =>
      arr.push(record.get(0).properties)
    );
    res.send(arr);
  } catch (error) {
    console.error(`Something went wrong: ${error}`);

    return false;
  } finally {
    await session.close();
  }
}

async function deleteClass(user, classcreated, res) {
  let session = driver.session();
  try {
    const readcclass = `MATCH (u:Class {name: "${classcreated.name}"}) RETURN u`;
    const checkclass = await session.executeRead((tx) => tx.run(readcclass));
    if (checkclass.records.length === 0) {
      res.sendStatus(400);
      return false;
    }
    const readQuery = `MATCH (u:User)-[:CREATED]->(c:Class {name: "${classcreated.name}"}) DETACH DELETE c`;
    const readResult = await session.executeWrite((tx) => tx.run(readQuery));

    res.sendStatus(200);
  } catch (error) {
    console.error(`Something went wrong: ${error}`);
    return false;
  } finally {
    await session.close();
  }
}
