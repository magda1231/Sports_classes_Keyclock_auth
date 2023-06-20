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
