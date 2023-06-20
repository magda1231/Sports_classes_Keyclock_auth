require("dotenv").config();
const express = require("express");
const path = require("path");
const bodyParser = require("body-parser");
const cors = require("cors");
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");
const mqtt = require("mqtt");
const pathl = require("dotenv").config({ path: ".env" });
var session = require("express-session");
const config = require("./config.json");
const uuidv4 = require("uuid").v4;

const neo4j = require("neo4j-driver");

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

const app = express();
app.use(bodyParser.json());
app.use(cors());

const { NodeAdapter } = require("ef-keycloak-connect");
const { key } = require("localforage");

const keycloak = new NodeAdapter(config);
app.use(keycloak.middleware({ logout: "/logout" }));

process.env.NODE_TLS_REJECT_UNAUTHORIZED = 0; // to disable https
const port = 3001;

app.use(
  cors({
    credentials: true,
    origin: "http://localhost:3000",
    optionsSuccessStatus: 200,
  })
);

app.use(bodyParser.urlencoded({ extended: true }));

app.use(bodyParser.json());

app.use(keycloak.middleware());

const memoryStore = new session.MemoryStore();

app.use(
  session({
    secret: "secret",
    resave: false,
    saveUninitialized: true,
    store: memoryStore,
  })
);

// app.use(require("./routes/classes"));
// app.use(require("./routes/comments"));
// app.use(require("./routes/user"));
// app.use(require("./routes/classesregister"));
// driver.close();

const getrole = (roles) => {
  if (roles.includes("trainer")) {
    return "trainer";
  } else if (roles.includes("user")) {
    return "user";
  }
};
app.get("/userpage", keycloak.protect(), async (req, res) => {
  const user = req.kauth.grant.access_token.content.preferred_username;
  console.log(user);
  let session = driver.session();
  try {
    const arr = [];
    const readQuery = `MATCH (c:Class) RETURN c`;
    const readResult = await session.executeRead((tx) => tx.run(readQuery));

    const result = readResult.records.forEach((record) =>
      arr.push(record.get(0).properties)
    );

    for (let i = 0; i < arr.length; i++) {
      const readQuery2 = `MATCH (c:Class {id: $id})<-[r:REGISTER]-(u:User) RETURN count(u)`;
      const readResult2 = await session.executeRead((tx) =>
        tx.run(readQuery2, {
          id: arr[i].id,
        })
      );
      const registered = readResult2.records[0].get(0).low;

      arr[i].registered = registered;
    }

    res.send(arr);
  } catch (error) {
    console.error(`Something went wrong: ${error}`);

    return false;
  } finally {
    await session.close();
  }
});

app.get("/myclasses", keycloak.protect(), async (req, res) => {
  const username = req.kauth.grant.access_token.content.preferred_username;

  const roles = req.kauth.grant.access_token.content.realm_access.roles;
  const role = getrole(roles);

  console.log(role);

  let session = driver.session();
  const arr = [];
  try {
    if (role == "trainer") {
      console.log("aaa", username);
      const readQuery = `MATCH (u:User {username:$username})-[:CREATED]->(c:Class)RETURN c`;
      const readResult = await session.executeRead((tx) =>
        tx.run(readQuery, { username: username })
      );
      console.log(readResult.records);
      console.log("aaa");
      const result = readResult.records.forEach((record) =>
        arr.push(record.get(0).properties)
      );
    } else if (role == "user") {
      console.log("aaa", username);
      const readQuery = `MATCH (u:User {username: $username})-[:REGISTER]->(c: Class)RETURN c`;
      const readResult = await session.executeRead((tx) =>
        tx.run(readQuery, {
          username: username,
        })
      );

      console.log(readResult.records);
      const result = readResult.records.forEach((record) =>
        arr.push(record.get(0).properties)
      );
    }
    res.send(arr);
  } catch (error) {
    console.error(`Something went wrong: ${error}`);
    //console.error(`Something went wrong: ${error}`);
    res.sendStatus(500);
    return false;
  } finally {
    await session.close();
  }
});

app.patch("/myclasses/:id", keycloak.protect(["trainer"]), async (req, res) => {
  const id = req.params.id;

  const user = req.kauth.grant.access_token.content.preferred_username;
  const classedited = req.body;

  const classcreated = {};
  for (const key in classedited) {
    if (classedited[key] !== "") {
      classcreated[key] = classedited[key];
    }
  }

  const queryParams = Object.keys(classcreated).map(
    (key) => `${key} : "${classcreated[key]}"`
  );

  if (user.role != "trainer") {
    res.sendStatus(401);
    return false;
  }
  let session = driver.session();
  try {
    const readcclass = `MATCH (u:Class {id: $id}) RETURN u`;
    const checkclass = await session.executeRead((tx) =>
      tx.run(readcclass, { id: id })
    );
    if (checkclass.records.length === 0) {
      res.sendStatus(400);
      return false;
    }

    const readQuery = `MATCH (u:User)-[:CREATED]->(c:Class {id: "${id}"})
      SET c += { ${queryParams.toString()} } RETURN c;`;

    const readResult = await session.executeWrite((tx) => tx.run(readQuery));

    res.sendStatus(201);
  } catch (error) {
    res.sendStatus(500);
    return false;
  } finally {
    await session.close();
  }
});

app.delete("/myclasses", async (req, res) => {
  const username = req.kauth.grant.access_token.content.preferred_username;
  const id = req.body.id;
  let session = driver.session();
  try {
    const readcclass = `MATCH (u:Class {id: $id}) RETURN u`;
    const checkclass = await session.executeRead((tx) =>
      tx.run(readcclass, { id: id })
    );
    if (checkclass.records.length === 0) {
      res.sendStatus(404);
      return false;
    }
    const readQuery = `MATCH (u:User)-[:CREATED]->(c:Class {id: $id}) DETACH DELETE c`;
    const readResult = await session.executeWrite((tx) =>
      tx.run(readQuery, { id: id })
    );

    res.sendStatus(200);
  } catch (error) {
    res.sendStatus(500);
    return false;
  } finally {
    await session.close();
  }
});

app.post("/createclass", keycloak.protect(["trainer"]), async (req, res) => {
  const user = req.kauth.grant.access_token.content.preferred_username;

  const classcreated = req.body;
  console.log(classcreated);

  let session = driver.session();
  try {
    const readcclass = `MATCH (u:Class {name: "${classcreated.name}"}) RETURN u`;
    const checkclass = await session.executeRead((tx) => tx.run(readcclass));
    if (checkclass.records.length > 0) {
      res.sendStatus(400);
      return false;
    }
    const id = uuidv4();
    const readQuery = `MATCH (u:User {username: "${user}"})
                        CREATE (u)-[:CREATED]->(c:Class
                        {id: $id,
                          name: $name,
                          city: $city,
                          place: $place,
                          time: $time,
                          date: $date,
                          description: $description,
                          price: $price,
                          category: $category,
                          maxPeople: $maxPeople}
                          ) RETURN c`;
    const readResult = await session.executeWrite((tx) =>
      tx.run(readQuery, {
        name: classcreated.name,
        id: id,
        city: classcreated.city,
        place: classcreated.place,
        time: classcreated.hour,
        date: classcreated.date,
        description: classcreated.description,
        price: classcreated.price,
        category: classcreated.category,
        maxPeople: classcreated.maxPeople,
      })
    );
    res.sendStatus(201);
  } catch (error) {
    console.log(error.message);
    res.sendStatus(500);
    return false;
  } finally {
    await session.close();
  }
});

app.post(
  "/myclasses/register/:id",
  keycloak.protect(["user"]),
  async (req, res) => {
    const id = req.params.id;
    const user = req.kauth.grant.access_token.content.preferred_username;

    let session = driver.session();
    try {
      const readQuery2 = `MATCH (u:User {username:$user})-[r:REGISTER]->(c:Class {id: $id}) RETURN c`;
      const readResult2 = await session.executeRead((tx) =>
        tx.run(readQuery2, {
          user: user,
          id: id,
        })
      );
      if (readResult2.records.length > 0) {
        console.log("user already registered");
        res.sendStatus(409);
        return false;
      }
      const readQuery = `MATCH (u:User {username: $user})
      MATCH (c:Class {id: $id})
      CREATE (u)-[:REGISTER]->(c) RETURN c`;
      const readResult = await session.executeWrite((tx) =>
        tx.run(readQuery, {
          user: user,
          id: id,
        })
      );

      res.sendStatus(200);
    } catch (error) {
      res.sendStatus(500);
    } finally {
      await session.close();
    }
  }
);

app.delete(
  "/myclasses/unsign/:id",
  keycloak.protect(["user"]),
  async (req, res) => {
    const id = req.params.id;
    const user = req.kauth.grant.access_token.content.preferred_username;
    let session = driver.session();
    try {
      const readQuery = `MATCH (n:User{username:$user})-[r:REGISTER]->(c:Class{id: $id}) DELETE r`;
      const readResult = await session.executeWrite((tx) =>
        tx.run(readQuery, {
          user: user,
          id: id,
        })
      );
      res.sendStatus(200);
    } catch (error) {
      res.sendStatus(500);
    } finally {
      await session.close();
    }
  }
);

app.get("/comments/:id", keycloak.protect(), async (req, res) => {
  console.log("comments");
  const id = req.params.id;
  let session = driver.session();
  try {
    const readQuery = `MATCH (c:Class {id: $id})-[r:COMMENT]->(m:Comment)
                      RETURN m ORDER BY m.timestamp DESC`;
    const readResult = await session.executeRead((tx) =>
      tx.run(readQuery, {
        id: id,
      })
    );
    const arr = [];
    const result = readResult.records.forEach((record) =>
      arr.push(record.get(0).properties)
    );
    console.log(arr);
    res.json(arr);
  } catch (error) {
    res.sendStatus(500);
  } finally {
    await session.close();
  }
});

app.post("/comment", keycloak.protect(["user"]), async (req, res) => {
  const Id = req.body.id;
  const classId = req.body.classid;
  const username = req.kauth.grant.access_token.content.preferred_username;
  const comment = req.body;
  const text = comment.message;
  console.log(text);
  console.log(comment);

  const timestamp = Date.now().toString();
  let session = driver.session();
  try {
    const readQuery = `MATCH (u:User {username: $username})
                      MATCH (c:Class {id: $classId})
                      CREATE (c)-[:COMMENT]->(m:Comment
                      {id: $id,
                        text: $text,
                        timestamp: $timestamp}
                        ) RETURN m`;
    const readResult = await session.executeWrite((tx) =>
      tx.run(readQuery, {
        username: username,
        classId: classId,
        id: Id,
        text: text,
        timestamp: timestamp,
      })
    );
    res.sendStatus(201);
  } catch (error) {
    console.log(error.message);
    res.sendStatus(500);
  } finally {
    await session.close();
  }
});

app.listen(5010, () => {
  console.log("Server is running on port 3003");
});
