const express = require("express");
const { auth } = require("neo4j-driver");
const routes = express.Router();

const authenticateToken = require("../middleware/authenticateToken");
const driver = require("../server");

routes.route("/userpage").get(authenticateToken, async (req, res) => {
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

routes.route("/userpage/random").get(async (req, res) => {
  let session = driver.session();
  try {
    const arr = [];
    const readQuery = `MATCH (c:Class) RETURN apoc.coll.randomItems(collect(c), 10)`;
    const readResult = await session.executeRead((tx) => tx.run(readQuery));
    const result = readResult.records[0]
      .get(0)
      .forEach((record) => arr.push(record.properties));
    res.status(200).send(arr);
  } catch (error) {
    res.sendStatus(500);
  } finally {
    await session.close();
  }
});

routes.route("/myclasses").get(authenticateToken, async (req, res) => {
  let session = driver.session();
  const arr = [];
  console.log(req.user.username);
  try {
    if (req.user.role == "trainer") {
      const readQuery = `MATCH (u:User {username: $username})-[:CREATED]->(c:Class)RETURN c`;
      const readResult = await session.executeRead((tx) =>
        tx.run(readQuery, {
          username: req.user.username,
        })
      );

      const result = readResult.records.forEach((record) =>
        arr.push(record.get(0).properties)
      );
    } else if (req.user.role == "user") {
      const readQuery = `MATCH (u:User {username: $username})-[:REGISTER]->(c:Class)RETURN c`;
      const readResult = await session.executeRead((tx) =>
        tx.run(readQuery, {
          username: user.username,
        })
      );

      const result = readResult.records.forEach((record) =>
        arr.push(record.get(0).properties)
      );
    }

    res.send(arr);
  } catch (error) {
    //console.error(`Something went wrong: ${error}`);
    res.sendStatus(500);

    return false;
  } finally {
    await session.close();
  }
});

routes.route("/myclasses/:id").patch(authenticateToken, async (req, res) => {
  const id = req.params.id;

  const user = req.user;
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

routes.route("/myclasses").delete(authenticateToken, async (req, res) => {
  const username = req.user.username;
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

routes.route("/createclass").post(authenticateToken, async (req, res) => {
  const user = req.user.username;
  const classcreated = req.body;
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
                          image: $image, 
                          category: $category, 
                          maxPeople: $maxPeople}
                          ) RETURN c`;
    const readResult = await session.executeWrite((tx) =>
      tx.run(readQuery, {
        name: classcreated.name,
        id: id,
        city: classcreated.city,
        place: classcreated.place,
        time: classcreated.time,
        date: classcreated.date,
        description: classcreated.description,
        price: classcreated.price,
        image: classcreated.image,
        category: classcreated.category,
        maxPeople: classcreated.maxPeople,
      })
    );
    res.sendStatus(201);
  } catch (error) {
    res.sendStatus(500);
    return false;
  } finally {
    await session.close();
  }
});

module.exports = routes;
