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

const schema = yup.object().shape({
  message: yup.string().required("message is required").min(1),
});

const Chat = () => {
  const [messagess, setMessages] = useState([]);
  const [message, setMessage] = useState("");
  const username = useSelector((state) => state.auth.username);

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
  const client = mqtt.connect(host, options);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    validationSchema: yupResolver(schema),
  });

  const sendMessage = async (data) => {
    const message = data.message;

    const me = JSON.stringify({ username: username, message: message });
    await client.publish("chat/lol", me);
    console.log(me);
    document.getElementById("message").reset();
    setMessage("");
  };
  useEffect(() => {
    client.on("connect", function () {
      console.log("connected  " + clientId);
    });
    client.subscribe("chat/lol");
  }, []);

  client.on("message", function (id, message, packet) {
    console.log(packet);
    const b = message.toString();
    const mess = JSON.parse(b);
    setMessages((prev) => [...prev, mess]);
  });

  useEffect(() => {
    const chat = document.getElementById("chat");
    chat.scrollTop = chat.scrollHeight;
    return () => {};
  }, [messagess]);

  return (
    <>
      <Navbar />
      <div className="  p-4 w-[700px] mx-auto bg-slate-400    bg-opacity-50">
        <div
          id="chat"
          className=" overflow-scroll  h-80 p-3  border-spacing-4  bg-slate-200"
        >
          {/* {console.log("AAA", messagess)} */}
          <MessageList messages={messagess} username={username} />
        </div>
        <form
          onSubmit={handleSubmit(sendMessage)}
          id="message"
          className="my-2 flex flex-row "
        >
          <input
            type="text"
            className="border-2 border-gray-300 bg-white  px-5 py-1 pr-16 rounded-lg text-sm focus:outline-none w-full"
            placeholder="Type your message"
            {...register("message")}
          />

          <button type="submit" className="w-min">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="10"
              className="w-6 h-6 text-gray-400 hover:text-gray-500"
              height="16"
              viewBox="0 0 16 16"
            >
              <path d="M15.854.146a.5.5 0 0 1 .11.54l-5.819 14.547a.75.75 0 0 1-1.329.124l-3.178-4.995L.643 7.184a.75.75 0 0 1 .124-1.33L15.314.037a.5.5 0 0 1 .54.11ZM6.636 10.07l2.761 4.338L14.13 2.576 6.636 10.07Zm6.787-8.201L1.591 6.602l4.339 2.76 7.494-7.493Z" />
            </svg>
          </button>
        </form>
      </div>
    </>
  );
};

export default Chat;
