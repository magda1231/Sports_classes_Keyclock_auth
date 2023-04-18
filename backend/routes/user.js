const express = require("express");
const user = express.Router();
const jwt = require("jsonwebtoken");
const neo4j = require("neo4j-driver");
const driver = require("../server");
const uuidv4 = require("uuid").v4;

user.route("/login").post(async (req, res) => {
  const user = {
    username: req.body.username,
    password: req.body.password,
  };

  let session = driver.session();
  console.log("user", user);
  try {
    const readQuery = `MATCH(p:User {username:$username,password:$password}) RETURN p`;
    const readResult = await session.executeRead((tx) =>
      tx.run(readQuery, {
        username: user.username,
        password: user.password,
      })
    );
    console.log(user);
    console.log("aaa", readResult.records);
    if (readResult.records.length > 0) {
      console.log(readResult.records.length);
      const role = readResult.records[0].get(0).properties.role;
      const usertokendata = {
        username: user.username,
        password: user.password,
        role: role,
      };
      const accessToken = jwt.sign(
        usertokendata,
        process.env.ACCESS_TOKEN_SECRET
      );
      console.log("acc", process.env.ACCESS_TOKEN_SECRET);
      res.json({ accessToken: accessToken });
    } else {
      res.sendStatus(403);
    }
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
    return false;
  } finally {
    await session.close();
  }
});

user.route("/register").post(async (req, res) => {
  let session = driver.session();

  const user = {
    email: req.body.email,
    role: req.body.role,
    username: req.body.username,
    password: req.body.password,
  };

  try {
    const checkUsername = `MATCH (p:User {username: $username}) RETURN p`;
    const usernameCheckResult = await session.executeRead((tx) =>
      tx.run(checkUsername, { username: user.username })
    );

    const checkEmail = `MATCH (p:User {email: $email}) RETURN p`;
    const userEmailCheck = await session.executeRead((tx) =>
      tx.run(checkEmail, { email: user.email })
    );

    if (
      usernameCheckResult.records.length > 0 ||
      userEmailCheck.records.length > 0
    ) {
      res.sendStatus(400);
      return;
    }
    const id = uuidv4();
    const readQuery = `CREATE (p:User{username:$username,password:$password, role:$role, id:$id, email:$email }) RETURN p`;
    const readResult = await session.executeWrite((tx) =>
      tx.run(readQuery, {
        username: user.username,
        password: user.password,
        role: user.role,
        id: id,
        email: user.email,
      })
    );

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
    res.sendStatus(500);
    console.log(error.message);
  } finally {
    await session.close();
  }
});

//edit user data

user.route("/edituser").put(async (req, res) => {
  let session = driver.session();

  const user = {
    email: req.body.email,
    password: req.body.password,
  };

  try {
    const checkUsername = `MATCH (p:User {username:$name, password:$password}) RETURN p`;
    const usernameCheckResult = await session.executeRead((tx) =>
      tx.run(checkUsername, { name: user.username, password: user.password })
    );
    if (usernameCheckResult.records.length > 0) {
      const readQuery = `MATCH (p:User {username:$username, password:$password}) SET p.email = $email, p.password = $password RETURN p`;
      const readResult = await session.executeWrite((tx) =>
        tx.run(readQuery, {
          username: user.username,
          password: user.password,
          email: user.email,
        })
      );
      res.sendStatus(200);
    } else {
      res.sendStatus(404);
    }
  } catch (error) {
    res.sendStatus(500);
  } finally {
    await session.close();
  }
});

user.route("/deleteuser").post(async (req, res) => {
  let session = driver.session();

  const user = {
    username: req.body.username,
    password: req.body.password,
  };

  try {
    const checkUsername = `MATCH (p:User {username:$name, password:$password}) RETURN p`;
    const usernameCheckResult = await session.executeRead((tx) =>
      tx.run(checkUsername, { name: user.username, password: user.password })
    );
    if (usernameCheckResult.records.length > 0) {
      const readQuery = `MATCH (p:User {username:$username, password:$password}) DETACH DELETE p`;
      const readResult = await session.executeWrite((tx) =>
        tx.run(readQuery, {
          username: user.username,
          password: user.password,
        })
      );

      res.sendStatus(204);
    } else {
      res.sendStatus(404);
    }
  } catch (error) {
    res.sendStatus(500);
  } finally {
    await session.close();
  }
});

user.route("/logout").post((req, res) => {
  res.sendStatus(204);
});

module.exports = user;
