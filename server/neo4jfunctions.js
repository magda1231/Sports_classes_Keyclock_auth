const neo4j = require("neo4j-driver");
let driver = neo4j.driver(
  "neo4j+s://08b226e6.databases.neo4j.io",
  neo4j.auth.basic("neo4j", "cg2rKSbSzfAUnZ0_JzEMR6e_Fs46qvQty3cUeK1ynPA")
);
const { v4: uuidv4 } = require("uuid");
const jwt = require("jsonwebtoken");

async function getClasses(user, res) {
  // console.log("user", user.username);
  let session = driver.session();
  const arr = [];
  try {
    if (user.role == "trainer") {
      const readQuery = `MATCH (u:User {username: "${user.username}"})-[:CREATED]->(c:Class)RETURN c`;
      const readResult = await session.executeRead((tx) => tx.run(readQuery));

      const result = readResult.records.forEach((record) =>
        arr.push(record.get(0).properties)
      );
    } else if (user.role == "user") {
      console.log("user", user.username);
      const readQuery = `MATCH (u:User {username: "${user.username}"})-[:REGISTER]->(c:Class)RETURN c`;
      const readResult = await session.executeRead((tx) => tx.run(readQuery));

      const result = readResult.records.forEach((record) =>
        arr.push(record.get(0).properties)
      );
      console.log("arr", arr);
    }

    res.send(arr);
  } catch (error) {
    console.error(`Something went wrong: ${error}`);

    return false;
  } finally {
    await session.close();
  }
}

async function createClass(user, classcreated, res) {
  console.log(user, classcreated);
  let session = driver.session();
  try {
    const readcclass = `MATCH (u:Class {name: "${classcreated.name}"}) RETURN u`;
    const checkclass = await session.executeRead((tx) => tx.run(readcclass));
    if (checkclass.records.length > 0) {
      res.sendStatus(400);
      return false;
    }
    const id = uuidv4();
    // console.log("vlsss", classcreated);
    console.log("vlsss", classcreated.category);

    const readQuery = `MATCH (u:User {username: "${user}"}) 
                        CREATE (u)-[:CREATED]->(c:Class 
                            {name: "${classcreated.name}",id:"${id}" ,
                            city: "${classcreated.city}",
                             place: "${classcreated.place}", 
                             time: "${classcreated.time}",
                             date:"${classcreated.date}",
                              description: "${classcreated.description}",
                               price:"${classcreated.price}", 
                               image:"${classcreated.image}",
                               category: "${classcreated.category}",
                               maxPeople: "${classcreated.maxPeople}"}
                               ) RETURN c`;
    const readResult = await session.executeWrite((tx) => tx.run(readQuery));
    res.sendStatus(201);
  } catch (error) {
    console.error(`Something went wrong: ${error}`);
    return false;
  } finally {
    await session.close();
  }
}

async function updateClass(user, id, classedited, res) {
  //const classcreated = classedited;

  // create obj from class edited that only has the properties that are not null
  const classcreated = {};
  for (const key in classedited) {
    if (classedited[key] !== "") {
      classcreated[key] = classedited[key];
    }
  }

  //console.log([...classcreated]);

  console.log(typeof classedited);

  const queryParams = Object.keys(classcreated).map(
    (key) => `c.${key} = "${classcreated[key]}",`
  );
  console.log("queryParams", queryParams);
  console.log(queryParams.toString().slice(0, -1));

  if (user.role != "trainer") {
    console.log("aaa");
    res.sendStatus(401);
    return false;
  }
  let session = driver.session();
  try {
    const readcclass = `MATCH (u:Class {id: "${id}"}) RETURN u`;
    const checkclass = await session.executeRead((tx) => tx.run(readcclass));
    if (checkclass.records.length === 0) {
      console.log("class does not exists");
      res.sendStatus(400);
      return false;
    }

    const readQuery = `MATCH (u:User)-[:CREATED]->(c:Class {id: "${id}"}) 
    SET ${queryParams.toString().slice(0, -1)}
       RETURN c`;
    const readResult = await session.executeWrite((tx) => tx.run(readQuery));
    console.log(readResult.records[0]);

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

async function deleteClass(username, id, res) {
  console.log(id);
  let session = driver.session();
  try {
    const readcclass = `MATCH (u:Class {id: "${id}"}) RETURN u`;
    const checkclass = await session.executeRead((tx) => tx.run(readcclass));
    if (checkclass.records.length === 0) {
      res.sendStatus(400);
      return false;
    }
    const readQuery = `MATCH (u:User)-[:CREATED]->(c:Class {id: "${id}"}) DETACH DELETE c`;
    const readResult = await session.executeWrite((tx) => tx.run(readQuery));

    res.sendStatus(200);
  } catch (error) {
    console.error(`Something went wrong: ${error}`);
    return false;
  } finally {
    await session.close();
  }
}

async function findPerson(user, res) {
  let session = driver.session();
  try {
    const readQuery = `MATCH(p:User {username:'${user.username}',password:'${user.password}'}) RETURN p`;

    const readResult = await session.executeRead((tx) => tx.run(readQuery));
    if (readResult.records.length > 0) {
      const role = readResult.records[0].get(0).properties.role;
      const userdata = {
        username: user.username,
        password: user.password,
        role: role,
      };

      const accessToken = jwt.sign(userdata, process.env.ACCESS_TOKEN_SECRET);

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

async function RegisterToClass(user, id, res) {
  let session = driver.session();
  try {
    const readQuery = `MATCH (u:User {username: "${user}"})
    MATCH (c:Class {id: "${id}"})
    CREATE (u)-[:REGISTER]->(c) RETURN c`;
    const readResult = await session.executeWrite((tx) => tx.run(readQuery));
    res.sendStatus(200);
  } catch (error) {
    console.error(`Something went wrong: ${error}`);
    return false;
  } finally {
    await session.close();
  }
}

async function UnSignFromClass(user, id, res) {
  let session = driver.session();
  try {
    const readQuery = `MATCH (u:User {username: "${user}"})
    MATCH (c:Class {id: "${id}"})
    MATCH (u)-[r:REGISTERED]->(c)
    DELETE r RETURN c`;
    const readResult = await session.executeWrite((tx) => tx.run(readQuery));
    res.sendStatus(200);
  } catch (error) {
    console.error(`Something went wrong: ${error}`);
    return false;
  } finally {
    await session.close();
  }
}

module.exports = {
  getClasses,
  createClass,
  updateClass,
  getAllClasses,
  deleteClass,
  findPerson,
  RegisterToClass,
  UnSignFromClass,
};
