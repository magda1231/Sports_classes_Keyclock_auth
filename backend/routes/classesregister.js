const express = require("express");
const register = express.Router();
const driver = require("../server");
const authenticateToken = require("../middleware/authenticateToken");

register
  .route("/myclasses/register/:id")
  .post(authenticateToken, async (req, res) => {
    const id = req.params.id;
    const user = req.user.username;

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
  });

register
  .route("/myclasses/unsign/:id")
  .delete(authenticateToken, async (req, res) => {
    const id = req.params.id;
    const user = req.user.username;
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
  });

module.exports = register;
