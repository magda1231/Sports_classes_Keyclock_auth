require("dotenv").config();
const express = require("express");
const path = require("path");
const bodyParser = require("body-parser");
const cors = require("cors");
const neo4j = require("neo4j-driver");
const jwt = require("jsonwebtoken");

// ś
const app = express();
app.use(cors());

app.use(bodyParser.urlencoded({ extended: true }));

const posts = [
  { username: "Alan", password: "lol" },
  { username: "Blan", password: "alan" },
];
const lista = [
  {
    name: "Pilates",
    place: "Gym",
    time: "12:00",
    description:
      "Lorem ipsum dolor sit amet consectetur adipisicing elit. Placeat, incidunt quos consequatur aliquam veritatis, ut nam corrupti laborum doloribus minus pariatur cum praesentium itaque ad fugit, quidem possimus laudantium animi?",
  },
  {
    name: "Yoga",
    place: "Gym",
    time: "12:00",
    description:
      "Lorem ipsum dolor sit amet consectetur adipisicing elit. Placeat, incidunt quos consequatur aliquam veritatis, ut nam corrupti laborum doloribus minus pariatur cum praesentium itaque ad fugit, quidem possimus laudantium animi?",
  },
  {
    name: "Yoga",
    place: "Gym",
    time: "12:00",
    description:
      "Lorem ipsum dolor sit amet consectetur adipisicing elit. Placeat, incidunt quos consequatur aliquam veritatis, ut nam corrupti laborum doloribus minus pariatur cum praesentium itaque ad fugit, quidem possimus laudantium animi?",
  },
];

app.use(bodyParser.json());

app.post("/login", (req, res) => {
  console.log(req.body);

  //correct user and password

  const username = req.body.username;
  if (username === "Alan" && req.body.password === "lol") {
    const user = { username: req.body.username, password: req.body.password };
    const accessToken = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET);
    res.json({ accessToken: accessToken });
  } else {
    res.sendStatus(403); // wrong user or password
  }
});

app.post("/logout", (req, res) => {
  refreshTokens = refreshTokens.filter((token) => token !== req.body.token);
  res.sendStatus(204);
});

app.get("/userpage/classes", authenticateToken, (req, res) => {
  const p2 = posts.filter((post) => post.username === req.body.username);
  res.json(p2);
});

app.post("/register", (req, res) => {
  console.log(req.body);
});
app.get("/userpage", authenticateToken, (req, res) => {
  console.log("aaaa", req.user);
  res.send(lista);

  const p = posts.filter((x) => x.username === req.user.username);
});

app.listen(3003, () => {
  console.log("Server is running on port 3001");
});

function authenticateToken(req, res, next) {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  if (token == null) return res.sendStatus(401); //if there isn't any token
  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
    if (err) return res.sendStatus(403); //if token is not valid
    console.log(user);
    req.user = user;
    console.log(req.user);
    next();
  });
}

let driver = neo4j.driver(
  "neo4j+s://08b226e6.databases.neo4j.io",
  neo4j.auth.basic("neo4j", "")
);
const Register = async function (
  username,
  name,
  surname,
  email,
  password,
  role
) {
  let session = driver.session();
  console.log("SESSION");
  const command = `CREATE(n:Users{username:'${username}', name:'${name}', surname:'${surname}', email:'${email}', password:'${password}', role:'${role}'}) RETURN n`;
  await session.run(command, {});
  session.close();
};
//Register();
const Login = async function () {
  let session = driver.session();
  console.log("SESSION");
  const username = "alan";
  const password = "haslo";
  const command = `MATCH (n:Users{username:'${username}', password:'${password}'}) RETURN n`;
  const matches = await session.run(command, {});
  session.close();
  console.log(matches.records);
  console.log("RESULT", !matches ? 0 : matches.records.length);
};
// Login();

const Class = {
  name: "name",
  place: { city: "city", street: "street", number: "number" },
  date: "date",
  time: "time",
  description: "description",
  teachername: "teachername",
  aboutteacher: "aboutteacher",
};

const AddClass = async function (Class) {
  console.log(Class);
  let session = driver.session();
  console.log("SESSION");
  const command = `CREATE(m:Classes{name:'${Class.name}', place:'${Class.place}', date:'${Class.date}', time:'${Class.time}', description:'${Class.description}', teachername:'${Class.teachername}', aboutteacher:'${Class.aboutteacher}'})`;
  await session.run(command, {});
  const command2 = `MATCH (k:Classes{name:'${Class.name}', place:'${Class.place}', date:'${Class.date}', time:'${Class.time}', description:'${Class.description}', teachername:'${Class.teachername}', aboutteacher:'${Class.aboutteacher}'}) RETURN k`;
  const matches = await session.run(command2, {});
  console.log(matches.records[0].get(0).properties);
  session.close();
  // session.close();
};

// AddClass(Class);

const DeleteClass = async function (Class) {
  let session = driver.session();
  console.log("SESSION");
  const command = `MATCH (n:Classes{name:'${Class.name}', place:'${Class.place}', date:'${Class.date}', time:'${Class.time}', description:'${Class.description}', teachername:'${Class.teachername}', aboutteacher:'${Class.aboutteacher}'}) DELETE n`;
  await session.run(command, {});
  session.close();
};

const UpdateClass = async function (Class) {
  let session = driver.session();
  console.log("SESSION");
  const command = `MATCH (n:Classes{name:'${Class.name}', place:'${Class.place}', date:'${Class.date}', time:'${Class.time}', description:'${Class.description}', teachername:'${Class.teachername}', aboutteacher:'${Class.aboutteacher}'}) SET n.name = 'nowa nazwa'`;
  await session.run(command, {});
  session.close();
};

const Get10Classes = async function () {
  let session = driver.session();
  console.log("SESSION");
  const command = `MATCH (n:Classes) RETURN n LIMIT 10`;
  const matches = await session.run(command, {});
  session.close();
  console.log(matches.records);
  console.log("RESULT", !matches ? 0 : matches.records.length);
};

const GetAllClasses = async function () {
  let session = driver.session();
  console.log("SESSION");
  const command = `MATCH (n:Classes) RETURN n`;
  const matches = await session.run(command, {});
  session.close();
  console.log(matches.records);
};
