const express = require("express");
const app = express();
const server = require("http").Server(app);
const io = require("socket.io")(server, {
  cors: {
    origin: "http://localhost:3000",
    AccessControlAllowOrigin: "http://localhost:3000",
  },
});

app.use(express.json());

io.on("connection", (socket) => {
  console.log("a user connected");

  socket.on("new comment", (comment) => {
    io.emit("new comment", comment);
  });

  socket.on("disconnect", () => {
    console.log("user disconnected");
  });
});

server.listen(3007, () => {
  console.log("Server started on port 3007");
});
