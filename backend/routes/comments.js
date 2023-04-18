const express = require("express");
const comments = express.Router();
const driver = require("../server");

comments.route("/comments/:id").get(async (req, res) => {
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
    res.json(arr);
  } catch (error) {
    res.sendStatus(500);
  } finally {
    await session.close();
  }
});

module.exports = comments;
