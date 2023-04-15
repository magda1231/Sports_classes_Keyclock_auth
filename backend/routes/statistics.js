const express = require("express");
const statistics = express.Router();
const authenticateToken = require("../middleware/authenticateToken");
const driver = require("../server");

statistics.route("/statistics").get(authenticateToken, async (req, res) => {
  let session = driver.session();
  const username = req.user.username;
  if (req.user.role !== "trainer") {
    res.sendStatus(403);
    return false;
  }
  try {
    const query = `MATCH (u:User {username: $username})-[:CREATED]->(c:Class)<-[r:REGISTER]-(p:User) 
                   RETURN c,count(r) ORDER BY count(r) DESC`;
    const result = await session.run(query, { username: username });
    const classes = result.records.map((record) => {
      return {
        class: record.get(0).properties.name,
        count: record.get(1).low,
      };
    });
    console.log(classes);
  } catch (error) {
    res.sendStatus(500);
    console.log(error);
    return false;
  } finally {
    session.close();
  }
});

module.exports = statistics;
