const neo4j = require("neo4j-driver");
const pathl = require("dotenv").config({ path: "../../.env" });
let driver = neo4j.driver(
  process.env.URI,
  neo4j.auth.basic(process.env.USERNAME, process.env.PASSWORD)
);
const { v4: uuidv4 } = require("uuid");
const jwt = require("jsonwebtoken");

// Add Message to chat history
async function addMessage(message, res) {
  let session = driver.session();
  try {
    const readQuery = `MATCH (u:User {username: $username})
    MATCH (c:Class {id: $classId})
    CREATE (u)-[:MESSAGE {message: $message}]->(c) RETURN c`;
    const readResult = await session.executeWrite((tx) =>
      tx.run(readQuery, {
        username: message.username,
        classId: message.classId,
        message: message.message,
      })
    );

    res.sendStatus(200);
  } catch (error) {
    console.error(`Something went wrong: ${error}`);
    return false;
  } finally {
    await session.close();
  }
}

async function getMessages(classId, res) {
  let session = driver.session();
  try {
    const readQuery = `MATCH (u:User)-[r:MESSAGE]->(c:Class {id: $classId}) RETURN u.username, r.message`;
    const readResult = await session.executeRead((tx) =>
      tx.run(readQuery, {
        classId: classId,
      })
    );
    const arr = [];
    for (let i = 0; i < readResult.records.length; i++) {
      const username = readResult.records[i].get(0);
      const message = readResult.records[i].get(1);
      arr.push({ username: username, message: message });
    }
    res.send(arr);
  } catch (error) {
    console.error(`Something went wrong: ${error}`);
    return false;
  } finally {
    await session.close();
  }
}

async function AddComment(id, message) {
  let session = driver.session();
  try {
    const comment = JSON.parse(message.toString()).message;
    const commentId = uuidv4();
    const readQuery = `MATCH (c:Class {id: $id})
    CREATE (c)-[r:COMMENT]->(m:Comment {id: $commendId, message: $comment}) RETURN r`;

    const readResult = await session.executeWrite((tx) =>
      tx.run(readQuery, {
        id: id,
        comment: comment,
        commendId: commentId,
      })
    );
  } catch (error) {
    console.error(`Something went wrong: ${error}`);
    return false;
  } finally {
  }
}

async function addReactions(classid, commentid, reactions) {
  let session = driver.session();
  try {
    console.log(reactions.toString());
    const { likes, dislikes } = JSON.parse(reactions.toString());
    const readQuery = `MATCH (c:Class {id: $classId})-[r:COMMENT]->(m:Comment {id: $commentId}) 
                       WITH m
                       CALL apoc.do.when(
                        m.likes IS NOT NULL AND m.dislikes IS NOT NULL,
                           'SET m.likes = m.likes + 1 SET m.dislikes = m.dislikes + 1',
                           'SET m.likes = $likes SET m.dislikes = $dislikes',
                           {m: m}
                       ) YIELD value
                       RETURN value`;
    const readResult = await session.run(readQuery, {
      likes: likes,
      dislikes: dislikes,
      classId: classid,
      commentId: commentid,
    });
  } catch (error) {
    console.error(`Something went wrong: ${error}`);

    return false;
  } finally {
    await session.close();
  }
}

module.exports = {
  AddComment,
  addReactions,
};
