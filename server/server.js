const express = require("express");
const path = require("path");
const bodyParser = require("body-parser");
const cors = require("cors");
const neo4j = require("neo4j-driver");
// ś
const app = express();
app.use(cors());

app.use(bodyParser.json());

app.post("/login", (req, res) => {
  console.log(req.body);
});

app.post("/register", (req, res) => {
  console.log(req.body);
});

app.post("/addclass", (req, res) => {});

app.listen(3003, () => {
  console.log("Server is running on port 3001");
});
