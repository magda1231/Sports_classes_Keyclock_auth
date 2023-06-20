import React, { useEffect, useMemo, useState } from "react";
import * as mqtt from "mqtt/dist/mqtt";
import Navbar from "../Navbar";
import { useSelector } from "react-redux";
import MessageList from "./MessageList";
//yup
import * as yup from "yup";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { client, clientId } from "./MqttClient";

export const schema = yup.object().shape({
  message: yup.string().required("message is required"),
});

const Chat = () => {
  const [messagess, setMessages] = useState([]);
  const [message, setMessage] = useState("");
  const username = useSelector((state) => state.auth.username);
  const [connected, setConnected] = useState(false);

  const clientId = "mqttjs_" + Math.random().toString(16);

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
      qos: 0,
      id: clientId,
      retain: false,
    },
  };
  //const client = mqtt.connect(host, options);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
    reset,
  } = useForm({
    mode: "onSubmit",
    resolver: yupResolver(schema),
  });

  const client = mqtt.connect(host, options);

  const sendMessage = (data) => {
    const message = data.message;

    const me = JSON.stringify({ username: username, message: message });
    client.publish("chat/lol", me);
    const chat = document.getElementById("chat");
    chat.scrollTo(0, 0);
    reset();
    setMessage("");
  };
  useEffect(() => {
    client.on("connect", function () {
      setConnected(true);
      client.subscribe("chat/lol");
    });
  }, []);
  client.on("message", function (topic, message) {
    const msg = JSON.parse(message.toString());

    //);
    setMessages((prev) => [...prev, msg]);
  });

  useEffect(() => {
    const chat = document.getElementById("chat");
    if (chat) {
      chat.scrollTo(0, chat.scrollHeight);
    }
    return () => {};
  }, [messagess]);

  return (
    <>
      <Navbar />
    </>
  );
};

export default Chat;
