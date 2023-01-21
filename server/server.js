require("dotenv").config();
const express = require("express");
const path = require("path");
const bodyParser = require("body-parser");
const cors = require("cors");
const neo4j = require("neo4j-driver");
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");

const app = express();
app.use(
  cors({
    credentials: true,
    origin: "http://localhost:3000",
    optionsSuccessStatus: 200,
  })
);
// app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));

const users = [
  { username: "Alan", password: "lol" },
  { username: "Blan", password: "alan" },
];
const lista = [
  {
    name: "Pilates",
    place: "Gym",
    image:
      "https://images.unsplash.com/photo-1671726805766-de50e4327182?ixlib=rb-4.0.3&ixid=MnwxMjA3fDF8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1770&q=80",
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
app.use(cookieParser());

app.post("/login", (req, res) => {
  const username = req.body.username;
  if (username === "Alan" && req.body.password === "lol") {
    const user = { username: req.body.username, password: req.body.password };
    const accessToken = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET);
    res.json({ accessToken: accessToken });
    // res.cookie("token", accessToken, {
    //   expires: new Date(Date.now() + 30000),
    // });
    // res.json("Token set in cookie");
  } else {
    res.sendStatus(403);

    // wrong user or password
  }
});

app.post("/logout", (req, res) => {
  // refreshTokens = refreshTokens.filter((token) => token !== req.body.token);
  res.sendStatus(204);
});

app.post("/register", (req, res) => {
  users.push(req.body);
  const user = { username: req.body.username, password: req.body.password };
  const accessToken = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET);
  res.json({ accessToken: accessToken });
  // Register(
  //   req.body.username,
  //   req.body.name,
  //   req.body.surname,
  //   req.body.password,
  //   req.body.email,
  //   req.body.role
  // );
});
app.get("/userpage", authenticateToken, (req, res) => {
  res.json(lista);
});

app.listen(3003, () => {
  console.log("Server is running on port 3001");
});

function authenticateToken(req, res, next) {
  const authHeader = req.headers["authorization"];
  console.log(authHeader);
  const token = authHeader && authHeader.split(" ")[1];
  console.log(token);
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
  neo4j.auth.basic("neo4j", "cg2rKSbSzfAUnZ0_JzEMR6e_Fs46qvQty3cUeK1ynPA")
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
const Login = async function (username, password) {
  let session = driver.session();
  console.log("SESSION");
  const command = `MATCH (n:Users{username:'${username}', password:'${password}'}) RETURN n`;
  const matches = await session.run(command, {});
  session.close();
  if (!matches) {
    res.sendStatus(403);
  }
  console.log("RESULT", !matches ? 0 : matches.records.length);
};

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
