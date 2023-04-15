const mqtt = require("mqtt");

const clientId = "mqttjs_" + Math.random().toString(16).substr(2, 8);
const host = "ws://127.0.0.1:8000/mqtt";
const options = {
  keepalive: 60,
  clientId: clientId,
  protocolId: "MQTT",
  protocolVersion: 4,
  clean: true,
  reconnectPeriod: 1000,
  connectTimeout: 30 * 1000,
  will: {
    topic: "WillMsg",
    payload: "Connection Closed abnormally..!",
    id: clientId,
    qos: 0,
    retain: false,
  },
};
const client = mqtt.connect(host, options);
const { AddComment, addReactions } = require("./neo4jfunctions");

client.on("connect", function () {
  client.subscribe("chat/lol");
  client.subscribe("/time");
  client.subscribe("/comments/#");
  client.subscribe("/comments/#/#/reaction");
  console.log("connected");

  setInterval(function () {
    client.publish(
      "chat/lol",
      JSON.stringify({ username: "server", message: "hello" })
    );
  }, 5000);
});

setInterval(function () {
  client.publish("/time", new Date().toLocaleTimeString());
}, 1000);

client.on("message", function (topic, message) {
  const regex = /\/comments\/.*/;
  const id = topic.slice(10);

  if (regex.test(topic)) {
    const id = topic.slice(10);
    AddComment(id, message);
  }
});

client.on("message", function (topic, message) {
  const regex = /\/comments\/.*\/.*\/reaction/;
  if (regex.test(topic)) {
    const id = topic.slice(10, topic.indexOf("/", 10));
    const commentid = topic.slice(
      topic.indexOf("/", 10) + 1,
      topic.indexOf("/", topic.indexOf("/", 10) + 1)
    );

    const classid = topic.slice(
      topic.indexOf("/", +1) + 1,
      topic.indexOf("/", topic.indexOf("/", +1) + 1)
    );
    addReactions(classid, commentid, message);
  }
});

module.exports = client;
